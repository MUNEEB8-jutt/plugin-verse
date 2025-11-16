# Database Migration Guide

## Issue Fixed
The database column names were using camelCase in the migration file, but PostgreSQL automatically converts unquoted identifiers to lowercase. This caused a mismatch between the code and actual database schema.

## Changes Made
1. Updated migration file to use snake_case column names
2. Updated all API routes to use snake_case
3. Updated TypeScript types to match snake_case
4. Updated all frontend components to use snake_case

## How to Apply Migration

### Option 1: Reset Database (Recommended for Development)
1. Go to Supabase Dashboard
2. Navigate to Database > Migrations
3. Delete all existing data (if any)
4. Run the migration again

### Option 2: Manual SQL Update (If you have existing data)
Run this SQL in Supabase SQL Editor:

```sql
-- Rename columns in plugins table
ALTER TABLE public.plugins 
  RENAME COLUMN "priceCoins" TO price_coins;

ALTER TABLE public.plugins 
  RENAME COLUMN "logoUrl" TO logo_url;

ALTER TABLE public.plugins 
  RENAME COLUMN "fileUrl" TO file_url;

-- Rename columns in deposits table
ALTER TABLE public.deposits 
  RENAME COLUMN "transactionId" TO transaction_id;

ALTER TABLE public.deposits 
  RENAME COLUMN "screenshotUrl" TO screenshot_url;
```

### Option 3: Fresh Setup
If you don't have important data:
1. Drop all tables in Supabase
2. Re-run the migration file `001_initial_schema.sql`
3. Run `002_rls_policies.sql`
4. Run `003_create_admin.sql`

## Verification
After migration, verify the schema:
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'plugins';
```

You should see: `price_coins`, `logo_url`, `file_url` (not camelCase)
