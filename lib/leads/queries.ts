import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import { TERMINAL_LEAD_STATUSES } from "@/lib/constants/leads";

export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type LeadInteraction =
  Database["public"]["Tables"]["lead_interactions"]["Row"];

/**
 * All leads visible to the current user (RLS decides: managers see everything,
 * a Capo PR sees only their own). Filtering/search happens client-side on top.
 */
export async function listLeads(): Promise<Lead[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .eq("is_archived", false)
    .order("updated_at", { ascending: false });
  return data ?? [];
}

/**
 * Leads with a follow-up date set (not archived, not in a terminal status),
 * oldest-due first. RLS scopes visibility exactly like listLeads(). The caller
 * splits these into "scaduti" vs "oggi" with isOverdue()/isToday(); leads whose
 * follow-up is still in the future are returned too but filtered out there.
 */
export async function listFollowUpsDue(): Promise<Lead[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .eq("is_archived", false)
    .not("next_follow_up_at", "is", null)
    .order("next_follow_up_at", { ascending: true });
  return (data ?? []).filter(
    (lead) => !TERMINAL_LEAD_STATUSES.has(lead.status),
  );
}

/**
 * Status-change history across all visible leads (RLS-scoped like listLeads),
 * used to reconstruct the furthest pipeline stage each lead ever reached — so a
 * lost lead is still attributed to where it dropped in the conversion funnel.
 */
export async function listLeadStatusChanges(): Promise<
  { lead_id: string; status: string }[]
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lead_interactions")
    .select("lead_id, body")
    .eq("type", "status_change");
  return (data ?? [])
    .map((r) => ({ lead_id: r.lead_id, status: r.body ?? "" }))
    .filter((r) => r.status !== "");
}

export async function getLead(id: string): Promise<Lead | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("*").eq("id", id).single();
  return data ?? null;
}

/** The activity log for a lead, newest first. RLS scopes visibility. */
export async function getLeadInteractions(
  leadId: string,
): Promise<LeadInteraction[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lead_interactions")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export interface DuplicateInfo {
  lead_id: string;
  owner_name: string;
  lead_status: string;
  last_update: string;
  can_open: boolean;
}

/** Global, privacy-aware duplicate check. Pass a normalized handle. */
export async function checkDuplicate(
  normalizedUsername: string,
): Promise<DuplicateInfo | null> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("check_lead_duplicate", {
    p_username: normalizedUsername,
  });
  return data && data.length > 0 ? (data[0] as DuplicateInfo) : null;
}
