-- ============================================================================
-- Hertz PR Hub — Phase 6: Ranking & Analytics
-- Depends on 0001 (profiles), 0003 (teams, collaborators).
-- Apply after 0004 in the Supabase SQL Editor.
-- ============================================================================

-- Named cross-team leaderboards are an explicit product goal (spec §5 "i capi
-- PR vedono molto, ma modificano poco"; §9 "Top Collaboratore"; §16 "I capi
-- PR possono vedere le classifiche"), but public.collaborators' own RLS
-- (collaborators_select_own) intentionally restricts a Capo PR to only their
-- OWN collaborators — needed for Fase 4's editing boundary, wrong for a
-- read-only leaderboard. Rather than loosen that policy (and risk widening
-- write-adjacent visibility), expose a narrow, privacy-aware read surface:
-- just enough to render a name + team + status, none of phone/notes/
-- reliability_notes. Same pattern as check_lead_duplicate() in migration 0002.
create or replace function public.ranking_collaborators()
returns table (
  id uuid,
  first_name text,
  last_name text,
  instagram_username text,
  team_id uuid,
  level text,
  status text,
  last_active_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select id, first_name, last_name, instagram_username, team_id, level, status, last_active_at
  from public.collaborators
  where is_archived = false;
$$;

grant execute on function public.ranking_collaborators() to authenticated;
