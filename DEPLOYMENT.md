# Deployment Guide for TypingSpeedX on Vercel

This guide will help you deploy TypingSpeedX on Vercel. Since Vercel is optimized for frontend and serverless functions, we'll need to adapt the backend for Vercel's serverless architecture.

## Overview

- **Frontend**: Deploy directly to Vercel (React + Vite)
- **Backend**: Deploy as Vercel Serverless Functions
- **Socket.io**: Use Vercel's serverless functions with Socket.io adapter (requires special setup)
- **MongoDB**: Use MongoDB Atlas (free tier available)

## Option 1: Recommended - Separate Deployments

### Frontend on Vercel + Backend on Railway/Render

This is the easiest and most reliable approach:

#### Step 1: Deploy Backend to Railway or Render

**Railway (Recommended):**
1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repo
4. Add environment variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   FRONTEND_URL=https://your-vercel-app.vercel.app
   NODE_ENV=production
   ```
5. Railway will auto-detect Node.js and deploy

**Render:**
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repo
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`
6. Add environment variables (same as above)

#### Step 2: Deploy Frontend to Vercel

1. **Prepare frontend for production:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create `vercel.json` in the root:**
   ```json
   {
     "buildCommand": "cd frontend && npm install && npm run build",
     "outputDirectory": "frontend/dist",
     "devCommand": "cd frontend && npm run dev",
     "installCommand": "cd frontend && npm install",
     "framework": "vite",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

3. **Update frontend environment variables:**
   Create `frontend/.env.production`:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   VITE_SOCKET_URL=https://your-backend-url.railway.app
   ```

4. **Deploy to Vercel:**
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel --prod`
   - Or connect GitHub repo to Vercel dashboard

## Option 2: Full Vercel Deployment (Serverless)

This requires adapting the backend for Vercel's serverless functions.

### Step 1: Restructure for Vercel

Create `api/` directory in the root and move backend files:

```
api/
  server.js (main serverless function)
  routes/
    text.js
    score.js
  models/
    Score.js
  socket.js (will need adapter)
```

### Step 2: Create Vercel Configuration

Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb-uri",
    "NODE_ENV": "production"
  }
}
```

### Step 3: Update Backend for Serverless

Socket.io on Vercel requires special handling. Consider using:
- Polling instead of WebSockets for Socket.io
- Or use a separate service for WebSocket (like Pusher, Ably, or Railway for Socket.io only)

## Option 3: Simplest - Vercel Frontend + MongoDB Atlas Only

Remove Socket.io multiplayer temporarily and deploy frontend + API routes to Vercel:

### Steps:

1. **Deploy Frontend to Vercel:**
   ```bash
   cd frontend
   vercel --prod
   ```

2. **Create API Routes in Vercel:**
   Create `api/` folder in root with serverless functions for REST API only.

3. **Use MongoDB Atlas:**
   - Free tier available
   - Update connection string in Vercel environment variables

## Recommended Deployment Steps (Option 1)

### 1. Set up MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP address (0.0.0.0/0 for development)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/typing-speedx`

### 2. Deploy Backend to Railway

1. Push code to GitHub
2. Go to Railway.app
3. New Project → Deploy from GitHub
4. Select your repo
5. Set root directory: `backend`
6. Add environment variables:
   - `MONGODB_URI=your_atlas_connection_string`
   - `FRONTEND_URL=https://your-app.vercel.app`
   - `PORT=5000`
   - `NODE_ENV=production`
7. Deploy

### 3. Deploy Frontend to Vercel

1. **Create `vercel.json` in project root:**
   ```json
   {
     "buildCommand": "cd frontend && npm install && npm run build",
     "outputDirectory": "frontend/dist",
     "devCommand": "cd frontend && npm run dev",
     "installCommand": "cd frontend && npm install",
     "framework": "vite",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

2. **Update `frontend/.env.production`:**
   ```
   VITE_API_URL=https://your-backend.railway.app
   VITE_SOCKET_URL=https://your-backend.railway.app
   ```

3. **Deploy:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Deploy
   cd frontend
   vercel --prod
   ```

   Or use Vercel Dashboard:
   - Connect GitHub repo
   - Set root directory to `frontend`
   - Add environment variables
   - Deploy

### 4. Update CORS Settings

Make sure your backend allows your Vercel domain:
```javascript
// backend/server.js
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "https://your-app.vercel.app",
    methods: ["GET", "POST"]
  }
});
```

## Environment Variables Summary

### Backend (Railway/Render):
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/typing-speedx
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Frontend (Vercel):
```
VITE_API_URL=https://your-backend.railway.app
VITE_SOCKET_URL=https://your-backend.railway.app
```

## Testing After Deployment

1. Test single-player mode
2. Test multiplayer mode (Socket.io)
3. Test leaderboard (MongoDB connection)
4. Check browser console for CORS errors
5. Verify Socket.io connection in Network tab

## Troubleshooting

### CORS Errors
- Check `FRONTEND_URL` in backend matches your Vercel URL
- Ensure CORS is configured correctly in `server.js`

### Socket.io Connection Issues
- Verify `VITE_SOCKET_URL` matches backend URL
- Check that WebSocket connections are allowed
- Railway/Render should support WebSockets

### MongoDB Connection
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

## Alternative: Free Hosting Options

- **Frontend**: Vercel (free)
- **Backend**: Railway (free tier), Render (free tier), or Fly.io (free tier)
- **Database**: MongoDB Atlas (free tier)

## Notes

- Vercel's serverless functions have execution time limits
- Socket.io works best with traditional servers (Railway/Render)
- For production, consider using a dedicated WebSocket service if needed
- Always use environment variables for sensitive data
- Enable HTTPS for both frontend and backend

