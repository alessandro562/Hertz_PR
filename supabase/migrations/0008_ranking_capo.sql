-- ============================================================================
-- Hertz PR Hub — "Via le squadre": raggruppa per Capo PR
-- Depends on 0003 (collaborators.capo_pr_user_id), 0006 (ranking_collaborators).
-- Apply after 0007 in the Supabase SQL Editor.
--
-- The app is moving off the "Squadra" (team) layer and groups everything by
-- Capo PR instead. Rankings/dormancy read the collaborator's capo, but
-- ranking_collaborators() only exposed team_id. Add capo_pr_user_id (both
-- columns already live on public.collaborators). team_id stays returned but
-- dormant so nothing else breaks. Additive migration — nothing destructive.
--
-- Postgres won't let CREATE OR REPLACE change a function's RETURNS TABLE shape,
-- so drop and recreate (same pattern as 0006).
-- ============================================================================

drop function if exists public.ranking_collaborators();

create function public.ranking_collaborators()
returns table (
  id uuid,
  first_name text,
  last_name text,
  instagram_username text,
  avatar_url text,
  team_id uuid,
  capo_pr_user_id uuid,
  level text,
  status text,
  last_active_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select id, first_name, last_name, instagram_username, avatar_url,
         team_id, capo_pr_user_id, level, status, last_active_at
  from public.collaborators
  where is_archived = false;
$$;

grant execute on function public.ranking_collaborators() to authenticated;
