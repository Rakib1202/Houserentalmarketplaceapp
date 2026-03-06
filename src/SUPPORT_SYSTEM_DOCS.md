# 💬 Customer Support Panel System - Complete Documentation

Complete documentation for the Customer Support Panel system with Live Chat functionality for HouseRentBD.

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Database Schema](#database-schema)
3. [Features](#features)
4. [Admin Management](#admin-management)
5. [Support Agent Dashboard](#support-agent-dashboard)
6. [Live Chat Widget](#live-chat-widget)
7. [API Services](#api-services)
8. [Installation & Setup](#installation--setup)
9. [Usage Guide](#usage-guide)
10. [Real-time Features](#real-time-features)

---

## 🎯 System Overview

The Customer Support Panel is a **complete, professional live chat system** designed to handle all website customer support operations. It consists of three main components:

### **1. Admin Panel** (Manage Support Agents)
- ✅ Create support agent accounts
- ✅ Edit agent details
- ✅ Reset passwords
- ✅ Activate/Deactivate accounts
- ✅ Suspend agents
- ✅ Monitor performance analytics

### **2. Support Agent Dashboard** (Handle Chats)
- ✅ Dedicated agent portal
- ✅ Real-time chat interface
- ✅ Conversation management
- ✅ Quick responses
- ✅ Chat transfer
- ✅ Performance tracking

### **3. Live Chat Widget** (Customer Interface)
- ✅ Beautiful floating chat button
- ✅ Minimizable chat window
- ✅ Real-time messaging
- ✅ Typing indicators
- ✅ Unread message badges

---

## 🗄️ Database Schema

### **New Tables Created** (`/database/support-schema.sql`)

#### 1. **support_agents**
Stores support agent accounts and information.

```sql
- id (UUID, Primary Key)
- user_id (Foreign Key to users)
- agent_name (VARCHAR)
- email (VARCHAR, Unique)
- password_hash (TEXT)
- avatar_url (TEXT)
- status (online/offline/busy/away)
- account_status (active/inactive/suspended)
- department (VARCHAR)
- role (agent/supervisor/manager)
- max_concurrent_chats (INTEGER)
- created_by (Foreign Key to users)
- created_at, updated_at
- last_active, last_login
```

#### 2. **chat_conversations**
Stores all chat conversations.

```sql
- id (UUID, Primary Key)
- visitor_id (VARCHAR)
- visitor_name (VARCHAR)
- visitor_email (VARCHAR)
- user_id (Foreign Key to users)
- assigned_agent_id (Foreign Key to support_agents)
- status (waiting/active/resolved/closed/transferred)
- priority (low/normal/high/urgent)
- category (VARCHAR)
- subject (VARCHAR)
- started_at, assigned_at, first_response_at
- resolved_at, closed_at
- rating (1-5)
- feedback (TEXT)
- tags (TEXT[])
- metadata (JSONB)
```

#### 3. **chat_messages**
Stores individual chat messages.

```sql
- id (UUID, Primary Key)
- conversation_id (Foreign Key to chat_conversations)
- sender_type (visitor/agent/system)
- sender_id (UUID)
- sender_name (VARCHAR)
- message_type (text/image/file/system)
- message_content (TEXT)
- attachments (JSONB)
- is_read (BOOLEAN)
- read_at (TIMESTAMP)
- created_at (TIMESTAMP)
```

#### 4. **agent_analytics**
Daily analytics for each agent.

```sql
- id (UUID, Primary Key)
- agent_id (Foreign Key to support_agents)
- date (DATE)
- total_chats (INTEGER)
- active_chats (INTEGER)
- resolved_chats (INTEGER)
- transferred_chats (INTEGER)
- avg_response_time_seconds (INTEGER)
- avg_resolution_time_seconds (INTEGER)
- total_messages_sent (INTEGER)
- avg_rating (DECIMAL)
- total_ratings (INTEGER)
- online_time_minutes (INTEGER)
- first_login_at, last_logout_at
```

#### 5. **agent_activity_logs**
Audit trail of agent actions.

```sql
- id (UUID, Primary Key)
- agent_id (Foreign Key to support_agents)
- activity_type (VARCHAR)
- details (JSONB)
- ip_address (VARCHAR)
- user_agent (TEXT)
- created_at (TIMESTAMP)
```

#### 6. **canned_responses**
Quick reply templates.

```sql
- id (UUID, Primary Key)
- title (VARCHAR)
- shortcut (VARCHAR, Unique)
- message (TEXT)
- category (VARCHAR)
- is_active (BOOLEAN)
- created_by (Foreign Key to support_agents)
```

#### 7. **support_departments**
Support departments/teams.

```sql
- id (UUID, Primary Key)
- name (VARCHAR)
- description (TEXT)
- email (VARCHAR)
- is_active (BOOLEAN)
```

---

## ✨ Features

### **Admin Features**

#### **Agent Management**
- ✅ Create new support agent accounts
- ✅ Set agent details (name, email, department, role)
- ✅ Configure concurrent chat limits
- ✅ Assign departments
- ✅ Set agent roles (Agent/Supervisor/Manager)

#### **Account Control**
- ✅ Activate agents
- ✅ Deactivate agents
- ✅ Suspend agents
- ✅ Delete agents
- ✅ Reset passwords

#### **Analytics Dashboard**
- ✅ Real-time agent status
- ✅ Daily chat volumes
- ✅ Response time tracking
- ✅ Resolution rates
- ✅ Customer satisfaction ratings
- ✅ Performance comparisons
- ✅ Export reports

#### **Statistics Tracked**
- Total chats handled
- Resolved chats
- Average response time
- Average resolution time
- Customer ratings
- Online time
- Chat transfers
- Messages sent

---

### **Support Agent Features**

#### **Dashboard**
- ✅ Real-time conversation list
- ✅ Unread message indicators
- ✅ Priority badges
- ✅ Status filters
- ✅ Search conversations
- ✅ Online status control

#### **Chat Interface**
- ✅ Real-time messaging
- ✅ Typing indicators
- ✅ Message history
- ✅ File attachments
- ✅ Quick responses
- ✅ Chat transfer
- ✅ Resolve/Close chats

#### **Conversation Management**
- ✅ Accept waiting chats
- ✅ Handle multiple chats
- ✅ Set chat priority
- ✅ Add notes
- ✅ Tag conversations
- ✅ Rate conversations

---

### **Live Chat Widget Features**

#### **Customer Experience**
- ✅ Beautiful floating button
- ✅ Minimizable chat window
- ✅ Unread count badge
- ✅ Pre-chat form
- ✅ Real-time messaging
- ✅ Typing indicators
- ✅ Agent availability status
- ✅ Emoji support
- ✅ File upload

#### **Design**
- ✅ Responsive design
- ✅ Mobile-friendly
- ✅ Customizable colors
- ✅ Smooth animations
- ✅ Professional UI

---

## 👨‍💼 Admin Management

### **Access Support Agent Management**

```
Route: /admin/support-agents
Component: AdminSupportAgents.tsx
```

### **Creating a Support Agent**

**Step 1:** Click "Create Agent" button

**Step 2:** Fill in agent details:
- Full Name *
- Email Address * (must be unique)
- Password * (will be hashed)
- Department (General Support, Property Queries, Technical, Billing)
- Role (Agent, Supervisor, Manager)
- Max Concurrent Chats (default: 5)

**Step 3:** Click "Create Agent"

**Result:**
- Agent account created
- Email credentials sent (in production)
- Account status: Active
- Login status: Offline

### **Managing Agents**

#### **Edit Agent**
```typescript
// Click Edit button
- Update name, department, role
- Change concurrent chat limit
- Save changes
```

#### **Reset Password**
```typescript
// Click Reset Password button
- Enter new password
- Confirm password
- System hashes and updates
```

#### **Activate/Deactivate**
```typescript
// Toggle account status
Active → Deactivate (agent can't login)
Inactive → Activate (agent can login)
```

#### **Suspend Agent**
```typescript
// Temporary suspension
- Agent immediately logged out
- Cannot login until unsuspended
- All active chats transferred
```

#### **Delete Agent**
```typescript
// Permanent deletion
- Confirmation required
- Agent removed from system
- Chat history preserved
- Analytics remain
```

---

## 💻 Support Agent Dashboard

### **Access Agent Dashboard**

```
Login Route: /support/login
Dashboard Route: /support/dashboard
Component: SupportAgentDashboard.tsx
```

### **Agent Login**

**Demo Credentials:**
```
Email: support@houserentbd.com
Password: support123
```

**Login Process:**
1. Enter email and password
2. System verifies credentials
3. Check account status (must be active)
4. Update last_login timestamp
5. Log login activity
6. Redirect to dashboard

### **Dashboard Features**

#### **Status Control**
```typescript
// Agent can set status:
- 🟢 Online (available for chats)
- 🟡 Busy (no new chats)
- 🟠 Away (temporarily unavailable)
```

#### **Conversation List**
- All assigned conversations
- Real-time updates
- Unread indicators
- Priority badges
- Status labels
- Search and filter

#### **Chat Interface**
- Message history
- Real-time updates
- Send messages
- Attach files
- Quick responses
- Resolve chat
- Transfer chat

### **Handling Chats**

#### **Accept New Chat**
```typescript
1. Waiting chat appears in list
2. Click to assign to self
3. Status changes to "Active"
4. Send greeting message
5. Start conversation
```

#### **Send Message**
```typescript
1. Type message in input
2. Press Enter or click Send
3. Message saved to database
4. Real-time update to visitor
5. Update conversation timestamp
```

#### **Resolve Chat**
```typescript
1. Click "Resolve" button
2. Chat status → Resolved
3. Ask for rating (optional)
4. Update analytics
5. Remove from active list
```

#### **Transfer Chat**
```typescript
1. Click "Transfer" button
2. Select agent/department
3. Add transfer note
4. Update assigned_agent_id
5. Notify new agent
6. Log transfer activity
```

---

## 🌐 Live Chat Widget

### **Integration**

Add to your website layout:

```tsx
import { LiveChatWidget } from './components/support/LiveChatWidget';

function Layout() {
  return (
    <>
      {/* Your content */}
      <LiveChatWidget />
    </>
  );
}
```

### **Customer Flow**

#### **Step 1: Open Chat**
- Click floating chat button
- Chat window opens
- See welcome message

#### **Step 2: Start Chat**
- Enter name (required)
- Enter email (optional)
- Click "Start Chat"
- Wait for agent

#### **Step 3: Chat**
- Agent joins conversation
- Send messages
- Receive responses
- Upload files

#### **Step 4: Complete**
- Agent resolves chat
- Rate experience (optional)
- Provide feedback
- Chat closed

### **Widget Customization**

```tsx
<LiveChatWidget
  primaryColor="#3B82F6"
  position="bottom-right"
  greeting="Welcome! How can we help?"
  showAvatars={true}
  enableFileUpload={true}
/>
```

---

## 🔌 API Services

All API services available in `/services/support-api.ts`

### **Support Agents Service**

```typescript
import { supportAgentsService } from './services/support-api';

// Get all agents
const { data } = await supportAgentsService.getAll({
  accountStatus: 'active',
  department: 'General Support'
});

// Create agent
await supportAgentsService.create({
  agent_name: 'John Doe',
  email: 'john@support.com',
  password: 'secure123',
  department: 'General Support',
  role: 'agent',
  created_by: adminUserId
});

// Update agent
await supportAgentsService.update(agentId, {
  agent_name: 'John Updated',
  department: 'Technical Support'
});

// Reset password
await supportAgentsService.resetPassword(agentId, 'newpassword123');

// Activate/Deactivate
await supportAgentsService.activate(agentId);
await supportAgentsService.deactivate(agentId);

// Agent login
const { data: agent } = await supportAgentsService.login(
  'john@support.com',
  'secure123'
);

// Update status
await supportAgentsService.updateStatus(agentId, 'online');
```

### **Chat Conversations Service**

```typescript
import { chatConversationsService } from './services/support-api';

// Get conversations
const { data } = await chatConversationsService.getAll({
  status: 'active',
  agentId: currentAgentId
});

// Create conversation (visitor starts chat)
await chatConversationsService.create({
  visitor_name: 'Jane Customer',
  visitor_email: 'jane@example.com',
  subject: 'Property inquiry'
});

// Assign to agent
await chatConversationsService.assign(conversationId, agentId);

// Resolve conversation
await chatConversationsService.resolve(conversationId, agentId);

// Transfer conversation
await chatConversationsService.transfer(
  conversationId,
  newAgentId,
  currentAgentId
);

// Rate conversation
await chatConversationsService.rate(conversationId, 5, 'Great service!');
```

### **Chat Messages Service**

```typescript
import { chatMessagesService } from './services/support-api';

// Get messages
const { data } = await chatMessagesService.getByConversation(conversationId);

// Send message
await chatMessagesService.send({
  conversation_id: conversationId,
  sender_type: 'agent',
  sender_id: agentId,
  sender_name: 'Support Agent',
  message_content: 'Hello! How can I help you?'
});

// Mark as read
await chatMessagesService.markAsRead(conversationId);

// Subscribe to real-time updates
const subscription = chatMessagesService.subscribeToConversation(
  conversationId,
  (newMessage) => {
    console.log('New message:', newMessage);
    updateUI(newMessage);
  }
);

// Unsubscribe when done
subscription.unsubscribe();
```

### **Agent Analytics Service**

```typescript
import { agentAnalyticsService } from './services/support-api';

// Get agent analytics
const { data } = await agentAnalyticsService.getByDateRange(
  agentId,
  '2024-02-01',
  '2024-02-11'
);

// Get all agents analytics (Admin)
const { data: allStats } = await agentAnalyticsService.getAllAgentsAnalytics(
  '2024-02-11'
);

// Get activity logs
const { data: logs } = await agentAnalyticsService.getActivityLogs(
  agentId,
  50 // limit
);

// Get performance summary
const { data: summary } = await agentAnalyticsService.getPerformanceSummary(
  agentId,
  30 // days
);
```

---

## 📊 Analytics & Reporting

### **Metrics Tracked**

#### **Per Agent:**
- Total chats handled
- Resolved chats
- Transferred chats
- Average response time
- Average resolution time
- Customer ratings
- Online time (minutes)
- Messages sent

#### **Overall:**
- Total conversations
- Active conversations
- Resolved conversations
- Average ratings
- Peak hours
- Chat categories
- Response time trends
- Resolution rates

### **Admin Analytics Dashboard**

Access: `/admin/support/analytics`

**Features:**
- Date range selection
- Agent comparison
- Export reports (CSV/PDF)
- Real-time statistics
- Charts and graphs
- Performance tracking

---

## 🚀 Installation & Setup

### **Step 1: Database Setup**

```sql
-- Run the support system schema
-- File: /database/support-schema.sql

psql your_database < support-schema.sql
```

Or in Supabase Dashboard:
1. Go to SQL Editor
2. Open `/database/support-schema.sql`
3. Copy and paste content
4. Click "Run"

### **Step 2: Install Dependencies**

Already included in `package.json`:
```json
{
  "@supabase/supabase-js": "^2.39.0",
  "react": "^18.2.0",
  "lucide-react": "latest",
  "sonner": "^2.0.3",
  "recharts": "^2.10.0"
}
```

### **Step 3: Add Routes**

Update your routing configuration:

```typescript
// routes.ts or App.tsx
import { SupportAgentLogin } from './components/support/SupportAgentLogin';
import { SupportAgentDashboard } from './components/support/SupportAgentDashboard';
import { AdminSupportAgents } from './components/admin/AdminSupportAgents';
import { AdminSupportAnalytics } from './components/admin/AdminSupportAnalytics';

const routes = [
  // Support Agent Routes
  {
    path: '/support/login',
    element: <SupportAgentLogin />
  },
  {
    path: '/support/dashboard',
    element: <SupportAgentDashboard />
  },
  
  // Admin Routes
  {
    path: '/admin/support-agents',
    element: <AdminSupportAgents />
  },
  {
    path: '/admin/support/analytics',
    element: <AdminSupportAnalytics />
  }
];
```

### **Step 4: Add Live Chat Widget**

Add to your main layout:

```typescript
// App.tsx or Layout.tsx
import { LiveChatWidget } from './components/support/LiveChatWidget';

function App() {
  return (
    <div>
      {/* Your app content */}
      
      {/* Live Chat Widget */}
      <LiveChatWidget />
    </div>
  );
}
```

### **Step 5: Create First Support Agent**

**Option A: Via Admin Panel**
1. Login as admin
2. Go to `/admin/support-agents`
3. Click "Create Agent"
4. Fill in details
5. Save

**Option B: Via Database**
```sql
INSERT INTO support_agents (
  agent_name,
  email,
  password_hash,
  department,
  role,
  account_status
) VALUES (
  'Support Agent',
  'support@houserentbd.com',
  encode('support123', 'base64'), -- Use proper hashing in production
  'General Support',
  'agent',
  'active'
);
```

---

## 🔒 Security Best Practices

### **Password Security**

**Development:**
```typescript
// Basic encoding (DEMO ONLY)
const passwordHash = btoa(password);
```

**Production:**
```typescript
// Use bcrypt or argon2
import bcrypt from 'bcrypt';

const passwordHash = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, passwordHash);
```

### **Access Control**

- ✅ Only admins can create/manage agents
- ✅ Agents can only access assigned chats
- ✅ RLS policies enforce data security
- ✅ Activity logging for audit trail

### **Data Protection**

- ✅ Password hashing
- ✅ Secure sessions
- ✅ HTTPS only
- ✅ Input validation
- ✅ SQL injection prevention

---

## 📱 Real-time Features

### **Supabase Realtime**

Enable real-time for support tables:

```typescript
// Subscribe to new messages
const subscription = supabase
  .channel('chat-messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_messages'
    },
    (payload) => {
      handleNewMessage(payload.new);
    }
  )
  .subscribe();
```

### **Features Using Realtime:**

- ✅ Instant message delivery
- ✅ Typing indicators
- ✅ Agent status updates
- ✅ New chat notifications
- ✅ Chat transfer notifications
- ✅ Read receipts

---

## ✅ Complete Feature Checklist

### **Admin Panel:**
- [x] Create support agent accounts
- [x] Edit agent details
- [x] Reset passwords
- [x] Activate/Deactivate accounts
- [x] Suspend agents
- [x] Delete agents
- [x] View agent list
- [x] Filter by status/department
- [x] Search agents
- [x] View statistics
- [x] Analytics dashboard
- [x] Performance monitoring
- [x] Export reports

### **Support Agent Dashboard:**
- [x] Agent login
- [x] Status control (online/busy/away)
- [x] Conversation list
- [x] Real-time updates
- [x] Unread indicators
- [x] Priority badges
- [x] Search conversations
- [x] Filter conversations
- [x] Chat interface
- [x] Send messages
- [x] Receive messages
- [x] Typing indicators
- [x] File attachments
- [x] Quick responses
- [x] Resolve chats
- [x] Transfer chats
- [x] Chat history

### **Live Chat Widget:**
- [x] Floating chat button
- [x] Unread count badge
- [x] Open/close animation
- [x] Minimize functionality
- [x] Pre-chat form
- [x] Real-time messaging
- [x] Typing indicators
- [x] Message history
- [x] File upload
- [x] Emoji support
- [x] Mobile responsive
- [x] Beautiful UI
- [x] Smooth animations

### **Analytics:**
- [x] Daily statistics
- [x] Agent performance
- [x] Response times
- [x] Resolution rates
- [x] Customer ratings
- [x] Chat volume trends
- [x] Peak hours analysis
- [x] Department statistics
- [x] Export functionality

---

## 🎯 Next Steps

### **Phase 1: Basic Implementation** ✅
- Database schema
- API services
- Admin management
- Agent dashboard
- Live chat widget

### **Phase 2: Enhancements**
- Email notifications
- SMS alerts
- Video chat
- Screen sharing
- Chatbot integration
- Knowledge base integration
- Multi-language support

### **Phase 3: Advanced Features**
- AI-powered responses
- Sentiment analysis
- Auto-routing
- Predictive analytics
- Mobile apps
- Desktop apps

---

## 📚 Additional Resources

- **Database Schema**: `/database/support-schema.sql`
- **API Services**: `/services/support-api.ts`
- **Admin Components**: `/components/admin/`
- **Support Components**: `/components/support/`
- **Supabase Docs**: https://supabase.com/docs

---

## 🆘 Support & Help

**For Admin Issues:**
- Check admin permissions
- Verify agent account status
- Review activity logs

**For Agent Issues:**
- Verify account is active
- Check login credentials
- Ensure proper department assignment

**For Technical Issues:**
- Check database connection
- Verify Supabase realtime is enabled
- Check browser console for errors
- Review API responses

---

## ✅ System Complete!

Your Customer Support Panel is now **fully functional** with:

- ✅ Admin management system
- ✅ Support agent dashboard
- ✅ Live chat widget
- ✅ Real-time messaging
- ✅ Analytics dashboard
- ✅ Database integration
- ✅ Complete API services

**Ready to provide excellent customer support!** 💬🎉
