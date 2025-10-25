
---

# 🌐 Full Stack Social Media App Deployment Guide

## 📋 Overview

This guide walks you through deploying your **full-stack social media application** with:

* **Frontend:** React + Vite (Deploy on [Vercel](https://vercel.com))
* **Backend:** Node.js + Express (Deploy on [Render](https://render.com))
* **Database:** MongoDB Atlas (Cloud Database)
* **Media Storage:** Cloudinary (Already configured)

---

## 🗂️ Project Structure

```
social/
├── client/          # React Frontend
└── server/          # Express Backend
```

---

## 🧩 Part 1: Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project (e.g., **“Social Media App”**)

### Step 2: Create a Cluster

1. Click **“Build a Database”**
2. Choose **FREE tier (M0)**
3. Select a cloud provider and region (closest to users)
4. Name your cluster (e.g., `social-cluster`)
5. Click **“Create”**

### Step 3: Configure Database Access

1. Go to **Database Access** (left sidebar)
2. Click **“Add New Database User”**
3. Choose **Password Authentication**
4. Create username and password (save securely)
5. Set privileges to **“Read and write to any database”**
6. Click **“Add User”**

### Step 4: Configure Network Access

1. Go to **Network Access**
2. Click **“Add IP Address”**
3. Choose **“Allow Access from Anywhere” (0.0.0.0/0)**
4. Click **“Confirm”**

### Step 5: Get Connection String

1. Go to **Database → Connect**

2. Choose **“Connect your application”**

3. Copy connection string:

   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
   ```

4. Replace `<username>` and `<password>` with actual credentials

5. Add a database name at the end:

   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/socialmedia
   ```

---

## ⚙️ Part 2: Backend Deployment (Render)

### Step 1: Prepare Backend Code

**Update `server/index.js`:**

```js
const PORT = process.env.PORT || 8000;
```

**Create `server/.env.example`:**

```env
dbUrl=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

**Update CORS in `server/index.js`:**

```js
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
```

**Create public folder:**

```bash
mkdir server/public
```

### Step 2: Push Code to GitHub

```bash
cd server
git init
git add .
git commit -m "Prepare for deployment"
git remote add origin https://github.com/yourusername/social-backend.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Render

1. Go to [Render](https://render.com)
2. Log in using GitHub
3. Click **“New +” → “Web Service”**
4. Connect your backend repository

**Configure Service:**

* Name: `social-media-backend`
* Region: (closest to you)
* Branch: `main`
* Root Directory: `server`
* Runtime: `Node`
* Build Command: `npm install`
* Start Command: `node index.js`
* Instance Type: `Free`

**Add Environment Variables:**

| Key                | Value                                |
| ------------------ | ------------------------------------ |
| `dbUrl`            | your_mongodb_atlas_connection_string |
| `JWT_SECRET`       | your_random_secret_key_here          |
| `CLOUD_NAME`       | your_cloudinary_cloud_name           |
| `CLOUD_API_KEY`    | your_cloudinary_api_key              |
| `CLOUD_API_SECRET` | your_cloudinary_api_secret           |
| `CLIENT_URL`       | (leave blank for now)                |

5. Click **“Create Web Service”**
6. Wait for deployment (~5–10 minutes)
7. Copy your backend URL, e.g.:

```
https://social-media-backend.onrender.com
```

---

## 💻 Part 3: Frontend Deployment (Vercel)

### Step 1: Prepare Frontend Code

**Update `client/apiCalls/config.js`:**

```js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
```

**Create `.env.example`:**

```env
VITE_API_BASE_URL=http://localhost:8000
```

**Create `.env.production`:**

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

**Create `vercel.json`:**

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 2: Push Code to GitHub

```bash
cd client
git init
git add .
git commit -m "Prepare for deployment"
git remote add origin https://github.com/yourusername/social-frontend.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Vercel

1. Go to [Vercel](https://vercel.com)
2. Login with GitHub
3. Click **“Add New Project”**
4. Import your frontend repository

**Configure:**

* Framework Preset: `Vite`
* Root Directory: `client`
* Build Command: `npm run build`
* Output Directory: `dist`

**Add Environment Variable:**

| Key                 | Value                                                                          |
| ------------------- | ------------------------------------------------------------------------------ |
| `VITE_API_BASE_URL` | [https://your-backend-url.onrender.com](https://your-backend-url.onrender.com) |

5. Click **“Deploy”**
6. Wait 2–5 minutes
7. Copy frontend URL, e.g.:

```
https://social-frontend.vercel.app
```

---

## 🔄 Part 4: Final Configuration

### Step 1: Update Backend CORS

1. Go to Render dashboard → your backend service
2. Open **Environment tab**
3. Update `CLIENT_URL` with your Vercel URL
4. Save changes (triggers redeploy)

### Step 2: Test Application

* ✅ Visit your Vercel URL
* ✅ Try Sign Up
* ✅ Try Sign In
* ✅ Upload a Post
* ✅ Verify image uploads and interactions

---

## 🧰 Troubleshooting

### Backend Issues

**Problem:** Cannot connect to MongoDB
✅ Check IP whitelist includes `0.0.0.0/0`
✅ Verify connection string credentials
✅ Confirm user permissions

**Problem:** CORS Error
✅ Set correct `CLIENT_URL`
✅ Ensure `credentials: true` in CORS setup

**Problem:** Cloudinary Upload Fails
✅ Verify all Cloudinary credentials
✅ Check for API limits on dashboard

---

### Frontend Issues

**Problem:** API Calls Failing
✅ Check `VITE_API_BASE_URL` value
✅ Ensure backend is live
✅ Review browser console

**Problem:** 404 on Refresh
✅ Confirm `vercel.json` rewrite rules exist

---

## 🧾 Environment Variables Checklist

**Backend (Render)**

* ✅ dbUrl
* ✅ JWT_SECRET
* ✅ CLOUD_NAME
* ✅ CLOUD_API_KEY
* ✅ CLOUD_API_SECRET
* ✅ CLIENT_URL

**Frontend (Vercel)**

* ✅ VITE_API_BASE_URL

---

## 🚀 Post-Deployment Tips

* **Custom Domains:** Supported on Render & Vercel
* **HTTPS:** Enabled automatically
* **Monitoring:** Check Render logs for errors
* **Sleep Mode:** Free Render instance sleeps after 15 mins
* **Auto-Updates:** Push to GitHub → auto redeploys

---

## 📚 Resources

* [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
* [Render Docs](https://render.com/docs)
* [Vercel Docs](https://vercel.com/docs)
* [Cloudinary Docs](https://cloudinary.com/documentation)

---

## ✅ Deployment Checklist

### Pre-Deployment

* [x] MongoDB Atlas cluster created
* [x] Database user with permissions
* [x] Cloudinary configured
* [x] Code pushed to GitHub

### Backend

* [x] Render account setup
* [x] Service connected
* [x] Env variables added
* [x] Successful build
* [x] Backend URL verified

### Frontend

* [x] Vercel project setup
* [x] Env variables added
* [x] Build successful
* [x] Frontend URL verified

### Post-Deployment

* [x] CORS updated
* [x] Signup tested
* [x] Signin tested
* [x] Post upload verified
* [x] Image upload functional

---

## 🎉 Congratulations!

Your **full-stack social media app is now live!**
Share it with the world 🚀

**Frontend:** [https://your-app.vercel.app](https://your-app.vercel.app)
**Backend:** [https://your-backend.onrender.com](https://your-backend.onrender.com)

---

## 💡 Common Questions

**Q:** Is the free tier enough?
**A:** Yes — for learning and small projects. Upgrade for higher traffic.

**Q:** How do I update my app?
**A:** Just push to GitHub — automatic redeploy.

**Q:** Can I use different platforms?
**A:** Yes — e.g., Backend on Railway or Heroku, Frontend on Netlify.

**Q:** What if Render sleeps my backend?
**A:** Use [UptimeRobot](https://uptimerobot.com) to ping every 15 mins or upgrade.

---

Would you like me to **generate a downloadable `.md` file** for this guide?
