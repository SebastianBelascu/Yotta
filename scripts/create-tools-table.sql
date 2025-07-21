-- Create tools table for the admin dashboard
-- This table stores information about tools/software in the directory

create table tools (
  id uuid primary key default gen_random_uuid(),
  
  name text not null,                    -- Tool / Software Name
  tagline text,                          -- One-liner (max 150 chars)
  categories text[],                     -- Select main + subcategory
  description text,                      -- Product Description
  problem_solved text,                   -- Main Problem Solved
  best_for text[],                       -- Solopreneurs, Startups, etc.

  features text[],                       -- Core Features (3–5)
  pros text[],                           -- Optional
  cons text[],                           -- Optional

  pricing_model text,                   -- Free, Trial, Monthly, etc.
  starting_price numeric,               -- Optional
  currency text check (currency in ('MYR', 'SGD', 'USD', 'GBP')),

  platforms_supported text[],           -- Web, iOS, Android etc.
  regions text[],                       -- Malaysia, Singapore, Global

  logo_url text,                         -- 1:1 logo
  banner_url text,                       -- promo banner (optional)

  affiliate_link text,                  -- redirect link
  published boolean default false,      -- status
  click_count integer default 0,        -- optional click tracking
  
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

-- Create indexes for better performance
create index idx_tools_published on tools(published);
create index idx_tools_categories on tools using gin(categories);
create index idx_tools_regions on tools using gin(regions);
create index idx_tools_created_at on tools(created_at desc);

-- Insert sample data for testing
insert into tools (
  name, 
  tagline, 
  categories, 
  description, 
  problem_solved, 
  best_for, 
  features, 
  pros, 
  cons, 
  pricing_model, 
  starting_price, 
  currency, 
  platforms_supported, 
  regions, 
  logo_url, 
  affiliate_link, 
  published
) values 
(
  'Notion',
  'All-in-one workspace for notes, docs, and collaboration',
  ARRAY['Productivity', 'Project Management'],
  'Notion is a comprehensive workspace that combines note-taking, task management, databases, and collaboration tools in one platform.',
  'Helps teams and individuals organize their work, notes, and projects in a unified digital workspace.',
  ARRAY['Startups', 'Remote Teams', 'Freelancers', 'Students'],
  ARRAY['Rich text editing', 'Database management', 'Team collaboration', 'Template library', 'API integration'],
  ARRAY['Highly customizable', 'Great for team collaboration', 'Powerful database features'],
  ARRAY['Can be overwhelming for new users', 'Performance issues with large databases'],
  'Freemium',
  8.00,
  'USD',
  ARRAY['Web', 'iOS', 'Android', 'Windows', 'macOS'],
  ARRAY['Global'],
  null,
  'https://notion.so',
  true
),
(
  'Figma',
  'Collaborative interface design tool for teams',
  ARRAY['Design', 'Collaboration'],
  'Figma is a web-based design tool that enables real-time collaboration for UI/UX design, prototyping, and design systems.',
  'Streamlines the design process with real-time collaboration and powerful design tools.',
  ARRAY['Agencies', 'Product-Based Brands', 'Startups', 'Remote Teams'],
  ARRAY['Real-time collaboration', 'Prototyping', 'Design systems', 'Developer handoff', 'Version control'],
  ARRAY['Excellent collaboration features', 'Web-based accessibility', 'Strong community'],
  ARRAY['Limited offline functionality', 'Can be resource-intensive'],
  'Freemium',
  12.00,
  'USD',
  ARRAY['Web', 'Windows', 'macOS'],
  ARRAY['Global'],
  null,
  'https://figma.com',
  true
),
(
  'Slack',
  'Team communication and collaboration platform',
  ARRAY['Communication', 'Project Management'],
  'Slack is a business communication platform that offers persistent chat rooms organized by topic, private groups, and direct messaging.',
  'Improves team communication and reduces email clutter with organized channels and integrations.',
  ARRAY['Startups', 'Remote Teams', 'Agencies', 'Enterprise'],
  ARRAY['Channel organization', 'File sharing', 'App integrations', 'Voice/video calls', 'Search functionality'],
  ARRAY['Great for team communication', 'Extensive app integrations', 'User-friendly interface'],
  ARRAY['Can become noisy with notifications', 'Pricing can add up for larger teams'],
  'Freemium',
  6.67,
  'USD',
  ARRAY['Web', 'iOS', 'Android', 'Windows', 'macOS'],
  ARRAY['Global'],
  null,
  'https://slack.com',
  true
);

-- Enable Row Level Security (optional)
-- alter table tools enable row level security;

-- Create policy for public read access to published tools
-- create policy "Published tools are viewable by everyone" on tools
--   for select using (published = true);

-- Create policy for authenticated users to manage tools (admin only)
-- create policy "Admin users can manage tools" on tools
--   for all using (auth.role() = 'authenticated');
