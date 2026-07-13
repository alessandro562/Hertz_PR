-- ============================================================================
-- Hertz PR Hub — Classificazione lead: tipo + etichette
-- Distingue i contatti (PR / festaiolo / supporter social) e aggiunge etichette
-- (tag da una lista fissa gestita lato app). Additiva e non distruttiva: i lead
-- esistenti restano 'pr' e senza tag, quindi nulla cambia per loro.
-- Apply after 0011. Depends on: public.leads (0002).
-- ============================================================================

alter table public.leads
  add column lead_type text not null default 'pr'
    check (lead_type in ('pr', 'festaiolo', 'supporter_social'));

alter table public.leads
  add column tags text[] not null default '{}';

create index leads_type_idx on public.leads (lead_type);
create index leads_tags_idx on public.leads using gin (tags);
