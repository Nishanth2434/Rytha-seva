import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Profile(models.Model):
    OWNER_STATUS_CHOICES = [
        ('none', 'None'),
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    village = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    district = models.CharField(max_length=255, blank=True, null=True)
    avatar_url = models.URLField(max_length=1024, blank=True, null=True)
    is_owner = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    owner_status = models.CharField(max_length=20, choices=OWNER_STATUS_CHOICES, default='none')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name or self.user.username} ({self.user.email})"


class Equipment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='equipment_listings')
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    image_url = models.URLField(max_length=1024, blank=True, null=True)
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.category}"


class OwnerRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='owner_requests')
    equipment_name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    photos = models.TextField(blank=True, null=True)  # comma separated or JSON string
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Request by {self.user} for {self.equipment_name} ({self.status})"


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='bookings')
    farmer = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='my_bookings')
    start_date = models.DateField()
    end_date = models.DateField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Booking #{self.id} - {self.equipment.name} by {self.farmer}"


class Advertisement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    banner_image_url = models.URLField(max_length=1024, blank=True, null=True)
    cta_text = models.CharField(max_length=100, default='Learn More')
    external_link = models.URLField(max_length=1024, default='https://novaagri.in/nova-agri-seeds/')
    badge_text = models.CharField(max_length=50, default='Sponsored')
    is_enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Reel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100)
    video_url = models.URLField(max_length=1024)
    thumbnail_url = models.URLField(max_length=1024, blank=True, null=True)
    views_count = models.IntegerField(default=0)
    likes_count = models.IntegerField(default=0)
    author_name = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class WeatherCache(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    village_name = models.CharField(max_length=255, unique=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    temp_celsius = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    humidity_pct = models.IntegerField(blank=True, null=True)
    wind_speed_kmh = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rain_probability_pct = models.IntegerField(blank=True, null=True)
    ai_recommendation = models.TextField(blank=True, null=True)
    cached_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Weather Cache for {self.village_name}"


class MarketPrice(models.Model):
    RECOMMENDATION_CHOICES = [
        ('HOLD', 'Hold'),
        ('SELL NOW', 'Sell Now'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    crop_name = models.CharField(max_length=255)
    mandi_name = models.CharField(max_length=255)
    district = models.CharField(max_length=255, blank=True, null=True)
    today_price = models.DecimalField(max_digits=10, decimal_places=2)
    predicted_price = models.DecimalField(max_digits=10, decimal_places=2)
    price_change_pct = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    recommendation = models.CharField(max_length=20, choices=RECOMMENDATION_CHOICES, default='HOLD')
    price_date = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.crop_name} @ {self.mandi_name}"


class PestReport(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(Profile, on_delete=models.SET_NULL, blank=True, null=True, related_name='pest_reports')
    crop_name = models.CharField(max_length=255)
    disease_name = models.CharField(max_length=255)
    confidence_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    organic_solution = models.TextField(blank=True, null=True)
    chemical_solution = models.TextField(blank=True, null=True)
    outbreak_risk_pct = models.IntegerField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    image_url = models.URLField(max_length=1024, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Pest Report: {self.disease_name} on {self.crop_name}"
