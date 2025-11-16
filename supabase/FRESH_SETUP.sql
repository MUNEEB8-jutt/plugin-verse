-- =====================================================
-- FRESH DATABASE SETUP
-- =====================================================
-- WARNING: This will DELETE ALL DATA!
-- Only use this if you want to start fresh
-- =====================================================

-- Step 1: Drop all existing tables (this will delete all data!)
DROP TABLE IF EXISTS public.purchases CASCADE;
DROP TABLE IF EXISTS public.deposits CASCADE;
DROP TABLE IF EXISTS public.plugins CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Step 2: Drop the trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 3: Now run the complete setup from COMPLETE_SETUP.sql
-- Or run these migrations in order:
-- 1. Copy and paste content from 001_initial_schema.sql
-- 2. Copy and paste content from 002_rls_policies.sql  
-- 3. Copy and paste content from 003_create_admin.sql

-- After running this, your database will be fresh with correct column names!
