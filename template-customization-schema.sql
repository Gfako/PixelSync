-- Template Customization Schema for PixelSync
-- This adds template customization storage to save colors, fonts, images, and components

-- Template Customizations Table
CREATE TABLE IF NOT EXISTS template_customizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic template info
  template_name VARCHAR(255),
  event_title VARCHAR(255) DEFAULT 'Event title',
  description TEXT DEFAULT 'Web conferencing details provided upon confirmation.',
  duration_minutes INTEGER DEFAULT 30,
  timezone VARCHAR(100) DEFAULT 'America/New_York',
  
  -- Design settings - Colors
  page_background_color VARCHAR(7) DEFAULT '#f8fafc',
  background_color VARCHAR(7) DEFAULT '#ffffff',
  calendar_background_color VARCHAR(7) DEFAULT '#ffffff',
  time_slot_button_color VARCHAR(7) DEFAULT '#ffffff',
  primary_color VARCHAR(7) DEFAULT '#3b82f6',
  text_color VARCHAR(7) DEFAULT '#1e293b',
  calendar_text_color VARCHAR(7) DEFAULT '#1e293b',
  
  -- Design settings - Typography
  font_family VARCHAR(50) DEFAULT 'font-montserrat',
  font_weight VARCHAR(10) DEFAULT '400',
  
  -- Design settings - Border radius
  border_radius VARCHAR(10) DEFAULT '8px',
  calendar_border_radius VARCHAR(10) DEFAULT '8px',
  button_border_radius VARCHAR(10) DEFAULT '8px',
  
  -- Media settings
  show_avatar BOOLEAN DEFAULT true,
  avatar_url TEXT,
  show_cover_photo BOOLEAN DEFAULT false,
  cover_photo TEXT,
  
  -- Custom components (stored as JSONB)
  custom_text_components JSONB DEFAULT '[]',
  accordion_components JSONB DEFAULT '[]',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_template_customizations_template_id 
  ON template_customizations(template_id);
CREATE INDEX IF NOT EXISTS idx_template_customizations_user_id 
  ON template_customizations(user_id);
CREATE INDEX IF NOT EXISTS idx_template_customizations_user_template 
  ON template_customizations(user_id, template_id);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_template_customizations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_template_customizations_updated_at
  BEFORE UPDATE ON template_customizations
  FOR EACH ROW
  EXECUTE FUNCTION update_template_customizations_updated_at();

-- Row Level Security (RLS)
ALTER TABLE template_customizations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own template customizations
CREATE POLICY "Users can manage their own template customizations"
  ON template_customizations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Allow public read access for booking pages (optional)
CREATE POLICY "Public read access for booking pages"
  ON template_customizations
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Grant permissions
GRANT ALL ON template_customizations TO authenticated;
GRANT SELECT ON template_customizations TO anon;