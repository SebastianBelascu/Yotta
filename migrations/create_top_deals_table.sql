-- Create top_deals table to store admin-selected deals
CREATE TABLE IF NOT EXISTS top_deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  price DECIMAL(10, 2),
  original_price DECIMAL(10, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  link_url TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  deal_type VARCHAR(50) NOT NULL, -- 'service' or 'tool'
  reference_id UUID, -- ID of the original service or tool
  badge_text VARCHAR(100),
  badge_color VARCHAR(50),
  rating DECIMAL(3, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create top_deals_settings table
CREATE TABLE IF NOT EXISTS top_deals_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  is_visible BOOLEAN NOT NULL DEFAULT true,
  section_title VARCHAR(255) NOT NULL DEFAULT 'Top Deals This Week',
  max_deals INTEGER NOT NULL DEFAULT 3,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO top_deals_settings (is_visible, section_title, max_deals)
VALUES (true, 'Top Deals This Week', 3);
