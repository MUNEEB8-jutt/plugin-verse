# PluginVerse Deployment Guide

This guide walks you through deploying PluginVerse to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase project fully configured (database, storage, admin user)

## Step 1: Push Code to GitHub

1. Initialize git repository (if not already done):
```bash
cd pluginverse
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/pluginverse.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or `pluginverse` if in subdirectory)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variables (click "Environment Variables"):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tazgwygxqtczolvetyvh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

6. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
cd pluginverse
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **pluginverse**
   - Directory? **./pluginverse** (or just **./** if already in directory)
   - Override settings? **N**

5. Add environment variables:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

6. Deploy to production:
```bash
vercel --prod
```

## Step 3: Post-Deployment Verification

### 1. Test Authentication
- Visit your deployed URL
- Try signing up with a new account
- Try logging in
- Verify session persists across page refreshes

### 2. Test Admin Access
- Login with admin@gmail.com / admin@786
- Verify you can access `/admin`
- Check all admin pages load correctly

### 3. Test Plugin Management
- Upload a test plugin with logo
- Verify files upload to Supabase Storage
- Check plugin appears on homepage

### 4. Test Purchase Flow
- Login as regular user
- Request a deposit
- Login as admin and approve deposit
- Verify coins added to user balance
- Purchase a plugin
- Verify download works

## Step 4: Configure Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

## Environment Variables Reference

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret service role key | Supabase Dashboard → Settings → API |

## Troubleshooting

### Build Fails

**Error**: "Module not found"
- **Solution**: Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error**: "Environment variable not found"
- **Solution**: Double-check environment variables are set in Vercel
- Make sure variable names match exactly (case-sensitive)

### Runtime Errors

**Error**: "Failed to fetch"
- **Solution**: Check Supabase URL and keys are correct
- Verify Supabase project is not paused

**Error**: "Unauthorized" on admin routes
- **Solution**: Verify admin user has `role: 'admin'` in user metadata
- Run the `set_user_as_admin` SQL function

**Error**: "Storage bucket not found"
- **Solution**: Create storage buckets in Supabase Dashboard
- Apply RLS policies from `STORAGE_SETUP.md`

### Image Loading Issues

**Error**: Images not loading
- **Solution**: Verify Supabase domain is in `next.config.ts` `remotePatterns`
- Check storage bucket is public (for logos)

### Download Issues

**Error**: "Failed to generate download link"
- **Solution**: Verify service role key is correct
- Check plugin file exists in storage bucket

## Performance Optimization

### Enable Caching

Vercel automatically caches static assets. For API routes:

```typescript
// Add to API routes for caching
export const revalidate = 60 // Revalidate every 60 seconds
```

### Image Optimization

Next.js automatically optimizes images. Make sure to use the `Image` component:

```tsx
import Image from 'next/image'

<Image src={url} alt="..." width={500} height={300} />
```

### Database Indexing

Ensure indexes are created (already in migration files):
- `idx_purchases_user_id`
- `idx_purchases_plugin_id`
- `idx_deposits_user_id`
- `idx_deposits_status`

## Monitoring

### Vercel Analytics

1. Go to your project in Vercel Dashboard
2. Click "Analytics" tab
3. View page views, performance metrics, and errors

### Supabase Logs

1. Go to Supabase Dashboard
2. Click "Logs" in sidebar
3. View API logs, database logs, and storage logs

### Error Tracking

Consider adding error tracking:
- [Sentry](https://sentry.io)
- [LogRocket](https://logrocket.com)
- [Datadog](https://www.datadoghq.com)

## Scaling Considerations

### Database

- Monitor query performance in Supabase Dashboard
- Add indexes for frequently queried columns
- Consider upgrading Supabase plan for more connections

### Storage

- Monitor storage usage in Supabase Dashboard
- Implement file size limits
- Consider CDN for static assets

### Compute

- Vercel automatically scales
- Monitor function execution time
- Optimize slow API routes

## Security Checklist

- [ ] Environment variables are set correctly
- [ ] Service role key is never exposed to client
- [ ] RLS policies are enabled on all tables
- [ ] Storage buckets have proper access policies
- [ ] Admin role is properly checked in middleware
- [ ] File uploads are validated (type and size)
- [ ] SQL injection is prevented (using Supabase client)
- [ ] XSS is prevented (React handles this)

## Backup Strategy

### Database Backups

Supabase automatically backs up your database. To manually backup:

1. Go to Supabase Dashboard → Database
2. Click "Backups" tab
3. Download backup or schedule automatic backups

### Storage Backups

Consider periodic backups of storage buckets:
- Use Supabase CLI to download all files
- Store backups in separate cloud storage

## Rollback Procedure

If deployment fails or has issues:

1. In Vercel Dashboard, go to "Deployments"
2. Find the last working deployment
3. Click "..." → "Promote to Production"
4. Verify the rollback worked

## Support

For issues:
- Check Vercel deployment logs
- Check Supabase logs
- Review browser console for client errors
- Check network tab for API errors

## Next Steps

After successful deployment:
1. Set up monitoring and alerts
2. Configure custom domain
3. Add more plugins
4. Invite users to test
5. Gather feedback and iterate
