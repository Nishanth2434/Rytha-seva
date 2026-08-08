from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from .views import (
    RegisterView, CustomTokenObtainPairView, CurrentProfileView, ProfileViewSet, EquipmentViewSet,
    OwnerRequestViewSet, BookingViewSet, AdvertisementViewSet,
    ReelViewSet, WeatherCacheViewSet, MarketPriceViewSet, PestReportViewSet
)

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet, basename='profile')
router.register(r'equipment', EquipmentViewSet, basename='equipment')
router.register(r'owner-requests', OwnerRequestViewSet, basename='owner-request')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'advertisements', AdvertisementViewSet, basename='advertisement')
router.register(r'reels', ReelViewSet, basename='reel')
router.register(r'weather', WeatherCacheViewSet, basename='weather')
router.register(r'market-prices', MarketPriceViewSet, basename='market-price')
router.register(r'pest-reports', PestReportViewSet, basename='pest-report')

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', CurrentProfileView.as_view(), name='auth_me'),
    path('', include(router.urls)),
]
