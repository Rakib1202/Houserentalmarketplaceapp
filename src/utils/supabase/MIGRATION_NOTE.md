# Supabase to MongoDB Migration Complete

## ⚠️ Important Notice

This project has been fully migrated from Supabase to MongoDB with Express.js backend.

## What Changed

1. **Authentication**: Now uses JWT tokens via MongoDB backend
2. **API Calls**: All API calls should use `/utils/api.ts` instead of direct Supabase calls
3. **Storage**: Files are stored in MongoDB GridFS or as base64 data URLs
4. **No Supabase Dependencies**: The `supabase/info.ts` and `supabase/client.ts` files are deprecated

## How to Use the New API

```typescript
// Import the API
import { authAPI, propertiesAPI, usersAPI } from '../../utils/api';

// Authentication
const loginData = await authAPI.login({ phone: '01XXXXXXXXX', password: 'password' });

// Properties
const properties = await propertiesAPI.getAll({ status: 'approved' });
const property = await propertiesAPI.getById(id);
await propertiesAPI.create(propertyData);
await propertiesAPI.update(id, propertyData);

// Users
const users = await usersAPI.getAll({ role: 'tenant' });
await usersAPI.updateStatus(userId, 'active');
```

## API Modules Available

- `authAPI` - Authentication (login, signup, admin login, Google OAuth)
- `usersAPI` - User management
- `propertiesAPI` - Property CRUD
- `supportEmployeesAPI` - Support employee management
- `supportTicketsAPI` - Support ticket system
- `jobsAPI` - Job postings
- `subscriptionsAPI` - Subscription management
- `photoUploadsAPI` - Photo upload management
- `employeeEarningsAPI` - Employee earnings tracking

## Migration Checklist

If you find any files still importing from `supabase/info` or making direct Supabase calls:

1. Remove the `supabase/info` import
2. Import the appropriate API module from `/utils/api.ts`
3. Replace the fetch call with the API method
4. Update error handling to work with the new API response format
5. Test the functionality

## Need Help?

Refer to `/utils/api.ts` for the complete API documentation and available endpoints.
