# Quick Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (optional - app works without it, but scores won't persist)

## Installation Steps

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/typing-speedx
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Note:** If you don't have MongoDB installed, the app will still work, but scores won't be saved to the database.

Start the backend:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

(Optional) Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Access the Application

Open your browser and navigate to `http://localhost:5173`

## Features to Try

1. **Single Player Mode**: Click "Single Player" and start a typing test
2. **Multiplayer Mode**: 
   - Create a room and share the code with a friend
   - Or join a room with a code
   - Wait for players to be ready
   - Compete in real-time!
3. **Leaderboard**: View top scores from all players

## Troubleshooting

### Backend won't start
- Make sure port 5000 is not in use
- Check that all dependencies are installed (`npm install`)
- Check the `.env` file exists and has correct values

### Frontend won't start
- Make sure port 5173 is not in use
- Check that all dependencies are installed (`npm install`)
- Make sure the backend is running on port 5000

### MongoDB connection errors
- The app will work without MongoDB, but scores won't be saved
- To enable MongoDB, make sure it's installed and running
- Update the `MONGODB_URI` in the backend `.env` file

### Socket.io connection issues
- Make sure the backend is running
- Check that `VITE_SOCKET_URL` in frontend `.env` matches the backend URL
- Check browser console for connection errors

## Production Build

To build for production:

```bash
# Frontend
cd frontend
npm run build

# The built files will be in frontend/dist/
```

## Deployment

### Backend
- Deploy to services like Heroku, Railway, or Render
- Set environment variables in your hosting platform
- Make sure to set `FRONTEND_URL` to your frontend URL

### Frontend
- Deploy to services like Vercel, Netlify, or GitHub Pages
- Set environment variables for API and Socket URLs
- Update `VITE_API_URL` and `VITE_SOCKET_URL` to your backend URL

## Enjoy!

Have fun typing and competing! 🚀
