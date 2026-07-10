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

/** Coarse tone for status badges. */
export function statusTone(
  status: LeadStatus,
): "neutral" | "active" | "positive" | "negative" {
  const bucket = STATUS_TO_BUCKET[status];
  if (bucket === "convertiti") return "positive";
  if (bucket === "persi") return "negative";
  if (bucket === "interessati" || bucket === "da_inserire") return "active";
  return "neutral";
}
