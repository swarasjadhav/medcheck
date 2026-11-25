-- MedCheck database setup.
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- It is safe to run again; it skips anything that already exists.

-- Saved claims: one row per (person, claim).
create table if not exists public.saved_claims (
  user_id    uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  claim_id   text        not null check (claim_id ~ '^[a-z0-9-]{1,80}$'),
  created_at timestamptz not null default now(),
  primary key (user_id, claim_id)
);

-- Row Level Security: people can only see and change their own saved claims.
alter table public.saved_claims enable row level security;

drop policy if exists "Read own saved claims" on public.saved_claims;
create policy "Read own saved claims"
  on public.saved_claims for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Save claims for yourself" on public.saved_claims;
create policy "Save claims for yourself"
  on public.saved_claims for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Remove own saved claims" on public.saved_claims;
create policy "Remove own saved claims"
  on public.saved_claims for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Signed-in people may read, add and remove rows (the policies above limit which rows).
-- Signed-out visitors get no access at all.
revoke all on public.saved_claims from anon;
grant select, insert, delete on public.saved_claims to authenticated;
