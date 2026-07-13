import type { LeadStatus, LeadPriority, LeadInterest } from "@/types/database";

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  da_contattare: "Da contattare",
  contattato: "Contattato",
  ha_risposto: "Ha risposto",
  interessato: "Interessato",
  da_spiegare: "Da spiegare",
  da_inserire_bacheca: "Da inserire in bacheca",
  inserito_bacheca: "In bacheca",
  da_inserire_squadra: "Da inserire in squadra",
  inserito_squadra: "In squadra",
  convertito_collaboratore: "Convertito",
  non_interessato: "Non interessato",
  non_risponde: "Non risponde",
  da_ricontattare: "Da ricontattare",
  scartato: "Scartato",
};

export const LEAD_STATUSES = Object.keys(LEAD_STATUS_LABELS) as LeadStatus[];

/**
 * Statuses where the lead is "done" — converted, or definitively lost. A lead in
 * one of these never needs a follow-up, so the "cosa fare oggi" view and the
 * hot-leads ranking both exclude them.
 */
export const TERMINAL_LEAD_STATUSES = new Set<LeadStatus>([
  "convertito_collaboratore",
  "non_interessato",
  "scartato",
]);

export const PRIORITY_LABELS: Record<LeadPriority, string> = {
  low: "Bassa",
  medium: "Media",
  high: "Alta",
};

export const INTEREST_LABELS: Record<LeadInterest, string> = {
  cold: "Freddo",
  warm: "Tiepido",
  hot: "Caldo",
};

// --- Pipeline (mobile tabs, spec §11.3) -------------------------------------
export type PipelineBucket =
  | "da_contattare"
  | "contattati"
  | "interessati"
  | "da_inserire"
  | "convertiti"
  | "persi";

export const PIPELINE_BUCKETS: { key: PipelineBucket; label: string }[] = [
  { key: "da_contattare", label: "Da contattare" },
  { key: "contattati", label: "Contattati" },
  { key: "interessati", label: "Interessati" },
  { key: "da_inserire", label: "Da inserire" },
  { key: "convertiti", label: "Convertiti" },
  { key: "persi", label: "Persi" },
];

const STATUS_TO_BUCKET: Record<LeadStatus, PipelineBucket> = {
  da_contattare: "da_contattare",
  da_ricontattare: "da_contattare",
  contattato: "contattati",
  non_risponde: "contattati",
  ha_risposto: "interessati",
  interessato: "interessati",
  da_spiegare: "interessati",
  da_inserire_bacheca: "da_inserire",
  inserito_bacheca: "da_inserire",
  da_inserire_squadra: "da_inserire",
  inserito_squadra: "da_inserire",
  convertito_collaboratore: "convertiti",
  non_interessato: "persi",
  scartato: "persi",
};

export function bucketForStatus(status: LeadStatus): PipelineBucket {
  return STATUS_TO_BUCKET[status];
}

/**
 * Happy-path progression, for the one-tap "Avanza" button. Ends at
 * inserito_bacheca — from there the person is converted via the Convert button,
 * not by picking a status. Negative/terminal states are reached from the menu.
 */
const NEXT_STATUS: Partial<Record<LeadStatus, LeadStatus>> = {
  da_contattare: "contattato",
  da_ricontattare: "contattato",
  contattato: "ha_risposto",
  ha_risposto: "interessato",
  interessato: "da_spiegare",
  da_spiegare: "da_inserire_bacheca",
  da_inserire_bacheca: "inserito_bacheca",
};

export function nextStatus(status: LeadStatus): LeadStatus | null {
  return NEXT_STATUS[status] ?? null;
}

/**
 * Statuses grouped by pipeline bucket for the manual status menu. Excludes
 * "convertito" (conversion is the Convert button's job) and empty buckets.
 */
export function statusesByBucket(): {
  key: PipelineBucket;
  label: string;
  statuses: LeadStatus[];
}[] {
  return PIPELINE_BUCKETS.map((b) => ({
    ...b,
    statuses: LEAD_STATUSES.filter(
      (s) => bucketForStatus(s) === b.key && s !== "convertito_collaboratore",
    ),
  })).filter((b) => b.statuses.length > 0);
}

/** Coarse tone for status badges. */
export function statusTone(
  status: LeadStatus,
): "new" | "neutral" | "active" | "warning" | "positive" | "negative" {
  if (status === "da_contattare") return "new";
  if (status === "da_ricontattare" || status === "non_risponde") return "warning";
  if (status === "convertito_collaboratore") return "positive";
  if (status === "non_interessato" || status === "scartato") return "negative";
  const bucket = STATUS_TO_BUCKET[status];
  if (bucket === "interessati" || bucket === "da_inserire") return "active";
  return "neutral";
}
