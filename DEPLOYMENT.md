# Vercel Deployment Guide

## ✅ Configuration Complete

Your project is now configured for Vercel deployment with SPA routing support.

## 📁 Files Created

1. **`vercel.json`** (root) - Main Vercel configuration for monorepo deployment
2. **`frontend/vercel.json`** - Alternative configuration if deploying from frontend directory

## 🚀 Deployment Options

### Option 1: Deploy from Root (Recommended for Monorepo)

1. **Connect your repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Vercel will auto-detect the `vercel.json` configuration

2. **Configure Build Settings (if needed):**
   - Root Directory: Leave as root (`.`)
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/build`
   - Install Command: `cd frontend && npm install`

3. **Set Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = Your backend API URL
   - **Don't have a backend URL yet?** See `HOW_TO_FIND_BACKEND_URL.md` or `Backend/DEPLOYMENT.md`

4. **Deploy:**
   - Push to your main branch or click "Deploy"

### Option 2: Deploy Frontend Only

1. **Set Root Directory in Vercel Dashboard:**
   - Project Settings → General → Root Directory: `frontend`

2. **Vercel will use `frontend/vercel.json` automatically**

3. **Set Environment Variables:**
   - `REACT_APP_API_URL` = Your backend API URL

## 🔧 Environment Variables Required

Make sure to set these in Vercel Dashboard → Settings → Environment Variables:

```
REACT_APP_API_URL=https://your-backend-url.com/api
```

## ✅ What's Fixed

- ✅ SPA routing configured (all routes serve `index.html`)
- ✅ Build command configured for monorepo structure
- ✅ Output directory set correctly
- ✅ Rewrites configured to handle React Router

## 🧪 Testing After Deployment

1. **Test root route:** `https://your-app.vercel.app/` → Should redirect to `/login`
2. **Test direct navigation:** `https://your-app.vercel.app/admin/dashboard` → Should work
3. **Test refresh:** Navigate to any route and refresh → Should not show 404
4. **Test API calls:** Ensure `REACT_APP_API_URL` is set correctly

## 🐛 Troubleshooting

### If you still get 404 errors:
- Verify `vercel.json` is in the correct location
- Check that `outputDirectory` matches your build output
- Ensure environment variables are set

### If build fails:
- Check Node.js version (Vercel uses Node 18.x by default)
- Verify all dependencies are in `package.json`
- Check build logs in Vercel dashboard

### If API calls fail:
- Verify `REACT_APP_API_URL` environment variable is set
- Check CORS settings on your backend
- Ensure backend is deployed and accessible

## 📝 Notes

- The `vercel.json` in root is for deploying the entire monorepo
- The `frontend/vercel.json` is a fallback if you set root directory to `frontend`
- Both configurations handle SPA routing correctly

