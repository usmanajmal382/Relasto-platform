# 🏠 Relasto — Luxury Real Estate Platform

> A full-stack real estate platform for the Pakistani market. Browse premium properties, connect with verified agents, book private tours, and get instant AI-powered real estate advice.

**🌐 Live Demo:** [relasto-platform-xf4r.vercel.app](https://relasto-platform-xf4r.vercel.app)

---

## 📸 What the App Does

Relasto is a complete real estate marketplace with two types of users:

- **Agents** can register, upload a profile photo, list properties with multiple images, manage visit requests from buyers, and receive real-time notifications.
- **Buyers** can browse all listings, filter by type and status, view full property details, request private tours, and leave reviews for agents.
- **Everyone** gets access to an AI real estate assistant (chatbot) powered by Google Gemini.

### Key Features
- 🏡 Property listings with images, features, pricing, and map address
- 🔍 Filter by type (residential / commercial) and status (for sale / for rent)
- 📅 Visit request system with agent lead management dashboard
- ⭐ Agent review and star rating system
- 🔔 Real-time in-app notifications for agents
- 🤖 AI chatbot (Pakistani real estate expert, powered by Gemini 2.5 Flash)
- 🖼️ Cloud image storage via Cloudinary (permanent, never lost on redeploy)
- 🔐 JWT authentication with automatic silent token refresh
- 📱 Fully responsive — works on mobile and desktop

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Python / Django 6 | Core web framework |
| Django REST Framework | REST API layer |
| PostgreSQL | Production database (hosted on Railway) |
| SimpleJWT | JWT token authentication |
| Cloudinary Python SDK | Direct image uploads to Cloudinary CDN |
| Gunicorn | Production WSGI server |
| WhiteNoise | Static file serving in production |
| django-cors-headers | CORS for frontend/backend communication |
| dj-database-url | Parse database URL from environment |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | Frontend framework and build tool |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Axios | HTTP client with JWT interceptors |
| Lucide React | Icon library |
| React Hot Toast | Toast notifications |

### Infrastructure
| Service | What it hosts |
|---|---|
| Railway | Django API + PostgreSQL database |
| Vercel | React frontend |
| Cloudinary | All property and profile images |
| Google Gemini API | AI chatbot responses |

---

## 🤖 How the AI Feature Works

The AI assistant is a floating chat widget available to all logged-in users. It is powered by **Google Gemini 2.5 Flash** and acts as a knowledgeable Pakistani real estate expert.

### Architecture
The API call is made **directly from the browser** to Google's Gemini API — no backend proxy needed.

```
User types message
       │
       ▼
React ChatBot component
       │  fetch() with API key from Vercel env var
       ▼
Google Gemini 2.5 Flash API
       │  Returns AI response text
       ▼
Displayed in chat bubble
```

### How it Remembers Context (Multi-turn Memory)
Every single message in the chat history is sent with each request. This means if you ask *"What are DHA Lahore rates?"* and follow up with *"What about Phase 6?"*, the AI knows "Phase 6" refers to DHA because it has the full conversation.

```javascript
const contents = messages.map(msg => ({
  role: msg.role === 'user' ? 'user' : 'model',
  parts: [{ text: msg.text }]
}));
```

### Prompt Engineering
A system instruction is permanently prepended to every request, shaping the AI's personality:

```
"You are a helpful Pakistani real estate assistant.
You help users with property buying, selling, renting,
investment advice, and documentation in Pakistan.
Be conversational, friendly, and locally knowledgeable.
Keep answers concise and practical. You may use
English with common Urdu real estate terms naturally."
```

### Quick Suggestions
On first open, 3 suggested questions appear: **"DHA Lahore rates?"**, **"Documents checklist"**, **"Rent vs Buy advice"** — clicking any one sends it instantly.

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- A [Cloudinary](https://cloudinary.com) account (free tier works)
- A [Google AI Studio](https://aistudio.google.com) API key (free)

---

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/usmanajmal382/Relasto-platform.git
cd "Relasto-platform/final project/backend"

# 2. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set environment variables
# Create a .env file or set these in your system:
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SECRET_KEY=your_django_secret_key
DEBUG=True

# 5. Run migrations
python manage.py migrate

# 6. Create a superuser (admin access)
python manage.py createsuperuser

# 7. Start the development server
python manage.py runserver
```

API will be available at: `http://localhost:8000/api/`

---

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd "../frontend"

# 2. Install dependencies
npm install

# 3. Create .env file with your Gemini API key
echo "VITE_GEMINI_API_KEY=your_gemini_api_key_here" > .env

# 4. Start the development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

> **Note:** The frontend's `api.js` points to the production Railway backend by default. To use your local backend, change the `baseURL` in `src/api.js` to `http://localhost:8000/api/`.

---

### Environment Variables Reference

#### Backend (Railway / `.env`)
| Variable | Required | Description |
|---|---|---|
| `SECRET_KEY` | ✅ | Django secret key |
| `DEBUG` | ✅ | `True` for local, `False` for production |
| `DATABASE_PUBLIC_URL` | ✅ (prod) | PostgreSQL connection string |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Your Cloudinary API secret |

#### Frontend (Vercel / `.env`)
| Variable | Required | Description |
|---|---|---|
| `VITE_GEMINI_API_KEY` | ✅ | Google Gemini API key for the AI chatbot |

---

## 📁 Project Structure

```
final project/
├── backend/
│   ├── accounts/         # Users, profiles, agents, authentication
│   ├── properties/       # Property listings, images, features
│   ├── interactions/     # Visit requests, reviews, notifications
│   ├── utils/
│   │   └── cloudinary_upload.py  # Central image upload utility
│   ├── backend_core/
│   │   ├── settings.py   # All configuration
│   │   └── urls.py       # Root URL routing
│   ├── requirements.txt
│   └── Procfile          # Railway deployment command
│
└── frontend/
    ├── src/
    │   ├── pages/        # 12 page components
    │   ├── components/   # Layout, PropertyCard, NotificationBell, ChatBot
    │   ├── api.js        # Axios instance with JWT auto-refresh
    │   └── App.jsx       # Route definitions
    └── vercel.json       # SPA routing fix for Vercel
```

---

## 🔐 Authentication

- **Registration:** Choose role (Agent or Buyer) at signup
- **Login:** Returns a 60-minute access token + 7-day refresh token
- **Auto-refresh:** When the access token expires, it is silently refreshed using the refresh token — users stay logged in without interruption
- **Security:** Only the property's owner agent can edit or delete their own listings

---

## 📝 License

This project was built as a final academic project. All rights reserved.
