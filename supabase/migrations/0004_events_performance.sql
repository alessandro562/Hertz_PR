-- ============================================================================
-- Hertz PR Hub — Phase 5: Events & Performance
-- Depends on 0001 (profiles, is_manager, handle_updated_at),
-- 0003 (teams, collaborators, owns_team).
-- Apply after 0003 in the Supabase SQL Editor.
-- ============================================================================

-- --- events -------------------------------------------------------------
create table public.events (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  event_date         timestamptz not null,
  venue              text,
  city               text,
  description        text,
  ticket_url         text,
  target_attendance  integer,
  status             text not null default 'bozza' check (status in (
    'bozza','in_preparazione','attivo','chiuso','completato','annullato'
  )),
  post_event_notes   text,
  created_by         uuid references public.profiles(id),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index events_date_idx on public.events(event_date);
create trigger events_set_updated_at before update on public.events
  for each row execute function public.handle_updated_at();

-- --- event_team_assignments (Manager decides which squads work an event) --
create table public.event_team_assignments (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null references public.events(id) on delete cascade,
  team_id     uuid not null references public.teams(id) on delete cascade,
  assigned_by uuid references public.profiles(id),
  notes       text,
  created_at  timestamptz not null default now(),
  unique(event_id, team_id)
);
create index event_team_assignments_event_idx on public.event_team_assignments(event_id);
create index event_team_assignments_team_idx on public.event_team_assignments(team_id);

-- --- event_collaborator_performances (numbers per collaborator per event) -
create table public.event_collaborator_performances (
  id                     uuid primary key default gen_random_uuid(),
  event_id               uuid not null references public.events(id) on delete cascade,
  collaborator_id        uuid not null references public.collaborators(id) on delete cascade,
  team_id                uuid references public.teams(id) on delete set null,
  capo_pr_user_id        uuid references public.profiles(id),
  confirmed_support      boolean not null default false,
  shared_story           boolean not null default false,
  broadcast_sent         boolean not null default false,
  list_names_count       integer not null default 0 check (list_names_count >= 0),
  tickets_sold_count     integer not null default 0 check (tickets_sold_count >= 0),
  tables_count           integer not null default 0 check (tables_count >= 0),
  actual_entries_count   integer not null default 0 check (actual_entries_count >= 0),
  negative_behavior      boolean not null default false,
  performance_score      integer not null default 0,
  notes                  text,
  updated_by             uuid references public.profiles(id),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  unique(event_id, collaborator_id)
);
create index ecp_event_idx on public.event_collaborator_performances(event_id);
create index ecp_team_idx on public.event_collaborator_performances(team_id);
create index ecp_collaborator_idx on public.event_collaborator_performances(collaborator_id);

-- Score formula (spec §15.1), computed server-side so it can't be spoofed by
-- the client. team_id/capo_pr_user_id are derived from the collaborator too,
-- not trusted from the client, so RLS scoping below can rely on them.
create or replace function public.compute_performance_row()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_collab public.collaborators;
  v_no_results boolean;
begin
  select * into v_collab from public.collaborators where id = new.collaborator_id;
  if v_collab.id is null then
    raise exception 'Collaboratore non trovato';
  end if;

  new.team_id := v_collab.team_id;
  new.capo_pr_user_id := v_collab.capo_pr_user_id;
  new.updated_by := auth.uid();

  v_no_results := (
    new.list_names_count = 0 and
    new.tickets_sold_count = 0 and
    new.tables_count = 0 and
    new.actual_entries_count = 0 and
    not new.shared_story and
    not new.broadcast_sent
  );

  new.performance_score :=
      (case when new.shared_story then 1 else 0 end)
    + (case when new.broadcast_sent then 1 else 0 end)
    + new.list_names_count
    + new.tickets_sold_count * 3
    + new.tables_count * 8
    + new.actual_entries_count * 2
    - (case when new.confirmed_support and v_no_results then 2 else 0 end)
    - (case when new.negative_behavior then 5 else 0 end);

  return new;
end;
$$;

create trigger event_collaborator_performances_compute
  before insert or update on public.event_collaborator_performances
  for each row execute function public.compute_performance_row();

create trigger event_collaborator_performances_set_updated_at
  before update on public.event_collaborator_performances
  for each row execute function public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.events                          enable row level security;
alter table public.event_team_assignments           enable row level security;
alter table public.event_collaborator_performances   enable row level security;

-- events: everyone authenticated reads; only Manager creates/edits/deletes.
create policy "events_select_authenticated" on public.events
  for select to authenticated using (true);
create policy "events_manager_all" on public.events
  for all to authenticated using (public.is_manager()) with check (public.is_manager());

-- event_team_assignments: everyone reads (so a Capo PR sees their team is
-- in); only Manager assigns/removes squads from an event.
create policy "eta_select_authenticated" on public.event_team_assignments
  for select to authenticated using (true);
create policy "eta_manager_all" on public.event_team_assignments
  for all to authenticated using (public.is_manager()) with check (public.is_manager());

-- event_collaborator_performances: everyone reads (rankings, cross-team
-- comparison per spec); Manager all; a Capo PR inserts/updates numbers only
-- for a collaborator that is theirs. Checked via the client-supplied
-- collaborator_id (not the trigger-derived team_id/capo_pr_user_id columns),
-- so this doesn't depend on BEFORE-trigger-vs-RLS-check ordering.
create policy "ecp_select_authenticated" on public.event_collaborator_performances
  for select to authenticated using (true);
create policy "ecp_manager_all" on public.event_collaborator_performances
  for all to authenticated using (public.is_manager()) with check (public.is_manager());
create policy "ecp_insert_own" on public.event_collaborator_performances
  for insert to authenticated
  with check (
    exists (
      select 1 from public.collaborators c
      where c.id = collaborator_id
        and (c.capo_pr_user_id = auth.uid() or c.created_by = auth.uid() or public.owns_team(c.team_id))
    )
  );
create policy "ecp_update_own" on public.event_collaborator_performances
  for update to authenticated
  using (
    exists (
      select 1 from public.collaborators c
      where c.id = collaborator_id
        and (c.capo_pr_user_id = auth.uid() or c.created_by = auth.uid() or public.owns_team(c.team_id))
    )
  )
  with check (
    exists (
      select 1 from public.collaborators c
      where c.id = collaborator_id
        and (c.capo_pr_user_id = auth.uid() or c.created_by = auth.uid() or public.owns_team(c.team_id))
    )
  );
