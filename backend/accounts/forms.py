from django import forms
from django.contrib.auth.models import User
from django.core.validators import RegexValidator


class RegistrationForm(forms.Form):
    """Registration form with name, email, password, and confirm password."""

    name = forms.CharField(
        max_length=150,
        widget=forms.TextInput(attrs={
            'placeholder': 'Full Name',
            'autocomplete': 'name',
            'id': 'reg-name',
        }),
        error_messages={'required': 'Please enter your name.'},
    )

    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'placeholder': 'Email Address',
            'autocomplete': 'email',
            'id': 'reg-email',
        }),
        error_messages={'required': 'Please enter your email address.'},
    )

    password = forms.CharField(
        min_length=8,
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Password (min 8 characters)',
            'autocomplete': 'new-password',
            'id': 'reg-password',
        }),
        error_messages={
            'required': 'Please enter a password.',
            'min_length': 'Password must be at least 8 characters long.',
        },
    )

    confirm_password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Confirm Password',
            'autocomplete': 'new-password',
            'id': 'reg-confirm-password',
        }),
        error_messages={'required': 'Please confirm your password.'},
    )

    def clean_email(self):
        """Normalize email and check for existing verified users."""
        email = self.cleaned_data['email'].strip().lower()

        if User.objects.filter(email=email, is_active=True).exists():
            raise forms.ValidationError(
                'An account with this email already exists. Please log in instead.'
            )

        return email

    def clean(self):
        """Validate that passwords match."""
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')

        if password and confirm_password and password != confirm_password:
            self.add_error('confirm_password', 'Passwords do not match.')

        return cleaned_data



class LoginForm(forms.Form):
    """Login form with email and password."""

    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'placeholder': 'Email Address',
            'autocomplete': 'email',
            'id': 'login-email',
        }),
        error_messages={'required': 'Please enter your email address.'},
    )

    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Password',
            'autocomplete': 'current-password',
            'id': 'login-password',
        }),
        error_messages={'required': 'Please enter your password.'},
    )

    def clean_email(self):
        """Normalize the email address."""
        return self.cleaned_data['email'].strip().lower()
