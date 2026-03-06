# 🚀 START HERE - Quick Launch Guide

## ⚡ 3-Minute Setup

### Prerequisites
- Node.js v16+ installed
- MongoDB Atlas account (free tier)

---

## 🎯 Step 1: MongoDB Atlas (One-Time Setup)

### A. Create Account & Cluster
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up → Create Cluster → Select **FREE** (M0)
3. Choose AWS, nearest region
4. Wait 3-5 minutes for cluster creation

### B. Create Database User
1. Go to "Database Access" → "Add New Database User"
2. Username: `houserentbd_admin`
3. Password: **Generate & SAVE IT!**
4. Privilege: "Atlas admin"

### C. Whitelist IP
1. Go to "Network Access" → "Add IP Address"
2. Click "Allow Access from Anywhere" (0.0.0.0/0)
3. Confirm

### D. Get Connection String
1. Go to "Database" → Click "Connect" on your cluster
2. "Connect your application" → Node.js
3. Copy connection string
4. Replace `<username>`, `<password>`, add `/houserentbd`

**Final string looks like:**
```
mongodb+srv://houserentbd_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/houserentbd?retryWrites=true&w=majority
```

### E. Update Server Config
Edit `/server/.env` and paste your connection string:
```env
MONGODB_URI=mongodb+srv://houserentbd_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/houserentbd?retryWrites=true&w=majority
```

✅ **MongoDB setup complete!**

---

## 🚀 Step 2: Start the Application

Open **TWO terminals**:

### Terminal 1: Backend
```bash
cd server
npm install
npm start
```

**Wait for:** `✅ MongoDB Connected Successfully`

### Terminal 2: Frontend  
```bash
npm install
npm run dev
```

**Wait for:** `Local: http://localhost:5173/`

---

## 🎉 Step 3: Open & Test

1. **Open browser:** http://localhost:5173
2. **Sign up** for a test account
3. **Done!** 🎊

---

## 👤 Create Admin Account

In a **third terminal**:
```bash
cd server
node scripts/createAdmin.js
```

Admin login:
- Phone: `01700000000`
- Password: `admin123`

Access admin panel: http://localhost:5173/admin/login

---

## 🆘 Quick Troubleshooting

### Backend won't start?
- Check MongoDB connection string in `/server/.env`
- Verify IP is whitelisted in MongoDB Atlas
- Ensure port 5000 is free

### Frontend won't start?
- Check `VITE_API_URL=http://localhost:5000` in `/.env`
- Ensure port 5173 is free
- Clear `node_modules` and reinstall

### "Failed to fetch" errors?
- Backend must be running first
- Check CORS settings
- Clear browser cache

### Can't connect to MongoDB?
- Cluster must be running (green status in Atlas)
- IP must be whitelisted
- Username/password must be correct
- URL-encode special characters in password

---

## 📝 Default Ports

- Frontend: `5173`
- Backend: `5000`
- MongoDB: Atlas Cloud (no local port)

---

## 🔑 Environment Files

Both `.env` files are already created and configured:
- `/.env` - Frontend config
- `/server/.env` - Backend config (UPDATE MongoDB URI!)

---

## 📚 Full Documentation

Need more details? Check these guides:

| File | What's in it |
|------|--------------|
| [SYSTEM_READY.md](./SYSTEM_READY.md) | System status & overview |
| [COMPLETE_STARTUP_GUIDE.md](./COMPLETE_STARTUP_GUIDE.md) | Detailed step-by-step |
| [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md) | MongoDB configuration |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | API endpoints reference |

---

## ✅ Success Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created & password saved
- [ ] IP whitelisted (0.0.0.0/0)
- [ ] Connection string updated in `/server/.env`
- [ ] Backend running (`cd server && npm start`)
- [ ] Frontend running (`npm run dev`)
- [ ] Can access http://localhost:5173
- [ ] Can sign up & login
- [ ] Admin account created

**All checked? You're ready! 🎉**

---

## 🎯 What You Get

### 5 User Roles
1. **Tenant** - Search properties
2. **Owner** - Post properties
3. **Agent** - Manage listings
4. **Employee** - Upload photos
5. **Admin** - System control

### Core Features
- Property listings with search
- Image upload (2 max, 100KB each)
- Support tickets
- Job postings
- Contact forms
- User favorites
- Admin dashboard

---

## 🔐 Security

- JWT authentication
- Password hashing (bcrypt)
- CORS protection
- Rate limiting
- Role-based access

---

## 🆘 Still Stuck?

1. Check backend terminal for errors
2. Check browser console (F12)
3. Verify both `.env` files exist
4. Ensure MongoDB cluster is running
5. Try restarting both servers

---

**Need help? Check the detailed guides above! 📚**

**Happy coding! 🚀**
