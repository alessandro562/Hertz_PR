-- ============================================================================
-- Hertz PR Hub — Fase 3: timeline & note sul lead
-- Registro immutabile di interazioni per-lead (note, cambi stato, contatti).
-- Apply after 0006. Depends on: public.leads (0002), public.profiles (0001),
-- public.is_manager (0001).
-- ============================================================================

create table public.lead_interactions (
  id              uuid primary key default gen_random_uuid(),
  lead_id         uuid not null references public.leads(id) on delete cascade,
  author_user_id  uuid references public.profiles(id),
  -- denormalized so the timeline renders without a join to profiles
  author_name     text,
  type            text not null
    check (type in ('note','status_change','contacted','created','converted')),
  -- free note text, or the new status value for a status_change
  body            text,
  created_at      timestamptz not null default now()
);

create index lead_interactions_lead_idx
  on public.lead_interactions(lead_id, created_at desc);

-- ---------------------------------------------------------------------------
-- RLS mirrors the leads table: a Capo PR sees/logs interactions only for a
-- lead they own or created; a Manager does everything. The log is immutable
-- for a Capo PR (no update/delete) — only inserts.
-- ---------------------------------------------------------------------------
alter table public.lead_interactions enable row level security;

create policy "lead_interactions_manager_all"
  on public.lead_interactions for all to authenticated
  using (public.is_manager()) with check (public.is_manager());

create policy "lead_interactions_select_own"
  on public.lead_interactions for select to authenticated
  using (
    exists (
      select 1 from public.leads l
      where l.id = lead_id
        and (l.owner_user_id = auth.uid() or l.created_by = auth.uid())
    )
  );

create policy "lead_interactions_insert_own"
  on public.lead_interactions for insert to authenticated
  with check (
    author_user_id = auth.uid()
    and exists (
      select 1 from public.leads l
      where l.id = lead_id
        and (l.owner_user_id = auth.uid() or l.created_by = auth.uid())
    )
  );
