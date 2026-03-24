# 💳 HouseRentBD Payment System Documentation

## Overview
Complete payment integration with bKash, Nagad, Rocket, and SSLCommerz for subscription management.

---

## 🎯 Features

### Payment Methods
1. **bKash** - Most popular mobile wallet in Bangladesh
2. **Nagad** - Government-backed mobile financial service
3. **Rocket** - Dutch-Bangla Bank's mobile banking
4. **Credit/Debit Card** - Via SSLCommerz gateway (Coming soon)

### Payment Flow
1. User selects a subscription plan
2. Choose payment method (bKash/Nagad/Rocket/Card)
3. Follow payment instructions
4. Submit transaction details
5. Admin verifies payment
6. Subscription activated

---

## 📁 File Structure

```
/components/payment/
├── PaymentGateway.tsx          # Main payment modal component

/components/pages/
├── SubscriptionPlansPage.tsx   # Subscription plans showcase

/server/models/
├── Subscription.js             # Subscription & plan model

/server/routes/
├── subscriptions.js            # Subscription API endpoints

/server/scripts/
├── seedPlans.js               # Seed default subscription plans
```

---

## 🚀 Setup Instructions

### 1. Seed Subscription Plans

Run this command to create default subscription plans in your database:

```bash
cd server
node scripts/seedPlans.js
```

This creates 4 plans:
- **Basic Monthly** - ৳499 (30 days)
- **Premium Monthly** - ৳999 (30 days) ⭐ Most Popular
- **Premium Quarterly** - ৳2,499 (90 days) - Save 17%
- **Premium Annual** - ৳8,999 (365 days) - Save 25%

### 2. Configure Payment Gateway Numbers

Update the merchant numbers in `/components/payment/PaymentGateway.tsx`:

```typescript
const paymentMethods = [
  {
    id: 'bkash',
    name: 'bKash',
    number: '01812-345678', // 👈 Replace with your bKash merchant number
  },
  {
    id: 'nagad',
    name: 'Nagad',
    number: '01912-345678', // 👈 Replace with your Nagad merchant number
  },
  {
    id: 'rocket',
    name: 'Rocket',
    number: '01712-345678', // 👈 Replace with your Rocket merchant number
  },
];
```

### 3. (Optional) SSLCommerz Integration

For credit/debit card payments, set up SSLCommerz:

1. Sign up at https://sslcommerz.com/
2. Get Store ID and Store Password
3. Add to `/server/.env`:
```env
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_IS_LIVE=false # Set to true for production
```

---

## 🎨 User Interface

### Pricing Page
**URL:** `/pricing` or `/subscribe`

Beautiful subscription plans page featuring:
- 4 premium plan cards
- Popular plan highlighting
- Feature comparison
- Call-to-action buttons
- Benefits showcase
- Money-back guarantee

### Payment Modal
**Component:** `<PaymentGateway />`

Features:
- Payment method selection with icons
- Step-by-step payment instructions
- Transaction ID input
- Real-time validation
- Success/Error states
- Beautiful animations

---

## 🔄 Payment Workflow

### For Users

1. **Browse Plans**
   - Visit `/pricing`
   - Compare features
   - Select desired plan

2. **Choose Payment Method**
   - Click "Subscribe Now"
   - Select bKash/Nagad/Rocket
   - Follow on-screen instructions

3. **Complete Payment**
   - Open mobile banking app
   - Send money to provided number
   - Note the transaction ID
   - Enter details in modal

4. **Wait for Activation**
   - Payment status: "Pending"
   - Admin verifies within 2-4 hours
   - Subscription activates automatically

### For Admins

1. **View Payment Requests**
   - Go to Admin Panel → Payments
   - See pending subscriptions
   - Check transaction details

2. **Verify Payment**
   - Check mobile wallet for payment
   - Match transaction ID
   - Update subscription status to "Active"

3. **Manage Plans**
   - Admin Panel → Subscriptions
   - Create/Edit/Deactivate plans
   - Set pricing and features

---

## 📊 Database Schema

### Subscription Model

```javascript
{
  // Plan Template Fields (when isPlan=true, userId=null)
  isPlan: Boolean,           // true = plan template, false = user subscription
  name: String,              // "Premium Monthly"
  price: Number,             // 999
  duration: Number,          // 30 (days)
  features: [String],        // ["Feature 1", "Feature 2"]
  active: Boolean,           // Available for purchase?
  
  // User Subscription Fields (when userId exists)
  userId: ObjectId,          // Reference to User
  planName: String,          // Name of subscribed plan
  startDate: Date,           // Subscription start
  endDate: Date,             // Subscription end
  status: String,            // active, pending, expired, cancelled
  amount: Number,            // Amount paid
  paymentMethod: String,     // BKASH, NAGAD, ROCKET
  transactionId: String,     // Transaction ID from payment
  phoneNumber: String,       // Phone used for payment
  autoRenew: Boolean,        // Auto-renewal flag
  
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔗 API Endpoints

### Get Subscription Plans
```http
GET /api/subscriptions?plansOnly=true
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "subscriptions": [
    {
      "_id": "...",
      "name": "Premium Monthly",
      "price": 999,
      "duration": 30,
      "features": ["..."],
      "active": true,
      "isPlan": true
    }
  ]
}
```

### Create User Subscription
```http
POST /api/subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "planName": "Premium Monthly",
  "amount": 999,
  "duration": 30,
  "startDate": "2026-03-24",
  "endDate": "2026-04-24",
  "paymentMethod": "BKASH",
  "transactionId": "9BH5G7KL3M",
  "phoneNumber": "01812345678"
}
```

**Response:**
```json
{
  "success": true,
  "subscription": {
    "_id": "...",
    "userId": "...",
    "status": "pending",
    ...
  }
}
```

### Get User Subscriptions
```http
GET /api/subscriptions
Authorization: Bearer <token>
```

---

## 💡 Usage Examples

### 1. Link to Pricing Page

```tsx
import { Link } from 'react-router';
import { Button } from './ui/button';

<Link to="/pricing">
  <Button>Upgrade to Premium</Button>
</Link>
```

### 2. Show Payment Modal

```tsx
import { PaymentGateway } from './payment/PaymentGateway';
import { useState } from 'react';

function MyComponent() {
  const [showPayment, setShowPayment] = useState(false);

  return (
    <>
      <Button onClick={() => setShowPayment(true)}>
        Subscribe
      </Button>

      <PaymentGateway
        open={showPayment}
        onClose={() => setShowPayment(false)}
        planId="plan_id_here"
        planName="Premium Monthly"
        amount={999}
        duration={30}
        onSuccess={() => {
          console.log('Payment submitted!');
        }}
      />
    </>
  );
}
```

### 3. Check User Subscription Status

```tsx
const user = JSON.parse(localStorage.getItem('user') || '{}');
const isPremium = user.premium || user.subscriptionStatus === 'active';

if (isPremium) {
  // Show premium features
} else {
  // Show upgrade prompt
}
```

---

## 🎯 Premium Features

When a user has an active premium subscription:

1. **Verified Badge** - Trust indicator on all listings
2. **Featured Placement** - Top position in search results
3. **Full Contact Access** - View complete owner details
4. **Priority Support** - 24/7 fast response
5. **Unlimited Listings** - No restriction on property posts
6. **Analytics Dashboard** - Track property performance

---

## 🔐 Security Features

1. **JWT Authentication** - All payment APIs require valid token
2. **Transaction Validation** - Admin verifies each payment
3. **Secure Storage** - Sensitive data encrypted in MongoDB
4. **Input Sanitization** - Prevent injection attacks
5. **Rate Limiting** - Prevent payment spam (TODO)

---

## 🧪 Testing

### Test Payment Flow

1. Start the app: `npm run dev` (frontend) + `npm run dev` (backend)
2. Create a test user account
3. Visit `/pricing`
4. Click "Subscribe Now" on any plan
5. Enter test data:
   - Phone: 01812345678
   - Transaction ID: TEST123456
6. Check MongoDB for pending subscription
7. Login as admin
8. Verify and activate subscription

---

## 📈 Future Enhancements

1. **SSLCommerz Card Payment** - Full credit/debit card support
2. **Auto-Renewal** - Automatic subscription renewal
3. **Invoice Generation** - PDF invoices for payments
4. **Payment History** - User payment transaction history
5. **Refund System** - Handle refund requests
6. **Discount Codes** - Promo code support
7. **Payment Webhooks** - Real-time payment notifications
8. **Multiple Currency** - Support USD/EUR (for internationals)

---

## 🐛 Troubleshooting

### Plans not showing on /pricing page

**Issue:** Empty plans list

**Solution:**
```bash
cd server
node scripts/seedPlans.js
```

### Payment modal not opening

**Issue:** User not logged in

**Solution:** Redirect to `/login` first, then retry

### Subscription not activating

**Issue:** Status stuck on "pending"

**Solution:** Admin must verify and activate from Admin Panel → Payments

### "Failed to fetch" error

**Issue:** Backend not running

**Solution:**
```bash
cd server
npm run dev
```

---

## 📞 Support

For payment integration issues:
- Check browser console for errors
- Verify MongoDB connection
- Ensure all environment variables are set
- Check backend logs for API errors

---

## ✅ Checklist

Before going live:

- [ ] Update payment gateway merchant numbers
- [ ] Test all payment methods
- [ ] Set up SSLCommerz (for cards)
- [ ] Enable HTTPS for production
- [ ] Configure rate limiting
- [ ] Set up payment logging
- [ ] Create backup strategy
- [ ] Train admins on payment verification
- [ ] Write user payment guide
- [ ] Set up customer support for payments

---

**Last Updated:** March 24, 2026
**Status:** ✅ Fully Functional (Manual verification)
**Next Step:** Integrate SSLCommerz API for auto-verification
