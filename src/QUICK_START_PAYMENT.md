# 🚀 Quick Start Guide - Payment System

## In 5 Minutes, Get Your Payment System Running!

---

## Step 1: Seed Subscription Plans (1 minute)

Open terminal and run:

```bash
cd server
node scripts/seedPlans.js
```

✅ This creates 4 subscription plans in your MongoDB database.

---

## Step 2: Update Payment Numbers (2 minutes)

Open `/components/payment/PaymentGateway.tsx` and update lines 23-25:

```typescript
{
  id: 'bkash',
  name: 'bKash',
  number: '01812-345678', // 👈 Replace with YOUR bKash number
},
{
  id: 'nagad',
  name: 'Nagad',
  number: '01912-345678', // 👈 Replace with YOUR Nagad number
},
{
  id: 'rocket',
  name: 'Rocket',
  number: '01712-345678', // 👈 Replace with YOUR Rocket number
},
```

---

## Step 3: Start Your Servers (1 minute)

### Terminal 1 - Backend
```bash
cd server
npm run dev
```

Wait for: `✅ MongoDB Connected Successfully`

### Terminal 2 - Frontend
```bash
npm run dev
```

Wait for: `Local: http://localhost:5173`

---

## Step 4: Test It! (1 minute)

### Test Registration
1. Go to: `http://localhost:5173/signup`
2. Fill the form:
   - Name: Your Name
   - Phone: 01812345678
   - Role: Tenant
3. Click "Send OTP"
4. Enter OTP: `123456`
5. Set password
6. Done! ✅

### Test Payment
1. Go to: `http://localhost:5173/pricing`
2. Click "Subscribe Now" on any plan
3. Login with your new account
4. Select "bKash" payment
5. Enter:
   - Phone: 01812345678
   - Transaction ID: TEST123
6. Click "Confirm Payment"
7. Done! ✅

---

## Step 5: Verify in Admin Panel

1. Go to: `http://localhost:5173/admin-login`
2. Login with admin credentials:
   - Phone: (your admin phone from MongoDB)
   - Password: (your admin password)
3. Go to: Admin Panel → Payments
4. See your pending subscription!

---

## 🎉 That's It!

Your complete payment system is now running with:
- ✅ bKash payments
- ✅ Nagad payments
- ✅ Rocket payments
- ✅ Subscription management
- ✅ Admin verification

---

## 📱 Test on Mobile

1. Open: `http://YOUR_LOCAL_IP:5173/pricing`
2. Everything works on mobile too!

---

## 🐛 Troubleshooting

**Plans not showing?**
```bash
cd server
node scripts/seedPlans.js
```

**Backend not connecting?**
```bash
# Check MongoDB is running
mongosh
# Should connect without error
```

**Frontend error?**
```bash
# Check backend is running on port 5000
curl http://localhost:5000/api/health
```

---

## 📚 Full Documentation

For complete details, see:
- `/PAYMENT_SYSTEM_DOCS.md` - Complete payment docs
- `/COMPLETE_FIX_SUMMARY_2026.md` - Full fix summary

---

## 🎯 Next Steps

1. ✅ **Test with real payment accounts**
   - Sign up for bKash merchant
   - Sign up for Nagad merchant
   - Sign up for Rocket merchant

2. ✅ **Deploy to production**
   - Set up MongoDB Atlas
   - Deploy backend to Heroku/DigitalOcean
   - Deploy frontend to Vercel/Netlify

3. ✅ **Go live!**
   - Update payment numbers to real ones
   - Enable HTTPS
   - Start accepting real payments

---

**Need Help?**
- Check console for errors
- Review `/PAYMENT_SYSTEM_DOCS.md`
- All features documented in `/COMPLETE_FIX_SUMMARY_2026.md`

---

✨ **Enjoy your new payment system!** ✨
