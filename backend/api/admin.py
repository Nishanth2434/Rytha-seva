from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import (
    Profile, Equipment, OwnerRequest, Booking,
    Advertisement, Reel, WeatherCache, MarketPrice, PestReport
)


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Farmer & Owner Profile Info'
    fields = ('full_name', 'phone', 'village', 'state', 'district', 'is_owner', 'is_admin', 'owner_status')

    def get_readonly_fields(self, request, obj=None):
        # Only overall superuser admin can grant is_admin status
        if not request.user.is_superuser:
            return ('is_admin',)
        return ()


class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)
    list_display = ('username', 'email', 'get_full_name', 'get_village', 'is_owner_flag', 'is_staff', 'is_superuser', 'date_joined')
    list_select_related = ('profile',)

    def get_full_name(self, instance):
        return instance.profile.full_name if hasattr(instance, 'profile') else ''
    get_full_name.short_description = 'Full Name'

    def get_village(self, instance):
        return instance.profile.village if hasattr(instance, 'profile') else ''
    get_village.short_description = 'Village'

    def is_owner_flag(self, instance):
        return instance.profile.is_owner if hasattr(instance, 'profile') else False
    is_owner_flag.boolean = True
    is_owner_flag.short_description = 'Equipment Owner'

    def save_model(self, request, obj, form, change):
        """Only overall superuser admin can add/promote backend staff users."""
        if not request.user.is_superuser:
            if not change:
                # Non-superusers creating accounts are forced to non-staff
                obj.is_staff = False
                obj.is_superuser = False
            else:
                # Non-superusers editing accounts cannot change staff/superuser status
                old_user = User.objects.get(pk=obj.pk)
                obj.is_staff = old_user.is_staff
                obj.is_superuser = old_user.is_superuser
        super().save_model(request, obj, form, change)


# Re-register User Admin with inline Profile support
admin.site.unregister(User)
admin.site.register(User, UserAdmin)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'phone', 'village', 'state', 'is_owner', 'is_admin', 'owner_status', 'created_at')
    list_filter = ('is_owner', 'is_admin', 'owner_status', 'created_at')
    search_fields = ('user__email', 'user__username', 'full_name', 'phone', 'village')
    ordering = ('-created_at',)


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'owner', 'price_per_day', 'is_available', 'created_at')
    list_filter = ('category', 'is_available')
    search_fields = ('name', 'category', 'location')


@admin.register(OwnerRequest)
class OwnerRequestAdmin(admin.ModelAdmin):
    list_display = ('equipment_name', 'category', 'user', 'price', 'status', 'created_at')
    list_filter = ('status', 'category')
    search_fields = ('equipment_name', 'user__user__email')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'equipment', 'farmer', 'start_date', 'end_date', 'total_price', 'status', 'created_at')
    list_filter = ('status', 'start_date')
    search_fields = ('equipment__name', 'farmer__user__email')


@admin.register(Advertisement)
class AdvertisementAdmin(admin.ModelAdmin):
    list_display = ('title', 'cta_text', 'badge_text', 'is_enabled', 'created_at')
    list_filter = ('is_enabled',)
    search_fields = ('title', 'description')


@admin.register(Reel)
class ReelAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'views_count', 'likes_count', 'is_published', 'created_at')
    list_filter = ('category', 'is_published')
    search_fields = ('title', 'description')


@admin.register(WeatherCache)
class WeatherCacheAdmin(admin.ModelAdmin):
    list_display = ('village_name', 'temp_celsius', 'humidity_pct', 'cached_at')
    search_fields = ('village_name',)


@admin.register(MarketPrice)
class MarketPriceAdmin(admin.ModelAdmin):
    list_display = ('crop_name', 'mandi_name', 'today_price', 'predicted_price', 'recommendation', 'price_date')
    list_filter = ('recommendation', 'price_date')
    search_fields = ('crop_name', 'mandi_name', 'district')


@admin.register(PestReport)
class PestReportAdmin(admin.ModelAdmin):
    list_display = ('crop_name', 'disease_name', 'confidence_score', 'outbreak_risk_pct', 'created_at')
    search_fields = ('crop_name', 'disease_name')
