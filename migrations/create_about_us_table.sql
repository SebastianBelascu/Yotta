-- Create about_us table for managing About Us page content
CREATE TABLE IF NOT EXISTS about_us (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon_name VARCHAR(100), -- For storing icon identifier
  section VARCHAR(50) NOT NULL DEFAULT 'main', -- main, features, values, stats
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_about_us_section ON about_us(section);
CREATE INDEX IF NOT EXISTS idx_about_us_published ON about_us(is_published);
CREATE INDEX IF NOT EXISTS idx_about_us_order ON about_us(display_order);

-- Insert sample data for About Us page
INSERT INTO about_us (title, description, icon_name, section, display_order, is_published) VALUES
-- Main hero content
('About Yotta', 'Yotta is your shortcut to discovering the tools, services, and partners that actually move the needle—curated for solopreneurs, startups, and modern small businesses building the future.', 'zap', 'main', 1, true),

-- What We Do section
('What We Do', 'Building a business is hard. Finding the right tools and services shouldn''t be.', null, 'intro', 1, true),
('Handpicked Marketplace', 'Yotta is a handpicked marketplace built to help ambitious founders and lean teams cut through the noise. Whether you''re starting your first side hustle or running your fifth venture, we help you discover the best platforms, providers, and solutions tailored for early-stage and growing businesses.', null, 'intro', 2, true),
('No Fluff Promise', 'No fluff, no overwhelm—just what works. From legal to marketing, CRMs to coworking spaces, we bring the next best thing straight to your fingertips.', null, 'intro', 3, true),

-- Features/Values
('Curated Selection', 'Handpicked marketplace built to help ambitious founders and lean teams cut through the noise.', 'shield-check', 'features', 1, true),
('No Fluff, No Overwhelm', 'Just what works. From legal to marketing, CRMs to coworking spaces.', 'filter', 'features', 2, true),
('Next Best Thing', 'We bring the solutions straight to your fingertips, tailored for early-stage and growing businesses.', 'trending-up', 'features', 3, true),

-- Why Choose Us values
('Built for doers', 'We don''t just list services. We curate what works, ditch what doesn''t, and get straight to the point.', 'users', 'values', 1, true),
('Founder-first', 'We understand small teams and solo operators because we are one.', 'heart', 'values', 2, true),
('Curated, not cluttered', 'Less doom-scrolling, more decision-making.', 'eye', 'values', 3, true),
('Real-world use cases', 'Tools and providers recommended by real businesses doing real things.', 'check-circle', 'values', 4, true),
('Save time and money', 'Skip the trial-and-error phase. We''ve already done it.', 'clock', 'values', 5, true),
('Better than Google', 'Your business deserves better than random Google searches and 50 open tabs.', 'search', 'values', 6, true),

-- Stats
('10,000+', 'Businesses trust Yotta to find the right tools and services for their growth journey.', 'trending-up', 'stats', 1, true),
('500+', 'Verified service providers and tools carefully curated for quality and reliability.', 'shield-check', 'stats', 2, true),
('95%', 'Customer satisfaction rate from businesses that found their perfect match through our platform.', 'heart', 'stats', 3, true),
('24/7', 'Platform availability with continuous updates and new additions to our marketplace.', 'clock', 'stats', 4, true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_about_us_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_about_us_updated_at BEFORE UPDATE ON about_us
    FOR EACH ROW EXECUTE FUNCTION update_about_us_updated_at_column();
