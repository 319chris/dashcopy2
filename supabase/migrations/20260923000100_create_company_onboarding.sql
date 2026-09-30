create table public.company_onboarding (
  company_id uuid primary key references public.companies(id) on delete cascade,
  onboarding_status text not null default 'in_process'
    check (onboarding_status in ('in_process', 'submitted', 'ready')),
  products text[] not null default '{}'
    check (products <@ array['chatbot', 'voice_agent']::text[]),
  created_at timestamptz not null default now()
);

alter table public.company_onboarding enable row level security;

create policy "Members can view their company onboarding"
on public.company_onboarding
for select
to authenticated
using (
  exists (
    select 1
    from public.company_members
    where company_members.company_id = company_onboarding.company_id
      and company_members.user_id = (select auth.uid())
  )
);
