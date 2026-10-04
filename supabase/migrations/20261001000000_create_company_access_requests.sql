create table public.company_access_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  company_name text not null check (char_length(btrim(company_name)) > 0),
  products text[] not null
    check (
      cardinality(products) > 0
      and products <@ array['chatbot', 'voice_agent']::text[]
    ),
  status text not null default 'submitted'
    check (status in ('submitted', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.company_access_requests enable row level security;

create policy "Users can view their own access request"
on public.company_access_requests
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can submit their own access request"
on public.company_access_requests
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and status = 'submitted'
);
