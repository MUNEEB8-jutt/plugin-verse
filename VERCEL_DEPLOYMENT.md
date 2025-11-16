# Vercel Deployment Guide - PluginVerse

## Step 1: GitHub Repository Setup

1. **Create GitHub Repository:**
   - Go to https://github.com/new
   - Repository name: `pluginverse`
   - Make it Public or Private
   - Click "Create repository"

2. **Push Code to GitHub:**
   ```bash
   cd pluginverse
   git init
   git add .
   git commit -m "Initial commit - PluginVerse"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/pluginverse.git
   git push -u origin main
   ```

## Step 2: Vercel Deployment

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign up/Login with GitHub

2. **Import Project:**
   - Click "Add New" → "Project"
   - Select your `pluginverse` repository
   - Click "Import"

3. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)

4. **Environment Variables:**
   Click "Environment Variables" and add these:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

   **Where to find these:**
   - Go to Supabase Dashboard
   - Project Settings → API
   - Copy URL and keys

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site will be live at: `https://pluginverse-xxx.vercel.app`

## Step 3: Custom Domain (Optional - Free)

### Option A: Vercel Free Subdomain
- You get: `pluginverse-xxx.vercel.app` (FREE)
- Already done after deployment!

### Option B: Free Domain from Freenom
1. Go to https://www.freenom.com
2. Search for available domain (e.g., `pluginverse.tk`, `.ml`, `.ga`)
3. Register for FREE (12 months)
4. In Vercel:
   - Go to Project Settings → Domains
   - Add your domain
   - Copy DNS records
5. In Freenom:
   - Manage Domain → Management Tools → Nameservers
   - Add Vercel nameservers:
     - `ns1.vercel-dns.com`
     - `ns2.vercel-dns.com`

### Option C: Free Subdomain from is-a.dev
1. Fork: https://github.com/is-a-dev/register
2. Create file: `domains/pluginverse.json`
   ```json
   {
     "owner": {
       "username": "your-github-username",
       "email": "your-email@example.com"
     },
     "record": {
       "CNAME": "pluginverse-xxx.vercel.app"
     }
   }
   ```
3. Create Pull Request
4. Wait for approval (1-2 days)
5. You get: `pluginverse.is-a.dev` (FREE forever!)

## Step 4: Update Supabase URLs

After deployment, update Supabase:

1. Go to Supabase Dashboard
2. Authentication → URL Configuration
3. Add your Vercel URL:
   - Site URL: `https://pluginverse-xxx.vercel.app`
   - Redirect URLs: `https://pluginverse-xxx.vercel.app/**`

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Test signup/login
3. Test plugin upload (admin)
4. Test deposit system
5. Test plugin purchase & download

## Automatic Deployments

Every time you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push
```
Vercel will automatically deploy! 🚀

## Troubleshooting

### Build Fails?
- Check Environment Variables are set correctly
- Check all files are committed to GitHub

### Database Not Working?
- Verify Supabase environment variables
- Check Supabase URL configuration

### Images/Videos Not Loading?
- Make sure Supabase Storage buckets are PUBLIC
- Check bucket policies in Supabase

## Free Resources Used:
- ✅ Vercel Hosting (FREE)
- ✅ Supabase Database (FREE tier)
- ✅ Supabase Storage (FREE tier)
- ✅ Vercel Domain (FREE .vercel.app)
- ✅ Optional: Freenom/is-a.dev domain (FREE)

## Your Live URLs:
- Vercel: `https://pluginverse-xxx.vercel.app`
- Custom (if setup): `https://pluginverse.tk` or `https://pluginverse.is-a.dev`

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
