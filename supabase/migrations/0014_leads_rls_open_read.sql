-- ============================================================================
-- Hertz PR Hub — Open lead visibility, restricted editing
-- Changes RLS on leads: all KPR see all leads, but only owner+master can edit.
-- Apply after 0013.
-- ============================================================================

-- Drop the restrictive select policy
drop policy if exists "leads_select_own" on public.leads;

-- New permissive select: all authenticated users see all leads
create policy "leads_select_all"
  on public.leads for select to authenticated
  using (true);

-- Delete old update policy and add new one that also blocks delete for non-owner
drop policy if exists "leads_update_own" on public.leads;

-- Update restricted to owner + manager
create policy "leads_update_own"
  on public.leads for update to authenticated
  using (public.is_manager() or owner_user_id = auth.uid() or created_by = auth.uid())
  with check (public.is_manager() or owner_user_id = auth.uid() or created_by = auth.uid());

-- Delete restricted to manager only (delete is dangerous)
create policy "leads_delete_manager"
  on public.leads for delete to authenticated
  using (public.is_manager());
