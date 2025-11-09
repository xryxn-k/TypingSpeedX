# Deploy TypingSpeedX to Vercel - Step by Step Guide

## Quick Overview

Since your app uses **Socket.io** (WebSockets), we'll use a hybrid approach:
- **Frontend**: Deploy to Vercel (free, fast)
- **Backend**: Deploy to Railway or Render (supports WebSockets)

## Step 1: Set Up MongoDB Atlas (Database)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a free cluster (M0 - Free tier)
4. Create database user:
   - Database Access → Add New User
   - Username: `typing-speedx-user`
   - Password: Generate secure password (save it!)
5. Whitelist IP addresses:
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
6. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://typing-speedx-user:yourpassword@cluster0.xxxxx.mongodb.net/typing-speedx?retryWrites=true&w=majority`

## Step 2: Deploy Backend to Railway (Recommended)

Railway is free and supports WebSockets perfectly.

### Option A: Deploy via Railway Dashboard

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Select your repository
6. Railway will auto-detect it's a Node.js project
7. Set the root directory to `backend`:
   - Click on your service
   - Settings → Root Directory → Set to `backend`
8. Add environment variables:
   - Go to Variables tab
   - Add these variables:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_atlas_connection_string_here
     NODE_ENV=production
     FRONTEND_URL=https://your-app.vercel.app (we'll update this after deploying frontend)
     ```
9. Deploy! Railway will automatically deploy

### Option B: Deploy via Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Set root directory
railway link

# Add environment variables
railway variables set MONGODB_URI=your_connection_string
railway variables set NODE_ENV=production
railway variables set PORT=5000

# Deploy
railway up
```

### Get Your Backend URL

After deployment, Railway will give you a URL like:
`https://typing-speedx-backend.railway.app`

**Save this URL** - you'll need it for the frontend!

## Step 3: Deploy Frontend to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Sign up with GitHub
4. Click "Add New Project"
5. Import your GitHub repository
6. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

7. Add environment variables:
   - Click "Environment Variables"
   - Add these (replace with your Railway backend URL):
     ```
     VITE_API_URL=https://your-backend.railway.app
     VITE_SOCKET_URL=https://your-backend.railway.app
     ```

8. Click "Deploy"
9. Wait for deployment to complete
10. **Copy your Vercel URL** (e.g., `https://typing-speedx.vercel.app`)

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Navigate to frontend
cd frontend

# Deploy
vercel --prod

# Add environment variables
vercel env add VITE_API_URL production
# Enter: https://your-backend.railway.app

vercel env add VITE_SOCKET_URL production
# Enter: https://your-backend.railway.app
```

## Step 4: Update Backend CORS Settings

1. Go back to Railway dashboard
2. Update the `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Railway will automatically redeploy

## Step 5: Test Your Deployment

1. Open your Vercel URL in a browser
2. Test single-player mode
3. Test multiplayer mode (create a room)
4. Test leaderboard
5. Check browser console for any errors

## Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in Railway matches your Vercel URL exactly
- Check that CORS is enabled in `backend/server.js`

### Socket.io Not Connecting
- Verify `VITE_SOCKET_URL` in Vercel matches your Railway backend URL
- Check Railway logs for connection errors
- Make sure WebSockets are enabled (Railway supports them by default)

### MongoDB Connection Issues
- Verify your connection string is correct
- Check that IP is whitelisted in MongoDB Atlas
- Ensure database user has correct permissions
- Check Railway logs for MongoDB connection errors

### Environment Variables Not Working
- Make sure variables are set for the correct environment (production)
- Redeploy after adding new environment variables
- Check variable names match exactly (case-sensitive)

## Alternative: Deploy Backend to Render

If you prefer Render over Railway:

1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repo
4. Settings:
   - **Name**: typing-speedx-backend
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: `backend`
5. Add environment variables (same as Railway)
6. Deploy!

## Cost Summary

- **Vercel**: Free (frontend hosting)
- **Railway/Render**: Free tier available (backend hosting)
- **MongoDB Atlas**: Free tier available (database)

**Total Cost: $0/month** 🎉

## Quick Reference

### Backend Environment Variables (Railway/Render):
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/typing-speedx
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Frontend Environment Variables (Vercel):
```
VITE_API_URL=https://your-backend.railway.app
VITE_SOCKET_URL=https://your-backend.railway.app
```

## Next Steps

1. ✅ Set up MongoDB Atlas
2. ✅ Deploy backend to Railway
3. ✅ Deploy frontend to Vercel
4. ✅ Update CORS settings
5. ✅ Test everything
6. 🎉 Share your app with the world!

## Support

If you encounter issues:
- Check Railway logs for backend errors
- Check Vercel logs for frontend errors
- Check browser console for client-side errors
- Verify all environment variables are set correctly
- Make sure all URLs use HTTPS (not HTTP)

Happy deploying! 🚀

