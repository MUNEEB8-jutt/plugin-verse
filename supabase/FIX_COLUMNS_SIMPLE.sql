-- =====================================================
-- SIMPLE VERSION - Try this if the other script doesn't work
-- =====================================================
-- Copy and paste these commands ONE BY ONE in Supabase SQL Editor

-- First, check what columns actually exist:
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'plugins';

-- Based on the output above, run the appropriate commands below:

-- If you see 'pricecoins' (lowercase), run these:
ALTER TABLE public.plugins RENAME COLUMN pricecoins TO price_coins;
ALTER TABLE public.plugins RENAME COLUMN logourl TO logo_url;
ALTER TABLE public.plugins RENAME COLUMN fileurl TO file_url;

-- If you see 'priceCoins' (camelCase), run these instead:
-- ALTER TABLE public.plugins RENAME COLUMN "priceCoins" TO price_coins;
-- ALTER TABLE public.plugins RENAME COLUMN "logoUrl" TO logo_url;
-- ALTER TABLE public.plugins RENAME COLUMN "fileUrl" TO file_url;

-- Now fix deposits table:
ALTER TABLE public.deposits RENAME COLUMN transactionid TO transaction_id;
ALTER TABLE public.deposits RENAME COLUMN screenshoturl TO screenshot_url;

-- Or if camelCase:
-- ALTER TABLE public.deposits RENAME COLUMN "transactionId" TO transaction_id;
-- ALTER TABLE public.deposits RENAME COLUMN "screenshotUrl" TO screenshot_url;

-- Verify everything is correct:
SELECT column_name FROM information_schema.columns WHERE table_name = 'plugins';
SELECT column_name FROM information_schema.columns WHERE table_name = 'deposits';
