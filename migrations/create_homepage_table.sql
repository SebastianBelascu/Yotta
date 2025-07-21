-- Create homepage table for managing Homepage content
CREATE TABLE IF NOT EXISTS homepage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  icon_svg TEXT, -- For storing SVG content
  section VARCHAR(50) NOT NULL DEFAULT 'hero', -- hero, categories, featured, steps, deals
  display_order INTEGER DEFAULT 0,
  
  -- Additional fields for different content types
  price VARCHAR(100), -- For deals section
  original_price VARCHAR(100), -- For deals section
  discount_percentage VARCHAR(10), -- For deals section
  rating DECIMAL(2,1), -- For deals section
  review_count INTEGER, -- For deals section
  company_name VARCHAR(255), -- For deals and featured sections
  badge_text VARCHAR(100), -- For deals section (Most Popular, Best Value, etc.)
  badge_color VARCHAR(50), -- For badge styling
  features TEXT[], -- Array of features for deals
  button_text VARCHAR(100), -- For CTA buttons
  button_link VARCHAR(255), -- For CTA buttons
  
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_homepage_section ON homepage(section);
CREATE INDEX IF NOT EXISTS idx_homepage_published ON homepage(is_published);
CREATE INDEX IF NOT EXISTS idx_homepage_order ON homepage(display_order);

-- Insert sample data for Homepage matching current content exactly
INSERT INTO homepage (title, subtitle, description, section, display_order, is_published) VALUES
-- Hero section
('Find a better deal for you', null, 'Discover, compare and get quotes on the best services, deals, and AI tools to start, scale and succeed in business across Singapore and Malaysia.', 'hero', 1, true);

-- Service Categories
INSERT INTO homepage (title, description, icon_svg, section, display_order, is_published) VALUES
('SaaS Tools', 'Software solutions for business growth', '<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#000000"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>', 'categories', 1, true),
('AI Tools', 'Artificial intelligence powered services', '<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#000000"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>', 'categories', 2, true),
('Register A Business', 'Legal incorporation and setup services', '<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#000000"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>', 'categories', 3, true),
('Marketing Services', 'Digital marketing and growth solutions', '<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#000000"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>', 'categories', 4, true),
('Design & Creative', 'Branding, logos, and creative services', '<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#000000"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>', 'categories', 5, true);

-- Featured In section
INSERT INTO homepage (title, company_name, icon_svg, section, display_order, is_published) VALUES
('Featured in:', 'TechCrunch', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FF0000" className="mr-2"><circle cx="12" cy="12" r="12" opacity="0.2" /></svg>', 'featured', 0, true),
('TechCrunch', 'TechCrunch', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FF0000" className="mr-2"><circle cx="12" cy="12" r="12" opacity="0.2" /></svg>', 'featured', 1, true),
('Forbes', 'Forbes', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#000000" className="mr-2" opacity="0.7"><rect width="24" height="24" opacity="0.2" /></svg>', 'featured', 2, true),
('The Straits Times', 'The Straits Times', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#000000" className="mr-2" opacity="0.7"><rect width="24" height="24" opacity="0.2" /></svg>', 'featured', 3, true),
('Channel NewsAsia', 'Channel NewsAsia', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#0088CC" className="mr-2"><rect width="24" height="24" rx="4" opacity="0.2" /></svg>', 'featured', 4, true),
('Tech in Asia', 'Tech in Asia', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#00AAFF" className="mr-2"><circle cx="12" cy="12" r="12" opacity="0.2" /></svg>', 'featured', 5, true),
('e27', 'e27', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FF5722" className="mr-2"><path d="M12 2L2 12h3v10h14V12h3L12 2z" opacity="0.2" /></svg>', 'featured', 6, true);

-- How Yotta Works section
INSERT INTO homepage (title, description, icon_svg, section, display_order, is_published) VALUES
('How Yotta Works', 'Get started in 4 simple steps', null, 'steps', 0, true),
('Search & Discover', 'Browse through our curated marketplace of business services and tools', '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>', 'steps', 1, true),
('Compare Options', 'View detailed comparisons, pricing, and reviews from real users', '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>', 'steps', 2, true),
('Get Quotes', 'Request personalized quotes from multiple providers instantly', '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>', 'steps', 3, true),
('Choose & Start', 'Select the best option and start growing your business', '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>', 'steps', 4, true);

-- Top Deals section
INSERT INTO homepage (title, subtitle, description, section, display_order, is_published) VALUES
('Top Deals This Week', null, 'Don''t miss these exclusive offers - limited time only!', 'deals', 0, true);

INSERT INTO homepage (title, company_name, description, price, original_price, discount_percentage, rating, review_count, badge_text, badge_color, features, button_text, button_link, section, display_order, is_published) VALUES
('Singapore Company Formation', 'FormSG Pro', null, 'From $299', '$499', '40% OFF', 4.8, 127, 'Most Popular', 'orange', ARRAY['ACRA Registration', 'Corporate Secretary', 'Registered Address'], 'Get This Deal', '#', 'deals', 1, true),
('AI-Powered CRM System', 'SmartCRM Asia', null, 'From $49/month', '$99/month', '50% OFF', 4.9, 89, 'Best Value', 'blue', ARRAY['Lead Management', 'Sales Analytics', 'Email Integration'], 'Get This Deal', '#', 'deals', 2, true),
('Professional Website Design', 'DesignPro SG', null, 'From $899', '$1,499', '30% OFF', 4.7, 156, 'Limited Time', 'green', ARRAY['Responsive Design', 'SEO Optimized', '6 Months Support'], 'Get This Deal', '#', 'deals', 3, true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_homepage_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_homepage_updated_at BEFORE UPDATE ON homepage
    FOR EACH ROW EXECUTE FUNCTION update_homepage_updated_at_column();
