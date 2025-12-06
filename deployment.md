# Deployment Guide

This guide outlines the steps to deploy your **Jewelry Store** (Frontend) and **CMS** (Backend).

## Recommended Stack
*   **Frontend**: [Vercel](https://vercel.com) (Best for React/Vite) or Netlify.
*   **Backend**: [Render](https://render.com) or [Railway](https://railway.app) (Good for Node.js apps).
*   **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (Cloud Database).
*   **Media**: [Cloudinary](https://cloudinary.com) (Already integrated).

---

## Part 1: Backend Deployment (Payload CMS)
**Target**: Render or Railway

1.  **Repository**: Push your `my-cms` folder to a GitHub repository (or the whole project if monorepo).
2.  **Create Service**:
    *   **Render**: New "Web Service".
    *   **Railway**: New "Project" -> "Deploy from GitHub".
3.  **Settings**:
    *   **Root Directory**: `my-cms` (if in a subdirectory).
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm run serve` (or `npm start`)
4.  **Environment Variables** (Copy these from your `.env`):
    *   `DATABASE_URI`: Your MongoDB connection string (from Atlas).
    *   `PAYLOAD_SECRET`: A long random string.
    *   `CLOUDINARY_CLOUD_NAME`: ...
    *   `CLOUDINARY_API_KEY`: ...
    *   `CLOUDINARY_API_SECRET`: ...
    *   `PAYLOAD_PUBLIC_SERVER_URL`: The URL provided by your host (e.g., `https://my-cms.onrender.com`).

> **Important**: Ensure your MongoDB Access (Network Access) in Atlas allows connections from anywhere (`0.0.0.0/0`) or whitelist your host's IP.

---

## Part 2: Frontend Deployment (Vite React)
**Target**: Vercel

1.  **Repository**: Push your `jewelry-store` folder to GitHub.
2.  **Create Project** on Vercel:
    *   Import from GitHub.
3.  **Settings**:
    *   **Root Directory**: `jewelry-store` (edit if prompted).
    *   **Framework Preset**: Vite.
    *   **Build Command**: `npm run build`.
    *   **Output Directory**: `dist`.
4.  **Environment Variables**:
    *   `VITE_API_URL`: The URL of your deployed backend (e.g., `https://my-cms.onrender.com/api`).
        *   *Note: Ensure you include `/api` at the end if your frontend expects it, or just the base URL depending on your setup.*

## Part 3: Final Wiring
1.  **CORS**: Go back to your Backend. Update `payload.config.ts` or `server.ts` to allow the frontend domain in `cors` settings.
    *   In `payload.config.ts`, add: `cors: ['https://your-frontend.vercel.app']`.
    *   *Tip: You might need to redeploy the backend after this.*
2.  **Test**: Open your frontend URL and verify products are loading from the live backend.

---

## Checklist
- [ ] MongoDB Atlas User/IP Whitelist configured.
- [ ] Backend deployed and healthy (visit `/admin` to check).
- [ ] Backend `cors` allowed Frontend URL.
- [ ] Frontend deployed with correct `VITE_API_URL`.
