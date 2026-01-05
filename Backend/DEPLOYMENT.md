# Backend Deployment Guide

## 🚀 Quick Deployment Options

Your backend needs to be deployed to get a public URL. Here are the best options:

---

## Option 1: Render (Recommended - Easiest)

### Step 1: Prepare Your Backend
1. Make sure your `Backend/package.json` has a proper start script
2. Ensure your MongoDB is accessible (use MongoDB Atlas for cloud database)

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `learnlytics-backend` (or any name)
   - **Root Directory**: `Backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node app.js` (or `npm start` if you have a production script)
   - **Plan**: Free tier is fine to start

### Step 3: Set Environment Variables
In Render Dashboard → Environment:
```
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-secret-key-here
PORT=10000
```

### Step 4: Get Your Backend URL
- After deployment, Render will give you a URL like: `https://learnlytics-backend.onrender.com`
- Your API URL will be: `https://learnlytics-backend.onrender.com/api`
- **Copy this URL** - you'll need it for your frontend!

---

## Option 2: Railway

### Step 1: Deploy to Railway
1. Go to [railway.app](https://railway.app) and sign up/login
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway will auto-detect it's a Node.js app

### Step 2: Configure
- **Root Directory**: Set to `Backend`
- **Start Command**: `node app.js`

### Step 3: Set Environment Variables
In Railway Dashboard → Variables:
```
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-secret-key-here
```

### Step 4: Get Your Backend URL
- Railway will generate a URL like: `https://your-app.up.railway.app`
- Your API URL will be: `https://your-app.up.railway.app/api`
- **Copy this URL** for your frontend!

---

## Option 3: Vercel (Serverless Functions)

Vercel can host Node.js backends, but requires some configuration. See `vercel-backend.json` if you want to use this option.

---

## Option 4: Keep Running Locally (Development Only)

If you're just testing:
- Run: `cd Backend && npm start`
- Your backend URL: `http://localhost:5000`
- Your API URL: `http://localhost:5000/api`
- ⚠️ **Note**: This only works on your local machine, not for production!

---

## 📋 Required Environment Variables

Make sure to set these in your deployment platform:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key-12345` |
| `PORT` | Server port (usually auto-set by platform) | `5000` or `10000` |

---

## 🔍 How to Find Your Backend URL After Deployment

### On Render:
1. Go to your Dashboard
2. Click on your web service
3. Look at the top - you'll see: **"Your service is live at: https://your-app.onrender.com"**
4. Your API URL: `https://your-app.onrender.com/api`

### On Railway:
1. Go to your project dashboard
2. Click on your service
3. Go to **"Settings"** → **"Domains"**
4. You'll see your public URL
5. Your API URL: `https://your-url.up.railway.app/api`

### Test Your Backend:
Visit: `https://your-backend-url.com/` 
You should see: `{"message": "Student Academic Data Management API is running"}`

---

## ✅ Next Steps

Once you have your backend URL:
1. Copy the full URL (e.g., `https://learnlytics-backend.onrender.com/api`)
2. Go to your **Frontend Vercel deployment**
3. Add environment variable: `REACT_APP_API_URL` = `https://learnlytics-backend.onrender.com/api`
4. Redeploy your frontend

---

## 🐛 Troubleshooting

### Backend not starting?
- Check logs in your deployment platform
- Verify environment variables are set correctly
- Ensure MongoDB connection string is correct

### CORS errors?
- Your backend already has `cors()` enabled, so this should work
- If issues persist, check the CORS configuration in `app.js`

### Can't connect to MongoDB?
- Make sure you're using MongoDB Atlas (cloud) not local MongoDB
- Verify your connection string includes your IP address whitelist
- Check that your MongoDB cluster is running

