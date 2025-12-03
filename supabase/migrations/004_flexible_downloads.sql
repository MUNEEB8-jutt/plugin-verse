-- Add flexible download support to plugins table

-- Add download_type column with default 'upload' for backward compatibility
ALTER TABLE public.plugins 
  ADD COLUMN download_type TEXT NOT NULL DEFAULT 'upload' 
    CHECK (download_type IN ('upload', 'external'));

-- Add external_url column for external links
ALTER TABLE public.plugins 
  ADD COLUMN external_url TEXT;

-- Make file_url nullable since external links won't use it
ALTER TABLE public.plugins 
  ALTER COLUMN file_url DROP NOT NULL;

-- Add constraint: either file_url or external_url must be present based on download_type
ALTER TABLE public.plugins 
  ADD CONSTRAINT check_download_source 
    CHECK (
      (download_type = 'upload' AND file_url IS NOT NULL) OR
      (download_type = 'external' AND external_url IS NOT NULL)
    );

-- Add index for download_type for better query performance
CREATE INDEX IF NOT EXISTS idx_plugins_download_type ON public.plugins(download_type);
