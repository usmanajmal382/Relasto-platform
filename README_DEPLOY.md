# Deployment Guide for Relasto on Vercel

I have prepared the codebase for Vercel deployment. Follow these steps to get it live:

## 1. Prerequisites
*   **Database:** Create a PostgreSQL database (e.g., on [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or Vercel Postgres).
*   **Git:** Ensure your project is pushed to a GitHub/GitLab/Bitbucket repository.

## 2. Deploy the Backend
1.  Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New... > Project**.
2.  Import your repository.
3.  **Root Directory:** Set this to `backend`.
4.  **Framework Preset:** Select **Other**.
5.  **Environment Variables:** Add the following:
    *   `SECRET_KEY`: (A random long string)
    *   `DATABASE_URL`: Your PostgreSQL connection string.
    *   `DEBUG`: `False`
6.  Click **Deploy**.

## 3. Deploy the Frontend
1.  Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New... > Project** (yes, again for the same repo).
2.  Import the same repository.
3.  **Root Directory:** Set this to `frontend`.
4.  **Framework Preset:** Select **Vite**.
5.  **Environment Variables:** Add the following:
    *   `VITE_API_URL`: The URL of your deployed backend (e.g., `https://your-backend.vercel.app/api/`).
6.  Click **Deploy**.

## 4. Final Touch: CORS
Once your frontend is deployed, copy its URL and add it to `CORS_ALLOWED_ORIGINS` in `backend/backend_core/settings.py` if you want to be more secure (currently it's set to `CORS_ALLOW_ALL_ORIGINS = True`).

---
**Note:** Since this is a serverless deployment, the first request might be slow (Cold Start).
