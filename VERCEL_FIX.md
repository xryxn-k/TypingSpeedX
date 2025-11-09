# Fix Vercel Build Error

## Problem
```
sh: line 1: vite: command not found
Error: Command "vite build" exited with 127
```

## Solution 1: Configure in Vercel Dashboard (Recommended)

Instead of using `vercel.json`, configure everything in Vercel Dashboard:

1. **Go to your Vercel project settings**
2. **Settings → General**
3. **Set Root Directory to: `frontend`**
4. **Settings → Build & Development Settings:**
   - Framework Preset: **Vite**
   - Build Command: `npm run build` (leave default)
   - Output Directory: `dist` (leave default)
   - Install Command: `npm install` (leave default)
5. **Save and redeploy**

This way, Vercel will work directly in the `frontend` directory and automatically detect Vite.

## Solution 2: Delete vercel.json and use Dashboard

1. **Delete `vercel.json` from your repo** (or rename it)
2. **Push to GitHub**
3. **In Vercel Dashboard:**
   - Root Directory: `frontend`
   - Framework: Vite
   - Everything else auto-detected
4. **Redeploy**

## Solution 3: Fix vercel.json (Current)

The `vercel.json` I created should work, but make sure:

1. **In Vercel Dashboard, DO NOT set Root Directory**
2. **Let vercel.json handle everything**
3. **Make sure the build command uses `npm ci` instead of `npm install`**

If it still doesn't work, use Solution 1 (Dashboard configuration).

## Quick Fix Steps

1. **Go to Vercel Dashboard**
2. **Project Settings → General**
3. **Root Directory: `frontend`**
4. **Project Settings → Build & Development Settings**
5. **Framework Preset: Vite**
6. **Save**
7. **Redeploy**

This should fix the issue immediately!

## Why This Happens

Vercel tries to run `vite build` but can't find the `vite` command because:
- Dependencies aren't installed in the right directory
- Build command is running from wrong directory
- Root directory isn't set correctly

Setting Root Directory to `frontend` fixes all of these issues.

## After Fixing

Your deployment should:
1. ✅ Install dependencies in `frontend/`
2. ✅ Run `npm run build` in `frontend/`
3. ✅ Output to `frontend/dist/`
4. ✅ Serve the built files

Try Solution 1 first - it's the easiest and most reliable!

