-- ============================================================================
-- Hertz PR Hub — UX pass: avatar photos for leads & collaborators
-- Depends on 0002 (leads), 0003 (collaborators, teams, owns_team, is_manager).
-- Apply after 0005 in the Supabase SQL Editor.
--
-- No automated Instagram photo/name fetch here on purpose: Instagram has no
-- public API for reading a third party's profile photo/name, and scraping it
-- would violate their Terms of Service and is unreliable in practice. This
-- migration instead supports a fast MANUAL upload (screenshot -> 2 taps).
-- ============================================================================

alter table public.leads add column avatar_url text;
alter table public.collaborators add column avatar_url text;

-- ranking_collaborators() (migration 0005) now needs to return avatar_url too,
-- for the leaderboards to show photos. Postgres won't let CREATE OR REPLACE
-- change a function's RETURNS TABLE shape, so drop and recreate.
drop function if exists public.ranking_collaborators();

create function public.ranking_collaborators()
returns table (
  id uuid,
  first_name text,
  last_name text,
  instagram_username text,
  avatar_url text,
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
  select id, first_name, last_name, instagram_username, avatar_url, team_id, level, status, last_active_at
  from public.collaborators
  where is_archived = false;
$$;

grant execute on function public.ranking_collaborators() to authenticated;

-- Public bucket: avatars are shown in cards/lists across the app; nothing
-- sensitive lives in the image itself, and object keys are opaque UUIDs.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Object key convention: "leads/<lead_id>" or "collaborators/<collaborator_id>".
-- Writers must own (or manage) the lead/collaborator the path names — same
-- ownership rule as editing that row directly.
create policy "avatars_write_own_lead"
on storage.objects for all
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = 'leads'
  and exists (
    select 1 from public.leads l
    where l.id::text = (storage.foldername(name))[2]
      and (l.owner_user_id = auth.uid() or l.created_by = auth.uid() or public.is_manager())
  )
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = 'leads'
  and exists (
    select 1 from public.leads l
    where l.id::text = (storage.foldername(name))[2]
      and (l.owner_user_id = auth.uid() or l.created_by = auth.uid() or public.is_manager())
  )
);

create policy "avatars_write_own_collaborator"
on storage.objects for all
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = 'collaborators'
  and exists (
    select 1 from public.collaborators c
    where c.id::text = (storage.foldername(name))[2]
      and (
        c.capo_pr_user_id = auth.uid()
        or c.created_by = auth.uid()
        or public.owns_team(c.team_id)
        or public.is_manager()
      )
  )
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = 'collaborators'
  and exists (
    select 1 from public.collaborators c
    where c.id::text = (storage.foldername(name))[2]
      and (
        c.capo_pr_user_id = auth.uid()
        or c.created_by = auth.uid()
        or public.owns_team(c.team_id)
        or public.is_manager()
      )
  )
);
