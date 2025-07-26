-- Create categories table for managing tool, service, and space categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('service', 'tool', 'space')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint to prevent duplicate category names within the same type
CREATE UNIQUE INDEX IF NOT EXISTS categories_name_type_unique 
ON categories (name, type);

-- Create index for faster queries by type
CREATE INDEX IF NOT EXISTS categories_type_idx ON categories (type);

-- Insert some sample space categories (as shown in the image)
INSERT INTO categories (name, type) VALUES
  ('Coworking & Business Spaces', 'space'),
  ('Entertainment Spaces', 'space'),
  ('Event Spaces', 'space'),
  ('F&B Spaces', 'space'),
  ('Fitness & Community Spaces', 'space'),
  ('Hospitality Spaces', 'space'),
  ('Retail & Commercial Spaces', 'space')
ON CONFLICT (name, type) DO NOTHING;

-- Insert some sample tool categories
INSERT INTO categories (name, type) VALUES
  ('Communication', 'tool'),
  ('Design & Creative', 'tool'),
  ('Development', 'tool'),
  ('Marketing', 'tool'),
  ('Productivity', 'tool'),
  ('Analytics', 'tool')
ON CONFLICT (name, type) DO NOTHING;

-- Insert some sample service categories
INSERT INTO categories (name, type) VALUES
  ('Web Development', 'service'),
  ('Mobile Development', 'service'),
  ('Design Services', 'service'),
  ('Marketing Services', 'service'),
  ('Consulting', 'service'),
  ('Content Creation', 'service')
ON CONFLICT (name, type) DO NOTHING;
