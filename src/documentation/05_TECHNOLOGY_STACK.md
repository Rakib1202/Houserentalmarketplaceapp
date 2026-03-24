# 💻 Technology Stack - HouseRentBD

## Complete Technology Breakdown

This document details every technology, framework, library, and tool used in the HouseRentBD system.

---

## 🎨 Frontend Stack

### Core Technologies

#### 1. **React 18.3.1**
- **Type:** JavaScript UI Library
- **Purpose:** Building user interfaces
- **Why:** Component-based, virtual DOM, large ecosystem
- **Usage:** 
  - 80+ components
  - Hooks (useState, useEffect, useContext)
  - Custom hooks for API calls
  - Lazy loading for optimization

```javascript
// Example React component
import { useState, useEffect } from 'react';

export function PropertyCard({ property }) {
  const [favorite, setFavorite] = useState(false);
  
  return (
    <div className="property-card">
      {/* Component JSX */}
    </div>
  );
}
```

#### 2. **TypeScript 5.6+**
- **Type:** Typed superset of JavaScript
- **Purpose:** Type safety and better developer experience
- **Why:** Catch errors at compile-time, better IDE support
- **Usage:**
  - All frontend code written in TypeScript
  - Type definitions for API responses
  - Interface definitions for props
  - Enum for constants

```typescript
// Example TypeScript types
interface Property {
  id: string;
  title: string;
  rent: number;
  bedrooms: number;
  location: string;
}

type UserRole = 'tenant' | 'owner' | 'agent' | 'employee' | 'admin';
```

#### 3. **Vite 6.0+**
- **Type:** Build tool and dev server
- **Purpose:** Fast development and optimized production builds
- **Why:** Lightning-fast HMR, optimized bundling
- **Features:**
  - Instant server start
  - Hot Module Replacement (HMR)
  - TypeScript support
  - CSS preprocessing
  - Build optimization

```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
```

### Routing & Navigation

#### 4. **React Router 7.1+**
- **Type:** Client-side routing library
- **Purpose:** Multi-page navigation without page reload
- **Why:** Declarative routing, nested routes, data loading
- **Usage:**
  - 25+ routes defined
  - Nested layouts (MainLayout, AdminLayout)
  - Protected routes for authentication
  - Dynamic routing for property details

```typescript
// routes.ts
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Homepage },
      { path: "properties", Component: PropertyListings },
      { path: "property/:id", Component: PropertyDetails },
    ]
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      // ... more admin routes
    ]
  }
]);
```

### Styling & UI

#### 5. **Tailwind CSS 4.0**
- **Type:** Utility-first CSS framework
- **Purpose:** Rapid UI development with utility classes
- **Why:** Fast development, small bundle size, responsive design
- **Configuration:**
  - Custom color palette
  - Responsive breakpoints
  - Custom utilities
  - Dark mode support

```css
/* globals.css - Tailwind directives */
@import "tailwindcss";

/* Custom styles */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
  }
}
```

```jsx
// Usage in components
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
  Click Me
</button>
```

#### 6. **Shadcn/ui**
- **Type:** Component library
- **Purpose:** Pre-built, accessible components
- **Why:** Radix UI primitives, fully customizable, TypeScript support
- **Components Used:**
  - Button, Input, Select, Dialog
  - Card, Badge, Avatar, Tabs
  - Dropdown, Popover, Toast
  - Table, Form, Calendar
  - 35+ components total

```tsx
// Example Shadcn component usage
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';

<Dialog open={showModal}>
  <DialogContent>
    <DialogHeader>Payment Gateway</DialogHeader>
    <Button onClick={handlePayment}>Confirm</Button>
  </DialogContent>
</Dialog>
```

#### 7. **Lucide React**
- **Type:** Icon library
- **Purpose:** Beautiful, consistent icons
- **Why:** Tree-shakeable, TypeScript support, 1000+ icons
- **Usage:** 100+ icons throughout the app

```tsx
import { Home, Search, User, Bell, Heart } from 'lucide-react';

<Home className="size-6 text-blue-600" />
<Search className="size-4" />
```

### State Management & Data Fetching

#### 8. **React Hooks**
- **useState:** Local component state
- **useEffect:** Side effects and data fetching
- **useNavigate:** Programmatic navigation
- **useLocation:** Current route information
- **Custom Hooks:** Reusable logic

```typescript
// Custom hook for API calls
function useProperties(filters) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProperties(filters).then(setProperties);
    setLoading(false);
  }, [filters]);
  
  return { properties, loading };
}
```

### Notifications

#### 9. **Sonner**
- **Type:** Toast notification library
- **Purpose:** User feedback and notifications
- **Why:** Beautiful, accessible, TypeScript support
- **Usage:** Success, error, info, loading toasts

```typescript
import { toast } from 'sonner';

toast.success('Property saved!');
toast.error('Failed to upload');
toast.loading('Processing payment...');
```

### Form Handling

#### 10. **React Hook Form 7.55.0**
- **Type:** Form library
- **Purpose:** Efficient form validation and handling
- **Why:** Better performance, less re-renders
- **Usage:** Login, signup, property forms

```typescript
import { useForm } from 'react-hook-form@7.55.0';

const { register, handleSubmit, formState: { errors } } = useForm();

<input {...register('email', { required: true })} />
```

---

## 🖥️ Backend Stack

### Core Technologies

#### 11. **Node.js 18+**
- **Type:** JavaScript runtime
- **Purpose:** Server-side JavaScript execution
- **Why:** Event-driven, non-blocking I/O, large ecosystem
- **Features:**
  - ES6+ syntax support
  - Native ESM modules
  - Async/await
  - Built-in crypto

#### 12. **Express.js 4.18+**
- **Type:** Web application framework
- **Purpose:** HTTP server and API routing
- **Why:** Minimalist, flexible, middleware support
- **Usage:**
  - RESTful API endpoints
  - Middleware chain
  - Route organization
  - Error handling

```javascript
// Express server setup
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
```

### Database

#### 13. **MongoDB 7.0+**
- **Type:** NoSQL document database
- **Purpose:** Store application data
- **Why:** Flexible schema, scalability, JSON-like documents
- **Collections:**
  - users
  - properties
  - subscriptions
  - supportTickets
  - photoUploads
  - jobs
  - inquiries
  - favorites
  - supportEmployees
  - employeeEarnings

```javascript
// MongoDB connection
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

#### 14. **Mongoose 8.0+**
- **Type:** MongoDB ODM (Object Data Modeling)
- **Purpose:** Schema definition and validation
- **Why:** Type casting, validation, query building
- **Usage:**
  - 10 schema definitions
  - Virtual properties
  - Middleware hooks
  - Custom validation

```javascript
// Mongoose schema example
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  rent: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  location: { type: String, required: true },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Property', propertySchema);
```

### Authentication & Security

#### 15. **JWT (jsonwebtoken)**
- **Type:** Authentication library
- **Purpose:** Stateless authentication tokens
- **Why:** Scalable, cross-domain, secure
- **Usage:**
  - User login tokens
  - Admin session tokens
  - Token expiration (24h)

```javascript
import jwt from 'jsonwebtoken';

// Generate token
const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

#### 16. **bcrypt**
- **Type:** Password hashing library
- **Purpose:** Secure password storage
- **Why:** Industry standard, salt rounds, one-way hashing
- **Usage:** Hash passwords on signup, compare on login

```javascript
import bcrypt from 'bcrypt';

// Hash password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Compare password
const isMatch = await bcrypt.compare(password, user.passwordHash);
```

### Middleware & Utilities

#### 17. **CORS**
- **Type:** Cross-Origin Resource Sharing middleware
- **Purpose:** Allow frontend to access backend API
- **Configuration:**
  - Allow credentials
  - Specific origins
  - HTTP methods

```javascript
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
```

#### 18. **dotenv**
- **Type:** Environment variable loader
- **Purpose:** Configuration management
- **Usage:** Load secrets from .env file

```javascript
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
```

#### 19. **Multer**
- **Type:** File upload middleware
- **Purpose:** Handle multipart/form-data for image uploads
- **Configuration:**
  - File size limits (100KB)
  - File type validation
  - Storage configuration

```javascript
import multer from 'multer';

const upload = multer({
  limits: { fileSize: 100 * 1024 }, // 100KB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  }
});
```

---

## 💳 Payment Integration

### 20. **bKash API**
- **Type:** Mobile wallet payment gateway
- **Purpose:** Process bKash payments
- **Integration:** Manual verification (API ready)

### 21. **Nagad API**
- **Type:** Mobile banking payment gateway
- **Purpose:** Process Nagad payments
- **Integration:** Manual verification (API ready)

### 22. **Rocket API**
- **Type:** Mobile banking payment gateway
- **Purpose:** Process Rocket payments
- **Integration:** Manual verification (API ready)

### 23. **SSLCommerz** (Planned)
- **Type:** Payment gateway
- **Purpose:** Credit/debit card payments
- **Status:** Integration planned

---

## 🔧 Development Tools

### 24. **npm**
- **Type:** Package manager
- **Purpose:** Dependency management
- **Usage:** Install and manage 50+ packages

### 25. **ESLint**
- **Type:** JavaScript linter
- **Purpose:** Code quality and consistency
- **Configuration:** React, TypeScript rules

### 26. **Git**
- **Type:** Version control
- **Purpose:** Code versioning and collaboration
- **Hosting:** GitHub/GitLab

### 27. **VS Code**
- **Type:** Code editor
- **Extensions:**
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets

---

## 📦 Key NPM Packages

### Frontend Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router": "^7.1.0",
  "typescript": "^5.6.3",
  "@radix-ui/react-*": "^1.0.0", // Shadcn primitives
  "lucide-react": "^0.263.1",
  "tailwindcss": "^4.0.0",
  "sonner": "^2.0.3",
  "react-hook-form": "^7.55.0"
}
```

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^5.1.1",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "multer": "^1.4.5"
}
```

---

## 🗄️ Database Technology

### MongoDB Features Used
- **Collections:** Document storage
- **Indexes:** Performance optimization
- **Aggregation:** Complex queries
- **References:** Document relationships
- **Validation:** Schema validation
- **Timestamps:** Auto createdAt/updatedAt

```javascript
// Index example
propertySchema.index({ location: 1, rent: 1 });
propertySchema.index({ ownerId: 1, status: 1 });

// Reference example
const propertySchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Population
const property = await Property.findById(id).populate('ownerId', 'fullName email');
```

---

## 🌐 API Standards

### RESTful Conventions
- **GET** - Retrieve resources
- **POST** - Create resources
- **PUT** - Update entire resource
- **PATCH** - Partial update
- **DELETE** - Remove resource

### Response Format
```javascript
// Success response
{
  success: true,
  data: { /* resource */ },
  message: "Operation successful"
}

// Error response
{
  success: false,
  error: "Error message",
  code: "ERROR_CODE"
}
```

### Status Codes
- **200** - OK
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **500** - Server Error

---

## 🎨 CSS Architecture

### Tailwind CSS Customization
```css
/* globals.css */
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary text-primary-foreground px-4 py-2 rounded-lg;
  }
}
```

---

## 📱 Image Processing

### Sharp (Planned)
- **Purpose:** Image compression and resizing
- **Features:**
  - Resize to 600x600px
  - 50% quality compression
  - Format conversion (WebP)
  - 98% file size reduction

---

## 🔐 Security Stack

### Authentication Flow
```
User → Login → JWT Token → Store in localStorage → 
Include in API headers → Backend verifies → Access granted
```

### Password Security
```
Plain Password → bcrypt.hash(password, 10 rounds) → 
Store hash in DB → Compare on login
```

### CORS Configuration
```javascript
{
  origin: ['http://localhost:5173', 'https://houserentbd.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}
```

---

## 📊 Technology Decision Matrix

| Need | Technology | Why |
|------|-----------|-----|
| UI Framework | React | Component reusability, ecosystem |
| Type Safety | TypeScript | Catch errors early |
| Styling | Tailwind CSS | Rapid development |
| Backend | Node.js + Express | JavaScript full-stack |
| Database | MongoDB | Flexible schema |
| Auth | JWT | Stateless, scalable |
| Routing | React Router | SPA navigation |
| Icons | Lucide React | Beautiful, tree-shakeable |
| Forms | React Hook Form | Performance |
| Notifications | Sonner | Beautiful toasts |

---

## 🚀 Performance Technologies

- **Vite:** Fast bundling and HMR
- **React.lazy:** Code splitting
- **MongoDB indexes:** Fast queries
- **Image compression:** Fast loading
- **Tailwind CSS:** Small bundle size
- **Tree shaking:** Remove unused code

---

## 📈 Scalability Technologies

- **MongoDB:** Horizontal scaling
- **JWT:** Stateless sessions
- **Express:** Lightweight framework
- **CDN-ready:** Static assets
- **API-first:** Microservices ready

---

**Next:** Read [Code Structure](./07_CODE_STRUCTURE.md) to understand how code is organized!
