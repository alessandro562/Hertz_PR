import type { EventStatus } from "@/types/database";

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  bozza: "Bozza",
  in_preparazione: "In preparazione",
  attivo: "Attivo",
  chiuso: "Chiuso",
  completato: "Completato",
  annullato: "Annullato",
};

export const EVENT_STATUSES = Object.keys(EVENT_STATUS_LABELS) as EventStatus[];

export function eventStatusTone(
  status: EventStatus,
): "neutral" | "active" | "positive" | "negative" {
  if (status === "attivo" || status === "in_preparazione") return "active";
  if (status === "completato") return "positive";
  if (status === "annullato") return "negative";
  return "neutral";
}
