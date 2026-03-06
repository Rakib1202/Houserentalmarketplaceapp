# 🚀 QUICK START - 3 COMMANDS

## ✅ Error Fixed: "Failed to fetch" - RESOLVED!

---

## 📋 WHAT WAS FIXED

✅ Created `/.env` with `VITE_API_URL=http://localhost:5000/api`
✅ Created `/.env.example` template
✅ Verified `/server/.env` exists and is configured
✅ All Supabase references removed from auth components

---

## 🎯 START YOUR SYSTEM (3 STEPS)

### 1️⃣ START MONGODB
```bash
brew services start mongodb-community@7.0
```

### 2️⃣ START BACKEND (Terminal 1)
```bash
cd server
npm run dev
```

**Wait for:** `✅ MongoDB Connected Successfully`

### 3️⃣ START FRONTEND (Terminal 2)
```bash
# IMPORTANT: If already running, STOP IT FIRST (Ctrl+C)
npm run dev
```

**Wait for:** `➜  Local:   http://localhost:5173/`

---

## 🧪 TEST IT WORKS

### ✅ Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```
Should return: `{"status":"OK",...}`

### ✅ Test 2: Login
1. Open: http://localhost:5173/admin-login
2. Phone: `01700000000`
3. Password: `admin123`
4. Click "Login"
5. Should work! ✅

### ✅ Test 3: Console
1. Press F12 in browser
2. Check Console tab
3. Should see NO "Failed to fetch" errors ✅

---

## 🔍 STILL NOT WORKING?

### Problem: "Failed to fetch" still appears

**Solution:** Restart the frontend!
```bash
# Stop frontend (Ctrl+C)
npm run dev
```

Vite only loads `.env` on startup!

### Problem: Backend not responding

**Check:**
```bash
curl http://localhost:5000/api/health
```

If fails, start backend:
```bash
cd server
npm run dev
```

### Problem: MongoDB not running

**Start it:**
```bash
brew services start mongodb-community@7.0
```

**Verify:**
```bash
mongosh
# Should connect. Type: exit
```

---

## 📁 FILES CREATED

- `/.env` - Frontend API configuration
- `/.env.example` - Frontend template
- `/FIX_FAILED_TO_FETCH.md` - Detailed fix guide
- `/STARTUP_GUIDE.md` - Complete startup guide
- `/ERROR_FIX_SUMMARY.md` - Error summary
- `/verify-system.sh` - Verification script

---

## 🎉 SUCCESS!

✅ Frontend: http://localhost:5173
✅ Admin: http://localhost:5173/admin-login
✅ API Health: http://localhost:5000/api/health

**Credentials:**
- Phone: `01700000000`
- Password: `admin123`

---

## 🆘 NEED HELP?

Read the detailed guides:
- `/STARTUP_GUIDE.md` - Complete startup instructions
- `/FIX_FAILED_TO_FETCH.md` - Error fix details
- `/ERROR_FIX_SUMMARY.md` - Quick summary

Run verification:
```bash
chmod +x verify-system.sh
./verify-system.sh
```

---

**Date:** February 23, 2026
**Status:** ✅ FIXED AND READY
**Happy Coding!** 🚀
