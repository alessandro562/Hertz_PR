import type { Profile, Role } from "@/types/domain";
import { ROLE } from "./constants/roles";

/**
 * UX-level permission predicates. These mirror the database Row Level Security
 * policies but are NOT the source of truth — RLS in Postgres is what actually
 * enforces access. Use these only to show/hide UI affordances.
 */

export function isManager(profile: Pick<Profile, "role"> | null | undefined): boolean {
  return profile?.role === ROLE.MANAGER;
}

export function isCapoPr(profile: Pick<Profile, "role"> | null | undefined): boolean {
  return profile?.role === ROLE.CAPO_PR;
}

export function hasRole(profile: Pick<Profile, "role"> | null | undefined, role: Role): boolean {
  return profile?.role === role;
}

/**
 * Can the current user edit a lead? Managers can edit anything; a Capo PR can
 * edit a lead they own or created.
 */
export function canEditLead(
  profile: Pick<Profile, "id" | "role"> | null | undefined,
  lead: { owner_user_id?: string | null; created_by?: string | null } | null | undefined,
): boolean {
  if (!profile) return false;
  if (isManager(profile)) return true;
  if (!lead) return false;
  return lead.owner_user_id === profile.id || lead.created_by === profile.id;
}

/**
 * Can the current user edit a collaborator? Managers can edit anything; a
 * Capo PR can edit a collaborator they own or created.
 */
export function canEditCollaborator(
  profile: Pick<Profile, "id" | "role"> | null | undefined,
  collaborator:
    | { capo_pr_user_id?: string | null; created_by?: string | null }
    | null
    | undefined,
): boolean {
  if (!profile) return false;
  if (isManager(profile)) return true;
  if (!collaborator) return false;
  return (
    collaborator.capo_pr_user_id === profile.id ||
    collaborator.created_by === profile.id
  );
}

/** Can the current user manage a team (its groups, settings)? */
export function canManageTeam(
  profile: Pick<Profile, "id" | "role"> | null | undefined,
  team: { capo_pr_user_id?: string | null } | null | undefined,
): boolean {
  if (!profile) return false;
  if (isManager(profile)) return true;
  if (!team) return false;
  return team.capo_pr_user_id === profile.id;
}
