import { createClient } from "@/lib/supabase/server";
import { ROLE } from "@/lib/constants/roles";
import type { Database } from "@/types/database";

export type Collaborator = Database["public"]["Tables"]["collaborators"]["Row"];
export type Team = Database["public"]["Tables"]["teams"]["Row"];
export type WhatsappGroup = Database["public"]["Tables"]["whatsapp_groups"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export async function listCollaborators(): Promise<Collaborator[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("collaborators")
    .select("*")
    .eq("is_archived", false)
    .order("updated_at", { ascending: false });
  return data ?? [];
}

export async function getCollaborator(id: string): Promise<Collaborator | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("collaborators")
    .select("*")
    .eq("id", id)
    .single();
  return data ?? null;
}

export async function getTeamCollaborators(teamId: string): Promise<Collaborator[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("collaborators")
    .select("*")
    .eq("team_id", teamId)
    .eq("is_archived", false)
    .order("updated_at", { ascending: false });
  return data ?? [];
}

export async function listTeams(): Promise<Team[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("teams")
    .select("*")
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function getTeam(id: string): Promise<Team | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("teams").select("*").eq("id", id).single();
  return data ?? null;
}

export async function getTeamForCapo(userId: string): Promise<Team | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("teams")
    .select("*")
    .eq("capo_pr_user_id", userId)
    .limit(1)
    .maybeSingle();
  return data ?? null;
}

export async function listGroupsForTeam(teamId: string): Promise<WhatsappGroup[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("whatsapp_groups")
    .select("*")
    .eq("team_id", teamId)
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function listGlobalGroups(): Promise<WhatsappGroup[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("whatsapp_groups")
    .select("*")
    .is("team_id", null)
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function listGroups(): Promise<WhatsappGroup[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("whatsapp_groups")
    .select("*")
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function getCollaboratorGroupIds(
  collaboratorId: string,
): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("collaborator_id", collaboratorId);
  return (data ?? []).map((r) => r.group_id);
}

export async function listProfiles(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*");
  return data ?? [];
}

export async function listCapiPr(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", ROLE.CAPO_PR)
    .eq("is_active", true);
  return data ?? [];
}

/** Map of profile id -> full name, for cheap "capo" / "owner" labels. */
export async function profilesNameMap(): Promise<Record<string, string>> {
  const profiles = await listProfiles();
  return Object.fromEntries(profiles.map((p) => [p.id, p.full_name]));
}
