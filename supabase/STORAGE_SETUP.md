# Supabase Storage Bucket Setup

This document provides instructions for creating the required storage buckets in your Supabase project.

## Required Buckets

### 1. `plugins` Bucket (Private)

**Purpose**: Store plugin files (.zip, .jar, etc.)

**Configuration**:
- Name: `plugins`
- Public: **No** (Private)
- File size limit: 50 MB
- Allowed MIME types: `application/zip`, `application/java-archive`, `application/x-zip-compressed`

**Steps**:
1. Go to Supabase Dashboard → Storage
2. Click "New bucket"
3. Name: `plugins`
4. Uncheck "Public bucket"
5. Click "Create bucket"

**RLS Policy** (Apply in SQL Editor):
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload plugins"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'plugins');

-- Allow admins to delete
CREATE POLICY "Admins can delete plugins"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'plugins' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_user_meta_data->>'role') = 'admin'
  )
);

-- Allow users who purchased to download (handled via signed URLs in API)
```

---

### 2. `logos` Bucket (Public)

**Purpose**: Store plugin logo/preview images

**Configuration**:
- Name: `logos`
- Public: **Yes**
- File size limit: 5 MB
- Allowed MIME types: `image/png`, `image/jpeg`, `image/jpg`, `image/webp`

**Steps**:
1. Go to Supabase Dashboard → Storage
2. Click "New bucket"
3. Name: `logos`
4. Check "Public bucket"
5. Click "Create bucket"

**RLS Policy** (Apply in SQL Editor):
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'logos');

-- Allow admins to delete
CREATE POLICY "Admins can delete logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'logos' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_user_meta_data->>'role') = 'admin'
  )
);

-- Public read access (automatic for public buckets)
```

---

### 3. `receipts` Bucket (Private)

**Purpose**: Store deposit payment screenshots

**Configuration**:
- Name: `receipts`
- Public: **No** (Private)
- File size limit: 10 MB
- Allowed MIME types: `image/png`, `image/jpeg`, `image/jpg`

**Steps**:
1. Go to Supabase Dashboard → Storage
2. Click "New bucket"
3. Name: `receipts`
4. Uncheck "Public bucket"
5. Click "Create bucket"

**RLS Policy** (Apply in SQL Editor):
```sql
-- Allow authenticated users to upload their receipts
CREATE POLICY "Users can upload receipts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'receipts');

-- Allow users to view their own receipts
CREATE POLICY "Users can view own receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'receipts' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow admins to view all receipts
CREATE POLICY "Admins can view all receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'receipts' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_user_meta_data->>'role') = 'admin'
  )
);
```

---

## Quick Setup SQL Script

Run this in your Supabase SQL Editor to create all storage policies at once:

```sql
-- Plugins bucket policies
CREATE POLICY "Authenticated users can upload plugins"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'plugins');

CREATE POLICY "Admins can delete plugins"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'plugins' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_user_meta_data->>'role') = 'admin'
  )
);

-- Logos bucket policies
CREATE POLICY "Authenticated users can upload logos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Admins can delete logos"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'logos' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_user_meta_data->>'role') = 'admin'
  )
);

-- Receipts bucket policies
CREATE POLICY "Users can upload receipts"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'receipts');

CREATE POLICY "Users can view own receipts"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'receipts' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Admins can view all receipts"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'receipts' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_user_meta_data->>'role') = 'admin'
  )
);
```

---

## Verification

After creating the buckets, verify they exist:
1. Go to Supabase Dashboard → Storage
2. You should see three buckets: `plugins`, `logos`, `receipts`
3. Check that `logos` has a green "Public" badge
4. Check that `plugins` and `receipts` show "Private"

## Troubleshooting

**Issue**: Upload fails with "new row violates row-level security policy"
- **Solution**: Make sure you've applied the RLS policies above

**Issue**: Can't access files
- **Solution**: For private buckets, use signed URLs. For public buckets, use public URLs.

**Issue**: File size too large
- **Solution**: Adjust the file size limits in bucket settings or compress files before upload
