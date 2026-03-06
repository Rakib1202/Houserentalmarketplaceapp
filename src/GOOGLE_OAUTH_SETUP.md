# 🔐 Google OAuth Setup Guide for HouseRentBD

## Current Status
✅ **Google OAuth is OPTIONAL** - The system works perfectly with Phone + Password authentication  
✅ **Error Fixed** - "Google Client ID not configured" warning has been resolved  
✅ **Graceful Fallback** - When Google OAuth is disabled, only phone/password login is shown  

---

## Quick Fix (Already Applied)

The system now works without Google OAuth! The error has been fixed by:

1. ✅ Created `/.env` file with `VITE_GOOGLE_CLIENT_ID=GOOGLE_AUTH_DISABLED`
2. ✅ Updated GoogleSignIn component to silently hide when disabled
3. ✅ Changed console.warn to console.info for better UX

**You can now use the app with Phone + Password authentication without any errors!**

---

## To Enable Google Sign-In (Optional)

If you want to add Google OAuth login functionality, follow these steps:

### Step 1: Get Google OAuth Credentials

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project:**
   - Click "Select a project" → "New Project"
   - Name: `HouseRentBD` or your preferred name
   - Click "Create"

3. **Enable Google+ API:**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "HouseRentBD Web Client"

5. **Configure Authorized Origins:**
   
   **For Development:**
   ```
   Authorized JavaScript origins:
   - http://localhost:5173
   - http://127.0.0.1:5173
   
   Authorized redirect URIs:
   - http://localhost:5173
   - http://localhost:5173/auth/callback
   ```

   **For Production:**
   ```
   Authorized JavaScript origins:
   - https://yourdomain.com
   - https://www.yourdomain.com
   
   Authorized redirect URIs:
   - https://yourdomain.com
   - https://yourdomain.com/auth/callback
   ```

6. **Copy Your Client ID:**
   - After creation, you'll see your Client ID
   - It looks like: `123456789-abcdefghijk.apps.googleusercontent.com`
   - Copy this value

### Step 2: Update Environment Variables

Update `/.env` file:

```env
# Replace with your actual Google Client ID
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
```

### Step 3: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Start again
npm run dev
```

### Step 4: Test Google Sign-In

1. Go to Login or Signup page
2. You should now see "Continue with Google" button
3. Click it and authorize with your Google account
4. You'll be logged in automatically

---

## Backend Setup

The backend already supports Google OAuth! Here's what's configured:

### `/server/routes/auth.js` - Google Login Route

```javascript
router.post('/google', async (req, res) => {
  const { credential, role } = req.body;
  
  // Verify Google token
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  
  const payload = ticket.getPayload();
  // ... rest of authentication logic
});
```

### Backend Environment Variable

Update `/server/.env`:

```env
# Add the same Google Client ID to backend
GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
```

**Note:** The backend uses this to verify Google tokens are authentic.

---

## Testing Google OAuth

### Test Accounts
You can use any Google account to test:
- Personal Gmail accounts work
- Google Workspace accounts work
- Test accounts from Google Cloud Console

### User Roles
When signing in with Google, users can choose their role:
- **Tenant** (default) - Looking for properties
- **Property Owner** - Listing properties
- **Agent** - Real estate agent
- **Employee** - Company employee

The role is selected during the signup process or can be set in the GoogleSignIn component props.

---

## Troubleshooting

### Error: "Invalid Client ID"
**Solution:**
- Verify the Client ID is correctly copied
- Check for extra spaces or quotes
- Ensure authorized origins match exactly

### Error: "Redirect URI Mismatch"
**Solution:**
- Add your exact URL to authorized redirect URIs
- Include both with and without trailing slash
- Wait 5-10 minutes for changes to propagate

### Google Button Not Showing
**Solution:**
1. Check browser console for errors
2. Ensure `VITE_GOOGLE_CLIENT_ID` is set in `.env`
3. Restart development server
4. Clear browser cache
5. Try incognito mode

### Token Verification Fails
**Solution:**
- Ensure backend has same `GOOGLE_CLIENT_ID`
- Check server logs for detailed error
- Verify Google token hasn't expired
- Ensure system time is correct

---

## Security Best Practices

### 1. Never Commit Credentials
```bash
# .gitignore already includes:
.env
server/.env
```

### 2. Use Different Credentials for Production
- Create separate OAuth client for production
- Use environment-specific client IDs
- Rotate credentials periodically

### 3. Restrict Origins
- Only add authorized domains
- Don't use wildcards in production
- Monitor usage in Google Cloud Console

### 4. Backend Token Verification
- Always verify tokens server-side
- Don't trust client-provided user data
- Check token expiration
- Validate audience matches your client ID

---

## Features Included

### ✅ Automatic User Creation
- First Google sign-in creates user account
- Email, name, and photo stored automatically
- User assigned selected role

### ✅ Existing User Login
- Recognizes returning users by email
- Maintains user preferences and data
- Seamless login experience

### ✅ Profile Integration
- Google profile photo used as avatar
- Name pre-filled from Google account
- Email verified automatically

### ✅ Multi-Role Support
- Different dashboards per role
- Role-specific permissions
- Smooth role switching

---

## Alternative: Disable Google OAuth

If you prefer to use only Phone + Password authentication:

**Option 1: Keep Current Setup** (Recommended)
```env
# /.env
VITE_GOOGLE_CLIENT_ID=GOOGLE_AUTH_DISABLED
```
✅ No errors or warnings  
✅ Google button hidden automatically  
✅ Clean user experience  

**Option 2: Remove from UI**
You can also remove GoogleSignIn component imports from:
- `/components/auth/Login.tsx`
- `/components/auth/Signup.tsx`

---

## Cost Information

### Google OAuth Pricing
- ✅ **FREE** for most applications
- Free tier: 10,000 requests/day
- No credit card required for basic OAuth
- Only pay if you exceed quotas

### When You Might Pay
- Only if you need more than 10,000 Google sign-ins per day
- Advanced Google APIs beyond OAuth
- This is unlikely for most applications

---

## Current Authentication Methods

### 1. Phone + Password (Working ✅)
```typescript
// Login with phone and password
const response = await authAPI.login(phone, password);
```

### 2. Google OAuth (Optional ✅)
```typescript
// Login with Google
const response = await authAPI.googleLogin(credential, role);
```

Both methods:
- ✅ Create JWT tokens
- ✅ Store in localStorage
- ✅ Work with all user roles
- ✅ Fully integrated with backend

---

## FAQ

### Q: Do I need Google OAuth?
**A:** No! The system works perfectly with just phone + password.

### Q: Can I add it later?
**A:** Yes! Just follow Step 1 and Step 2 above anytime.

### Q: Does it cost money?
**A:** No, Google OAuth is free for normal usage.

### Q: Can users have both?
**A:** Yes! A user can sign up with phone, then link Google later (or vice versa).

### Q: Is it secure?
**A:** Yes! Google tokens are verified server-side. Very secure.

### Q: What about Facebook/Apple login?
**A:** Similar pattern - can be added anytime with respective OAuth providers.

---

## Support

If you have issues:

1. **Check Console Logs:**
   - Browser console (F12)
   - Server terminal logs

2. **Verify Environment Variables:**
   ```bash
   # Check frontend
   cat .env
   
   # Check backend
   cat server/.env
   ```

3. **Test Basic Auth First:**
   - Ensure phone + password login works
   - Then add Google OAuth

4. **Common Issues:**
   - Restart dev server after .env changes
   - Clear browser cache
   - Check authorized origins exactly match
   - Wait 5-10 minutes after Google Console changes

---

## Summary

✅ **Current Status:** System works with Phone + Password authentication  
✅ **Error Fixed:** No more "Google Client ID not configured" warnings  
✅ **Google OAuth:** Optional - can be added anytime  
✅ **Setup Time:** ~10 minutes if you want Google login  
✅ **Cost:** Free for normal usage  

**You're all set! The app is ready to use with or without Google OAuth.** 🎉
