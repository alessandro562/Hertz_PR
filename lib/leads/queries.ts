import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type Lead = Database["public"]["Tables"]["leads"]["Row"];

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

export async function getLead(id: string): Promise<Lead | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("*").eq("id", id).single();
  return data ?? null;
}

export interface DuplicateInfo {
  owner_name: string;
  lead_status: string;
  last_update: string;
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
