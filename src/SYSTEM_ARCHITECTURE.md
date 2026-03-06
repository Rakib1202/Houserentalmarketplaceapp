# 🏗️ HouseRentBD - System Architecture

## 📐 Complete System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                          CLIENT LAYER (Browser)                         │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                    React Application                             │  │
│  │                    (Port: 5173)                                  │  │
│  │                                                                   │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │  │
│  │  │  Login   │  │  Signup  │  │  Admin   │  │ Dashboard│       │  │
│  │  │Component │  │Component │  │  Panel   │  │ Component│       │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │  │
│  │       │             │             │             │               │  │
│  │       └─────────────┴─────────────┴─────────────┘               │  │
│  │                             │                                    │  │
│  │                      ┌──────▼──────┐                            │  │
│  │                      │  Google     │                            │  │
│  │                      │  Sign-In    │                            │  │
│  │                      │  Component  │                            │  │
│  │                      └──────┬──────┘                            │  │
│  │                             │                                    │  │
│  │                      ┌──────▼──────┐                            │  │
│  │                      │   API       │                            │  │
│  │                      │   Client    │                            │  │
│  │                      │ /utils/api  │                            │  │
│  │                      └──────┬──────┘                            │  │
│  └──────────────────────────────┬──────────────────────────────────┘  │
│                                 │                                     │
└─────────────────────────────────┼─────────────────────────────────────┘
                                  │
                          HTTP REST API
                     (JSON Request/Response)
                                  │
┌─────────────────────────────────▼─────────────────────────────────────┐
│                                                                         │
│                       APPLICATION LAYER                                │
│                    Express.js Backend Server                           │
│                         (Port: 5000)                                   │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │                    Middleware Stack                            │   │
│  │                                                                 │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │   │
│  │  │  CORS    │  │  Helmet  │  │   Rate   │  │  Morgan  │     │   │
│  │  │Protection│  │ Security │  │ Limiting │  │ Logging  │     │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │   │
│  │                                                                 │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │   │
│  │  │Compress  │  │   Body   │  │  Google  │                    │   │
│  │  │  -ion    │  │  Parser  │  │   Auth   │                    │   │
│  │  └──────────┘  └──────────┘  └──────────┘                    │   │
│  └───────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │                    Authentication Layer                        │   │
│  │                                                                 │   │
│  │  ┌────────────────────────────────────────────────────────┐   │   │
│  │  │  JWT Authentication Middleware                         │   │   │
│  │  │  • Verify JWT tokens                                   │   │   │
│  │  │  • Extract user ID & role                              │   │   │
│  │  │  • Attach to request object                            │   │   │
│  │  └────────────────────────────────────────────────────────┘   │   │
│  │                                                                 │   │
│  │  ┌────────────────────────────────────────────────────────┐   │   │
│  │  │  Google OAuth Verification                             │   │   │
│  │  │  • Verify Google ID tokens                             │   │   │
│  │  │  • Extract user profile                                │   │   │
│  │  │  • Link/create accounts                                │   │   │
│  │  └────────────────────────────────────────────────────────┘   │   │
│  └───────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │                     API Routes Layer                           │   │
│  │                                                                 │   │
│  │  /api/auth              /api/properties       /api/jobs        │   │
│  │  ├─ POST /signup        ├─ GET /              ├─ GET /         │   │
│  │  ├─ POST /login         ├─ GET /:id           ├─ GET /:id      │   │
│  │  ├─ POST /admin-login   ├─ POST /             ├─ POST /        │   │
│  │  ├─ POST /google        ├─ PUT /:id           ├─ PUT /:id      │   │
│  │  ├─ POST /google/verify ├─ DELETE /:id        └─ DELETE /:id   │   │
│  │  └─ GET /me             └─ PATCH /:id/status                   │   │
│  │                                                                 │   │
│  │  /api/users             /api/support-tickets  /api/subscriptions   │
│  │  /api/support-employees /api/photo-uploads    /api/employee-earnings│
│  │                                                                 │   │
│  └───────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │                   Business Logic Layer                         │   │
│  │                                                                 │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │   │
│  │  │   Password   │  │   JWT Token  │  │    Image     │        │   │
│  │  │   Hashing    │  │  Generation  │  │ Compression  │        │   │
│  │  │   (bcrypt)   │  │              │  │   (Sharp)    │        │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │   │
│  │                                                                 │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │   │
│  │  │ Validation   │  │   File       │  │   Google     │        │   │
│  │  │  (express-   │  │   Upload     │  │   OAuth      │        │   │
│  │  │  validator)  │  │  (Multer)    │  │  Verifier    │        │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │   │
│  └───────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                            Mongoose ODM
                      (Schema & Validation)
                                  │
┌─────────────────────────────────▼───────────────────────────────────────┐
│                                                                          │
│                         DATABASE LAYER                                  │
│                       MongoDB (Port: 27017)                             │
│                     Database: houserentbd                               │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Collections                                    │  │
│  │                                                                    │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │  │
│  │  │   users     │  │ properties  │  │    jobs     │              │  │
│  │  ├─────────────┤  ├─────────────┤  ├─────────────┤              │  │
│  │  │ _id         │  │ _id         │  │ _id         │              │  │
│  │  │ fullName    │  │ title       │  │ title       │              │  │
│  │  │ email       │  │ description │  │ description │              │  │
│  │  │ phone       │  │ location    │  │ type        │              │  │
│  │  │ password    │  │ rent        │  │ location    │              │  │
│  │  │ googleId    │  │ images[]    │  │ salary      │              │  │
│  │  │ role        │  │ owner       │  │ status      │              │  │
│  │  │ status      │  │ status      │  │ createdAt   │              │  │
│  │  │ verified    │  │ createdAt   │  └─────────────┘              │  │
│  │  │ createdAt   │  └─────────────┘                                │  │
│  │  └─────────────┘                                                  │  │
│  │                                                                    │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │  │
│  │  │ support     │  │ support     │  │  photo      │              │  │
│  │  │ employees   │  │  tickets    │  │  uploads    │              │  │
│  │  ├─────────────┤  ├─────────────┤  ├─────────────┤              │  │
│  │  │ _id         │  │ _id         │  │ _id         │              │  │
│  │  │ name        │  │ ticketNo    │  │ employeeId  │              │  │
│  │  │ employeeId  │  │ customer    │  │ imageData   │              │  │
│  │  │ email       │  │ subject     │  │ status      │              │  │
│  │  │ password    │  │ category    │  │ approvedBy  │              │  │
│  │  │ department  │  │ priority    │  │ createdAt   │              │  │
│  │  │ status      │  │ assignedTo  │  └─────────────┘              │  │
│  │  │ onlineStatus│  │ messages[]  │                                │  │
│  │  └─────────────┘  │ status      │  ┌─────────────┐              │  │
│  │                   └─────────────┘  │ employee    │              │  │
│  │  ┌─────────────┐                   │  earnings   │              │  │
│  │  │subscription │                   ├─────────────┤              │  │
│  │  ├─────────────┤                   │ _id         │              │  │
│  │  │ _id         │                   │ employeeId  │              │  │
│  │  │ userId      │                   │ amount      │              │  │
│  │  │ planType    │                   │ type        │              │  │
│  │  │ startDate   │                   │ propertyId  │              │  │
│  │  │ endDate     │                   │ date        │              │  │
│  │  │ status      │                   │ status      │              │  │
│  │  └─────────────┘                   └─────────────┘              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                         Indexes                                   │  │
│  │                                                                    │  │
│  │  • users: phone, email, googleId, role+status                    │  │
│  │  • properties: owner, status, location                           │  │
│  │  • supportTickets: assignedTo, status, category                  │  │
│  │  • supportEmployees: employeeId, status                          │  │
│  │  • jobs: status, type, location                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Authentication Flow

### Password Authentication Flow
```
┌──────────┐                                        ┌──────────┐
│          │  1. POST /api/auth/login               │          │
│          │  { phone, password }                   │          │
│  Client  │────────────────────────────────────────>│  Backend │
│          │                                         │          │
│          │                                         │          │
│          │  2. Verify credentials                 │          │
│          │     • Find user by phone               │          │
│          │     • Compare password hash            └─────┬────┘
│          │                                               │
│          │                                               │ Query
│          │                                               ▼
│          │                                        ┌──────────┐
│          │                                        │          │
│          │                                        │ MongoDB  │
│          │                                        │          │
│          │                                        └─────┬────┘
│          │                                               │
│          │  3. Generate JWT token                       │
│          │     { userId, role, exp }             ┌──────▼────┐
│          │                                        │          │
│          │<────────────────────────────────────────  Backend │
│          │  { user, accessToken }                 │          │
│          │                                        └──────────┘
│          │  4. Store token in localStorage
│          │     localStorage.setItem('accessToken', ...)
└──────────┘
```

### Google OAuth Flow
```
┌──────────┐                                        ┌──────────┐
│          │  1. Click "Sign in with Google"        │          │
│          │                                         │  Google  │
│  Client  │────────────────────────────────────────>│  OAuth   │
│          │                                         │  Server  │
│          │                                         └─────┬────┘
│          │  2. User authenticates                        │
│          │                                               │
│          │<──────────────────────────────────────────────┘
│          │  3. Google ID Token (JWT)
│          │
│          │  4. POST /api/auth/google
│          │  { credential: googleToken, role }     ┌──────────┐
│          │────────────────────────────────────────>│          │
│          │                                         │  Backend │
│          │  5. Verify Google token                │          │
│          │     • Verify signature                 │          │
│          │     • Extract user info                └─────┬────┘
│          │                                               │
│          │                                               │ Verify
│          │                                               ▼
│          │                                        ┌──────────┐
│          │                                        │  Google  │
│          │                                        │  Auth    │
│          │                                        │  Library │
│          │                                        └─────┬────┘
│          │                                               │
│          │  6. Find or create user               ┌──────▼────┐
│          │                                        │          │
│          │                                        │ MongoDB  │
│          │                                        │          │
│          │                                        └─────┬────┘
│          │                                               │
│          │  7. Generate JWT token                ┌──────▼────┐
│          │<────────────────────────────────────────          │
│          │  { user, accessToken }                 │  Backend │
│          │                                        │          │
└──────────┘                                        └──────────┘
```

---

## 🔐 Authorization Flow

```
┌──────────┐
│  Client  │
└─────┬────┘
      │
      │  1. Request with JWT token
      │  GET /api/properties
      │  Authorization: Bearer eyJhbGc...
      ▼
┌──────────┐
│  Backend │
│  (auth   │
│middleware│
└─────┬────┘
      │
      │  2. Extract & verify JWT
      │     • Check signature
      │     • Check expiration
      │     • Extract userId & role
      ▼
┌──────────┐
│   JWT    │
│ Verify   │
└─────┬────┘
      │
      │  3a. Token valid?
      │  ┌─ Yes ──────────────────┐
      │  │                        │
      │  │  4. Attach user to req │
      │  │  req.userId = userId   │
      │  │  req.role = role       │
      │  │                        │
      │  └────────┬───────────────┘
      │           │
      │           │  5. Proceed to route handler
      │           ▼
      │     ┌──────────┐
      │     │  Route   │
      │     │ Handler  │
      │     └────┬─────┘
      │          │
      │          │  6. Access control
      │          │  if (role === 'admin') {
      │          │    // Allow operation
      │          │  }
      │          │
      │  ┌───────▼──────────┐
      │  │                  │
      │  │  7. Query DB     │
      │  │                  │
      │  └───────┬──────────┘
      │          │
      │          │  8. Return response
      │          ▼
      │     ┌─────────┐
      │     │ Client  │
      │     └─────────┘
      │
      │  3b. Token invalid?
      │  └─ No ────────────────┐
      │                        │
      │  4. Return 401         │
      │  { error: "Unauthorized" }
      └────────────────────────┘
```

---

## 📊 Data Flow Example: Create Property

```
Step 1: User Creates Property
┌──────────┐
│  Owner   │
│Dashboard │
└────┬─────┘
     │
     │  Click "Add Property"
     │  Fill form & upload images
     ▼
┌────────────────┐
│ PropertyForm   │
│  Component     │
└────┬───────────┘
     │
     │  Compress images (98%)
     │  600x600px, 50% quality
     ▼
┌────────────────┐
│ Image          │
│ Compression    │
│ (Sharp)        │
└────┬───────────┘
     │
     │  POST /api/properties
     │  Authorization: Bearer ...
     │  Body: { title, location, rent, images[] }
     ▼
┌────────────────┐
│  API Client    │
│  (/utils/api)  │
└────┬───────────┘
     │
     │  HTTP POST
     ▼

Step 2: Backend Processing
┌────────────────┐
│  Express       │
│  Router        │
└────┬───────────┘
     │
     │  Auth Middleware
     ▼
┌────────────────┐
│  Verify JWT    │
│  Extract userId│
└────┬───────────┘
     │
     │  Route Handler
     ▼
┌────────────────┐
│  Validate      │
│  Input Data    │
│ (express-      │
│  validator)    │
└────┬───────────┘
     │
     │  Create Property
     ▼
┌────────────────┐
│  Mongoose      │
│  Model         │
│  .create()     │
└────┬───────────┘
     │
     │  Insert Document
     ▼

Step 3: Database Storage
┌────────────────┐
│  MongoDB       │
│  properties    │
│  collection    │
└────┬───────────┘
     │
     │  {
     │    _id: "...",
     │    title: "2BHK Apartment",
     │    owner: userId,
     │    status: "pending",
     │    images: [base64, base64],
     │    createdAt: Date
     │  }
     │
     │  Return saved document
     ▼

Step 4: Response
┌────────────────┐
│  Backend       │
│  Response      │
└────┬───────────┘
     │
     │  200 OK
     │  { success: true, property: {...} }
     ▼
┌────────────────┐
│  Frontend      │
│  Update UI     │
└────┬───────────┘
     │
     │  Toast success message
     │  Navigate to property list
     ▼
┌────────────────┐
│  Owner sees    │
│  new property  │
│  Status: Pending
└────────────────┘
```

---

## 🎯 Role-Based Access Control (RBAC)

```
┌─────────────────────────────────────────────────────────────┐
│                       Admin Role                            │
│  ✓ Full system access                                       │
│  ✓ User management (create, edit, delete, suspend)         │
│  ✓ Property approvals                                       │
│  ✓ Photo approvals                                          │
│  ✓ Support employee management                              │
│  ✓ Job posting management                                   │
│  ✓ View all analytics                                       │
│  ✓ System settings                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       Owner Role                            │
│  ✓ Create property listings                                 │
│  ✓ Edit own properties                                      │
│  ✓ Delete own properties                                    │
│  ✓ Upload property images (2 max, 100KB each)              │
│  ✓ View property analytics                                  │
│  ✓ Manage inquiries                                         │
│  ✗ Cannot edit other's properties                           │
│  ✗ Cannot approve properties                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      Tenant Role                            │
│  ✓ Search properties                                        │
│  ✓ View property details                                    │
│  ✓ Save favorites                                           │
│  ✓ Contact owners                                           │
│  ✓ Create support tickets                                   │
│  ✗ Cannot create properties                                 │
│  ✗ Cannot edit properties                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       Agent Role                            │
│  ✓ All owner permissions                                    │
│  ✓ Manage multiple properties                               │
│  ✓ Track commissions                                        │
│  ✓ View earnings history                                    │
│  ✓ Generate reports                                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     Employee Role                           │
│  ✓ Upload employee photos for approval                      │
│  ✓ View earnings                                            │
│  ✓ Manage assigned properties                               │
│  ✓ Track commissions                                        │
│  ✗ Cannot approve own photos                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 Support Employee (Special)                  │
│  ✓ View support tickets                                     │
│  ✓ Reply to tickets                                         │
│  ✓ Assign tickets                                           │
│  ✓ Update ticket status                                     │
│  ✓ Live chat with users                                     │
│  ✗ Cannot access admin panel                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔒 Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Stack                           │
└─────────────────────────────────────────────────────────────┘
       │
       ├─ 1. Network Level
       │    • CORS protection (whitelisted origins)
       │    • Helmet security headers
       │    • Rate limiting (100 req/15min)
       │
       ├─ 2. Authentication Level
       │    • JWT token verification
       │    • Google OAuth token verification
       │    • Token expiration (30 days)
       │    • Secure token storage
       │
       ├─ 3. Authorization Level
       │    • Role-based access control
       │    • Route-level permissions
       │    • Resource ownership checks
       │    • Admin-only endpoints
       │
       ├─ 4. Data Level
       │    • Input validation (express-validator)
       │    • Bcrypt password hashing (10 rounds)
       │    • Mongoose schema validation
       │    • XSS prevention
       │    • NoSQL injection prevention
       │
       ├─ 5. File Level
       │    • Image size limits (100KB)
       │    • File count limits (2 images)
       │    • Image compression (98%)
       │    • File type validation
       │
       └─ 6. Logging & Monitoring
            • Morgan request logging
            • Error logging
            • Authentication attempts
            • API usage tracking
```

---

## 📁 Project Structure

```
/HouseRentBD
│
├── /server                         # Backend application
│   ├── /models                     # Mongoose models
│   │   ├── User.js                 # User schema with OAuth
│   │   ├── Property.js
│   │   ├── SupportEmployee.js
│   │   ├── SupportTicket.js
│   │   ├── Job.js
│   │   ├── Subscription.js
│   │   ├── PhotoUpload.js
│   │   └── EmployeeEarning.js
│   │
│   ├── /routes                     # API routes
│   │   ├── auth.js                 # Auth + Google OAuth
│   │   ├── users.js
│   │   ├── properties.js
│   │   ├── supportEmployees.js
│   │   ├── supportTickets.js
│   │   ├── jobs.js
│   │   ├── subscriptions.js
│   │   ├── photoUploads.js
│   │   └── employeeEarnings.js
│   │
│   ├── /middleware
│   │   └── auth.js                 # JWT verification
│   │
│   ├── /scripts
│   │   ├── createAdmin.js          # Create admin user
│   │   └── verifySystem.js         # System verification
│   │
│   ├── server.js                   # Entry point
│   ├── package.json
│   ├── .env                        # Environment variables
│   └── .env.example
│
├── /components                     # React components
│   ├── /auth
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── AdminLogin.tsx
│   │   └── GoogleSignIn.tsx        # Google OAuth component
│   │
│   ├── /admin                      # Admin components
│   ├── /owner                      # Owner components
│   ├── /tenant                     # Tenant components
│   ├── /agent                      # Agent components
│   ├── /employee                   # Employee components
│   ├── /support                    # Support components
│   └── /ui                         # Reusable UI components
│
├── /utils
│   └── api.ts                      # API client with all endpoints
│
├── /styles
│   └── globals.css                 # Global styles
│
├── App.tsx                         # Main app component
├── routes.ts                       # React Router configuration
├── package.json
├── .env                            # Frontend environment
├── .env.example
│
└── /documentation                  # Documentation files
    ├── COMPLETE_SYSTEM_README.md
    ├── SYSTEM_STARTUP_GUIDE.md
    ├── MONGODB_SETUP_COMPLETE.md
    ├── QUICK_REFERENCE.md
    ├── SYSTEM_ARCHITECTURE.md       # This file
    ├── IMPLEMENTATION_COMPLETE.md
    ├── test-connection.html
    └── check-system.sh
```

---

## 🌐 Network Topology

```
                    Internet
                       │
                       │
        ┌──────────────▼──────────────┐
        │     Load Balancer/CDN       │
        │      (Production)           │
        └──────────────┬──────────────┘
                       │
           ┌───────────┴───────────┐
           │                       │
           ▼                       ▼
    ┌─────────────┐         ┌─────────────┐
    │  Frontend   │         │  Backend    │
    │   Server    │────────>│   Server    │
    │ (Vercel/    │  API    │  (Render/   │
    │  Netlify)   │ Calls   │  Railway)   │
    └─────────────┘         └──────┬──────┘
                                   │
                                   │ Mongoose
                                   ▼
                            ┌─────────────┐
                            │  MongoDB    │
                            │   Atlas     │
                            │ (Database)  │
                            └─────────────┘
                                   │
                            ┌──────┴──────┐
                            │   Backups   │
                            └─────────────┘

External Services:
    ┌─────────────┐
    │   Google    │───> OAuth Authentication
    │   OAuth     │
    └─────────────┘

    ┌─────────────┐
    │    SMS      │───> OTP (Future)
    │   Provider  │
    └─────────────┘

    ┌─────────────┐
    │   Email     │───> Notifications (Future)
    │   Service   │
    └─────────────┘
```

---

This architecture diagram provides a complete visual overview of the HouseRentBD system, showing how all components interact with each other from the frontend to the database layer.

**Last Updated:** February 23, 2026  
**Version:** 1.0.0
