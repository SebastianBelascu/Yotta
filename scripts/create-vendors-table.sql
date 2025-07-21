-- Create vendors table
create table vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Add vendor_id to services table
alter table services
add column if not exists vendor_id uuid references vendors(id) on delete set null;

-- Insert some sample vendors for testing
insert into vendors (name, email) values
  ('Digital Growth Co.', 'contact@digitalgrowth.com'),
  ('WebCraft Studio', 'hello@webcraft.com'),
  ('Marketing Masters', 'info@marketingmasters.com'),
  ('StartupLegal', 'team@startuplegal.com');
