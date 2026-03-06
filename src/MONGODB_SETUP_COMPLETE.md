# MongoDB Setup & Google OAuth Integration - COMPLETE

## 🎉 System Status: FULLY CONFIGURED

The HouseRentBD application is now fully configured with MongoDB backend and Google OAuth authentication!

---

## 📦 What Has Been Configured

### 1. Environment Files Created ✅

#### Backend Environment (`/server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/houserentbd
JWT_SECRET=houserentbd-super-secret-jwt-key-2024-change-in-production
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

#### Frontend Environment (`/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
VITE_APP_NAME=HouseRentBD
VITE_APP_URL=http://localhost:5173
```

### 2. MongoDB Connection ✅
- Connection string: `mongodb://localhost:27017/houserentbd`
- Database name: `houserentbd`
- Auto-reconnect enabled
- Connection pooling configured

### 3. Google OAuth 2.0 Integration ✅
- Google Sign-In support added
- Backend OAuth verification endpoint: `/api/auth/google`
- Token verification endpoint: `/api/auth/google/verify`
- User model updated with Google fields

### 4. Updated Dependencies ✅

#### Server Dependencies Added:
- `passport` - Authentication middleware
- `passport-google-oauth20` - Google OAuth strategy
- `express-session` - Session management
- `google-auth-library` - Google token verification

### 5. Database Models Enhanced ✅

#### User Model Updates:
```javascript
{
  googleId: String (unique, sparse),
  authProvider: ['local', 'google'],
  email: String (no longer required for all users),
  phone: String (sparse index),
  password: String (optional for OAuth users)
}
```

---

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies (if needed)
cd ..
npm install
```

### Step 2: Start MongoDB

#### macOS (Homebrew):
```bash
brew services start mongodb-community@7.0
# or
mongod --config /opt/homebrew/etc/mongod.conf
```

#### Linux (Ubuntu):
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Windows:
```bash
net start MongoDB
```

#### Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

### Step 3: Verify MongoDB Connection

```bash
# Check if MongoDB is running
mongosh

# In mongosh shell:
show dbs
use houserentbd
show collections
```

### Step 4: Create Admin User

```bash
cd server
npm run create-admin
```

Default admin credentials:
- Phone: `01700000000`
- Password: `admin123`

### Step 5: Configure Google OAuth (Optional)

1. **Go to Google Cloud Console:**
   - https://console.cloud.google.com/

2. **Create a New Project** (or select existing)

3. **Enable Google+ API:**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://localhost:5000`
   - Add authorized redirect URIs:
     - `http://localhost:5173/auth/callback`
     - `http://localhost:5000/api/auth/google/callback`

5. **Copy Credentials:**
   - Copy the Client ID and Client Secret
   - Update `/server/.env`:
     ```env
     GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
     GOOGLE_CLIENT_SECRET=your-actual-client-secret
     ```
   - Update `/.env`:
     ```env
     VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
     ```

### Step 6: Start the Application

```bash
# Terminal 1 - Start Backend
cd server
npm run dev

# Terminal 2 - Start Frontend (in project root)
npm run dev
```

---

## 🔌 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user (phone + password) |
| POST | `/api/auth/login` | Login with phone + password |
| POST | `/api/auth/admin-login` | Admin login |
| POST | `/api/auth/google` | Google OAuth login |
| POST | `/api/auth/google/verify` | Verify Google token |
| GET | `/api/auth/me` | Get current user (requires token) |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

---

## 🧪 Testing the System

### 1. Test MongoDB Connection

```bash
# Use test-connection.html
open test-connection.html

# Or use curl
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "HouseRentBD API is running",
  "timestamp": "2024-02-23T..."
}
```

### 2. Test User Registration

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "phone": "01712345678",
    "password": "test123",
    "role": "tenant",
    "email": "test@example.com"
  }'
```

### 3. Test User Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01712345678",
    "password": "test123"
  }'
```

### 4. Test Admin Login

```bash
curl -X POST http://localhost:5000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01700000000",
    "password": "admin123"
  }'
```

---

## 🔍 Database Schema

### Collections Created:

1. **users** - All user accounts (tenants, owners, agents, employees, admins)
2. **properties** - Property listings
3. **subscriptions** - User subscription plans
4. **photouploads** - Employee photo uploads for approval
5. **employeeearnings** - Employee commission tracking
6. **supportemployees** - Live chat support staff
7. **supporttickets** - Customer support tickets
8. **jobs** - Career/job postings

### Indexes:
- User: phone, email, googleId, role+status
- Property: owner, status, location
- Support: employeeId, status

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Problem:** "MongooseServerSelectionError"
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Check MongoDB logs
tail -f /opt/homebrew/var/log/mongodb/mongo.log  # macOS
tail -f /var/log/mongodb/mongod.log              # Linux

# Restart MongoDB
brew services restart mongodb-community@7.0      # macOS
sudo systemctl restart mongod                     # Linux
```

### Port Already in Use

**Problem:** "Port 5000 already in use"
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### CORS Errors

**Problem:** CORS policy blocking requests

**Solution:** Ensure backend `.env` has correct CLIENT_URL:
```env
CLIENT_URL=http://localhost:5173
```

### Google OAuth Not Working

**Problem:** Google Sign-In fails

**Checklist:**
1. ✅ Google Client ID is correctly set in both `.env` files
2. ✅ OAuth consent screen is configured in Google Cloud Console
3. ✅ Authorized origins include `http://localhost:5173`
4. ✅ Test users are added (if in testing mode)

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                   │
│                    Port: 5173                                │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │   Login     │  │  Dashboard   │  │  Google OAuth   │   │
│  │  Component  │  │  Components  │  │   Integration   │   │
│  └─────────────┘  └──────────────┘  └─────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                    HTTP/REST API
                            │
┌───────────────────────────▼─────────────────────────────────┐
│              Backend (Express.js + Node.js)                  │
│                    Port: 5000                                │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │    Auth     │  │     API      │  │   Google OAuth  │   │
│  │  Middleware │  │    Routes    │  │  Verification   │   │
│  └─────────────┘  └──────────────┘  └─────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                    Mongoose ODM
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                   MongoDB Database                           │
│                   Port: 27017                                │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │    Users    │  │  Properties  │  │    Support      │   │
│  │ Collection  │  │  Collection  │  │   Collections   │   │
│  └─────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features Implemented

### Authentication System
- ✅ Phone + Password authentication
- ✅ Google OAuth 2.0 authentication
- ✅ JWT token-based session management
- ✅ Role-based access control (tenant, owner, agent, employee, admin)
- ✅ Admin-specific login endpoint
- ✅ Support employee login system

### Backend Features
- ✅ RESTful API architecture
- ✅ MongoDB integration with Mongoose ODM
- ✅ Password hashing with bcrypt
- ✅ Input validation with express-validator
- ✅ Request rate limiting
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Response compression
- ✅ Request logging with Morgan

### Database Features
- ✅ 8 Mongoose models
- ✅ Indexed fields for performance
- ✅ Sparse unique indexes for optional fields
- ✅ Automatic timestamps
- ✅ Data validation at schema level

---

## 📝 Next Steps

### 1. Production Deployment
- [ ] Update environment variables for production
- [ ] Use MongoDB Atlas for cloud database
- [ ] Configure production Google OAuth credentials
- [ ] Set up SSL/HTTPS
- [ ] Configure domain-specific CORS

### 2. Security Enhancements
- [ ] Implement refresh tokens
- [ ] Add 2FA (Two-Factor Authentication)
- [ ] Set up email verification
- [ ] Add phone number verification (OTP)
- [ ] Implement account lockout after failed attempts

### 3. Additional Features
- [ ] Password reset flow
- [ ] Email notifications
- [ ] SMS notifications (for Bangladesh)
- [ ] File upload to cloud storage (AWS S3/Cloudinary)
- [ ] Real-time chat with Socket.io

---

## 📚 Documentation Links

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Express.js Documentation](https://expressjs.com/)
- [JWT Documentation](https://jwt.io/)

---

## 🎯 Quick Reference

### Important Files

| File | Purpose |
|------|---------|
| `/server/.env` | Backend environment variables |
| `/.env` | Frontend environment variables |
| `/server/server.js` | Express server entry point |
| `/server/routes/auth.js` | Authentication routes |
| `/server/models/User.js` | User database model |
| `/utils/api.ts` | Frontend API integration |

### Default Ports

| Service | Port |
|---------|------|
| Frontend | 5173 |
| Backend | 5000 |
| MongoDB | 27017 |

### Environment Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `MONGODB_URI` | Backend | MongoDB connection string |
| `JWT_SECRET` | Backend | JWT signing secret |
| `GOOGLE_CLIENT_ID` | Both | Google OAuth client ID |
| `VITE_API_URL` | Frontend | Backend API URL |

---

## 🎊 System is Ready!

Your HouseRentBD application is now fully configured with:
- ✅ MongoDB database connection
- ✅ Complete backend API
- ✅ Google OAuth integration
- ✅ Environment configuration
- ✅ Security middleware
- ✅ Error handling
- ✅ Logging system

**Start the servers and begin development!** 🚀
