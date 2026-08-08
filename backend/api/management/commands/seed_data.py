from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import (
    Profile, Equipment, Advertisement, Reel, WeatherCache, MarketPrice
)

class Command(BaseCommand):
    help = 'Seed initial data for KrishiMitra AI'

    def handle(self, *args, **options):
        # Create superuser / admin user if not exists
        if not User.objects.filter(username='admin').exists():
            admin_user = User.objects.create_superuser('admin', 'admin@krishimitra.com', 'admin123')
            Profile.objects.get_or_create(
                user=admin_user,
                defaults={
                    'full_name': 'System Admin',
                    'phone': '9999999999',
                    'village': 'Raipur',
                    'state': 'Chhattisgarh',
                    'district': 'Raipur',
                    'is_owner': True,
                    'is_admin': True,
                    'owner_status': 'approved'
                }
            )
            self.stdout.write(self.style.SUCCESS('Admin user created (admin / admin123)'))

        admin_profile = Profile.objects.get(user__username='admin')

        # Seed Equipment
        if not Equipment.objects.exists():
            Equipment.objects.create(
                owner=admin_profile,
                name='Mahindra 575 DI Tractor 45HP',
                category='Tractors',
                price_per_day=1500.00,
                price_per_hour=250.00,
                location='Raipur, Chhattisgarh',
                image_url='https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&q=80&w=600',
                is_available=True
            )
            Equipment.objects.create(
                owner=admin_profile,
                name='Kubota Combine Harvester DC-68G',
                category='Harvesters',
                price_per_day=4500.00,
                price_per_hour=750.00,
                location='Durg, Chhattisgarh',
                image_url='https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=600',
                is_available=True
            )
            self.stdout.write(self.style.SUCCESS('Seeded sample equipment'))

        # Seed Advertisements (Nova Agri Seeds & Tech)
        Advertisement.objects.all().delete()
        Advertisement.objects.create(
            title='Nova Agri Seeds - Certified Hybrid Seeds at 20% Off',
            description='Free soil-health test with every order above ₹2,000. Verified high-yield seeds for Kharif & Rabi seasons from Nova Agri Tech.',
            banner_image_url='https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
            cta_text='Claim This Offer',
            external_link='https://novaagri.in/nova-agri-seeds/',
            badge_text='Sponsored · Nova Agri Seeds',
            is_enabled=True
        )
        Advertisement.objects.create(
            title="Sonalika Heavy Duty Tractors - India's No.1 Export Brand",
            description='Explore heavy-duty Sonalika tractors with advanced HDM engines, zero-down payment options, and 5-year warranty.',
            banner_image_url='https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80',
            cta_text='Explore Sonalika',
            external_link='https://www.sonalika.com/',
            badge_text='Sponsored · Sonalika Tractors',
            is_enabled=True
        )
        self.stdout.write(self.style.SUCCESS('Seeded Nova Agri Seeds & Sonalika Tractors advertisements'))

        # Seed Market Prices
        if not MarketPrice.objects.exists():
            MarketPrice.objects.create(
                crop_name='Paddy (Dhan)',
                mandi_name='Raipur Mandi',
                district='Raipur',
                today_price=2300.00,
                predicted_price=2450.00,
                price_change_pct=6.52,
                recommendation='HOLD'
            )
            MarketPrice.objects.create(
                crop_name='Wheat (Gehun)',
                mandi_name='Durg Mandi',
                district='Durg',
                today_price=2275.00,
                predicted_price=2180.00,
                price_change_pct=-4.18,
                recommendation='SELL NOW'
            )
            self.stdout.write(self.style.SUCCESS('Seeded market prices'))

        # Seed Weather Cache
        if not WeatherCache.objects.exists():
            WeatherCache.objects.create(
                village_name='Raipur',
                latitude=21.2514,
                longitude=81.6296,
                temp_celsius=31.5,
                humidity_pct=68,
                wind_speed_kmh=12.4,
                rain_probability_pct=25,
                ai_recommendation='Good weather conditions for spraying organic pesticides in the early morning.'
            )
            self.stdout.write(self.style.SUCCESS('Seeded weather cache'))

        # Seed Reels
        if not Reel.objects.exists():
            Reel.objects.create(
                title='Organic Fertilization Tips for Paddy',
                description='Learn how to prepare Jeevamrut at home for high yield.',
                category='Farming Tips',
                video_url='https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                thumbnail_url='https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=400',
                views_count=1240,
                likes_count=350,
                author_name='Krishi Expert Ramesh',
                location='Raipur',
                is_published=True
            )
            self.stdout.write(self.style.SUCCESS('Seeded sample reels'))
