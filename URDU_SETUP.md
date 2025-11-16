# PluginVerse Setup Guide (Urdu)

## 🚀 Quick Setup (3 Minutes)

### Step 1: Database Tables Banayein

1. **Supabase Dashboard** kholen
2. **SQL Editor** pe jayein (left sidebar mein)
3. **"New query"** click karein
4. `pluginverse/supabase/COMPLETE_SETUP.sql` file kholen
5. **Poora SQL code** copy karein aur SQL Editor mein paste karein
6. **"Run"** button click karein
7. ✅ Done! Sare 5 tables ban jayenge automatically

### Tables Jo Ban Jayengi:

1. **users** - User profiles aur coin balance
2. **plugins** - Plugin catalog
3. **purchases** - Purchase records
4. **deposits** - Deposit requests
5. **settings** - Payment settings

---

### Step 2: Storage Buckets Banayein

1. Supabase Dashboard mein **Storage** pe jayein
2. Teen buckets banayein:

**Bucket 1: plugins**
- Name: `plugins`
- Public: **NO** (Private rakhen)
- Click "Create bucket"

**Bucket 2: logos**
- Name: `logos`
- Public: **YES** (Check karen)
- Click "Create bucket"

**Bucket 3: receipts**
- Name: `receipts`
- Public: **NO** (Private rakhen)
- Click "Create bucket"

---

### Step 3: Admin User Banayein

1. Supabase Dashboard mein **Authentication** → **Users** pe jayein
2. **"Add user"** click karein
3. **"Create new user"** select karein
4. Details bharein:
   - Email: `admin@gmail.com`
   - Password: `admin@786`
5. **"Create user"** click karein
6. Ab **SQL Editor** mein jayein aur ye run karein:

```sql
SELECT public.set_user_as_admin('admin@gmail.com');
```

✅ Done! Admin user ban gaya!

---

### Step 4: App Start Karein

```bash
npm run dev
```

---

## 🎯 Login Karein

1. Browser mein jayein: http://localhost:3000
2. **Login** click karein
3. Credentials dalein:
   - Email: `admin@gmail.com`
   - Password: `admin@786`
4. Login ho jayega!

---

## ✅ Test Karein

### Admin Panel Check Karein:
1. Login ke baad **"Admin Panel"** link navbar mein dikhega
2. Click karein
3. Aap admin dashboard dekh sakte hain

### Plugin Add Karein:
1. Admin Panel → **Plugins**
2. **"Add New Plugin"** click karein
3. Details bharein:
   - Title: "Test Plugin"
   - Description: "Ye test plugin hai"
   - Price: 100
   - Logo: Koi image upload karein
   - File: Koi .zip file upload karein
4. **"Create Plugin"** click karein
5. Homepage pe check karein - plugin dikhai dega!

---

## 🐛 Common Issues

### "Email not confirmed" error
**Solution:** Supabase Dashboard → Authentication → Providers → Email → "Confirm email" ko **uncheck** karein

### Tables nahi ban rahe
**Solution:** `COMPLETE_SETUP.sql` file poori copy karein aur SQL Editor mein run karein

### Admin panel access nahi ho raha
**Solution:** SQL Editor mein ye run karein:
```sql
SELECT public.set_user_as_admin('admin@gmail.com');
```

### Deposit page pe navbar nahi dikha
**Solution:** Ab fix ho gaya hai! Server restart karein

---

## 📚 Files

- **COMPLETE_SETUP.sql** - Ek click mein sab kuch setup
- **GET_STARTED.md** - English quick start
- **README.md** - Complete documentation

---

## 🎉 Tayar!

Aapka PluginVerse marketplace ab ready hai!

**Admin Login:**
- Email: admin@gmail.com
- Password: admin@786

**URLs:**
- Homepage: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- Add Coins: http://localhost:3000/deposit

Enjoy! 🚀
