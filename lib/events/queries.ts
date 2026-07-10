import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type Event = Database["public"]["Tables"]["events"]["Row"];
export type EventTeamAssignment =
  Database["public"]["Tables"]["event_team_assignments"]["Row"];
export type EventPerformance =
  Database["public"]["Tables"]["event_collaborator_performances"]["Row"];

/** Soonest-upcoming first, so the operational "what's next" view is the default. */
export async function listEvents(): Promise<Event[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });
  return data ?? [];
}

export async function getEvent(id: string): Promise<Event | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("events").select("*").eq("id", id).single();
  return data ?? null;
}

export async function getEventTeamAssignments(
  eventId: string,
): Promise<EventTeamAssignment[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("event_team_assignments")
    .select("*")
    .eq("event_id", eventId);
  return data ?? [];
}

export async function getEventPerformances(
  eventId: string,
): Promise<EventPerformance[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("event_collaborator_performances")
    .select("*")
    .eq("event_id", eventId);
  return data ?? [];
}

/** A collaborator's history across every event (spec §12.4 "Storico eventi"). */
export async function getCollaboratorPerformances(
  collaboratorId: string,
): Promise<EventPerformance[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("event_collaborator_performances")
    .select("*")
    .eq("collaborator_id", collaboratorId);
  return data ?? [];
}
