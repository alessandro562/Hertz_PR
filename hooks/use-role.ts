"use client";

import { useCurrentUser } from "./use-current-user";
import { ROLE } from "@/lib/constants/roles";
import type { Role } from "@/types/domain";

export function useRole(): Role {
  return useCurrentUser().profile.role;
}

export function useIsManager(): boolean {
  return useRole() === ROLE.MANAGER;
}
