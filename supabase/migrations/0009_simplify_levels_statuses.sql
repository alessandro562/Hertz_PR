-- ============================================================================
-- Hertz PR Hub — Semplificazione livelli e stati dei collaboratori
-- Depends on 0003 (collaborators, convert_lead_to_collaborator).
-- Apply after 0008 in the Supabase SQL Editor.
--
-- Meno voci, più chiare da gestire e analizzare:
--   Livello: occasionale · condivisioni_attive · pr_attivo · pr_con_potenziale
--   Stato:   attivo · affidabile · inattivo · da_riattivare
-- Rimappa i dati esistenti, aggiorna i default e la funzione di conversione,
-- e ripulisce gli abbinamenti Capo PR "orfani".
-- ============================================================================

-- 1. Via i vecchi CHECK e i default, così possiamo rimappare liberamente.
alter table public.collaborators drop constraint if exists collaborators_level_check;
alter table public.collaborators drop constraint if exists collaborators_status_check;
alter table public.collaborators alter column level drop default;
alter table public.collaborators alter column status drop default;

-- 2. Rimappa le righe esistenti al nuovo vocabolario.
update public.collaborators set level = case level
  when 'bacheca' then 'occasionale'
  when 'collaboratore_occasionale' then 'occasionale'
  when 'sotto_pr' then 'pr_attivo'
  when 'pr_attivo' then 'pr_attivo'
  when 'pr_stretto' then 'pr_con_potenziale'
  when 'capo_pr' then 'pr_con_potenziale'
  when 'core_team' then 'pr_con_potenziale'
  else 'occasionale'
end;

update public.collaborators set status = case status
  when 'in_prova' then 'attivo'
  when 'attivo' then 'attivo'
  when 'molto_attivo' then 'affidabile'
  when 'occasionale' then 'inattivo'
  when 'dormiente' then 'inattivo'
  when 'da_riattivare' then 'da_riattivare'
  when 'non_affidabile' then 'inattivo'
  when 'uscito' then 'inattivo'
  else 'attivo'
end;

-- 3. Nuovi default + CHECK.
alter table public.collaborators alter column level set default 'occasionale';
alter table public.collaborators alter column status set default 'attivo';
alter table public.collaborators add constraint collaborators_level_check
  check (level in ('occasionale','condivisioni_attive','pr_attivo','pr_con_potenziale'));
alter table public.collaborators add constraint collaborators_status_check
  check (status in ('attivo','affidabile','inattivo','da_riattivare'));

-- 4. Abbinamenti Capo PR "orfani": un capo_pr_user_id che punta a un non-Capo-PR
--    (es. conversioni fatte da un Manager) va azzerato → bucket "Senza Capo PR".
update public.collaborators c
set capo_pr_user_id = null
where c.capo_pr_user_id is not null
  and not exists (
    select 1 from public.profiles p
    where p.id = c.capo_pr_user_id
      and p.role = 'capo_pr'
      and p.is_active = true
  );

-- 5. La conversione crea collaboratori con i nuovi default e abbina al Capo PR
--    solo se chi possiede il lead è davvero un Capo PR attivo (altrimenti resta
--    "Senza Capo PR", da abbinare a mano dal Manager).
create or replace function public.convert_lead_to_collaborator(p_lead_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_lead public.leads;
  v_uid uuid := auth.uid();
  v_capo uuid;
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

  -- Abbina al Capo PR solo se l'owner del lead è un Capo PR attivo.
  select p.id into v_capo from public.profiles p
    where p.id = v_lead.owner_user_id and p.role = 'capo_pr' and p.is_active = true;

  insert into public.collaborators (
    lead_id, first_name, last_name, instagram_username, instagram_url,
    phone, city, level, status, capo_pr_user_id, created_by, joined_board_at
  ) values (
    v_lead.id, v_lead.first_name, v_lead.last_name, v_lead.instagram_username,
    v_lead.instagram_url, v_lead.phone, v_lead.city, 'occasionale', 'attivo',
    v_capo, v_uid, now()
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
