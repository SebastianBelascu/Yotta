-- Simple Footer Table Creation Script
-- Run this in your Supabase SQL Editor

-- Create footer table
CREATE TABLE IF NOT EXISTS footer (
  id SERIAL PRIMARY KEY,
  section VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  content TEXT,
  link_url VARCHAR(500),
  icon_name VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_footer_section ON footer(section);
CREATE INDEX IF NOT EXISTS idx_footer_active ON footer(is_active);
CREATE INDEX IF NOT EXISTS idx_footer_order ON footer(display_order);

-- Insert default footer content
INSERT INTO footer (section, title, content, link_url, display_order, is_active) VALUES
-- Company Info
('company_info', 'Yotta', 'Your marketplace for discovering the best business services, tools, and solutions in Singapore and Malaysia.', NULL, 1, true),
('company_info', 'Copyright', '© 2025 Yotta. All rights reserved.', NULL, 2, true),

-- Quick Links
('quick_links', 'About Us', NULL, '/about', 1, true),
('quick_links', 'Browse Services', NULL, '/services', 2, true),
('quick_links', 'Insights', NULL, '/insights', 3, true),
('quick_links', 'FAQ', NULL, '/faq', 4, true),
('quick_links', 'Contact', NULL, '/contact', 5, true),

-- Categories
('categories', 'Register a Business', NULL, '/services?category=Register+a+Business', 1, true),
('categories', 'Legal & Compliance', NULL, '/services?category=Legal+%26+Compliance', 2, true),
('categories', 'Banking & Finance', NULL, '/services?category=Banking+%26+Finance', 3, true),
('categories', 'SaaS & AI Tools', NULL, '/services?category=SaaS+%26+AI+Tools', 4, true),

-- Social Media
('social_media', 'Twitter', NULL, 'https://twitter.com/yotta', 1, true),
('social_media', 'LinkedIn', NULL, 'https://linkedin.com/company/yotta', 2, true),
('social_media', 'YouTube', NULL, 'https://youtube.com/yotta', 3, true),

-- Legal Links
('legal_links', 'Terms of Service', NULL, '/terms', 1, true),
('legal_links', 'Privacy Policy', NULL, '/privacy', 2, true);

-- Enable RLS
ALTER TABLE footer ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON footer
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage footer" ON footer
  FOR ALL USING (auth.role() = 'authenticated');
