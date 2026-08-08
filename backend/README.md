# KrishiMitra AI - Django REST API Backend

This is the Django backend service for KrishiMitra AI, providing REST API endpoints, JWT authentication, and database persistence.

---

## 🚀 Quick Setup Instructions

### 1. Create and Activate Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

---

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 3. Run Database Migrations

```bash
python manage.py makemigrations api
python manage.py migrate
```

---

### 4. Create Admin Superuser

```bash
python manage.py createsuperuser
```

---

### 5. Start Django Development Server

```bash
python manage.py runserver 8000
```

The API will be available at: `http://localhost:8000/api/`  
The Django Admin Panel will be available at: `http://localhost:8000/admin/`

---

## 📡 API Endpoints Overview

| Endpoint | Method | Description | Auth Required |
|---|---|---|---|
| `/api/auth/register/` | `POST` | Register a new user | ❌ |
| `/api/auth/login/` | `POST` | Obtain JWT access & refresh tokens | ❌ |
| `/api/auth/token/refresh/` | `POST` | Refresh access token | ❌ |
| `/api/auth/me/` | `GET`, `PUT` | Get / Update logged-in user profile | ✅ |
| `/api/profiles/` | `GET`, `POST` | Manage user profiles | ✅ |
| `/api/equipment/` | `GET`, `POST`, `PUT`, `DELETE` | Rental equipment listings | Optional |
| `/api/owner-requests/` | `GET`, `POST`, `PUT` | Owner equipment verification requests | ✅ |
| `/api/bookings/` | `GET`, `POST`, `PUT` | Equipment rental bookings | ✅ |
| `/api/advertisements/` | `GET`, `POST`, `DELETE` | Banners & advertisements | Optional |
| `/api/reels/` | `GET`, `POST` | Krishi Shorts / Reels | Optional |
| `/api/weather/` | `GET`, `POST` | Cached weather & AI advice | ❌ |
| `/api/market-prices/` | `GET`, `POST` | Mandi prices & AI predictions | ❌ |
| `/api/pest-reports/` | `GET`, `POST` | Pest identification reports | ❌ |
