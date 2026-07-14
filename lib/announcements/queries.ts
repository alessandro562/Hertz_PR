import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type Announcement = Database["public"]["Tables"]["announcements"]["Row"];

/** All announcements — pinned first, then newest first. RLS: everyone reads. */
export async function listAnnouncements(): Promise<Announcement[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });
  return data ?? [];
}
