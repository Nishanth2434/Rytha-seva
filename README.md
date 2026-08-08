<div align="center">

# 🌾 KrishiMitra AI

### AI-Powered Farming Assistant for Indian farmers — make smarter decisions with weather intelligence, pest prediction, market insights, and more.

<br/>

[![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-6366F1?style=for-the-badge)](https://github.com/Nishanth2434/Rytha-seva/releases)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Django](https://img.shields.io/badge/Django-4.2+-092E20?style=flat-square&logo=django&logoColor=white)](https://www.djangoproject.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)

</div>

---

## 📖 About the Project

**KrishiMitra AI** (formerly Rytha-seva) is a full-stack, multilingual platform designed to empower Indian farmers with data-driven insights. Farming is increasingly complex, and KrishiMitra AI simplifies it by combining real-time weather forecasts, AI-driven pest detection, live mandi prices, and an equipment rental marketplace into one easy-to-use application. 

With full support for **English**, **Kannada (ಕನ್ನಡ)**, and **Hindi (हिन्दी)**, KrishiMitra AI bridges the technology gap and brings modern agricultural intelligence directly to the hands of farmers.

---

## ✨ Core Features

<table>
  <tr>
    <td width="33%">
      <h3>🌦️ Weather Advisor</h3>
      Hyperlocal 7-day forecasts automatically converted into actionable spray, irrigation, and harvest recommendations.
    </td>
    <td width="33%">
      <h3>🐛 Pest AI</h3>
      Upload crop photos for AI-powered disease detection with confidence scores and both organic/chemical treatment suggestions.
    </td>
    <td width="33%">
      <h3>💰 Market Analysis</h3>
      Live mandi (market) prices powered by AI-driven sell-or-hold recommendations to maximize profits.
    </td>
  </tr>
  <tr>
    <td>
      <h3>🚜 Equipment Rental</h3>
      A marketplace to rent tractors, harvesters, and drones from verified owners, complete with an owner verification and booking system.
    </td>
    <td>
      <h3>📱 Krishi Shorts</h3>
      A TikTok/Reels-style short-form video content feed dedicated exclusively to farming tips and agricultural education.
    </td>
    <td>
      <h3>🤖 AI Chatbot</h3>
      "Alex"-style conversational assistant powered by Google Gemini to answer complex farming queries instantly.
    </td>
  </tr>
  <tr>
    <td>
      <h3>👨‍🌾 Owner Dashboard</h3>
      Dedicated portal for equipment owners to manage their fleet, approve listings, and track rental bookings.
    </td>
    <td>
      <h3>🌐 Multilingual</h3>
      Seamlessly toggle between English, Kannada, and Hindi to ensure accessibility for all users.
    </td>
    <td>
      <h3>🔐 Secure Authentication</h3>
      Robust JWT-based authentication using Django REST Framework for secure user sessions and role management.
    </td>
  </tr>
</table>

---

## 🧰 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, TanStack Start/Router, Vite 8, TanStack Query |
| **Styling** | Tailwind CSS 4, Radix UI, shadcn/ui components |
| **Backend** | Python 3.10+, Django 4.2+, Django REST Framework (DRF) |
| **Database** | SQLite (Development) |
| **Authentication** | SimpleJWT (JWT Auth), Google OAuth |
| **AI / External APIs** | Google Gemini API (Chatbot & Vision), Open-Meteo (Weather) |
| **Package Managers** | npm / bun (Frontend), pip (Backend) |

---

## 📸 Screenshots

<div align="center">

<b>🏠 Home Dashboard — Weather, Market Insights, and Quick Actions</b>

<img src="docs/screenshots/home.png" alt="Home Dashboard placeholder" width="100%" />

</div>

<table>
  <tr>
    <td width="50%"><b>🌦️ Weather Advisor</b><br/><img src="docs/screenshots/weather.png" alt="Weather page placeholder" /></td>
    <td width="50%"><b>🐛 Pest AI Detection</b><br/><img src="docs/screenshots/pest.png" alt="Pest AI placeholder" /></td>
  </tr>
  <tr>
    <td width="50%"><b>🚜 Equipment Marketplace</b><br/><img src="docs/screenshots/equipment.png" alt="Equipment page placeholder" /></td>
    <td width="50%"><b>📱 Krishi Shorts</b><br/><img src="docs/screenshots/shorts.png" alt="Shorts feed placeholder" /></td>
  </tr>
</table>

---

## 📁 Project Structure

```text
krishimitra-ai/
├── backend/                   # Django REST Framework Backend
│   ├── accounts/              # User models, profiles, and auth logic
│   ├── api/                   # Core application endpoints and business logic
│   ├── config/                # Django project settings and root routing
│   ├── manage.py              # Django execution script
│   └── requirements.txt       # Python dependencies
│
├── src/                       # React Frontend
│   ├── components/            # Reusable UI components (shadcn, etc.)
│   ├── hooks/                 # Custom React hooks (auth, API fetchers)
│   ├── lib/                   # Utility functions and API client configuration
│   ├── routes/                # TanStack Router page definitions
│   └── main.tsx               # Frontend entry point
│
├── public/                    # Static assets
├── docs/
│   └── screenshots/           # README images
├── .env.example               # Example environment variables
├── package.json               # Frontend dependencies
└── vite.config.ts             # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **npm** or **bun**
- **Python** (v3.10+)

### 1. Clone the repository
```bash
git clone https://github.com/Nishanth2434/Rytha-seva.git
cd Rytha-seva
```

### 2. Backend Setup (Django)
Open a terminal and navigate to the project root:
```bash
# Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run migrations to set up the database
python backend/manage.py migrate

# Create a superuser (admin account)
python backend/manage.py createsuperuser

# Start the development server
python backend/manage.py runserver 8000
```
The backend API will be running at `http://localhost:8000`.

### 3. Frontend Setup (React/Vite)
Open a new terminal, navigate to the project root:
```bash
# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
```
The frontend will be available at `http://localhost:5173` (or the port specified in your console).

### 4. Environment Variables
Create a `.env` file in the root of the project and configure the following variables:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_DJANGO_API_URL` | The URL of your local Django backend API. | `http://localhost:8000/api` |
| `VITE_GEMINI_API_KEY` | API Key for Google Gemini (Pest AI & Chatbot). | `AIzaSyYourGeminiKeyHere...` |
| `SECRET_KEY` | Django secret key (usually in backend `settings.py` or `.env`). | `django-insecure-...` |

> **Note:** We recommend duplicating `.env.example` to `.env` to quickly set up your local environment.

---

## 🔌 API Endpoints Overview

The backend exposes a comprehensive REST API. Most endpoints (except public ones like registration or weather) require a valid JWT token passed in the `Authorization: Bearer <token>` header.

| Feature Area | Endpoint Base | Description | Auth Required? |
| :--- | :--- | :--- | :--- |
| **Authentication** | `/api/auth/` | Login (`/login/`), Register (`/register/`), Refresh token | ❌ |
| **User Profiles** | `/api/profiles/` | Get/update farmer profiles, settings, and language preferences | ✅ |
| **Equipment** | `/api/equipment/` | Browse rental marketplace, add new equipment listings | ✅ |
| **Bookings** | `/api/bookings/` | Create and track equipment rental requests | ✅ |
| **Weather** | `/api/weather/` | Fetch cached Open-Meteo forecasts by village | ❌ |
| **Market Prices** | `/api/market-prices/` | Get latest mandi prices for specific crops | ❌ |
| **Pest Reports** | `/api/pest-reports/` | Save and fetch previous AI pest diagnoses | ✅ |
| **Reels (Shorts)** | `/api/reels/` | Fetch short-form farming video content feed | ❌ |
| **Advertisements** | `/api/ads/` | Promotional banners and announcements | ❌ |

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <b>Built with ❤️ for Indian farmers.</b>
</div>
