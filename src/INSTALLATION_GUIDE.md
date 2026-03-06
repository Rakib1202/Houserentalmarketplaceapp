# 🚀 HouseRentBD - Complete Installation Guide

Complete step-by-step guide to install and run your HouseRentBD application with full backend integration.

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- ✅ **npm** or **yarn** package manager
- ✅ **Git** (optional, for version control)
- ✅ **Modern web browser** (Chrome, Firefox, Edge, Safari)
- ✅ **Supabase account** (free) - [Sign up](https://supabase.com)

---

## 🎯 Installation Steps

### **Step 1: Install Dependencies**

```bash
# Install all required packages
npm install

# Or using yarn
yarn install
```

**Packages installed:**
- `@supabase/supabase-js` - Database & authentication
- `react` & `react-dom` - UI framework
- `react-router` - Routing system
- `lucide-react` - Icons
- `sonner` - Toast notifications
- `recharts` - Charts & graphs
- `motion` - Animations
- `tailwindcss` - Styling

---

### **Step 2: Set Up Environment Variables**

```bash
# Copy the example environment file
cp .env.example .env
```

**Edit `.env` file:**

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to get these values:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create new one)
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

---

### **Step 3: Set Up Database** (Optional for demo mode)

#### **Option A: Demo Mode (No Database Needed)**

The application works perfectly with demo data built-in. You can skip database setup and use it immediately.

```bash
# Just start the dev server
npm run dev
```

#### **Option B: Full Production Mode (With Database)**

Follow the complete database setup guide:

**📖 See: [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed instructions**

Quick summary:
1. Create Supabase project
2. Run `schema.sql` in SQL Editor
3. Create storage bucket named `media`
4. Configure authentication providers
5. Set up environment variables

---

### **Step 4: Start Development Server**

```bash
# Start the application
npm run dev

# Or using yarn
yarn dev
```

**You should see:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### **Step 5: Open Application**

Open your browser and navigate to:
```
http://localhost:5173/
```

**🎉 Your application is now running!**

---

## 🧪 Testing the Application

### **Test Demo Mode** (No database required)

1. **Homepage**: `http://localhost:5173/`
   - ✅ Hero section
   - ✅ Featured properties
   - ✅ Live support button

2. **Career Page**: `http://localhost:5173/careers`
   - ✅ Job listings
   - ✅ Department filters
   - ✅ Apply buttons

3. **Admin Panel**: `http://localhost:5173/admin-login`
   - 👤 Username: `admin`
   - 🔑 Password: `admin`
   - ✅ Full admin dashboard
   - ✅ All management features

4. **CMS Features**: After admin login
   - **SEO Management**: `/admin/cms/seo`
   - **Media Library**: `/admin/cms/media`
   - **Content Analytics**: `/admin/cms/analytics`

---

### **Test Database Connection** (With Supabase)

1. **Check Browser Console**
```javascript
// Open DevTools (F12) → Console
// You should see Supabase client initialized
```

2. **Test Authentication**
```bash
# Go to: http://localhost:5173/signup
# Create a test account
# Check Supabase Dashboard → Authentication → Users
```

3. **Test Property Creation**
```bash
# Login as owner
# Go to dashboard
# Create a property
# Check Supabase Dashboard → Table Editor → properties
```

4. **Test Admin Functions**
```bash
# Login as admin
# Approve a property
# Check database update
```

---

## 📱 Access Different Dashboards

### **Public Pages**
- Homepage: `/`
- About: `/about`
- Contact: `/contact`
- Properties: `/properties`
- Careers: `/careers`

### **Authentication**
- Sign Up: `/signup`
- Login: `/login`
- Admin Login: `/admin-login`

### **User Dashboards** (After login)
- Tenant Dashboard: `/tenant`
- Owner Dashboard: `/owner`
- Agent Dashboard: `/agent`
- Employee Dashboard: `/employee`

### **Admin Panel** (Requires admin role)
- Main Dashboard: `/admin`
- Properties: `/admin/properties`
- Users: `/admin/users`
- Subscriptions: `/admin/subscriptions`
- Payments: `/admin/payments`
- Photo Approvals: `/admin/photos`
- Earnings: `/admin/earnings`
- Complaints: `/admin/reports`
- Analytics: `/admin/analytics`
- CRM: `/admin/crm`
- CMS: `/admin/cms`
- Jobs: `/admin/jobs`
- Settings: `/admin/settings`

### **CMS Features**
- SEO Management: `/admin/cms/seo`
- Media Library: `/admin/cms/media`
- Content Analytics: `/admin/cms/analytics`

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
tsc --noEmit
```

---

## 🐛 Troubleshooting

### **Issue: Port 5173 already in use**

**Solution:**
```bash
# Kill the process using port 5173
# On Mac/Linux:
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use different port:
npm run dev -- --port 3000
```

---

### **Issue: Environment variables not loading**

**Solution:**
1. Ensure file is named `.env` (not `.env.txt`)
2. Restart dev server after changing `.env`
3. Variables must start with `VITE_`
4. No quotes needed around values

**Correct:**
```env
VITE_SUPABASE_URL=https://example.supabase.co
```

**Incorrect:**
```env
SUPABASE_URL="https://example.supabase.co"  ❌
```

---

### **Issue: Supabase connection failed**

**Solutions:**

1. **Check credentials:**
```typescript
// Add to your component:
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has API Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

2. **Verify project is active:**
   - Go to Supabase Dashboard
   - Check project status
   - Ensure not paused

3. **Test connection:**
```typescript
import { supabase } from './lib/supabase';

const testConnection = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('count');
  
  console.log('Connection test:', { data, error });
};
```

---

### **Issue: Build fails**

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Try build again
npm run build
```

---

### **Issue: Types not working**

**Solution:**
```bash
# Ensure TypeScript is installed
npm install -D typescript @types/react @types/react-dom

# Regenerate types from Supabase (if using database)
npx supabase gen types typescript --project-id your-project-id > lib/database.types.ts
```

---

## 🌐 Production Deployment

### **Option 1: Vercel** (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Add environment variables:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

4. **Redeploy:**
```bash
vercel --prod
```

---

### **Option 2: Netlify**

1. **Build the project:**
```bash
npm run build
```

2. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

3. **Deploy:**
```bash
netlify deploy --prod
```

4. **Configure:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variables in Netlify Dashboard

---

### **Option 3: Traditional Hosting**

1. **Build:**
```bash
npm run build
```

2. **Upload `dist/` folder to your hosting**

3. **Configure web server:**
   - Point to `index.html`
   - Enable SPA routing (redirect all to index.html)

---

## 📊 Performance Optimization

### **Production Build**

```bash
# Create optimized build
npm run build

# Check build size
du -sh dist/
```

### **Environment-specific configs**

```env
# .env.development
VITE_SUPABASE_URL=https://dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=dev-key

# .env.production
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=prod-key
```

---

## 🔐 Security Best Practices

### **Environment Variables**

✅ **DO:**
- Use `.env` for local development
- Add `.env` to `.gitignore`
- Use environment variables in hosting platform
- Rotate keys regularly

❌ **DON'T:**
- Commit `.env` to Git
- Use production keys in development
- Share keys publicly
- Hardcode sensitive data

### **.gitignore**

Ensure these are ignored:
```
.env
.env.local
.env.production
node_modules/
dist/
.DS_Store
```

---

## 📚 Additional Resources

### **Documentation**
- 📖 [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Database configuration
- 📖 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
- 📖 [BACKEND_COMPLETE.md](./BACKEND_COMPLETE.md) - Backend overview

### **External Links**
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

## ✅ Installation Checklist

Before going live, ensure:

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured
- [ ] Database schema created (if using database)
- [ ] Storage bucket created (if using file uploads)
- [ ] Authentication providers configured
- [ ] Application runs locally (`npm run dev`)
- [ ] All features tested
- [ ] Production build successful (`npm run build`)
- [ ] Deployment configured

---

## 🎯 Quick Start Summary

**For Demo/Development:**
```bash
# 1. Install dependencies
npm install

# 2. Start server
npm run dev

# 3. Open browser
# http://localhost:5173
```

**For Production:**
```bash
# 1. Install dependencies
npm install

# 2. Set up Supabase (see DATABASE_SETUP.md)

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your credentials

# 4. Build
npm run build

# 5. Deploy
# Upload dist/ folder to hosting
```

---

## 🎊 You're All Set!

Your HouseRentBD application is now ready to use!

**Next Steps:**
1. ✅ Explore the application
2. ✅ Test all features
3. ✅ Customize branding and content
4. ✅ Set up production database (when ready)
5. ✅ Deploy to production

**Need help?** Check the documentation files or visit [Supabase Community](https://github.com/supabase/supabase/discussions).

---

## 🌟 Features Available

### **Without Database (Demo Mode)**
- ✅ All UI components
- ✅ Navigation and routing
- ✅ Demo data visualization
- ✅ Admin panel preview
- ✅ All dashboards
- ✅ CMS features (demo)
- ✅ Career page
- ✅ Live support button

### **With Database (Production Mode)**
- ✅ Everything in Demo Mode PLUS:
- ✅ Real authentication
- ✅ Data persistence
- ✅ File uploads
- ✅ Real-time updates
- ✅ User management
- ✅ Payment processing
- ✅ Analytics tracking
- ✅ Email notifications
- ✅ And much more!

---

**Happy Building! 🚀**
