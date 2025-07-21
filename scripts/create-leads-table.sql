-- Create leads table
create table leads (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references services(id) on delete cascade,
  provider_id uuid references vendors(id) on delete cascade,
  metadata jsonb,
  sent boolean default false,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Add indexes for better performance
create index idx_leads_service_id on leads(service_id);
create index idx_leads_provider_id on leads(provider_id);
create index idx_leads_created_at on leads(created_at);
create index idx_leads_sent on leads(sent);

-- Example of how metadata will be structured:
-- {
--   "company_name": "Example Corp",
--   "contact_person": "John Doe", 
--   "email": "john@example.com",
--   "phone": "+1234567890",
--   "message": "Interested in your services"
-- }
