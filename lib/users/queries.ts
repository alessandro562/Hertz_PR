import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/domain";

/** All app users (profiles), newest first. A Manager reads every profile via RLS. */
export async function listUsers(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}
