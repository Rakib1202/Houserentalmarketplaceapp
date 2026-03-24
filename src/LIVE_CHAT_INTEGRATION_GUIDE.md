# 💬 Live Chat Integration - Complete Guide

## How Live Chat Connects to Support System

The HouseRentBD live chat is **fully integrated** with the support ticket system, allowing seamless real-time communication between users and the support team.

---

## 🔄 How It Works

### User Side (Live Chat Widget)

1. **User Opens Live Chat**
   - Clicks the floating blue chat button on the website
   - Sees multiple contact options (Live Chat, Facebook, Instagram, etc.)

2. **User Starts Chat**
   - Clicks "Live Chat" button
   - Enters contact information (Name, Email, Phone)
   - System automatically creates a Support Ticket
   - Chat becomes active instantly

3. **User Sends Messages**
   - Types message in chat input
   - Clicks Send or presses Enter
   - Message is added to the Support Ticket
   - System polls every 2 seconds for replies

4. **User Receives Replies**
   - Support team's messages appear in real-time
   - Notification toast shows "New message received!"
   - Messages are displayed in chat interface

---

### Support Team Side (Support Dashboard)

1. **Support Employee Logs In**
   - Access `/support/live-chat-reply` dashboard
   - See all support tickets in real-time
   - Dashboard refreshes every 3 seconds automatically

2. **View Live Chat Tickets**
   - All live chat conversations appear as tickets
   - Subject line: "Live Chat Support"
   - Priority, status, and customer info displayed
   - Filter by status, priority, or category

3. **Assign & Reply**
   - Click "Assign to Me" to take ownership
   - Ticket status changes to "In Progress"
   - Type reply in message box
   - Click Send (or press Enter)
   - Message instantly sent to user's live chat

4. **Resolve Tickets**
   - After helping user, click "Resolve"
   - Ticket marked as resolved
   - Stats updated automatically

---

## 🏗️ Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│                    USER (Customer)                   │
│                    Live Chat Widget                  │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼ Creates Support Ticket
┌─────────────────────────────────────────────────────┐
│                  SUPPORT TICKET                      │
│                  (MongoDB Document)                  │
│  {                                                   │
│    customerName: "John Doe",                        │
│    customerEmail: "john@example.com",               │
│    customerPhone: "01712345678",                    │
│    subject: "Live Chat Support",                    │
│    messages: [                                      │
│      {                                              │
│        sender: "customer",                          │
│        message: "I need help...",                   │
│        timestamp: "2026-03-24T10:30:00Z"           │
│      },                                             │
│      {                                              │
│        sender: "support",                           │
│        message: "How can I help you?",              │
│        timestamp: "2026-03-24T10:31:00Z"           │
│      }                                              │
│    ]                                                │
│  }                                                  │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼ Displays in Dashboard
┌─────────────────────────────────────────────────────┐
│              SUPPORT EMPLOYEE                        │
│           Live Chat Reply Dashboard                  │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Files Involved

### User-Facing Components

#### `/components/LiveSupport.tsx` (Main Live Chat Widget)
```typescript
Features:
✅ Floating chat button
✅ Contact form (Name, Email, Phone)
✅ Create support ticket on chat start
✅ Send messages to ticket
✅ Poll for new messages every 2 seconds
✅ Display support replies in real-time
✅ Toast notifications for new messages
✅ Auto-fill user info from localStorage
```

### Support Team Components

#### `/components/support/LiveChatReplyDashboard.tsx` (Support Dashboard)
```typescript
Features:
✅ View all support tickets
✅ Auto-refresh every 3 seconds
✅ Filter by status, priority, category
✅ Search tickets by number, name, subject
✅ Assign tickets to support employees
✅ Reply to tickets (sends to user's live chat)
✅ Mark tickets as resolved
✅ Real-time statistics
✅ Customer info display (email, phone)
✅ Message history
```

---

## 🔌 API Integration

### API Endpoints Used

#### Create Support Ticket (Start Live Chat)
```typescript
POST /api/support-tickets
Body: {
  customerName: "John Doe",
  customerEmail: "john@example.com",
  customerPhone: "01712345678",
  subject: "Live Chat Support",
  category: "General",
  priority: "medium",
  message: "User has started a live chat session"
}
Response: {
  success: true,
  ticket: { _id: "...", messages: [...], ... }
}
```

#### Add Message to Ticket
```typescript
POST /api/support-tickets/:ticketId/messages
Body: {
  message: "Hello, how can I help?",
  sender: "customer" | "support",
  senderName: "John Doe" | "Support Agent"
}
Response: {
  success: true,
  ticket: { messages: [...updated messages...] }
}
```

#### Get Ticket by ID (Polling)
```typescript
GET /api/support-tickets/:ticketId
Response: {
  success: true,
  ticket: { messages: [...all messages...], ... }
}
```

#### Get All Tickets (Support Dashboard)
```typescript
GET /api/support-tickets
Response: {
  success: true,
  tickets: [ {...}, {...}, {...} ]
}
```

#### Assign Ticket to Employee
```typescript
POST /api/support-tickets/:ticketId/assign
Body: {
  employeeId: "SUPPORT001"
}
Response: {
  success: true,
  ticket: { assignedTo: "SUPPORT001", status: "in-progress" }
}
```

#### Update Ticket Status
```typescript
PATCH /api/support-tickets/:ticketId/status
Body: {
  status: "resolved"
}
Response: {
  success: true,
  ticket: { status: "resolved" }
}
```

---

## 🎯 Real-Time Features

### User Side (Polling)
```typescript
// Poll every 2 seconds for new messages
useEffect(() => {
  const pollInterval = setInterval(async () => {
    const response = await supportTicketsAPI.getById(currentTicketId);
    if (response.ticket.messages.length > chatMessages.length) {
      setChatMessages(response.ticket.messages);
      // Show notification for new support messages
      toast.success("New message received!");
    }
  }, 2000);
  
  return () => clearInterval(pollInterval);
}, [currentTicketId, chatMessages]);
```

### Support Side (Polling)
```typescript
// Poll every 3 seconds for new tickets/messages
useEffect(() => {
  const refreshInterval = setInterval(() => {
    loadTickets(true); // Silent refresh
  }, 3000);
  
  return () => clearInterval(refreshInterval);
}, []);
```

---

## 💡 Key Features

### User Experience
- ✅ **Instant Connection** - No waiting, chat starts immediately
- ✅ **Real-time Replies** - See support messages within 2 seconds
- ✅ **Notifications** - Toast alerts for new messages
- ✅ **Auto-fill Info** - Logged-in users get info pre-filled
- ✅ **Multiple Options** - Can choose other contact methods
- ✅ **Message History** - See entire conversation
- ✅ **Online Indicator** - Green dot shows support is available

### Support Team Experience
- ✅ **Unified Dashboard** - All chats in one place
- ✅ **Auto-refresh** - New messages appear automatically
- ✅ **Smart Filters** - Filter by status, priority, category
- ✅ **Quick Actions** - Assign, Reply, Resolve with one click
- ✅ **Customer Context** - See email, phone, ticket history
- ✅ **Statistics** - Real-time ticket counts
- ✅ **Search** - Find tickets quickly
- ✅ **Notifications** - Alerts for new customer messages

---

## 🔄 Message Flow Example

### Complete Conversation Flow

```
1. User clicks Live Chat button
   ↓
2. User fills contact form and clicks "Start Chat"
   ↓
3. System creates Support Ticket:
   {
     _id: "TICK-123",
     customerName: "John Doe",
     messages: [
       {
         sender: "customer",
         message: "User has started a live chat session",
         timestamp: "10:30:00"
       }
     ]
   }
   ↓
4. User sends first message: "I need help with my property listing"
   ↓
5. Message added to ticket:
   messages: [
     { sender: "customer", message: "User has started..." },
     { sender: "customer", message: "I need help with..." }
   ]
   ↓
6. Support Dashboard shows ticket (refreshes every 3s)
   ↓
7. Support employee clicks "Assign to Me"
   ↓
8. Ticket status: "In Progress"
   ↓
9. Support employee types: "Hello! How can I help you?"
   ↓
10. Message added to ticket:
    messages: [
      { sender: "customer", message: "User has started..." },
      { sender: "customer", message: "I need help with..." },
      { sender: "support", message: "Hello! How can I help you?" }
    ]
    ↓
11. User's live chat polls (every 2s) and sees new message
    ↓
12. Toast notification: "Support Agent: New message received!"
    ↓
13. Conversation continues...
    ↓
14. Support employee clicks "Resolve" when done
    ↓
15. Ticket status: "Resolved"
```

---

## 🎨 UI Components

### Live Chat Widget (User)
```
┌────────────────────────────────────┐
│  How can we help?              ✕   │
│  Choose your preferred contact     │
├────────────────────────────────────┤
│  💬 Live Chat                      │
│     Chat with our support team     │
│                                    │
│  📘 Facebook Messenger             │
│     Chat via Facebook              │
│                                    │
│  📸 Instagram Chat                 │
│     Message us on Instagram        │
│                                    │
│  🔗 LinkedIn                       │
│     Connect on LinkedIn            │
│                                    │
│  📧 Email Support                  │
│     support@houserentbd.com        │
└────────────────────────────────────┘
```

### Live Chat Interface
```
┌────────────────────────────────────┐
│  ← Live Support               🟢   │
│     We typically reply instantly   │
├────────────────────────────────────┤
│                                    │
│  John Doe                          │
│  ┌──────────────────────┐         │
│  │ I need help with my  │         │
│  │ property listing     │         │
│  └──────────────────────┘         │
│                                    │
│                Support Agent       │
│         ┌──────────────────────┐  │
│         │ Hello! How can I     │  │
│         │ help you?            │  │
│         └──────────────────────┘  │
│                                    │
├────────────────────────────────────┤
│  Type your message...        [📤]  │
└────────────────────────────────────┘
```

### Support Dashboard
```
┌──────────────────────────────────────────────────────────────┐
│  Live Chat Support  👤 Support Agent Name      [🔄 Refresh]   │
│                                                                │
│  🔍 Search tickets...                                          │
│  [All Status ▼] [All Priority ▼] [All Category ▼]            │
├──────────────────────────────────────────────────────────────┤
│  📋 Ticket List              │  💬 Chat Area                  │
│  ┌──────────────────────┐   │  ┌───────────────────────┐    │
│  │ TICK-001     [High]  │   │  │  👤 John Doe          │    │
│  │ Property listing help│   │  │  📞 01712345678       │    │
│  │ John Doe            │   │  │                       │    │
│  │ 5m ago • 3 messages │   │  │  Customer: Hello...    │    │
│  └──────────────────────┘   │  │  Support: How can I..│    │
│                             │  │                       │    │
│  ┌──────────────────────┐   │  │  [Type message...]  📤│    │
│  │ TICK-002   [Medium]  │   │  └───────────────────────┘    │
│  │ Payment question     │   │                               │
│  └──────────────────────┘   │                               │
├──────────────────────────────┴───────────────────────────────┤
│  📊 Stats: 5 Open | 3 In Progress | 12 Resolved              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Setup Instructions

### For Users (No Setup Required)
1. Click the blue floating chat button (bottom-right)
2. Click "Live Chat"
3. Enter your contact information
4. Click "Start Chat"
5. Send your message
6. Wait for support response (usually < 1 minute)

### For Support Employees

#### Step 1: Create Support Employee Account (Admin)
```bash
# In Admin Panel
1. Go to /admin/livechat/employees
2. Click "Create Employee"
3. Fill in employee details:
   - Name
   - Email
   - Phone
   - Department
4. Click "Create"
5. Save the generated employeeId and password
```

#### Step 2: Login to Support Dashboard
```bash
# Support employee uses
1. Go to /support/live-chat-reply
2. Enter employeeId (e.g., SUPPORT001)
3. Enter password
4. Click "Login"
```

#### Step 3: Reply to Chats
```bash
1. See all tickets in left sidebar
2. Click a ticket to open
3. Click "Assign to Me" if unassigned
4. Type your reply in the message box
5. Click "Send" or press Enter
6. User receives message in their live chat
7. Click "Resolve" when finished
```

---

## ⚙️ Configuration

### Polling Intervals

```typescript
// User side (LiveSupport.tsx)
const USER_POLL_INTERVAL = 2000; // 2 seconds

// Support side (LiveChatReplyDashboard.tsx)
const SUPPORT_POLL_INTERVAL = 3000; // 3 seconds
```

### Auto-fill User Info

```typescript
// Automatically fills contact info for logged-in users
useEffect(() => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    setCustomerName(userData.fullName);
    setCustomerEmail(userData.email);
    setCustomerPhone(userData.phone);
  }
}, []);
```

---

## 🐛 Troubleshooting

### User Can't Send Messages
**Problem:** Message not sending
**Solution:**
- Check internet connection
- Ensure ticket was created (chat started)
- Check browser console for errors
- Try refreshing the page

### Support Not Seeing Tickets
**Problem:** No tickets appearing in dashboard
**Solution:**
- Check if employee is logged in
- Verify API connection to backend
- Check backend server is running
- Look at browser console for errors

### Messages Not Updating
**Problem:** Real-time updates not working
**Solution:**
- Polling should happen automatically
- Check internet connection
- Verify polling interval is running
- Force refresh with the refresh button

### Duplicate Messages
**Problem:** Same message appearing twice
**Solution:**
- Clear browser cache
- Logout and login again
- Check message timestamps (might be different messages)

---

## 📊 Performance Optimization

### Efficient Polling
```typescript
// Only update if message count changed
if (response.ticket.messages.length !== chatMessages.length) {
  setChatMessages(response.ticket.messages);
}
```

### Silent Refresh
```typescript
// Don't show loading spinner on auto-refresh
const loadTickets = async (silent = false) => {
  if (!silent) setLoading(true);
  // ... fetch tickets
  if (!silent) setLoading(false);
};
```

---

## 🔮 Future Enhancements (Planned)

### Real-time WebSocket Integration
```typescript
// Replace polling with WebSocket for instant updates
const ws = new WebSocket('wss://api.houserentbd.com/live-chat');

ws.onmessage = (event) => {
  const newMessage = JSON.parse(event.data);
  setChatMessages([...chatMessages, newMessage]);
};
```

### Typing Indicators
```
Support Agent is typing...
```

### Read Receipts
```
✓✓ Message delivered
```

### File Attachments
```
📎 Attach screenshot or document
```

### Audio/Video Call
```
📞 Upgrade to voice call
📹 Start video chat
```

---

## ✅ System Status

| Feature | Status | Notes |
|---------|--------|-------|
| Live Chat Widget | ✅ Working | Floating button on all pages |
| Ticket Creation | ✅ Working | Creates support ticket on chat start |
| Send Messages | ✅ Working | User can send messages |
| Receive Replies | ✅ Working | Real-time polling (2s) |
| Support Dashboard | ✅ Working | View all tickets |
| Auto-refresh | ✅ Working | Updates every 3 seconds |
| Assign Tickets | ✅ Working | Support can assign to self |
| Reply to Chats | ✅ Working | Support can send messages |
| Resolve Tickets | ✅ Working | Mark tickets as resolved |
| Notifications | ✅ Working | Toast alerts for new messages |
| Filters | ✅ Working | Status, priority, category |
| Search | ✅ Working | Search by name, ticket number |

---

## 📞 Support

**For Development Issues:**
- Check backend API logs
- Verify MongoDB connection
- Test API endpoints manually
- Review browser console errors

**For User Issues:**
- Guide users to refresh page
- Check if backend is running
- Verify user account exists
- Test with demo mode

---

**Last Updated:** March 24, 2026
**Status:** ✅ Fully Operational
**Integration:** Complete
