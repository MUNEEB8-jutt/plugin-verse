# PluginVerse Setup Checklist

Follow this checklist to get PluginVerse up and running.

## ✅ Prerequisites

- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] Supabase account created
- [ ] Git installed (for deployment)

## ✅ Step 1: Install Dependencies

```bash
cd pluginverse
npm install
```

## ✅ Step 2: Configure Environment Variables

- [ ] Copy `.env.example` to `.env.local` (already done)
- [ ] Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- [ ] Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- [ ] Verify `SUPABASE_SERVICE_ROLE_KEY` is correct

## ✅ Step 3: Set Up Supabase Database

### Run Migrations

1. [ ] Go to Supabase Dashboard → SQL Editor
2. [ ] Run `supabase/migrations/001_initial_schema.sql`
3. [ ] Run `supabase/migrations/002_rls_policies.sql`
4. [ ] Run `supabase/migrations/003_create_admin.sql`

### Verify Tables Created

- [ ] `users` table exists
- [ ] `plugins` table exists
- [ ] `purchases` table exists
- [ ] `deposits` table exists
- [ ] `settings` table exists

## ✅ Step 4: Create Storage Buckets

Follow instructions in `supabase/STORAGE_SETUP.md`:

1. [ ] Create `plugins` bucket (Private)
2. [ ] Create `logos` bucket (Public)
3. [ ] Create `receipts` bucket (Private)
4. [ ] Apply RLS policies for storage

## ✅ Step 5: Create Admin User

1. [ ] Go to Supabase Dashboard → Authentication → Users
2. [ ] Click "Add user" → "Create new user"
3. [ ] Email: `admin@gmail.com`
4. [ ] Password: `admin@786`
5. [ ] Click "Create user"
6. [ ] Go to SQL Editor and run:
   ```sql
   SELECT public.set_user_as_admin('admin@gmail.com');
   ```
7. [ ] Verify admin user has `role: 'admin'` in user metadata

## ✅ Step 6: Start Development Server

```bash
npm run dev
```

- [ ] Server starts successfully
- [ ] Open http://localhost:3000
- [ ] Homepage loads without errors

## ✅ Step 7: Test Authentication

- [ ] Visit http://localhost:3000/signup
- [ ] Create a test user account
- [ ] Verify email confirmation (if enabled)
- [ ] Login with test user
- [ ] Verify redirect to /account
- [ ] Logout works

## ✅ Step 8: Test Admin Access

- [ ] Login with admin@gmail.com / admin@786
- [ ] Verify redirect to /account
- [ ] Click "Admin Panel" in navbar
- [ ] Verify access to /admin
- [ ] Check all admin pages load:
  - [ ] /admin (Dashboard)
  - [ ] /admin/plugins (Plugin Management)
  - [ ] /admin/deposits (Deposit Approval)
  - [ ] /admin/settings (Payment Settings)

## ✅ Step 9: Test Plugin Management

- [ ] Go to /admin/plugins
- [ ] Click "Add New Plugin"
- [ ] Fill in plugin details:
  - Title: "Test Plugin"
  - Description: "A test plugin"
  - Price: 100
  - Logo: Upload an image
  - File: Upload a .zip file
- [ ] Submit form
- [ ] Verify plugin appears in table
- [ ] Verify plugin appears on homepage
- [ ] Test edit functionality
- [ ] Test delete functionality (optional)

## ✅ Step 10: Test Purchase Flow

### As Regular User:

1. [ ] Logout from admin
2. [ ] Login as test user
3. [ ] Go to homepage
4. [ ] Click on test plugin
5. [ ] Try to purchase (should fail - insufficient balance)

### Request Deposit:

6. [ ] Go to /deposit
7. [ ] Fill in deposit form:
   - Amount: 500
   - Method: Easypaisa
   - Transaction ID: TEST123
   - Screenshot: Upload an image
8. [ ] Submit form
9. [ ] Verify success message

### As Admin - Approve Deposit:

10. [ ] Logout and login as admin
11. [ ] Go to /admin/deposits
12. [ ] Find pending deposit
13. [ ] Click "View" to see details
14. [ ] Click "Approve"
15. [ ] Verify status changes to "approved"

### Complete Purchase:

16. [ ] Logout and login as test user
17. [ ] Go to /account
18. [ ] Verify balance is 500 coins
19. [ ] Go to homepage
20. [ ] Purchase test plugin
21. [ ] Verify success message
22. [ ] Verify balance deducted
23. [ ] Go to /account
24. [ ] Verify plugin appears in "My Plugins"

## ✅ Step 11: Test Download

- [ ] In /account, click "Download" on purchased plugin
- [ ] Verify download starts
- [ ] Verify file downloads successfully

## ✅ Step 12: Test Payment Settings

- [ ] Login as admin
- [ ] Go to /admin/settings
- [ ] Update payment numbers:
  - Easypaisa: 03001234567
  - JazzCash: 03007654321
  - UPI: test@upi
- [ ] Click "Save Settings"
- [ ] Verify success message
- [ ] Logout and go to /deposit
- [ ] Verify updated numbers display

## ✅ Common Issues

### "User already registered" error
- User already exists, try logging in instead

### Can't access admin panel
- Verify admin user has `role: 'admin'` in metadata
- Run `set_user_as_admin` SQL function

### File upload fails
- Check storage buckets exist
- Verify RLS policies applied
- Check file size limits

### Download doesn't work
- Verify purchase record exists
- Check storage bucket permissions
- Ensure service role key is correct

### Images not loading
- Verify Supabase domain in next.config.ts
- Check storage bucket is public (for logos)

## ✅ Ready for Production

Once all tests pass:

- [ ] Review security settings
- [ ] Update payment numbers to real values
- [ ] Change admin password
- [ ] Follow DEPLOYMENT.md for Vercel deployment
- [ ] Test production deployment
- [ ] Monitor for errors

## 🎉 Setup Complete!

Your PluginVerse marketplace is ready to use!

**Next Steps:**
1. Add more plugins
2. Invite users to test
3. Gather feedback
4. Iterate and improve

**Need Help?**
- Check README.md for detailed documentation
- Review DEPLOYMENT.md for deployment guide
- Check Supabase logs for errors
- Review browser console for client errors
