# MongoDB Atlas Setup Guide for HouseRentBD

## 🎯 Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (or sign in if you have one)
3. Create a new organization (if needed)

## 🗄️ Step 2: Create a New Cluster

1. Click "Build a Database" or "Create" button
2. Choose **FREE** tier (M0 Sandbox)
3. Select your preferred cloud provider:
   - **AWS** (recommended)
   - Google Cloud
   - Azure
4. Choose the region closest to you (or your users)
5. Name your cluster (e.g., "HouseRentBD")
6. Click "Create Cluster"

⏱️ **Wait 3-5 minutes** for the cluster to be created.

## 🔐 Step 3: Create Database User

1. Go to "Database Access" (left sidebar under SECURITY)
2. Click "Add New Database User"
3. Authentication Method: **Password**
4. Username: `houserentbd_admin` (or your choice)
5. Password: **Generate a strong password** (or create your own)
   - ⚠️ **SAVE THIS PASSWORD** - you'll need it later!
6. Database User Privileges: **Atlas admin** (or "Read and write to any database")
7. Click "Add User"

## 🌐 Step 4: Configure Network Access

1. Go to "Network Access" (left sidebar under SECURITY)
2. Click "Add IP Address"
3. For development, choose one option:
   - **Option A (Recommended for Development):** Click "Allow Access from Anywhere"
     - This adds IP: `0.0.0.0/0`
   - **Option B (More Secure):** Click "Add Current IP Address"
     - Only your current IP can access the database
4. Click "Confirm"

⏱️ **Wait 1-2 minutes** for the IP whitelist to be updated.

## 🔗 Step 5: Get Your Connection String

1. Go to "Database" (left sidebar)
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. **Driver:** Node.js
5. **Version:** 4.1 or later
6. Copy the connection string - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## ✏️ Step 6: Update Your Connection String

1. Replace `<username>` with your database username (from Step 3)
2. Replace `<password>` with your database password (from Step 3)
3. Add the database name after `.net/` - it should be: `houserentbd`

**Final connection string should look like:**
```
mongodb+srv://houserentbd_admin:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/houserentbd?retryWrites=true&w=majority
```

## 🔧 Step 7: Configure Backend Server

1. Open `/server/.env` file
2. Update the `MONGODB_URI` with your connection string:

```env
MONGODB_URI=mongodb+srv://houserentbd_admin:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/houserentbd?retryWrites=true&w=majority
```

3. Save the file

## 🧪 Step 8: Test Connection

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Look for this message:
   ```
   ✅ MongoDB Connected Successfully
   🚀 Server running on port 5000
   ```

## ✅ Step 9: Create Admin User

After the server is running, create an admin user:

```bash
cd server
node scripts/createAdmin.js
```

This will create an admin account with:
- **Phone:** 01700000000
- **Password:** admin123
- **Role:** admin

You can now login to the admin panel!

## 🎉 Step 10: Start the Full Application

Now that MongoDB is connected, start the complete application:

1. **Terminal 1** - Start Backend:
   ```bash
   cd server
   npm start
   ```

2. **Terminal 2** - Start Frontend:
   ```bash
   npm run dev
   ```

3. Open browser at: `http://localhost:5173`

## 🔧 Troubleshooting

### Connection Timeout
- Check if your IP is whitelisted in Network Access
- Verify firewall/antivirus isn't blocking MongoDB

### Authentication Failed
- Double-check username and password in connection string
- Ensure no special characters in password need URL encoding
- Common URL encoding:
  - `@` → `%40`
  - `#` → `%23`
  - `/` → `%2F`

### Can't Connect
- Verify cluster is running (green status)
- Check internet connection
- Try using `0.0.0.0/0` for IP access temporarily

### "Failed to fetch" errors in frontend
- Ensure backend server is running on port 5000
- Check `VITE_API_URL` in frontend `.env` file
- Verify CORS settings in `server/server.js`

## 📊 Database Structure

The application will automatically create these collections:
- `users` - All user accounts
- `properties` - Property listings
- `subscriptions` - User subscriptions
- `photouploads` - Employee photo uploads
- `employeeearnings` - Employee earnings tracking
- `supportemployees` - Support team members
- `supporttickets` - Customer support tickets
- `jobs` - Job postings
- `inquiries` - Contact form submissions
- `favorites` - User favorite properties

## 🔒 Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong passwords** for database users
3. **Rotate credentials** periodically
4. **Limit IP access** in production
5. **Enable database encryption** (available in paid tiers)
6. **Set up automated backups** (Database > Backup)

## 💡 Tips

- MongoDB Atlas free tier includes:
  - 512 MB storage
  - Shared RAM
  - No backups (manual export recommended)
  
- For production, consider upgrading to:
  - M2 or M5 cluster
  - Automated backups
  - More storage and RAM
  
- Monitor your usage in the Atlas dashboard
- Set up alerts for database metrics

## 📞 Support

If you encounter issues:
1. Check MongoDB Atlas documentation
2. Review server logs for specific errors
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed

---

**You're all set! 🎉**

Your HouseRentBD application is now connected to MongoDB Atlas and ready to use!
