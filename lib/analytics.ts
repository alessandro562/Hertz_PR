/**
 * Pure aggregation helpers for the /dati analytics page. No I/O — safe to run on
 * the server or (in the interactive dashboard) client-side inside useMemo. Mirror
 * of the style in lib/performance.ts. Domain wrappers pull their labels/order
 * from the constants so a chart shows every category (incl. zeros) in a sensible
 * order.
 */
import type { Lead } from "@/lib/leads/queries";
import type { Collaborator } from "@/lib/network/queries";
import type { TrendPoint } from "@/lib/performance-trends";
import type { LeadStatus } from "@/types/database";
import {
  PIPELINE_BUCKETS,
  bucketForStatus,
  LEAD_TYPES,
  LEAD_TYPE_LABELS,
  LEAD_TAGS,
} from "@/lib/constants/leads";
import {
  LEVELS,
  LEVEL_LABELS,
  COLLAB_STATUSES,
  COLLAB_STATUS_LABELS,
} from "@/lib/constants/collaborators";

export interface CountItem {
  key: string;
  label: string;
  count: number;
}

/** Count items by a key; returns {key,label,count} sorted desc. Null/empty keys skipped. */
export function countBy<T>(
  items: T[],
  keyFn: (item: T) => string | null | undefined,
  labelFn: (key: string) => string = (k) => k,
): CountItem[] {
  const map = new Map<string, number>();
  for (const it of items) {
    const k = keyFn(it);
    if (k == null || k === "") continue;
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([key, count]) => ({ key, label: labelFn(key), count }))
    .sort((a, b) => b.count - a.count);
}

/** Monday (ISO week start) of the week containing `iso`, as yyyy-MM-dd (UTC). */
export function weekStart(iso: string): string {
  const d = new Date(iso);
  const dayFromMonday = (d.getUTCDay() + 6) % 7; // 0 = Monday
  d.setUTCDate(d.getUTCDate() - dayFromMonday);
  return d.toISOString().slice(0, 10);
}

/**
 * Weekly counts, chronological, shaped as TrendChart points (x key = eventDate).
 * `series` is the column name the chart plots.
 */
export function byWeek<T>(
  items: T[],
  dateFn: (item: T) => string | null | undefined,
  series = "Nuovi",
): TrendPoint[] {
  const map = new Map<string, number>();
  for (const it of items) {
    const iso = dateFn(it);
    if (!iso) continue;
    const ws = weekStart(iso);
    map.set(ws, (map.get(ws) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([eventDate, count]) => ({ eventDate, [series]: count }));
}

/** Pipeline funnel: counts per bucket in PIPELINE order (not sorted by size). */
export function funnelCounts(leads: Lead[]): CountItem[] {
  const map = new Map<string, number>();
  for (const l of leads) {
    const b = bucketForStatus(l.status);
    map.set(b, (map.get(b) ?? 0) + 1);
  }
  return PIPELINE_BUCKETS.map((b) => ({
    key: b.key,
    label: b.label,
    count: map.get(b.key) ?? 0,
  }));
}

/** Lead counts by Tipo, all three shown in canonical order. */
export function leadTypeCounts(leads: Lead[]): CountItem[] {
  const map = new Map<string, number>();
  for (const l of leads) map.set(l.lead_type, (map.get(l.lead_type) ?? 0) + 1);
  return LEAD_TYPES.map((t) => ({
    key: t,
    label: LEAD_TYPE_LABELS[t],
    count: map.get(t) ?? 0,
  }));
}

/** Lead counts per etichetta (a lead contributes to each of its tags), desc. */
export function tagCounts(leads: Lead[]): CountItem[] {
  const map = new Map<string, number>();
  for (const l of leads) for (const t of l.tags) map.set(t, (map.get(t) ?? 0) + 1);
  return LEAD_TAGS.map((t) => ({
    key: t.value,
    label: t.label,
    count: map.get(t.value) ?? 0,
  })).sort((a, b) => b.count - a.count);
}

/** Lead counts by source, desc, capped to top N with the tail folded into "Altro". */
export function sourceCounts(leads: Lead[], topN = 6): CountItem[] {
  const all = countBy(leads, (l) => (l.source ?? "").trim() || null);
  if (all.length <= topN) return all;
  const rest = all.slice(topN).reduce((s, x) => s + x.count, 0);
  return [...all.slice(0, topN), { key: "__altro", label: "Altro", count: rest }];
}

export function collabByLevel(collabs: Collaborator[]): CountItem[] {
  const map = new Map<string, number>();
  for (const c of collabs) map.set(c.level, (map.get(c.level) ?? 0) + 1);
  return LEVELS.map((l) => ({
    key: l,
    label: LEVEL_LABELS[l],
    count: map.get(l) ?? 0,
  }));
}

export function collabByStatus(collabs: Collaborator[]): CountItem[] {
  const map = new Map<string, number>();
  for (const c of collabs) map.set(c.status, (map.get(c.status) ?? 0) + 1);
  return COLLAB_STATUSES.map((s) => ({
    key: s,
    label: COLLAB_STATUS_LABELS[s],
    count: map.get(s) ?? 0,
  }));
}

// --- Conversione (funnel qualità) -------------------------------------------

/** Stadi progressivi del funnel (esclusi i "persi", ramo laterale). */
export const PROGRESSIVE_BUCKETS = PIPELINE_BUCKETS.filter(
  (b) => b.key !== "persi",
);

/** Indice dello stadio progressivo di uno stato (0..N-1); -1 per "persi". */
export function progressiveIndex(status: LeadStatus): number {
  const bucket = bucketForStatus(status);
  return PROGRESSIVE_BUCKETS.findIndex((b) => b.key === bucket);
}

export interface FunnelStage {
  key: string;
  label: string;
  reached: number;
  /** % dei lead dello stadio precedente arrivati fin qui (100 per il primo). */
  conversionPct: number;
}

/**
 * Funnel di conversione da un elenco di "indice massimo raggiunto" per lead
 * (0..N-1): reached[i] = quanti hanno raggiunto almeno lo stadio i.
 */
export function conversionFunnel(reachedIndices: number[]): FunnelStage[] {
  const base = PROGRESSIVE_BUCKETS.map((b, i) => ({
    key: b.key,
    label: b.label,
    reached: reachedIndices.filter((r) => r >= i).length,
  }));
  return base.map((s, i) => ({
    ...s,
    conversionPct:
      i === 0
        ? 100
        : base[i - 1].reached > 0
          ? Math.round((s.reached / base[i - 1].reached) * 100)
          : 0,
  }));
}

export interface ConversionRow {
  key: string;
  label: string;
  total: number;
  converted: number;
  pct: number;
}

/** A lead counts as converted once it became a collaborator. */
export function isConvertedLead(lead: Lead): boolean {
  return (
    lead.converted_to_collaborator || lead.status === "convertito_collaboratore"
  );
}

function groupConversion(
  leads: Lead[],
  keyFn: (l: Lead) => string | null | undefined,
  labelFn: (key: string) => string,
): ConversionRow[] {
  const map = new Map<string, { total: number; converted: number }>();
  for (const l of leads) {
    const k = keyFn(l);
    if (k == null || k === "") continue;
    const cur = map.get(k) ?? { total: 0, converted: 0 };
    cur.total++;
    if (isConvertedLead(l)) cur.converted++;
    map.set(k, cur);
  }
  return [...map.entries()]
    .map(([key, v]) => ({
      key,
      label: labelFn(key),
      total: v.total,
      converted: v.converted,
      pct: v.total > 0 ? Math.round((v.converted / v.total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

/** Conversione per fonte del lead. */
export function conversionBySource(leads: Lead[]): ConversionRow[] {
  return groupConversion(leads, (l) => (l.source ?? "").trim() || null, (k) => k);
}

/** Conversione per owner (Capo/Manager) — volume vs qualità. */
export function conversionByOwner(
  leads: Lead[],
  names: Record<string, string>,
): ConversionRow[] {
  return groupConversion(
    leads,
    (l) => l.owner_user_id,
    (id) => names[id] ?? "—",
  );
}
