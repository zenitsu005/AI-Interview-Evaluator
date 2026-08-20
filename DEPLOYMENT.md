# 🚀 Cloud Deployment Guide: AI Interview Evaluator

This full-stack application can be deployed for **100% Free** using **Render**, **Railway**, or **Vercel**.

---

## 🌟 Method 1: All-in-One Deployment on Render.com (Recommended & Easiest)
Deploy both the React frontend and Node.js backend under a **single free URL** with zero CORS setup!

### Step 1: Push your project to GitHub
1. Create a new repository on [GitHub](https://github.com/new) (e.g. `ai-interview-evaluator`).
2. In your VS Code terminal, run:
```bash
git init
git add .
git commit -m "feat: initial production build"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/ai-interview-evaluator.git
git push -u origin main
```

### Step 2: Deploy on Render
1. Sign up / Log in to [Render.com](https://render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Fill in the following settings:
   - **Name**: `ai-interview-evaluator`
   - **Region**: Nearest to your users (e.g., Singapore, Frankfurt, or Ohio)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: *Your Google Gemini API Key*
   - `JWT_SECRET`: *Any random 32-character secret string*
   - `NODE_ENV`: `production`
6. Click **Deploy Web Service**!
7. Render will build the client and start your server. In 2-3 minutes, your live site URL will be ready at `https://ai-interview-evaluator.onrender.com`.

---

## ⚡ Method 2: Split Deployment (Vercel Frontend + Render/Railway Backend)

### 1. Deploy the Backend on Render
1. Create a **Web Service** on Render pointing to your repo.
2. Set **Root Directory** to `server`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `node server.js`.
5. Add your `GEMINI_API_KEY` and `JWT_SECRET` in environment variables.
6. Copy your backend URL: e.g. `https://my-backend.onrender.com`.

### 2. Deploy the Frontend on Vercel
1. Go to [Vercel.com](https://vercel.com) and import your GitHub repo.
2. Set **Root Directory** to `client`.
3. Set **Framework Preset** to `Vite`.
4. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://my-backend.onrender.com/api`
5. Click **Deploy**.
6. Your blazing-fast global frontend is live on Vercel!

---

## 🔑 Required Environment Variables
| Variable | Description | Example |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API Key from Google AI Studio | `AIzaSy...` |
| `JWT_SECRET` | Secret key for user auth tokens | `super-secret-key-12345` |
| `PORT` | Port for Express server | `5000` (auto-set by cloud provider) |
| `NODE_ENV` | Environment mode | `production` |
