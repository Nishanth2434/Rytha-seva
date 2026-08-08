from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Profile, Equipment, OwnerRequest, Booking,
    Advertisement, Reel, WeatherCache, MarketPrice, PestReport
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Profile
        fields = (
            'id', 'username', 'email', 'full_name', 'phone', 'village',
            'state', 'district', 'avatar_url', 'is_owner', 'is_admin',
            'owner_status', 'created_at', 'updated_at'
        )


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    full_name = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    village = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)
    district = serializers.CharField(required=False, allow_blank=True)
    is_owner = serializers.BooleanField(default=False)

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        username = email.split('@')[0]

        # Ensure unique username
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_staff=False,
            is_superuser=False,
        )

        profile, created = Profile.objects.get_or_create(
            user=user,
            defaults={
                'full_name': validated_data.get('full_name', ''),
                'phone': validated_data.get('phone', ''),
                'village': validated_data.get('village', ''),
                'state': validated_data.get('state', ''),
                'district': validated_data.get('district', ''),
                'is_owner': validated_data.get('is_owner', False),
                'is_admin': False,
            }
        )
        return profile


class EquipmentSerializer(serializers.ModelSerializer):
    owner_detail = ProfileSerializer(source='owner', read_only=True)

    class Meta:
        model = Equipment
        fields = '__all__'
        read_only_fields = ('owner',)


class OwnerRequestSerializer(serializers.ModelSerializer):
    user_detail = ProfileSerializer(source='user', read_only=True)

    class Meta:
        model = OwnerRequest
        fields = '__all__'
        read_only_fields = ('user',)


class BookingSerializer(serializers.ModelSerializer):
    equipment_detail = EquipmentSerializer(source='equipment', read_only=True)
    farmer_detail = ProfileSerializer(source='farmer', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('farmer',)


class AdvertisementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertisement
        fields = '__all__'


class ReelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reel
        fields = '__all__'


class WeatherCacheSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherCache
        fields = '__all__'


class MarketPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketPrice
        fields = '__all__'


class PestReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = PestReport
        fields = '__all__'
