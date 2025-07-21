-- Create FAQ table for better question management
CREATE TABLE IF NOT EXISTS faq (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'general',
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_faq_category ON faq(category);
CREATE INDEX IF NOT EXISTS idx_faq_published ON faq(is_published);
CREATE INDEX IF NOT EXISTS idx_faq_order ON faq(display_order);

-- Insert sample FAQ data
INSERT INTO faq (question, answer, category, display_order, is_published) VALUES
('How does Yotta work?', 'Yotta connects businesses with verified service providers across various categories. You can search for services, compare options, read reviews, and request quotes directly through our platform.', 'general', 1, true),
('Is Yotta free to use?', 'Yes, Yotta is completely free for businesses looking for services. We only charge service providers a small fee to list their services on our platform.', 'general', 2, true),
('How do I get started?', 'Simply create an account, browse through our service categories, and reach out to providers that match your needs. You can request quotes, compare offerings, and book services directly through Yotta.', 'general', 3, true),
('Can I trust the service providers on Yotta?', 'All service providers on Yotta go through a verification process. We check their credentials, business registration, and collect reviews from past clients to ensure quality and reliability.', 'general', 4, true),
('How can I list my services on Yotta?', 'To list your services, create a service provider account, complete your profile with all required information, and submit it for verification. Once approved, you can start listing your services.', 'providers', 1, true),
('What are the requirements to become a provider?', 'You need to have a registered business, relevant qualifications or certifications for your service category, and provide references or portfolio of past work. We also conduct interviews for certain service categories.', 'providers', 2, true),
('How much does it cost to list on Yotta?', 'We offer different subscription plans starting from MYR 99/month. The cost depends on the number of services you want to list and additional features like premium placement and marketing support.', 'providers', 3, true),
('How do I get more visibility on the platform?', 'Complete your profile with high-quality images and detailed service descriptions, collect positive reviews from clients, respond promptly to inquiries, and consider our premium placement options for increased visibility.', 'providers', 4, true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_faq_updated_at BEFORE UPDATE ON faq
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
