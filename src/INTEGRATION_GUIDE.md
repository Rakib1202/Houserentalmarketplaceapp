# 🔗 Customer Support Panel - Integration Guide

Complete guide to integrate the Customer Support Panel into your HouseRentBD application.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Environment Configuration](#environment-configuration)
4. [Routing Setup](#routing-setup)
5. [Component Integration](#component-integration)
6. [Testing & Verification](#testing--verification)
7. [Production Deployment](#production-deployment)

---

## ✅ Prerequisites

Before starting, ensure you have:

- ✅ Node.js (v18 or higher)
- ✅ Supabase account and project
- ✅ Existing HouseRentBD app running
- ✅ Admin authentication working

---

## 🗄️ Database Setup

### **Step 1: Run Support Schema**

**Option A: Supabase Dashboard**
1. Open [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Create new query
5. Copy entire contents from `/database/support-schema.sql`
6. Paste and click **Run**
7. Wait for success message ✅

**Option B: Supabase CLI**
```bash
# Ensure you're in project root
supabase db push

# Or manually:
psql your_database_url < database/support-schema.sql
```

### **Step 2: Verify Tables Created**

Go to **Table Editor** in Supabase and verify these 7 tables exist:
- ✅ support_agents
- ✅ chat_conversations
- ✅ chat_messages
- ✅ agent_analytics
- ✅ agent_activity_logs
- ✅ canned_responses
- ✅ support_departments

### **Step 3: Create First Support Agent (Optional)**

**Via SQL:**
```sql
INSERT INTO support_agents (
  agent_name,
  email,
  password_hash,
  department,
  role,
  account_status,
  created_by
) VALUES (
  'Demo Support Agent',
  'support@houserentbd.com',
  encode('support123', 'base64'), -- Use bcrypt in production
  'General Support',
  'agent',
  'active',
  'admin-user-id-here' -- Replace with actual admin user ID
);
```

---

## ⚙️ Environment Configuration

Your `.env` file should already have Supabase credentials:

```env
# Existing Supabase config
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# No additional environment variables needed!
```

---

## 🛤️ Routing Setup

### **Option 1: Using React Router (Recommended)**

Update your `/routes.ts` or routing configuration:

```typescript
import { createBrowserRouter } from 'react-router';

// Import Support Components
import { SupportAgentLogin } from './components/support/SupportAgentLogin';
import { SupportPanelDashboard } from './components/support/SupportPanelDashboard';
import { AgentProfile } from './components/support/AgentProfile';

// Import Admin Components
import { AdminSupportAgents } from './components/admin/AdminSupportAgents';
import { AdminSupportAnalytics } from './components/admin/AdminSupportAnalytics';

export const router = createBrowserRouter([
  // ... existing routes ...

  // Support Agent Routes
  {
    path: '/support',
    children: [
      {
        path: 'login',
        element: <SupportAgentLogin />,
      },
      {
        path: 'dashboard',
        element: <SupportPanelDashboard />,
        // Add authentication guard here
      },
      {
        path: 'profile',
        element: <AgentProfile />,
        // Add authentication guard here
      },
    ],
  },

  // Admin Routes (add to existing admin section)
  {
    path: '/admin',
    children: [
      // ... existing admin routes ...
      {
        path: 'support-agents',
        element: <AdminSupportAgents />,
        // Add admin authentication guard here
      },
      {
        path: 'support/analytics',
        element: <AdminSupportAnalytics />,
        // Add admin authentication guard here
      },
    ],
  },
]);
```

### **Option 2: Add to Admin Panel Navigation**

Update your admin sidebar/navigation to include:

```typescript
// In your AdminLayout or AdminSidebar component
const adminNavigation = [
  // ... existing items ...
  
  {
    title: 'Customer Support',
    icon: <Headphones />,
    items: [
      {
        label: 'Support Agents',
        path: '/admin/support-agents',
        icon: <Users />,
      },
      {
        label: 'Analytics',
        path: '/admin/support/analytics',
        icon: <BarChart3 />,
      },
    ],
  },
];
```

---

## 🧩 Component Integration

### **1. Add Live Chat Widget to Website**

Add the widget to your main layout so it appears on all pages:

```typescript
// In your App.tsx or MainLayout.tsx
import { LiveChatWidget } from './components/support/LiveChatWidget';

function App() {
  return (
    <div>
      {/* Your existing app content */}
      <RouterProvider router={router} />
      
      {/* Add Live Chat Widget - appears on all pages */}
      <LiveChatWidget />
    </div>
  );
}

export default App;
```

**Alternative: Conditionally Show Widget**

If you want to show the widget only on certain pages:

```typescript
import { useLocation } from 'react-router';
import { LiveChatWidget } from './components/support/LiveChatWidget';

function App() {
  const location = useLocation();
  
  // Show on all pages except admin and support panel
  const showWidget = !location.pathname.startsWith('/admin') && 
                     !location.pathname.startsWith('/support');

  return (
    <div>
      <RouterProvider router={router} />
      {showWidget && <LiveChatWidget />}
    </div>
  );
}
```

### **2. Protect Support Routes**

Create an authentication guard for support agent routes:

```typescript
// /components/support/SupportAgentGuard.tsx
import { Navigate } from 'react-router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export function SupportAgentGuard({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Check if support agent is logged in
    // This is a placeholder - implement your actual auth logic
    const agentId = localStorage.getItem('support_agent_id');
    
    if (agentId) {
      // Verify agent exists and is active
      const { data } = await supabase
        .from('support_agents')
        .select('*')
        .eq('id', agentId)
        .eq('account_status', 'active')
        .single();
      
      setIsAuthorized(!!data);
    } else {
      setIsAuthorized(false);
    }
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/support/login" replace />;
  }

  return <>{children}</>;
}
```

Use the guard in your routes:

```typescript
{
  path: 'dashboard',
  element: (
    <SupportAgentGuard>
      <SupportPanelDashboard />
    </SupportAgentGuard>
  ),
}
```

---

## 🧪 Testing & Verification

### **Step 1: Test Database Connection**

Create a test file: `/test-support-db.ts`

```typescript
import { supportAgentsService } from './services/support-api';

async function testDatabase() {
  console.log('Testing support database connection...');
  
  const result = await supportAgentsService.getAll();
  
  if (result.success) {
    console.log('✅ Database connected successfully!');
    console.log('Agents found:', result.data?.length || 0);
  } else {
    console.error('❌ Database connection failed:', result.error);
  }
}

testDatabase();
```

Run: `npx tsx test-support-db.ts`

### **Step 2: Test Admin Panel**

1. Login as admin
2. Navigate to `/admin/support-agents`
3. Try creating a test agent:
   - Name: Test Agent
   - Email: test@support.com
   - Password: test123
   - Department: General Support
   - Role: agent
4. Verify agent appears in table ✅
5. Try editing the agent ✅
6. Try resetting password ✅
7. Try activating/deactivating ✅

### **Step 3: Test Support Agent Login**

1. Navigate to `/support/login`
2. Use credentials:
   - Email: support@houserentbd.com (or the one you created)
   - Password: support123
3. Should redirect to dashboard ✅
4. Verify dashboard loads with stats ✅
5. Try navigating between pages ✅

### **Step 4: Test Live Chat Widget**

1. Open your website (e.g., `/`)
2. Look for floating chat button in bottom-right ✅
3. Click to open chat window ✅
4. Fill in name and email
5. Click "Start Chat" ✅
6. Send a test message ✅
7. Check if it appears in support panel dashboard ✅

### **Step 5: Test Real-Time Features**

1. Open support dashboard in one browser tab
2. Open live chat widget in another tab (or incognito)
3. Send message from widget
4. Verify it appears instantly in dashboard ✅
5. Reply from dashboard
6. Verify visitor sees reply ✅

### **Step 6: Test Analytics**

1. Navigate to `/admin/support/analytics`
2. Verify charts load ✅
3. Check statistics cards ✅
4. Try changing date range ✅
5. Verify agent performance table ✅

---

## 🚀 Production Deployment

### **Step 1: Environment Variables**

Ensure production environment has:

```env
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### **Step 2: Security Enhancements**

**Replace Basic Password Encoding:**

Install bcrypt:
```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

Update password handling in `/services/support-api.ts`:

```typescript
import bcrypt from 'bcryptjs';

// In supportAgentsService.create():
const passwordHash = await bcrypt.hash(agentData.password, 10);

// In supportAgentsService.login():
const isValid = await bcrypt.compare(password, data.password_hash);
if (!isValid) {
  return { success: false, error: 'Invalid credentials' };
}
```

### **Step 3: Enable Supabase Realtime**

1. Go to Supabase Dashboard → Database → Replication
2. Enable replication for:
   - ✅ chat_conversations
   - ✅ chat_messages
   - ✅ support_agents (for status updates)

### **Step 4: Configure Storage (for file uploads)**

If using file attachments:

1. Go to Supabase Dashboard → Storage
2. Create bucket: `support-files`
3. Make it public or set policies
4. Update chat components to upload files

### **Step 5: Set Up Email Notifications (Optional)**

Configure email service for:
- New agent account creation
- Password reset
- Daily performance reports

### **Step 6: Performance Optimization**

**Enable Indexes** (already in schema.sql):
- ✅ Indexes on foreign keys
- ✅ Indexes on frequently queried columns
- ✅ Composite indexes for filters

**Enable Caching:**
```typescript
// Cache agent list in admin panel
const cacheTime = 5 * 60 * 1000; // 5 minutes
```

### **Step 7: Monitor & Logs**

Set up monitoring for:
- Database queries
- API response times
- Error rates
- User activity

---

## 📊 Post-Deployment Checklist

After deploying to production:

- [ ] Database schema applied successfully
- [ ] All 7 tables exist
- [ ] Sample departments created
- [ ] First support agent created
- [ ] Admin can login
- [ ] Support agent can login
- [ ] Live chat widget appears on website
- [ ] Chat messages are saved to database
- [ ] Real-time updates working
- [ ] Notifications working
- [ ] Analytics dashboard loading
- [ ] All routes accessible
- [ ] Authentication guards working
- [ ] Password hashing implemented
- [ ] Error handling in place
- [ ] Mobile responsive
- [ ] Cross-browser tested

---

## 🔧 Troubleshooting

### **Issue: Database connection failed**

**Solution:**
1. Check `.env` file has correct Supabase credentials
2. Restart development server
3. Verify Supabase project is active
4. Check browser console for errors

### **Issue: Tables not created**

**Solution:**
1. Re-run `support-schema.sql` in SQL Editor
2. Check for SQL errors in Supabase logs
3. Ensure UUID extension is enabled
4. Verify you have proper permissions

### **Issue: Support agent login not working**

**Solution:**
1. Verify agent exists in `support_agents` table
2. Check `account_status` is 'active'
3. Verify password hash matches
4. Check browser console for API errors

### **Issue: Live chat widget not appearing**

**Solution:**
1. Verify `<LiveChatWidget />` is in your layout
2. Check z-index isn't being overridden
3. Ensure component is imported correctly
4. Check browser console for errors

### **Issue: Real-time not working**

**Solution:**
1. Enable Realtime in Supabase Dashboard
2. Check replication is enabled for tables
3. Verify subscription code is correct
4. Check browser console for WebSocket errors

---

## 🎯 Next Steps

After successful integration:

1. **Create Production Support Agents**
   - Create real agent accounts
   - Assign to departments
   - Set appropriate roles

2. **Configure Departments**
   - Add your actual departments
   - Assign agents
   - Set up routing rules

3. **Customize Branding**
   - Update colors in widget
   - Add your logo
   - Customize messages

4. **Train Your Team**
   - Show agents how to use dashboard
   - Teach admin panel features
   - Practice with test chats

5. **Monitor Performance**
   - Watch analytics dashboard
   - Track response times
   - Gather feedback

6. **Optimize & Improve**
   - Add canned responses
   - Create templates
   - Refine workflows

---

## 📚 Additional Resources

- **Complete Documentation**: `/SUPPORT_SYSTEM_DOCS.md`
- **Feature Summary**: `/SUPPORT_PANEL_COMPLETE.md`
- **Database Schema**: `/database/support-schema.sql`
- **API Services**: `/services/support-api.ts`
- **Supabase Docs**: https://supabase.com/docs

---

## ✅ Integration Complete!

Once you've followed this guide, your Customer Support Panel will be **fully integrated** into your HouseRentBD application with:

- ✅ Database connected
- ✅ All routes configured
- ✅ Components integrated
- ✅ Authentication working
- ✅ Real-time enabled
- ✅ Production ready

**You're ready to provide amazing customer support!** 🎉

---

## 🆘 Need Help?

If you encounter any issues:

1. Check this guide's troubleshooting section
2. Review `/SUPPORT_SYSTEM_DOCS.md` for detailed explanations
3. Check Supabase Dashboard logs
4. Verify all environment variables
5. Test database connection

**Happy integrating! 🚀**
