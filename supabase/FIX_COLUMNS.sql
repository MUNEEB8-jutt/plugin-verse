-- =====================================================
-- SQL Commands to Fix Column Names in Existing Database
-- =====================================================
-- Run these commands in Supabase SQL Editor
-- This will rename columns from camelCase to snake_case

-- Step 1: Check if columns exist (optional - for verification)
-- Uncomment to see current column names
-- SELECT column_name 
-- FROM information_schema.columns 
-- WHERE table_name = 'plugins';

-- Step 2: Rename columns in plugins table
-- Note: PostgreSQL might have already converted these to lowercase
-- Try both versions to see which one works

-- If columns are in lowercase (pricecoins, logourl, fileurl)
DO $$ 
BEGIN
    -- Try to rename pricecoins to price_coins
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plugins' AND column_name = 'pricecoins'
    ) THEN
        ALTER TABLE public.plugins RENAME COLUMN pricecoins TO price_coins;
    END IF;

    -- Try to rename logourl to logo_url
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plugins' AND column_name = 'logourl'
    ) THEN
        ALTER TABLE public.plugins RENAME COLUMN logourl TO logo_url;
    END IF;

    -- Try to rename fileurl to file_url
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plugins' AND column_name = 'fileurl'
    ) THEN
        ALTER TABLE public.plugins RENAME COLUMN fileurl TO file_url;
    END IF;
END $$;

-- Step 3: Rename columns in deposits table
DO $$ 
BEGIN
    -- Try to rename transactionid to transaction_id
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'deposits' AND column_name = 'transactionid'
    ) THEN
        ALTER TABLE public.deposits RENAME COLUMN transactionid TO transaction_id;
    END IF;

    -- Try to rename screenshoturl to screenshot_url
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'deposits' AND column_name = 'screenshoturl'
    ) THEN
        ALTER TABLE public.deposits RENAME COLUMN screenshoturl TO screenshot_url;
    END IF;
END $$;

-- Step 4: Verify the changes
SELECT 'Plugins table columns:' as info;
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'plugins'
ORDER BY ordinal_position;

SELECT 'Deposits table columns:' as info;
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'deposits'
ORDER BY ordinal_position;

-- Expected output for plugins table:
-- id, title, description, price_coins, logo_url, file_url, created_at

-- Expected output for deposits table:
-- id, user_id, amount, method, transaction_id, screenshot_url, status, created_at
