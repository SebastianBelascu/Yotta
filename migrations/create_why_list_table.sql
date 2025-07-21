-- Create why_list_with_us table for managing provider benefits
CREATE TABLE IF NOT EXISTS why_list_with_us (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon_name VARCHAR(100), -- For storing icon identifier (e.g., 'users', 'star', 'trending-up')
  category VARCHAR(50) NOT NULL DEFAULT 'benefit', -- benefit, feature, stat
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_why_list_category ON why_list_with_us(category);
CREATE INDEX IF NOT EXISTS idx_why_list_published ON why_list_with_us(is_published);
CREATE INDEX IF NOT EXISTS idx_why_list_order ON why_list_with_us(display_order);

-- Insert sample data for Why List With Us
INSERT INTO why_list_with_us (title, description, icon_name, category, display_order, is_published) VALUES
-- Benefits
('Reach More Customers', 'Connect with thousands of businesses actively searching for services like yours. Our platform brings qualified leads directly to your inbox.', 'users', 'benefit', 1, true),
('Verified Business Profile', 'Build trust with a verified business profile that showcases your credentials, portfolio, and client testimonials in a professional format.', 'shield-check', 'benefit', 2, true),
('Easy Quote Management', 'Streamline your sales process with our built-in quote management system. Track inquiries, send proposals, and close deals faster.', 'clipboard-list', 'benefit', 3, true),
('Marketing Support', 'Get featured in our marketing campaigns, newsletters, and social media to increase your visibility and brand awareness.', 'megaphone', 'benefit', 4, true),
('Performance Analytics', 'Track your listing performance with detailed analytics. See how many views, clicks, and leads your services generate.', 'bar-chart', 'benefit', 5, true),
('Flexible Pricing Plans', 'Choose from various subscription plans that fit your business size and budget. No hidden fees or long-term contracts required.', 'credit-card', 'benefit', 6, true),

-- Features
('Professional Listings', 'Create stunning service listings with high-quality images, detailed descriptions, and pricing information that converts visitors into customers.', 'star', 'feature', 1, true),
('Client Review System', 'Build credibility with our integrated review system. Satisfied clients can leave reviews that help you attract more business.', 'message-circle', 'feature', 2, true),
('Mobile-Optimized', 'Your listings look great on all devices. Most of our traffic comes from mobile users actively searching for services.', 'smartphone', 'feature', 3, true),
('SEO Optimized', 'Your services get found on Google and other search engines. We optimize every listing for maximum search visibility.', 'search', 'feature', 4, true),

-- Stats
('10,000+', 'Active businesses searching for services every month. Join our growing marketplace of verified service providers.', 'trending-up', 'stat', 1, true),
('95%', 'Customer satisfaction rate. Our platform consistently delivers quality leads and positive experiences for both sides.', 'heart', 'stat', 2, true),
('24/7', 'Platform availability with dedicated support. Get help whenever you need it with our responsive customer service team.', 'clock', 'stat', 3, true),
('48hrs', 'Average response time for new leads. Quick turnaround helps you close more deals and grow your business faster.', 'zap', 'stat', 4, true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_why_list_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_why_list_updated_at BEFORE UPDATE ON why_list_with_us
    FOR EACH ROW EXECUTE FUNCTION update_why_list_updated_at_column();
