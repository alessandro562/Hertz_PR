-- ============================================================================
-- Hertz PR Hub — 2 fix UX rinviati
-- Depends on 0002 (leads, check_lead_duplicate), 0004 (compute_performance_row).
-- Apply after 0009 in the Supabase SQL Editor.
--
-- A. check_lead_duplicate ora ritorna anche lead_id + can_open, così il banner
--    anti-duplicato può offrire "Apri scheda" (solo per i lead tuoi — la RLS
--    blocca comunque quelli altrui).
-- B. compute_performance_row: "Confermato senza numeri" non toglie più 2 punti
--    (prima della serata non è un demerito). Resta il -5 per comportamento neg.
-- ============================================================================

-- A. Nuova shape del RETURNS TABLE → drop + recreate (come 0006/0008).
drop function if exists public.check_lead_duplicate(text);

create function public.check_lead_duplicate(p_username text)
returns table (
  lead_id uuid,
  owner_name text,
  lead_status text,
  last_update timestamptz,
  can_open boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    l.id,
    coalesce(p.full_name, '—'),
    l.status,
    l.updated_at,
    (l.owner_user_id = auth.uid()
      or l.created_by = auth.uid()
      or public.is_manager())
  from public.leads l
  left join public.profiles p on p.id = coalesce(l.owner_user_id, l.created_by)
  where l.instagram_username = lower(p_username)
  limit 1;
$$;

grant execute on function public.check_lead_duplicate(text) to authenticated;

-- B. Punteggio: via il -2 per "confermato ma nessun risultato".
create or replace function public.compute_performance_row()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_collab public.collaborators;
begin
  select * into v_collab from public.collaborators where id = new.collaborator_id;
  if v_collab.id is null then
    raise exception 'Collaboratore non trovato';
  end if;

  new.team_id := v_collab.team_id;
  new.capo_pr_user_id := v_collab.capo_pr_user_id;
  new.updated_by := auth.uid();

  new.performance_score :=
      (case when new.shared_story then 1 else 0 end)
    + (case when new.broadcast_sent then 1 else 0 end)
    + new.list_names_count
    + new.tickets_sold_count * 3
    + new.tables_count * 8
    + new.actual_entries_count * 2
    - (case when new.negative_behavior then 5 else 0 end);

  return new;
end;
$$;
