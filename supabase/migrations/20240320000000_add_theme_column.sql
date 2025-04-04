-- Add theme column to hotels table
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS theme jsonb DEFAULT jsonb_build_object(
  'primaryColor', '#000000',
  'secondaryColor', '#ffffff',
  'backgroundColor', '#ffffff',
  'darkMode', false,
  'showLogo', true,
  'buttonStyle', 'minimal',
  'font', 'geist',
  'bookingUrl', NULL,
  'contactEmail', NULL
);

-- Add a comment to the column
COMMENT ON COLUMN hotels.theme IS 'Theme settings for the hotel''s public page';

-- Create an index on the theme column for better performance
CREATE INDEX IF NOT EXISTS idx_hotels_theme ON hotels USING gin (theme);

-- Add RLS policies for theme
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can update their own hotel theme"
    ON hotels
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own hotel theme"
    ON hotels
    FOR SELECT
    USING (auth.uid() = user_id); 