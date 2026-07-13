-- ============================================================================
-- Hertz PR Hub — Notifiche Web Push
-- Salva le subscription push del browser (una per dispositivo/utente) così il
-- cron giornaliero può inviare il promemoria "cosa fare oggi".
-- Apply after 0010. Depends on: public.profiles (0001), public.is_manager (0001).
-- ============================================================================

create table public.push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  -- l'endpoint del push service identifica univocamente la subscription:
  -- ri-abbonarsi dallo stesso dispositivo fa upsert su questo vincolo
  endpoint    text not null unique,
  p256dh      text not null,
  auth        text not null,
  user_agent  text,
  created_at  timestamptz not null default now()
);

create index push_subscriptions_user_idx on public.push_subscriptions(user_id);

-- ---------------------------------------------------------------------------
-- RLS: ognuno gestisce SOLO le proprie subscription; il Manager tutte. Il cron
-- legge con il service-role admin client (bypassa la RLS), quindi qui basta
-- coprire insert/update/delete/select lato browser.
-- ---------------------------------------------------------------------------
alter table public.push_subscriptions enable row level security;

create policy "push_subscriptions_manager_all"
  on public.push_subscriptions for all to authenticated
  using (public.is_manager()) with check (public.is_manager());

create policy "push_subscriptions_select_own"
  on public.push_subscriptions for select to authenticated
  using (user_id = auth.uid());

create policy "push_subscriptions_insert_own"
  on public.push_subscriptions for insert to authenticated
  with check (user_id = auth.uid());

create policy "push_subscriptions_update_own"
  on public.push_subscriptions for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "push_subscriptions_delete_own"
  on public.push_subscriptions for delete to authenticated
  using (user_id = auth.uid());
