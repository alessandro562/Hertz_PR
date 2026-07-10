import type {
  CollaboratorLevel,
  CollaboratorStatus,
  GroupType,
} from "@/types/database";

export const LEVEL_LABELS: Record<CollaboratorLevel, string> = {
  bacheca: "Bacheca",
  collaboratore_occasionale: "Occasionale",
  sotto_pr: "Sotto PR",
  pr_attivo: "PR attivo",
  pr_stretto: "PR stretto",
  capo_pr: "Capo PR",
  core_team: "Core team",
};
export const LEVELS = Object.keys(LEVEL_LABELS) as CollaboratorLevel[];

export const COLLAB_STATUS_LABELS: Record<CollaboratorStatus, string> = {
  in_prova: "In prova",
  attivo: "Attivo",
  molto_attivo: "Molto attivo",
  occasionale: "Occasionale",
  dormiente: "Dormiente",
  da_riattivare: "Da riattivare",
  non_affidabile: "Non affidabile",
  uscito: "Uscito",
};
export const COLLAB_STATUSES = Object.keys(
  COLLAB_STATUS_LABELS,
) as CollaboratorStatus[];

export function collabStatusTone(
  s: CollaboratorStatus,
): "neutral" | "active" | "positive" | "negative" {
  if (s === "attivo" || s === "molto_attivo") return "positive";
  if (s === "dormiente" || s === "da_riattivare") return "active";
  if (s === "non_affidabile" || s === "uscito") return "negative";
  return "neutral";
}

export const GROUP_TYPE_LABELS: Record<GroupType, string> = {
  bacheca: "Bacheca",
  pr: "Gruppo PR",
  sotto_pr: "Gruppo sotto-PR",
};
export const GROUP_TYPES = Object.keys(GROUP_TYPE_LABELS) as GroupType[];
