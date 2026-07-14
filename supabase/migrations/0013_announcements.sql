-- ============================================================================
-- Hertz PR Hub — Bacheca: annunci in-app
-- Il Manager/Capo pubblica un annuncio per coordinare la squadra senza WhatsApp;
-- tutti gli utenti con login lo leggono (e ricevono una notifica push).
-- Apply after 0012. Depends on: public.profiles (0001), public.is_manager /
-- public.is_capo_pr (0001).
-- ============================================================================

create table public.announcements (
  id              uuid primary key default gen_random_uuid(),
  author_user_id  uuid references public.profiles(id),
  author_name     text, -- denormalizzato per il render senza join
  title           text not null,
  body            text not null,
  pinned          boolean not null default false,
  created_at      timestamptz not null default now()
);

create index announcements_created_idx on public.announcements(created_at desc);

-- ---------------------------------------------------------------------------
-- RLS: tutti gli autenticati leggono; Manager e Capo pubblicano (autore =
-- se stessi); l'autore elimina i propri; il Manager gestisce tutto (pin/elimina).
-- ---------------------------------------------------------------------------
alter table public.announcements enable row level security;

create policy "announcements_manager_all"
  on public.announcements for all to authenticated
  using (public.is_manager()) with check (public.is_manager());

create policy "announcements_select_all"
  on public.announcements for select to authenticated
  using (true);

create policy "announcements_insert_staff"
  on public.announcements for insert to authenticated
  with check (
    author_user_id = auth.uid()
    and (public.is_manager() or public.is_capo_pr())
  );

create policy "announcements_delete_own"
  on public.announcements for delete to authenticated
  using (author_user_id = auth.uid());
