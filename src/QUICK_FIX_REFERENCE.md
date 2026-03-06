# 🚀 QUICK FIX REFERENCE - Start in 3 Steps

## ✅ All .env files have been created!

### **Step 1: Start MongoDB**
```bash
brew services start mongodb-community@7.0
```

### **Step 2: Start Backend** (new terminal)
```bash
cd server
npm run dev
```
**Wait for:** `✅ MongoDB Connected Successfully`

### **Step 3: Start Frontend** (new terminal)
```bash
npm run dev
```
**Wait for:** `➜  Local:   http://localhost:5173/`

---

## 🧪 Quick Test

```bash
# Test backend health
curl http://localhost:5000/api/health

# Should return: {"status":"OK",...}
```

Then open: **http://localhost:5173**

---

## 🔍 Verify Everything

```bash
chmod +x verify-env.sh
./verify-env.sh
```

---

## 📝 Test Credentials

**Admin Login:**
- URL: http://localhost:5173/admin-login
- Phone: `01700000000`
- Password: `admin123`

---

## ⚠️ Common Issues

### "Failed to fetch" error?
→ Backend not running. Do Step 2 above.

### "MongoDB Connection Error"?
→ MongoDB not running. Do Step 1 above.

### Still not working?
→ Restart frontend (Ctrl+C, then `npm run dev`)

---

## 📚 Full Documentation

- **STARTUP_INSTRUCTIONS.md** - Complete guide
- **ERROR_FIXED_ENV_FILES.md** - What was fixed
- **verify-env.sh** - Automated verification

---

**Status:** ✅ Ready to start!
