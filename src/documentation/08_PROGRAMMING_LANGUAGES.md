# 💻 Programming Languages Used in HouseRentBD

## Overview of Languages

This document details all programming languages, markup languages, and styling languages used in building the HouseRentBD system.

---

## 🟦 1. JavaScript (ES6+)

### Purpose
Primary programming language for both frontend and backend

### Usage Statistics
- **Backend:** 100% (all server code)
- **Frontend Logic:** 70% (mixed with TypeScript)
- **Total Lines:** ~15,000+ lines

### Where Used
1. **Backend Server**
   - Express.js server configuration
   - API route handlers
   - MongoDB models
   - Middleware functions
   - Authentication logic
   - Payment processing

2. **Frontend**
   - React components (some)
   - Utility functions
   - API client functions
   - Configuration files

### Example Code
```javascript
// Backend - Express Server (server/server.js)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

```javascript
// Backend - API Route Handler (server/routes/properties.js)
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Property from '../models/Property.js';

const router = express.Router();

// Get all properties
router.get('/', async (req, res) => {
  try {
    const { area, minRent, maxRent, bedrooms } = req.query;
    
    let query = { status: 'approved' };
    
    if (area) query.location = new RegExp(area, 'i');
    if (minRent) query.rent = { $gte: parseInt(minRent) };
    if (maxRent) query.rent = { ...query.rent, $lte: parseInt(maxRent) };
    if (bedrooms) query.bedrooms = parseInt(bedrooms);
    
    const properties = await Property.find(query)
      .populate('ownerId', 'fullName phone')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Create property
router.post('/', authenticate, async (req, res) => {
  try {
    const property = new Property({
      ...req.body,
      ownerId: req.userId
    });
    await property.save();
    res.status(201).json({ success: true, property });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create property' });
  }
});

export default router;
```

```javascript
// Backend - Mongoose Model (server/models/Property.js)
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  rent: { 
    type: Number, 
    required: true,
    min: 0
  },
  location: { 
    type: String, 
    required: true 
  },
  area: { 
    type: String, 
    required: true 
  },
  bedrooms: { 
    type: Number, 
    required: true,
    min: 1
  },
  bathrooms: { 
    type: Number, 
    required: true,
    min: 1
  },
  size: { 
    type: Number, 
    required: true 
  },
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'bachelor', 'sublet'],
    required: true
  },
  amenities: [{ type: String }],
  images: [{ type: String }],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Indexes for performance
propertySchema.index({ location: 1, rent: 1 });
propertySchema.index({ ownerId: 1, status: 1 });
propertySchema.index({ area: 1, bedrooms: 1 });

export default mongoose.model('Property', propertySchema);
```

### Key Features Used
- ✅ **ES6+ Syntax** - Arrow functions, destructuring, spread operator
- ✅ **Async/Await** - Promise handling
- ✅ **Modules** - import/export (ESM)
- ✅ **Template Literals** - String interpolation
- ✅ **Arrow Functions** - Concise function syntax
- ✅ **Destructuring** - Object and array destructuring
- ✅ **Rest/Spread** - Function parameters and object spreading

---

## 🔷 2. TypeScript

### Purpose
Type-safe JavaScript for frontend development

### Usage Statistics
- **Frontend:** 90% (most React components)
- **Total Lines:** ~25,000+ lines

### Where Used
1. **React Components**
   - All page components
   - UI components
   - Form components
   - Layout components

2. **Type Definitions**
   - Interface definitions
   - Type aliases
   - Prop types
   - API response types

3. **Utilities**
   - Helper functions
   - API client
   - Custom hooks

### Example Code
```typescript
// Type Definitions (types.ts)
export interface Property {
  _id: string;
  title: string;
  description: string;
  rent: number;
  location: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  propertyType: 'apartment' | 'house' | 'bachelor' | 'sublet';
  amenities: string[];
  images: string[];
  ownerId: string;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  fullName: string;
  email?: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'banned';
  premium: boolean;
  createdAt: string;
}

export type UserRole = 'tenant' | 'owner' | 'agent' | 'employee' | 'admin';

export interface Subscription {
  _id: string;
  userId: string;
  planName: string;
  amount: number;
  duration: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  paymentMethod: 'BKASH' | 'NAGAD' | 'ROCKET' | 'CARD';
  transactionId: string;
  phoneNumber: string;
}
```

```typescript
// React Component with TypeScript (PropertyCard.tsx)
import { Link } from 'react-router';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface PropertyCardProps {
  property: Property;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

export function PropertyCard({ 
  property, 
  onFavorite, 
  isFavorite = false 
}: PropertyCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onFavorite?.(property._id);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={property.images[0] || '/placeholder.jpg'}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        {property.featured && (
          <Badge className="absolute top-2 left-2">
            Featured
          </Badge>
        )}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-2 bg-white rounded-full"
        >
          <Heart
            className={`size-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{property.title}</h3>
          <span className="text-xl font-bold text-blue-600">
            ৳{property.rent.toLocaleString()}/mo
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
          <MapPin className="size-4" />
          {property.location}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Bed className="size-4" /> {property.bedrooms} Beds
          </span>
          <span className="flex items-center gap-1">
            <Bath className="size-4" /> {property.bathrooms} Baths
          </span>
          <span className="flex items-center gap-1">
            <Square className="size-4" /> {property.size} sqft
          </span>
        </div>
        
        <Button className="w-full mt-4" asChild>
          <Link to={`/property/${property._id}`}>
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
```

```typescript
// API Client with TypeScript (utils/api.ts)
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class APIClient {
  private baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return response.json();
  }
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return response.json();
  }
}

export const api = new APIClient('http://localhost:5000/api');
```

### Key TypeScript Features Used
- ✅ **Interfaces** - Object type definitions
- ✅ **Type Aliases** - Custom type names
- ✅ **Enums** - Named constants
- ✅ **Generics** - Reusable type patterns
- ✅ **Union Types** - Multiple possible types
- ✅ **Optional Properties** - Nullable fields
- ✅ **Type Inference** - Automatic type detection
- ✅ **Strict Mode** - Enhanced type checking

---

## 🎨 3. JSX/TSX (JavaScript/TypeScript XML)

### Purpose
HTML-like syntax for React components

### Usage Statistics
- **Frontend Components:** 100%
- **Total Files:** 80+ .tsx files

### Where Used
- All React component files
- Page components
- Layout components
- UI components

### Example Code
```tsx
// JSX/TSX Syntax Example
export function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Find Your Perfect Home in Dhaka
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Trusted rental marketplace connecting tenants and property owners
        </p>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <input
            type="text"
            placeholder="Enter location..."
            className="w-full px-4 py-3 rounded-lg border"
          />
          <button type="submit" className="bg-blue-600 text-white px-8 py-3">
            Search Properties
          </button>
        </form>
      </section>
      
      {/* Property Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

---

## 🎨 4. CSS (Cascading Style Sheets)

### Purpose
Styling and layout

### Usage Statistics
- **Tailwind CSS:** 95%
- **Custom CSS:** 5%
- **Total CSS Files:** 2 (globals.css, component styles)

### Where Used
1. **Global Styles** (`styles/globals.css`)
   - Tailwind directives
   - CSS variables
   - Base styles
   - Custom utilities

2. **Component Styles**
   - Inline Tailwind classes
   - Custom component styles
   - Animations

### Example Code
```css
/* Global Styles (styles/globals.css) */
@import "tailwindcss";

/* CSS Variables */
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
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
}

/* Base Styles */
@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
  
  h1 {
    @apply text-4xl font-bold;
  }
  
  h2 {
    @apply text-3xl font-semibold;
  }
}

/* Custom Utilities */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  
  .scroll-smooth {
    scroll-behavior: smooth;
  }
}

/* Animations */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
```

---

## 📝 5. JSON (JavaScript Object Notation)

### Purpose
Configuration and data exchange

### Usage Statistics
- **Config Files:** 5+ files
- **API Responses:** All

### Where Used
1. **Configuration**
   - package.json (dependencies)
   - tsconfig.json (TypeScript config)
   - .eslintrc.json (linting rules)

2. **Data Exchange**
   - API request/response bodies
   - Local storage data
   - Environment configs

### Example Code
```json
// package.json
{
  "name": "houserentbd",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router": "^7.1.0",
    "typescript": "^5.6.3"
  }
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 🌐 6. HTML (HyperText Markup Language)

### Purpose
Structure and semantic markup

### Usage Statistics
- **Direct HTML:** Minimal (index.html only)
- **JSX Templates:** 100% of UI

### Where Used
1. **Root HTML** (index.html)
   - Single page entry point
   - Meta tags
   - Root div

2. **JSX/TSX Templates**
   - All component markup

### Example Code
```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Find rental properties in Dhaka" />
    <title>HouseRentBD - Find Your Perfect Home in Dhaka</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 🔧 7. Shell Script (Bash)

### Purpose
Automation and deployment scripts

### Usage Statistics
- **Script Files:** 3+ files

### Where Used
- Deployment scripts
- Setup scripts
- Verification scripts

### Example Code
```bash
#!/bin/bash
# verify-system.sh

echo "🔍 Verifying HouseRentBD System..."

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js installed: $(node -v)"
else
    echo "❌ Node.js not found"
fi

# Check MongoDB
if command -v mongosh &> /dev/null; then
    echo "✅ MongoDB installed"
else
    echo "❌ MongoDB not found"
fi

# Check dependencies
cd server
if [ -d "node_modules" ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Run: npm install"
fi

echo "✅ System verification complete!"
```

---

## 📊 Language Usage Breakdown

| Language | Purpose | Lines of Code | Percentage |
|----------|---------|---------------|------------|
| TypeScript | Frontend logic | ~25,000 | 45% |
| JavaScript | Backend logic | ~15,000 | 27% |
| CSS (Tailwind) | Styling | ~10,000 | 18% |
| JSON | Configuration | ~2,000 | 4% |
| HTML/JSX | Markup | ~3,000 | 5% |
| Shell | Scripts | ~500 | 1% |

---

## 🎯 Language Selection Rationale

### Why TypeScript?
- ✅ Type safety reduces bugs
- ✅ Better IDE autocomplete
- ✅ Self-documenting code
- ✅ Easier refactoring
- ✅ Large ecosystem

### Why JavaScript (Node.js)?
- ✅ Full-stack JavaScript
- ✅ Huge package ecosystem
- ✅ Async/await support
- ✅ JSON native handling
- ✅ Fast performance

### Why Tailwind CSS?
- ✅ Rapid development
- ✅ Consistent design
- ✅ Small bundle size
- ✅ Responsive utilities
- ✅ No context switching

---

## 🔄 Code Conversion Examples

### JavaScript to TypeScript
```javascript
// JavaScript
function createUser(name, email, role) {
  return {
    id: generateId(),
    name: name,
    email: email,
    role: role,
    createdAt: new Date()
  };
}
```

```typescript
// TypeScript
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

type UserRole = 'tenant' | 'owner' | 'agent';

function createUser(
  name: string, 
  email: string, 
  role: UserRole
): User {
  return {
    id: generateId(),
    name,
    email,
    role,
    createdAt: new Date()
  };
}
```

---

**Next:** Read [Code Structure](./07_CODE_STRUCTURE.md) to understand project organization!
