import type { Role } from "@/types/domain";

/** Canonical role identifiers (mirror the DB `profiles.role` check constraint). */
export const ROLE = {
  MANAGER: "manager",
  CAPO_PR: "capo_pr",
} as const satisfies Record<string, Role>;

/** Human-readable labels (Italian, matching the product language). */
export const ROLE_LABELS: Record<Role, string> = {
  manager: "Manager",
  capo_pr: "Capo PR",
};
