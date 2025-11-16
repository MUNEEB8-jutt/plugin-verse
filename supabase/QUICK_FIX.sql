-- =====================================================
-- QUICK FIX - Run this in Supabase SQL Editor
-- =====================================================
-- This will check and fix column names automatically

-- First, let's see what we have:
SELECT 
    table_name,
    column_name
FROM information_schema.columns 
WHERE table_name IN ('plugins', 'deposits')
ORDER BY table_name, ordinal_position;

-- Now fix plugins table (try both versions):
DO $$ 
BEGIN
    -- Fix lowercase versions
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plugins' AND column_name = 'pricecoins') THEN
        ALTER TABLE public.plugins RENAME COLUMN pricecoins TO price_coins;
        RAISE NOTICE 'Renamed pricecoins to price_coins';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plugins' AND column_name = 'logourl') THEN
        ALTER TABLE public.plugins RENAME COLUMN logourl TO logo_url;
        RAISE NOTICE 'Renamed logourl to logo_url';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plugins' AND column_name = 'fileurl') THEN
        ALTER TABLE public.plugins RENAME COLUMN fileurl TO file_url;
        RAISE NOTICE 'Renamed fileurl to file_url';
    END IF;

    -- Fix deposits table
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'deposits' AND column_name = 'transactionid') THEN
        ALTER TABLE public.deposits RENAME COLUMN transactionid TO transaction_id;
        RAISE NOTICE 'Renamed transactionid to transaction_id';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'deposits' AND column_name = 'screenshoturl') THEN
        ALTER TABLE public.deposits RENAME COLUMN screenshoturl TO screenshot_url;
        RAISE NOTICE 'Renamed screenshoturl to screenshot_url';
    END IF;
END $$;

-- Verify the fix:
SELECT 'PLUGINS TABLE:' as info;
SELECT column_name FROM information_schema.columns WHERE table_name = 'plugins' ORDER BY ordinal_position;

SELECT 'DEPOSITS TABLE:' as info;
SELECT column_name FROM information_schema.columns WHERE table_name = 'deposits' ORDER BY ordinal_position;

-- You should see:
-- PLUGINS: id, title, description, price_coins, logo_url, file_url, created_at
-- DEPOSITS: id, user_id, amount, method, transaction_id, screenshot_url, status, created_at
