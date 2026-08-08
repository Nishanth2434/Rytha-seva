import logging

from django.contrib import messages
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.utils.html import escape

from .forms import RegistrationForm, LoginForm

logger = logging.getLogger(__name__)


# ─── Views ────────────────────────────────────────────────────────────────────

def register_view(request):
    """Handle user registration."""
    if request.user.is_authenticated:
        return redirect('accounts:dashboard')

    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            name = form.cleaned_data['name']
            password = form.cleaned_data['password']

            # Create a new user immediately
            username = email  # Use email as username
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=name,
                is_active=True,
                is_staff=False,
                is_superuser=False,
            )

            # Log the user in
            login(request, user)
            messages.success(request, f'Welcome, {escape(name)}! Your account has been created.')
            return redirect('accounts:dashboard')
    else:
        form = RegistrationForm()

    return render(request, 'accounts/register.html', {'form': form})


def login_view(request):
    """Handle user login with email and password."""
    if request.user.is_authenticated:
        return redirect('accounts:dashboard')

    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']

            # Find user by email
            try:
                user_obj = User.objects.get(email=email)
            except User.DoesNotExist:
                messages.error(request, 'Invalid email or password.')
                return render(request, 'accounts/login.html', {'form': form})

            if not user_obj.is_active:
                messages.error(request, 'This account is not verified. Please contact support.')
                return render(request, 'accounts/login.html', {'form': form})

            # Authenticate
            user = authenticate(request, username=user_obj.username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f'Welcome back, {escape(user.first_name or user.email)}!')
                return redirect('accounts:dashboard')
            else:
                messages.error(request, 'Invalid email or password.')
    else:
        form = LoginForm()

    return render(request, 'accounts/login.html', {'form': form})


@login_required(login_url='/accounts/login/')
def dashboard_view(request):
    """Protected dashboard page — only accessible after login."""
    return render(request, 'accounts/dashboard.html')


def logout_view(request):
    """Log out the user and redirect to login."""
    logout(request)
    messages.info(request, 'You have been logged out.')
    return redirect('accounts:login')
