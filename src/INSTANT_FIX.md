# ⚡ INSTANT FIX - "Failed to fetch" Error

## 🚨 THE PROBLEM

Your **backend is NOT running**. That's why you're getting "Failed to fetch" errors.

---

## ✅ THE FIX (3 Commands)

### **1. Start MongoDB**
```bash
brew services start mongodb-community@7.0
```

### **2. Start Backend**
```bash
cd server
npm run dev
```

**WAIT FOR THIS:**
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

### **3. Start Frontend (New Terminal)**
```bash
# If frontend is already running, STOP IT FIRST (Ctrl+C)
npm run dev
```

---

## 🧪 TEST IT WORKS

### **Test 1: Backend Health**
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"status":"OK","message":"HouseRentBD API is running","timestamp":"..."}
```

### **Test 2: Open Browser**
1. Go to: http://localhost:5173/login
2. Press F12 (Developer Tools)
3. Look at Console
4. Should see: `🔧 API Configuration: { ... }`
5. **NO** "Failed to fetch" errors ✅

---

## 🚫 STILL NOT WORKING?

### **Check if backend is actually running:**
```bash
lsof -i :5000
```

If this shows **nothing**, backend is NOT running!

Go back and run:
```bash
cd server
npm run dev
```

And WAIT for: `✅ MongoDB Connected Successfully`

---

### **Check if MongoDB is actually running:**
```bash
mongosh
```

If this fails, MongoDB is NOT running!

Start it with:
```bash
brew services start mongodb-community@7.0
```

---

## 📊 QUICK CHECKLIST

- [ ] MongoDB is running (test with `mongosh`)
- [ ] Backend is running (test with `curl http://localhost:5000/api/health`)
- [ ] Frontend is running (test by opening http://localhost:5173)
- [ ] You restarted frontend after creating .env file
- [ ] No "Failed to fetch" in browser console

---

## 💡 MOST COMMON MISTAKE

**You didn't wait for the backend to fully start!**

When you run `npm run dev` in the server directory, you MUST wait until you see:

```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

If you don't see these messages, the backend is still starting (or failed to start).

**DO NOT proceed until you see these messages!**

---

## 🎯 TL;DR

1. Open terminal
2. Run: `brew services start mongodb-community@7.0`
3. Run: `cd server && npm run dev`
4. **WAIT for:** `✅ MongoDB Connected Successfully`
5. Open new terminal
6. Run: `npm run dev`
7. Open: http://localhost:5173/login
8. ✅ Should work now!

---

## 📖 MORE HELP

If this didn't fix it, read:
- `/DIAGNOSTIC_GUIDE.md` - Complete troubleshooting guide
- `/STARTUP_GUIDE.md` - Detailed startup instructions
- `/test-connection.html` - Visual connection test tool

Or run the verification script:
```bash
chmod +x verify-system.sh
./verify-system.sh
```

---

**REMEMBER:**

**"Failed to fetch" = Backend not running**

**Fix = Start the backend!**

---

**Date:** February 23, 2026

**Status:** ✅ Instructions ready

**Happy coding! 🚀**
