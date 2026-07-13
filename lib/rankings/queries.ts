import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { EventPerformance } from "@/lib/events/queries";
import type { Lead } from "@/lib/leads/queries";
import { TERMINAL_LEAD_STATUSES } from "@/lib/constants/leads";

export type RankingCollaborator =
  Database["public"]["Functions"]["ranking_collaborators"]["Returns"][number];

/** Every performance row, across all events — the raw material for every ranking. */
export async function listAllPerformances(): Promise<EventPerformance[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("event_collaborator_performances").select("*");
  return data ?? [];
}

/**
 * Minimal, privacy-safe collaborator fields for cross-team leaderboards
 * (name/team/level/status only — see migration 0005 for why this is a
 * dedicated RPC instead of a direct `collaborators` select).
 */
export async function listRankingCollaborators(): Promise<RankingCollaborator[]> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("ranking_collaborators");
  return data ?? [];
}

/**
 * Hot leads with no follow-up date, or an overdue one (spec §16 ranking #7).
 * RLS on `leads` naturally scopes this: a Manager gets everyone's, a Capo PR
 * gets only their own — no extra filtering needed here.
 */
export async function listHotLeadsNeedingFollowUp(): Promise<Lead[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .eq("interest_level", "hot")
    .eq("is_archived", false);

  const now = Date.now();
  return (data ?? []).filter(
    (lead) =>
      !TERMINAL_LEAD_STATUSES.has(lead.status) &&
      (!lead.next_follow_up_at || new Date(lead.next_follow_up_at).getTime() < now),
  );
}
