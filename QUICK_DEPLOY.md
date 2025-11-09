# Quick Deploy Guide - Vercel + Railway

## 🚀 Fastest Way to Deploy

### 1. Backend on Railway (5 minutes)

1. Go to [railway.app](https://railway.app) → Sign up with GitHub
2. New Project → Deploy from GitHub → Select your repo
3. Settings → Set Root Directory to `backend`
4. Variables → Add:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/typing-speedx
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-app.vercel.app (update after step 2)
   ```
5. Copy your Railway URL (e.g., `https://typing-speedx.railway.app`)

### 2. Frontend on Vercel (5 minutes)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. New Project → Import your GitHub repo
3. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Environment Variables:
   ```
   VITE_API_URL=https://your-backend.railway.app
   VITE_SOCKET_URL=https://your-backend.railway.app
   ```
5. Deploy → Copy your Vercel URL

### 3. Update Backend CORS

1. Go back to Railway
2. Update `FRONTEND_URL` to your Vercel URL
3. Railway auto-redeploys

### 4. Set up MongoDB Atlas (5 minutes)

1. [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) → Sign up
2. Create free cluster (M0)
3. Database Access → Add user → Save password
4. Network Access → Allow from anywhere (0.0.0.0/0)
5. Connect → Get connection string
6. Update `MONGODB_URI` in Railway with your connection string

## ✅ Done!

Your app is live at: `https://your-app.vercel.app`

## 📝 Checklist

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] MongoDB Atlas configured
- [ ] Environment variables set
- [ ] CORS updated
- [ ] Tested single-player mode
- [ ] Tested multiplayer mode
- [ ] Tested leaderboard

## 🆘 Common Issues

**CORS Error?**
- Check `FRONTEND_URL` in Railway matches Vercel URL exactly

**Socket.io not connecting?**
- Verify `VITE_SOCKET_URL` matches Railway backend URL
- Check Railway logs

**MongoDB connection failed?**
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas
- Check Railway logs

## 💰 Cost: $0/month (Free tiers)

- Vercel: Free
- Railway: Free ($5 credit/month)
- MongoDB Atlas: Free (512MB)

Happy deploying! 🎉

