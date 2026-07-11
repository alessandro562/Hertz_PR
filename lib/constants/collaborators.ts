import type {
  CollaboratorLevel,
  CollaboratorStatus,
  GroupType,
} from "@/types/database";

export const LEVEL_LABELS: Record<CollaboratorLevel, string> = {
  occasionale: "Occasionale",
  condivisioni_attive: "Condivisioni attive",
  pr_attivo: "PR attivo",
  pr_con_potenziale: "PR con potenziale",
};
export const LEVELS = Object.keys(LEVEL_LABELS) as CollaboratorLevel[];

/** One-liner per livello, per aiutare a taggare e analizzare i collaboratori. */
export const LEVEL_DESCRIPTIONS: Record<CollaboratorLevel, string> = {
  occasionale:
    "Potrebbe venire e condividere ogni tanto, ma è impegnato e non punta a partecipare attivamente.",
  condivisioni_attive:
    "Condivide attivamente, ma non è detto che venga con costanza alle serate.",
  pr_attivo: "Viene alle serate e porta gente in lista.",
  pr_con_potenziale:
    "Sposta tanta gente in lista; a breve può avere lista autonoma e sotto-PR.",
};

export const COLLAB_STATUS_LABELS: Record<CollaboratorStatus, string> = {
  attivo: "Attivo",
  affidabile: "Affidabile",
  inattivo: "Inattivo",
  da_riattivare: "Da riattivare",
};
export const COLLAB_STATUSES = Object.keys(
  COLLAB_STATUS_LABELS,
) as CollaboratorStatus[];

export function collabStatusTone(
  s: CollaboratorStatus,
): "new" | "neutral" | "active" | "warning" | "positive" | "negative" {
  if (s === "attivo") return "active";
  if (s === "affidabile") return "positive";
  if (s === "da_riattivare") return "warning";
  return "neutral"; // inattivo
}

export const GROUP_TYPE_LABELS: Record<GroupType, string> = {
  bacheca: "Bacheca",
  pr: "Gruppo PR",
  sotto_pr: "Gruppo sotto-PR",
};
export const GROUP_TYPES = Object.keys(GROUP_TYPE_LABELS) as GroupType[];
