-- ============================================================================
-- Hertz PR Hub — Phase 1: Auth & Roles
-- Creates public.profiles, role helpers, RLS policies, and the signup trigger.
-- Apply via the Supabase SQL Editor (hosted) or `npx supabase db reset` (local).
-- ============================================================================

-- Keep updated_at fresh on every UPDATE.
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles: the app-level user record (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null,
  email      text not null unique,
  role       text not null check (role in ('manager', 'capo_pr')),
  avatar_url text,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- Role helpers.
-- SECURITY DEFINER so they read profiles while BYPASSING RLS. This is what
-- prevents infinite recursion when the profiles policies themselves call
-- is_manager(). `set search_path = ''` forces fully-qualified names (security).
-- ---------------------------------------------------------------------------
create or replace function public.is_manager()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'manager' and is_active = true
  );
$$;

create or replace function public.is_capo_pr()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'capo_pr' and is_active = true
  );
$$;

grant execute on function public.is_manager() to authenticated;
grant execute on function public.is_capo_pr() to authenticated;

-- NOTE: public.owns_team(uuid) is intentionally DEFERRED to the teams migration
-- (Phase 4). It references public.teams, which does not exist yet — adding it
-- here would make this migration fail.

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Any authenticated user can read profiles (needed for attribution, rankings,
-- and "assigned to" labels). Not sensitive within this internal tool.
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

-- A user can update their own row (name/avatar). Privileged columns are locked
-- down by the guard trigger below.
create policy "profiles_update_self"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Managers can do anything to any profile.
create policy "profiles_manager_all"
  on public.profiles for all
  to authenticated
  using (public.is_manager())
  with check (public.is_manager());

-- Prevent privilege escalation: a non-manager updating their own row must not
-- change role / is_active / email / id. (RLS WITH CHECK can't see OLD values,
-- so this is enforced with a BEFORE UPDATE trigger. Managers pass through.)
create or replace function public.enforce_profile_update_guard()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (
       new.role      is distinct from old.role
    or new.is_active is distinct from old.is_active
    or new.email     is distinct from old.email
    or new.id        is distinct from old.id
  ) and not public.is_manager() then
    raise exception 'Only managers can change role, active status, id or email';
  end if;
  return new;
end;
$$;

create trigger profiles_guard_privileged_update
  before update on public.profiles
  for each row execute function public.enforce_profile_update_guard();

-- ---------------------------------------------------------------------------
-- Auto-create a profile on signup.
-- role/full_name come from user_metadata (set by the seed script or Studio).
-- New users default to 'capo_pr'; the first Manager is seeded with role=manager.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'capo_pr')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
