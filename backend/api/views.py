from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .models import (
    Profile, Equipment, OwnerRequest, Booking,
    Advertisement, Reel, WeatherCache, MarketPrice, PestReport
)
from .serializers import (
    ProfileSerializer, RegisterSerializer, EquipmentSerializer,
    OwnerRequestSerializer, BookingSerializer, AdvertisementSerializer,
    ReelSerializer, WeatherCacheSerializer, MarketPriceSerializer,
    PestReportSerializer
)


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username_or_email = attrs.get('username') or attrs.get('email')
        if username_or_email and '@' in username_or_email:
            try:
                user = User.objects.filter(email__iexact=username_or_email).first()
                if user:
                    attrs['username'] = user.username
            except Exception:
                pass
        elif not attrs.get('username') and attrs.get('email'):
            try:
                user = User.objects.filter(email__iexact=attrs.get('email')).first()
                if user:
                    attrs['username'] = user.username
            except Exception:
                pass

        return super().validate(attrs)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile = serializer.save()
        return Response(ProfileSerializer(profile).data, status=status.HTTP_201_CREATED)


class CurrentProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.profile
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        try:
            profile = request.user.profile
            serializer = ProfileSerializer(profile, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all().order_by('-created_at')
    serializer_class = EquipmentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)


class OwnerRequestViewSet(viewsets.ModelViewSet):
    queryset = OwnerRequest.objects.all().order_by('-created_at')
    serializer_class = OwnerRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = self.request.user.profile
        if profile.is_admin:
            return OwnerRequest.objects.all()
        return OwnerRequest.objects.filter(user=profile)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user.profile)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = self.request.user.profile
        if profile.is_admin:
            return Booking.objects.all()
        return Booking.objects.filter(
            models.Q(farmer=profile) | models.Q(equipment__owner=profile)
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user.profile)


class AdvertisementViewSet(viewsets.ModelViewSet):
    queryset = Advertisement.objects.all()
    serializer_class = AdvertisementSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated and hasattr(self.request.user, 'profile') and self.request.user.profile.is_admin:
            return Advertisement.objects.all()
        return Advertisement.objects.filter(is_enabled=True)


class ReelViewSet(viewsets.ModelViewSet):
    queryset = Reel.objects.filter(is_published=True).order_by('-created_at')
    serializer_class = ReelSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class WeatherCacheViewSet(viewsets.ModelViewSet):
    queryset = WeatherCache.objects.all()
    serializer_class = WeatherCacheSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'village_name'


class MarketPriceViewSet(viewsets.ModelViewSet):
    queryset = MarketPrice.objects.all().order_by('-price_date')
    serializer_class = MarketPriceSerializer
    permission_classes = [permissions.AllowAny]


class PestReportViewSet(viewsets.ModelViewSet):
    queryset = PestReport.objects.all().order_by('-created_at')
    serializer_class = PestReportSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated and hasattr(self.request.user, 'profile'):
            serializer.save(user=self.request.user.profile)
        else:
            serializer.save()
