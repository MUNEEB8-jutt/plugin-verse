# PluginVerse Quick Start Guide

Get PluginVerse running in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies (30 seconds)

```bash
cd pluginverse
npm install
```

### 2. Environment is Already Configured ✅

Your `.env.local` file is already set up with:
- Supabase URL: `https://tazgwygxqtczolvetyvh.supabase.co`
- Anon Key: Configured
- Service Role Key: Configured

### 3. Set Up Supabase Database (2 minutes)

**Run these SQL scripts in Supabase Dashboard → SQL Editor:**

1. Copy and run `supabase/migrations/001_initial_schema.sql`
2. Copy and run `supabase/migrations/002_rls_policies.sql`
3. Copy and run `supabase/migrations/003_create_admin.sql`

### 4. Create Storage Buckets (1 minute)

**In Supabase Dashboard → Storage:**

1. Create bucket `plugins` (Private)
2. Create bucket `logos` (Public)
3. Create bucket `receipts` (Private)

**Then run storage policies in SQL Editor:**
- Copy and run the SQL from `supabase/STORAGE_SETUP.md`

### 5. Create Admin User (1 minute)

**In Supabase Dashboard → Authentication → Users:**

1. Click "Add user" → "Create new user"
2. Email: `admin@gmail.com`
3. Password: `admin@786`
4. Click "Create user"

**Then in SQL Editor, run:**
```sql
SELECT public.set_user_as_admin('admin@gmail.com');
```

### 6. Start the App (30 seconds)

```bash
npm run dev
```

Open http://localhost:3000

## 🎯 First Steps

### Test as Admin

1. Go to http://localhost:3000/login
2. Login with `admin@gmail.com` / `admin@786`
3. Click "Admin Panel" in navbar
4. Go to "Plugins" and add your first plugin

### Test as User

1. Logout
2. Go to http://localhost:3000/signup
3. Create a test account
4. Request a deposit at /deposit
5. Login as admin and approve the deposit
6. Login as user and purchase a plugin

## 📚 Full Documentation

- **README.md** - Complete feature documentation
- **SETUP_CHECKLIST.md** - Detailed setup checklist
- **DEPLOYMENT.md** - Production deployment guide
- **supabase/STORAGE_SETUP.md** - Storage bucket configuration

## 🆘 Quick Troubleshooting

**Can't login?**
- Check Supabase URL and keys in `.env.local`
- Verify database migrations ran successfully

**Can't access admin panel?**
- Run: `SELECT public.set_user_as_admin('admin@gmail.com');`
- Verify user metadata has `role: 'admin'`

**File upload fails?**
- Create storage buckets in Supabase
- Apply RLS policies from STORAGE_SETUP.md

**Images not loading?**
- Check `next.config.ts` has Supabase domain
- Verify `logos` bucket is public

## ✨ You're Ready!

Your PluginVerse marketplace is now running. Start adding plugins and inviting users!

**Admin Panel:** http://localhost:3000/admin  
**Marketplace:** http://localhost:3000  
**User Dashboard:** http://localhost:3000/account
