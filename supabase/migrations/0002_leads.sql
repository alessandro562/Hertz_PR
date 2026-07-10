-- ============================================================================
-- Hertz PR Hub — Phase 2: Lead CRM
-- leads table + RLS + privacy-aware global duplicate check.
-- Apply after 0001. Depends on: public.profiles, public.handle_updated_at,
-- public.is_manager (from 0001).
-- ============================================================================

create table public.leads (
  id                        uuid primary key default gen_random_uuid(),
  first_name                text,
  last_name                 text,
  -- normalized handle (lowercase, no @) — enforced app-side; unique = anti-dup
  instagram_username        text not null unique,
  instagram_url             text,
  phone                     text,
  city                      text,
  source                    text,
  status                    text not null default 'da_contattare'
    check (status in (
      'da_contattare','contattato','ha_risposto','interessato','da_spiegare',
      'da_inserire_bacheca','inserito_bacheca','da_inserire_squadra',
      'inserito_squadra','convertito_collaboratore','non_interessato',
      'non_risponde','da_ricontattare','scartato'
    )),
  priority                  text not null default 'medium'
    check (priority in ('low','medium','high')),
  interest_level            text not null default 'warm'
    check (interest_level in ('cold','warm','hot')),
  owner_user_id             uuid references public.profiles(id),
  owner_team_id             uuid, -- FK to public.teams added in Phase 4
  created_by                uuid references public.profiles(id),
  next_action               text,
  notes                     text,
  last_contact_at           timestamptz,
  next_follow_up_at         timestamptz,
  converted_to_collaborator boolean not null default false,
  converted_collaborator_id uuid,
  is_archived               boolean not null default false,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create index leads_owner_user_id_idx  on public.leads(owner_user_id);
create index leads_created_by_idx      on public.leads(created_by);
create index leads_status_idx          on public.leads(status);
create index leads_next_follow_up_idx  on public.leads(next_follow_up_at);

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: managers do everything; a Capo PR reads/edits only leads they own or
-- created. Multiple permissive policies are OR-combined by Postgres.
-- ---------------------------------------------------------------------------
alter table public.leads enable row level security;

create policy "leads_manager_all"
  on public.leads for all to authenticated
  using (public.is_manager()) with check (public.is_manager());

create policy "leads_insert_own"
  on public.leads for insert to authenticated
  with check (created_by = auth.uid());

create policy "leads_select_own"
  on public.leads for select to authenticated
  using (owner_user_id = auth.uid() or created_by = auth.uid());

create policy "leads_update_own"
  on public.leads for update to authenticated
  using (owner_user_id = auth.uid() or created_by = auth.uid())
  with check (owner_user_id = auth.uid() or created_by = auth.uid());

-- ---------------------------------------------------------------------------
-- Global anti-duplicate (spec §11.5), privacy-aware.
-- SECURITY DEFINER so a Capo PR learns "this @ is already taken by Fede"
-- WITHOUT being able to read the whole lead (which RLS still hides).
-- Returns a single row only when a match exists; empty = no duplicate.
-- The app passes an already-normalized handle; lower() is a safety net.
-- ---------------------------------------------------------------------------
create or replace function public.check_lead_duplicate(p_username text)
returns table (owner_name text, lead_status text, last_update timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(p.full_name, '—'), l.status, l.updated_at
  from public.leads l
  left join public.profiles p on p.id = coalesce(l.owner_user_id, l.created_by)
  where l.instagram_username = lower(p_username)
  limit 1;
$$;

grant execute on function public.check_lead_duplicate(text) to authenticated;
