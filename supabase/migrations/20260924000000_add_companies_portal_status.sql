alter table public.companies
add column portal_status text not null default 'active'
check (portal_status in ('active', 'inactive'));
