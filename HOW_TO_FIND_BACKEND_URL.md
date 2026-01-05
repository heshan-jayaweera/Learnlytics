# 🔍 How to Find Your Backend URL

## Quick Answer

**If your backend is already deployed:**
- Check your deployment platform dashboard (Render, Railway, etc.)
- Look for the "Live URL" or "Public URL" section
- Your API URL = `https://your-backend-url.com/api`

**If your backend is NOT deployed yet:**
- You need to deploy it first (see `Backend/DEPLOYMENT.md`)
- Then come back here to find the URL

---

## 📍 Step-by-Step: Finding Your Backend URL

### Option 1: Render (Most Common)

1. **Go to [render.com](https://render.com)** and log in
2. **Click on your web service** (the backend you deployed)
3. **Look at the top of the page** - you'll see:
   ```
   Your service is live at: https://learnlytics-backend.onrender.com
   ```
4. **Your API URL is:** `https://learnlytics-backend.onrender.com/api`
   - Just add `/api` to the end!

**Visual Guide:**
```
Render Dashboard
└── Your Service: "learnlytics-backend"
    └── Status: Live ✅
    └── URL: https://learnlytics-backend.onrender.com  ← COPY THIS
    └── Add "/api" → https://learnlytics-backend.onrender.com/api
```

---

### Option 2: Railway

1. **Go to [railway.app](https://railway.app)** and log in
2. **Click on your project**
3. **Click on your service** (the backend)
4. **Go to "Settings" tab**
5. **Click "Domains"** or look for "Public Domain"
6. **Copy the URL** shown (e.g., `https://your-app.up.railway.app`)
7. **Your API URL is:** `https://your-app.up.railway.app/api`

---

### Option 3: Vercel

1. **Go to [vercel.com](https://vercel.com)** and log in
2. **Click on your backend project**
3. **Look at the "Domains" section**
4. **Copy the URL** (e.g., `https://your-backend.vercel.app`)
5. **Your API URL is:** `https://your-backend.vercel.app/api`

---

### Option 4: Other Platforms

**Heroku:**
- Dashboard → Your App → Settings → Domains
- URL format: `https://your-app.herokuapp.com/api`

**DigitalOcean App Platform:**
- Apps → Your App → Settings → Domains
- URL format: `https://your-app.ondigitalocean.app/api`

**AWS/GCP/Azure:**
- Check your cloud provider's console for the public endpoint

---

## ✅ Verify Your Backend is Working

Once you have the URL, test it:

1. **Test the root endpoint:**
   - Visit: `https://your-backend-url.com/`
   - Should see: `{"message": "Student Academic Data Management API is running"}`

2. **Test an API endpoint:**
   - Visit: `https://your-backend-url.com/api/auth/profile`
   - Should get a response (might be an error if not authenticated, but that's OK - it means the server is running!)

---

## 🎯 What to Do With This URL

Once you have your backend URL:

1. **Copy the full API URL** (e.g., `https://learnlytics-backend.onrender.com/api`)

2. **Go to your Frontend Vercel deployment:**
   - Vercel Dashboard → Your Frontend Project → Settings → Environment Variables

3. **Add/Update this variable:**
   ```
   Name: REACT_APP_API_URL
   Value: https://learnlytics-backend.onrender.com/api
   ```

4. **Redeploy your frontend** (or it will auto-redeploy)

5. **Test your app** - it should now connect to your backend!

---

## 🆘 Still Can't Find It?

### Check These Places:

1. **Deployment Platform Dashboard:**
   - Look for "Live URL", "Public URL", "Domain", or "Endpoint"

2. **Deployment Logs:**
   - Sometimes the URL is shown in the build/deployment logs

3. **Email Notifications:**
   - Check your email for deployment confirmation - it often includes the URL

4. **Browser History:**
   - If you visited it before, check your browser history

5. **GitHub Actions/CI:**
   - If you use CI/CD, check the workflow logs

---

## 💡 Pro Tips

- **Bookmark your backend URL** once you find it!
- **Use a custom domain** if you want a cleaner URL (optional)
- **Keep the URL handy** - you'll need it for frontend environment variables

---

## 📝 Example URLs

Here are examples of what your backend URL might look like:

```
✅ Good Examples:
- https://learnlytics-api.onrender.com/api
- https://my-backend.up.railway.app/api
- https://backend-abc123.vercel.app/api

❌ Wrong Examples:
- http://localhost:5000/api (only works locally)
- https://learnlytics-api.onrender.com (missing /api)
- learnlytics-api.onrender.com/api (missing https://)
```

---

## 🚀 Next Steps

1. ✅ Find your backend URL (you're here!)
2. ✅ Test that it works
3. ✅ Add it to frontend environment variables
4. ✅ Deploy/redeploy frontend
5. ✅ Test the full application

Need help deploying? Check `Backend/DEPLOYMENT.md`

