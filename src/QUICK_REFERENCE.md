# 🚀 HouseRentBD - Quick Reference Card

## ⚡ Essential Commands

### Start the System
```bash
# Terminal 1 - MongoDB (if not auto-starting)
brew services start mongodb-community@7.0

# Terminal 2 - Backend
cd server && npm run dev

# Terminal 3 - Frontend
npm run dev
```

### Access Points
- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api
- Health: http://localhost:5000/api/health

### Default Login
- Admin: `01700000000` / `admin123`

---

## 📡 API Endpoints Reference

### Authentication
```bash
POST /api/auth/signup              # Register user
POST /api/auth/login               # Login user
POST /api/auth/admin-login         # Admin login
POST /api/auth/google              # Google OAuth
GET  /api/auth/me                  # Get current user
```

### Users
```bash
GET    /api/users                  # List all users
GET    /api/users/:id              # Get user by ID
PUT    /api/users/:id              # Update user
PATCH  /api/users/:id/status       # Update user status
DELETE /api/users/:id              # Delete user
GET    /api/users/stats            # User statistics
```

### Properties
```bash
GET    /api/properties             # List properties
GET    /api/properties/:id         # Get property
POST   /api/properties             # Create property
PUT    /api/properties/:id         # Update property
DELETE /api/properties/:id         # Delete property
PATCH  /api/properties/:id/status  # Update status
```

### Support Employees
```bash
GET    /api/support-employees                # List employees
GET    /api/support-employees/next-id        # Get next ID
POST   /api/support-employees                # Create employee
POST   /api/support-employees/login          # Employee login
PATCH  /api/support-employees/:id/status     # Update status
DELETE /api/support-employees/:id            # Delete employee
```

### Support Tickets
```bash
GET    /api/support-tickets                  # List tickets
GET    /api/support-tickets/:id              # Get ticket
POST   /api/support-tickets                  # Create ticket
POST   /api/support-tickets/:id/assign       # Assign ticket
POST   /api/support-tickets/:id/messages     # Add message
PATCH  /api/support-tickets/:id/status       # Update status
DELETE /api/support-tickets/:id              # Delete ticket
```

### Jobs
```bash
GET    /api/jobs                   # List jobs
GET    /api/jobs/:id               # Get job
POST   /api/jobs                   # Create job
PUT    /api/jobs/:id               # Update job
PATCH  /api/jobs/:id/status        # Update status
DELETE /api/jobs/:id               # Delete job
```

### Other Endpoints
```bash
GET    /api/subscriptions          # Subscriptions
GET    /api/photo-uploads          # Photo uploads
GET    /api/employee-earnings      # Earnings
GET    /api/health                 # Health check
```

---

## 🔑 Environment Variables

### Backend (`/server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/houserentbd
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
```

### Frontend (`/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_APP_NAME=HouseRentBD
```

---

## 🗃️ Database Collections

| Collection | Purpose |
|------------|---------|
| users | All user accounts |
| properties | Property listings |
| subscriptions | User plans |
| photouploads | Employee photos |
| employeeearnings | Commissions |
| supportemployees | Chat staff |
| supporttickets | Support tickets |
| jobs | Career postings |

---

## 👤 User Roles

| Role | Access |
|------|--------|
| admin | Full system access |
| owner | Property management |
| tenant | Search & rent |
| agent | Multi-property |
| employee | Photo uploads |
| support | Live chat |

---

## 🛠️ NPM Scripts

### Backend (`/server`)
```bash
npm start              # Start server (production)
npm run dev            # Start with nodemon
npm run create-admin   # Create admin user
npm run verify         # Verify system
```

### Frontend (root)
```bash
npm run dev            # Start dev server
npm run build          # Build for production
npm run preview        # Preview production build
```

---

## 🐛 Quick Troubleshooting

### MongoDB not connecting?
```bash
ps aux | grep mongod          # Check if running
brew services restart mongodb  # Restart (macOS)
mongosh                        # Test connection
```

### Port in use?
```bash
lsof -i :5000                 # Find process
kill -9 <PID>                 # Kill process
```

### API not responding?
```bash
curl http://localhost:5000/api/health
cd server && npm run dev
```

### Frontend errors?
```bash
# Restart after .env changes
npm run dev
```

---

## 📊 Testing Examples

### Create User (curl)
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "phone": "01712345678",
    "password": "test123",
    "role": "tenant"
  }'
```

### Login (curl)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01712345678",
    "password": "test123"
  }'
```

### Get User (with token)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📁 Project Structure

```
/
├── server/                  # Backend
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── scripts/            # Utility scripts
│   ├── server.js           # Entry point
│   ├── package.json
│   └── .env
├── components/             # React components
│   ├── auth/              # Auth components
│   ├── admin/             # Admin panels
│   ├── tenant/            # Tenant views
│   ├── owner/             # Owner views
│   └── ui/                # Reusable UI
├── utils/                 # Utilities
│   └── api.ts             # API client
├── routes.ts              # React Router
├── App.tsx                # Main app
├── package.json
└── .env
```

---

## 🔐 Security Notes

- ✅ JWT tokens expire in 30 days
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ Rate limiting: 100 requests/15 minutes
- ✅ Helmet security headers enabled
- ✅ CORS configured for localhost
- ⚠️ Change JWT_SECRET in production
- ⚠️ Use HTTPS in production
- ⚠️ Enable MongoDB authentication

---

## 📞 Support & Documentation

- `SYSTEM_STARTUP_GUIDE.md` - Complete setup
- `MONGODB_SETUP_COMPLETE.md` - Database setup
- `API_DOCUMENTATION.md` - API reference
- `test-connection.html` - Connection tester
- `cd server && npm run verify` - System check

---

**Last Updated:** February 23, 2026
**Version:** 1.0.0
