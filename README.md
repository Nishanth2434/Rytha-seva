<div align="center">

<img src="public/favicon.ico" alt="KrishiMitra AI logo" width="120" />

# 🌾 KrishiMitra AI

### A modern agricultural intelligence platform — hyperlocal weather, pest AI, live markets, and equipment rentals in one place.

<br/>

[![Live Website](https://img.shields.io/badge/🌐_Live_Website-Visit_Now-2563EB?style=for-the-badge&logoColor=white)](https://rytha-seva.vercel.app)
[![Stars](https://img.shields.io/github/stars/Nishanth2434/Rytha-seva?style=for-the-badge&color=F59E0B)](https://github.com/Nishanth2434/Rytha-seva/stargazers)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Django](https://img.shields.io/badge/Django-4.2+-092E20?style=flat-square&logo=django&logoColor=white)](https://www.djangoproject.com)
[![SQLite](https://img.shields.io/badge/SQLite-DB-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://sqlite.org)

</div>

---

## 🌐 Live Demo

<div align="center">

### Try the live website here 👇

<a href="https://rytha-seva.vercel.app">
  <img src="https://img.shields.io/badge/🚀_LAUNCH_LIVE_APP-rytha--seva.vercel.app-2563EB?style=for-the-badge&logoColor=white" alt="Live Website" height="52" />
</a>

<br/><br/>

| Area                   | URL                                                  |
| :--------------------- | :--------------------------------------------------- |
| 👨‍🌾 Farmer portal     | https://rytha-seva.vercel.app                        |
| 🚜 Owner Dashboard     | https://rytha-seva.vercel.app/owner/dashboard        |
| 🔐 Login / Register    | https://rytha-seva.vercel.app/login                  |

</div>

---

## 📸 A Look Inside — Website Trailer

<div align="center">

<b>🏠 Home — Weather forecasts, quick actions, and market insights</b>

<img src="docs/screenshots/home.png" alt="KrishiMitra AI home page" width="100%" />

</div>

<table>
  <tr>
    <td width="50%"><b>🌦️ Weather Advisor</b><br/><img src="docs/screenshots/weather.png" alt="Weather recommendations page" /></td>
    <td width="50%"><b>🐛 Pest AI Detection</b><br/><img src="docs/screenshots/pest.png" alt="Pest diagnosis and treatment page" /></td>
  </tr>
  <tr>
    <td width="50%"><b>🚜 Equipment Rentals</b><br/><img src="docs/screenshots/equipment.png" alt="Equipment marketplace page" /></td>
    <td width="50%"><b>💰 Market Analysis</b><br/><img src="docs/screenshots/market.png" alt="Live market prices" /></td>
  </tr>
  <tr>
    <td width="50%"><b>🔐 Sign In</b><br/><img src="docs/screenshots/signin.png" alt="Sign in page" /></td>
    <td width="50%"><b>📝 Sign Up</b><br/><img src="docs/screenshots/signup.png" alt="Registration page" /></td>
  </tr>
</table>

<div align="center">

<b>👨‍🌾 Owner Dashboard — Manage your fleet, approve listings, and track rentals</b>

<img src="docs/screenshots/dashboard.png" alt="Owner dashboard showing bookings and analytics" width="100%" />

</div>

<div align="center">

🔒 The owner dashboard, equipment booking system, and AI diagnostic history live behind login —
<a href="https://rytha-seva.vercel.app"><b>sign in on the live site</b></a> to see them in action.

</div>

---

## ✨ Features

<table>
  <tr>
    <td width="33%">
      <h3>🌦️ Weather Advisor</h3>
      Hyperlocal 7-day forecasts automatically converted into actionable spray and irrigation recommendations.
    </td>
    <td width="33%">
      <h3>🐛 Pest AI</h3>
      Upload crop photos for Gemini-powered disease detection with confidence scores and treatment suggestions.
    </td>
    <td width="33%">
      <h3>💰 Market Analysis</h3>
      Live mandi (market) prices powered by AI-driven sell-or-hold recommendations to maximize profits.
    </td>
  </tr>
  <tr>
    <td>
      <h3>🚜 Equipment Rentals</h3>
      A marketplace to rent tractors, harvesters, and drones from verified owners with a booking workflow.
    </td>
    <td>
      <h3>📱 Krishi Shorts</h3>
      A TikTok-style short-form video content feed dedicated exclusively to farming tips and education.
    </td>
    <td>
      <h3>🤖 AI Chatbot</h3>
      Conversational agricultural assistant powered by Google Gemini to answer complex farming queries instantly.
    </td>
  </tr>
  <tr>
    <td>
      <h3>👨‍🌾 Owner Dashboard</h3>
      Dedicated portal for equipment owners to manage their fleet, approve listings, and track rental bookings.
    </td>
    <td>
      <h3>🌐 Multilingual</h3>
      Seamlessly toggle between English, Kannada (ಕನ್ನಡ), and Hindi (हिन्दी) for complete accessibility.
    </td>
    <td>
      <h3>🔐 Secure Authentication</h3>
      Robust JWT-based authentication using Django REST Framework with secure user sessions.
    </td>
  </tr>
</table>

<details>
<summary><b>🤖 Smart extras</b></summary>

- **AI-Powered Diagnostics** — Gemini 1.5 Flash Vision analyzes plant images to provide organic and chemical treatments.
- **Multilingual Content Fallbacks** — AI translates advice and weather warnings into the user's selected language instantly.
- **Owner Verification** — Trust system where equipment owners are verified before their listings go live on the marketplace.
- **Location Auto-detect** — Automatically fetches the user's nearest village weather data without needing manual postal code entry.
- **Offline-ready caching** — Weather and Market data are aggressively cached to save bandwidth for rural users with poor connectivity.

</details>

---

## 🧰 Tech Stack

| Layer               | Technology                                                |
| :------------------ | :-------------------------------------------------------- |
| **Frontend**        | React 19 + TanStack Start (SSR) + TanStack Router         |
| **Backend**         | Python 3.10+ with Django 4.2+ & Django REST Framework     |
| **Database**        | SQLite (Development)                                      |
| **Authentication**  | Managed auth — email/password, SimpleJWT                  |
| **Hosting (Web)**   | Vercel (Edge deployment + CDN)                            |
| **UI Framework**    | Tailwind CSS v4 + shadcn/ui + Radix primitives            |
| **Icons**           | Lucide React                                              |
| **Data Fetching**   | TanStack Query                                            |
| **AI Integration**  | Google Gemini API (Vision & Text models)                  |
| **External APIs**   | Open-Meteo (Weather Data)                                 |

---

## 🏗️ Architecture

The application is built on a decoupled full-stack architecture. The React frontend interacts with the Django REST API backend, utilizing JWTs for secure access. AI processing is handed off to the Gemini API, while external agricultural data is pulled from Open-Meteo.

```text
Frontend (React + TanStack Router)
        ↓
Backend API (Django REST Framework)
        ↓
Authentication (SimpleJWT + Session Roles)
        ↓
Database (SQLite / PostgreSQL in prod)
        ↓
AI Inference (Google Gemini Vision & Text)
```

```mermaid
flowchart TD
    U[Farmer / Owner Browser] --> FE[React + TanStack Router]
    FE --> BE[Django REST API]
    BE --> AUTH[SimpleJWT Auth]
    AUTH --> DB[(SQLite DB)]
    FE --> API_W[Open-Meteo API]
    FE --> API_M[Market Price APIs]
    BE --> AI[Google Gemini API - Pest & Chat]
    AI --> FE
```

---

## 📁 Project Structure

```text
rytha-seva/
├── backend/                   # Django REST Framework Backend
│   ├── accounts/              # User models, profiles, and auth logic
│   ├── api/                   # Core application endpoints (equipment, weather, pests)
│   ├── config/                # Django project settings and root routing
│   ├── manage.py              # Django execution script
│   └── requirements.txt       # Python dependencies
│
├── src/                       # React Frontend
│   ├── assets/                # Logos and local images
│   ├── components/            # Reusable UI (shadcn, forms, navigation)
│   ├── hooks/                 # Custom React hooks (auth, geolocation)
│   ├── lib/                   # Utility functions and API client
│   ├── routes/                # TanStack Router page definitions
│   └── main.tsx               # Frontend entry point
│
├── public/                    # Static assets, favicon
├── docs/
│   └── screenshots/           # README images
├── .env.example               # Example environment variables
├── package.json               # Frontend dependencies
└── vite.config.ts             # Vite bundler configuration
```

---

## 🚀 Getting Started

To run this project locally, you will need **Node.js 18+** and **Python 3.10+**.

### 1. Clone & Install
```bash
git clone https://github.com/Nishanth2434/Rytha-seva.git
cd Rytha-seva
```

### 2. Backend Setup
```bash
# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate # macOS/Linux

# Install dependencies and setup database
pip install -r backend/requirements.txt
python backend/manage.py migrate
python backend/manage.py createsuperuser

# Start the server (runs on port 8000)
python backend/manage.py runserver 8000
```

### 3. Frontend Setup
```bash
# Open a new terminal in the project root
npm install

# Start the frontend (runs on port 5173)
npm run dev
```

### 4. Environment Variables
Create a `.env` file in the root based on `.env.example`:
```env
VITE_DJANGO_API_URL="http://localhost:8000/api"
VITE_GEMINI_API_KEY="your_gemini_api_key_here"
```

---

<div align="center">
  <b>Built with ❤️ for Indian farmers.</b>
</div>
