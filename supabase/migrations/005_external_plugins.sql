-- Add is_external column to plugins table
ALTER TABLE plugins ADD COLUMN IF NOT EXISTS is_external BOOLEAN DEFAULT false;

-- Update existing plugins to be internal (made by us)
UPDATE plugins SET is_external = false WHERE is_external IS NULL;
