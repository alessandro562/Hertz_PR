-- ============================================================================
-- Hertz PR Hub — Phase 4: Teams, Collaborators, WhatsApp Groups
-- Depends on 0001 (profiles, is_manager, handle_updated_at) and 0002 (leads).
-- Apply after 0002 in the Supabase SQL Editor.
-- ============================================================================

-- --- teams (squadre PR) -----------------------------------------------------
create table public.teams (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  description     text,
  capo_pr_user_id uuid not null references public.profiles(id),
  is_active       boolean not null default true,
  created_by      uuid references public.profiles(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index teams_capo_idx on public.teams(capo_pr_user_id);
create trigger teams_set_updated_at before update on public.teams
  for each row execute function public.handle_updated_at();

-- owns_team(): deferred from Phase 1 (needed teams). SECURITY DEFINER.
create or replace function public.owns_team(team_uuid uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.teams
    where id = team_uuid and capo_pr_user_id = auth.uid()
  );
$$;
grant execute on function public.owns_team(uuid) to authenticated;

-- --- collaborators ----------------------------------------------------------
create table public.collaborators (
  id                 uuid primary key default gen_random_uuid(),
  lead_id            uuid unique references public.leads(id) on delete set null,
  first_name         text,
  last_name          text,
  instagram_username text not null unique,
  instagram_url      text,
  phone              text,
  city               text,
  level              text not null default 'bacheca' check (level in (
    'bacheca','collaboratore_occasionale','sotto_pr','pr_attivo',
    'pr_stretto','capo_pr','core_team'
  )),
  status             text not null default 'in_prova' check (status in (
    'in_prova','attivo','molto_attivo','occasionale','dormiente',
    'da_riattivare','non_affidabile','uscito'
  )),
  team_id            uuid references public.teams(id) on delete set null,
  capo_pr_user_id    uuid references public.profiles(id),
  notes              text,
  reliability_notes  text,
  joined_board_at    timestamptz,
  joined_team_at     timestamptz,
  last_active_at     timestamptz,
  is_archived        boolean not null default false,
  created_by         uuid references public.profiles(id),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index collaborators_team_idx on public.collaborators(team_id);
create index collaborators_capo_idx on public.collaborators(capo_pr_user_id);
create trigger collaborators_set_updated_at before update on public.collaborators
  for each row execute function public.handle_updated_at();

-- --- WhatsApp groups (bacheca / gruppi PR / sotto-PR) -----------------------
create table public.whatsapp_groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  type        text not null default 'pr'
    check (type in ('bacheca','pr','sotto_pr')),
  invite_link text,
  team_id     uuid references public.teams(id) on delete set null,
  created_by  uuid references public.profiles(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger whatsapp_groups_set_updated_at before update on public.whatsapp_groups
  for each row execute function public.handle_updated_at();

create table public.group_members (
  id              uuid primary key default gen_random_uuid(),
  group_id        uuid not null references public.whatsapp_groups(id) on delete cascade,
  collaborator_id uuid not null references public.collaborators(id) on delete cascade,
  joined_at       timestamptz not null default now(),
  unique(group_id, collaborator_id)
);

-- --- Lead -> Collaborator conversion (atomic, permission-checked) -----------
create or replace function public.convert_lead_to_collaborator(p_lead_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_lead public.leads;
  v_uid uuid := auth.uid();
  v_collab_id uuid;
begin
  select * into v_lead from public.leads where id = p_lead_id;
  if v_lead.id is null then raise exception 'Lead non trovato'; end if;

  if not (public.is_manager()
          or v_lead.owner_user_id = v_uid
          or v_lead.created_by = v_uid) then
    raise exception 'Non autorizzato a convertire questo lead';
  end if;

  if v_lead.converted_to_collaborator then
    return v_lead.converted_collaborator_id;
  end if;

  insert into public.collaborators (
    lead_id, first_name, last_name, instagram_username, instagram_url,
    phone, city, level, status, capo_pr_user_id, created_by, joined_board_at
  ) values (
    v_lead.id, v_lead.first_name, v_lead.last_name, v_lead.instagram_username,
    v_lead.instagram_url, v_lead.phone, v_lead.city, 'bacheca', 'in_prova',
    coalesce(v_lead.owner_user_id, v_uid), v_uid, now()
  ) returning id into v_collab_id;

  update public.leads
    set converted_to_collaborator = true,
        converted_collaborator_id = v_collab_id,
        status = 'convertito_collaboratore'
    where id = p_lead_id;

  return v_collab_id;
end;
$$;
grant execute on function public.convert_lead_to_collaborator(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.teams            enable row level security;
alter table public.collaborators    enable row level security;
alter table public.whatsapp_groups  enable row level security;
alter table public.group_members    enable row level security;

-- teams: everyone authenticated can see (transparency/rankings); managers do
-- everything; a Capo PR can edit their own team.
create policy "teams_select_authenticated" on public.teams
  for select to authenticated using (true);
create policy "teams_manager_all" on public.teams
  for all to authenticated using (public.is_manager()) with check (public.is_manager());
create policy "teams_update_own" on public.teams
  for update to authenticated
  using (capo_pr_user_id = auth.uid()) with check (capo_pr_user_id = auth.uid());

-- collaborators: managers all; a Capo PR manages their own (by capo, team or creator).
create policy "collaborators_manager_all" on public.collaborators
  for all to authenticated using (public.is_manager()) with check (public.is_manager());
create policy "collaborators_insert_own" on public.collaborators
  for insert to authenticated with check (created_by = auth.uid());
create policy "collaborators_select_own" on public.collaborators
  for select to authenticated using (
    capo_pr_user_id = auth.uid() or created_by = auth.uid() or public.owns_team(team_id)
  );
create policy "collaborators_update_own" on public.collaborators
  for update to authenticated using (
    capo_pr_user_id = auth.uid() or created_by = auth.uid() or public.owns_team(team_id)
  ) with check (
    capo_pr_user_id = auth.uid() or created_by = auth.uid() or public.owns_team(team_id)
  );

-- whatsapp_groups: everyone authenticated can read (to grab invite links);
-- managers all; a Capo PR manages groups tied to their team.
create policy "groups_select_authenticated" on public.whatsapp_groups
  for select to authenticated using (true);
create policy "groups_manager_all" on public.whatsapp_groups
  for all to authenticated using (public.is_manager()) with check (public.is_manager());
create policy "groups_insert_capo" on public.whatsapp_groups
  for insert to authenticated with check (public.owns_team(team_id));
create policy "groups_update_capo" on public.whatsapp_groups
  for update to authenticated
  using (public.owns_team(team_id)) with check (public.owns_team(team_id));

-- group_members: everyone authenticated can read; managers all; a Capo PR
-- manages memberships for collaborators they own.
create policy "gm_select_authenticated" on public.group_members
  for select to authenticated using (true);
create policy "gm_manage" on public.group_members
  for all to authenticated
  using (
    public.is_manager() or exists (
      select 1 from public.collaborators c
      where c.id = collaborator_id
        and (c.capo_pr_user_id = auth.uid() or c.created_by = auth.uid())
    )
  )
  with check (
    public.is_manager() or exists (
      select 1 from public.collaborators c
      where c.id = collaborator_id
        and (c.capo_pr_user_id = auth.uid() or c.created_by = auth.uid())
    )
  );
