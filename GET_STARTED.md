# 🚀 Get Started with PluginVerse

Welcome! Your PluginVerse marketplace is ready to launch. Follow these simple steps.

## ⚡ Super Quick Start (Choose One)

### Option A: Complete Setup Script (Easiest - 3 minutes)

1. **Run the complete SQL script:**
   - Open Supabase Dashboard → SQL Editor
   - Copy and paste **entire** `supabase/COMPLETE_SETUP.sql`
   - Click "Run"
   - ✅ This creates all tables, policies, and functions!

2. **Create storage buckets:**
   - Go to Storage → Create these 3 buckets:
     - `plugins` (Private)
     - `logos` (Public) 
     - `receipts` (Private)

3. **Create admin user:**
   - Go to Authentication → Users → Add user
   - Email: `admin@gmail.com`
   - Password: `admin@786`
   - Then in SQL Editor run:
     ```sql
     SELECT public.set_user_as_admin('admin@gmail.com');
     ```

4. **Start the app:**
   ```bash
   npm run dev
   ```

### Option B: Step-by-Step Setup (5 minutes)

Follow **QUICKSTART.md** for detailed step-by-step instructions.

## 🎯 First Login

1. Open http://localhost:3000
2. Click "Login"
3. Use: `admin@gmail.com` / `admin@786`
4. Click "Admin Panel" in navbar

## ✨ Add Your First Plugin

1. Go to Admin Panel → Plugins
2. Click "Add New Plugin"
3. Fill in:
   - Title: "My First Plugin"
   - Description: "An awesome plugin"
   - Price: 100 coins
   - Logo: Upload an image
   - File: Upload a .zip file
4. Click "Create Plugin"
5. View it on the homepage!

## 📚 Documentation

- **QUICKSTART.md** - 5-minute quick start
- **SETUP_CHECKLIST.md** - Detailed checklist
- **README.md** - Complete documentation
- **DEPLOYMENT.md** - Deploy to production
- **PROJECT_SUMMARY.md** - What's been built

## 🆘 Need Help?

**Can't login?**
- Check `.env.local` has correct Supabase keys
- Verify database migrations ran

**Can't access admin panel?**
- Run: `SELECT public.set_user_as_admin('admin@gmail.com');`

**File upload fails?**
- Create storage buckets in Supabase
- Check bucket names: `plugins`, `logos`, `receipts`

**More help:** See SETUP_CHECKLIST.md troubleshooting section

## 🎉 You're Ready!

Your marketplace is running at http://localhost:3000

**What's Next?**
- Add more plugins
- Test the purchase flow
- Customize the design
- Deploy to production

Happy building! 🚀
