"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/session";
import { createEventSchema } from "@/lib/validations/event";
import type { EventStatus } from "@/types/database";
import type { PerformanceInput } from "@/lib/performance";

function nullify(v: FormDataEntryValue | null | undefined): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length > 0 ? s : null;
}

export interface CreateEventState {
  error?: string;
}

export async function createEvent(
  _prev: CreateEventState,
  formData: FormData,
): Promise<CreateEventState> {
  const current = await getSessionUser();
  if (!current) return { error: "Non autenticato." };

  const parsed = createEventSchema.safeParse({
    name: formData.get("name") ?? "",
    event_date: formData.get("event_date") ?? "",
    venue: formData.get("venue") ?? undefined,
    city: formData.get("city") ?? undefined,
    description: formData.get("description") ?? undefined,
    target_attendance: formData.get("target_attendance") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  }

  const eventDate = new Date(parsed.data.event_date);
  if (Number.isNaN(eventDate.getTime())) {
    return { error: "Data non valida." };
  }

  const target = parsed.data.target_attendance
    ? Number(parsed.data.target_attendance)
    : null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .insert({
      name: parsed.data.name,
      event_date: eventDate.toISOString(),
      venue: nullify(parsed.data.venue),
      city: nullify(parsed.data.city),
      description: nullify(parsed.data.description),
      target_attendance: target && Number.isFinite(target) ? target : null,
      created_by: current.id,
    })
    .select("id")
    .single();
  if (error) return { error: "Errore nel creare l'evento (solo i manager possono)." };

  revalidatePath("/events");
  redirect(`/events/${data.id}`);
}

export async function setEventStatus(
  id: string,
  status: EventStatus,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("events").update({ status }).eq("id", id);
  if (error) return { error: "Impossibile aggiornare lo stato." };
  revalidatePath(`/events/${id}`);
  revalidatePath("/events");
  return {};
}

export async function assignTeamToEvent(
  eventId: string,
  teamId: string,
): Promise<{ error?: string }> {
  const current = await getSessionUser();
  if (!current) return { error: "Non autenticato." };
  const supabase = await createClient();
  const { error } = await supabase.from("event_team_assignments").insert({
    event_id: eventId,
    team_id: teamId,
    assigned_by: current.id,
  });
  if (error) return { error: "Impossibile assegnare la squadra (solo i manager possono)." };
  revalidatePath(`/events/${eventId}`);
  return {};
}

export async function unassignTeamFromEvent(
  eventId: string,
  teamId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("event_team_assignments")
    .delete()
    .eq("event_id", eventId)
    .eq("team_id", teamId);
  if (error) return { error: "Impossibile rimuovere la squadra." };
  revalidatePath(`/events/${eventId}`);
  return {};
}

export interface UpsertPerformanceInput extends PerformanceInput {
  event_id: string;
  collaborator_id: string;
  notes?: string | null;
}

/**
 * Save a collaborator's numbers for an event (spec §14.3). We never send
 * performance_score/team_id/capo_pr_user_id — the DB trigger derives and
 * computes those authoritatively, so the client can't spoof them.
 */
export async function upsertPerformance(
  input: UpsertPerformanceInput,
): Promise<{ error?: string }> {
  const clampCount = (n: number) => Math.max(0, Math.trunc(n) || 0);

  const supabase = await createClient();
  const { error } = await supabase.from("event_collaborator_performances").upsert(
    {
      event_id: input.event_id,
      collaborator_id: input.collaborator_id,
      confirmed_support: input.confirmed_support,
      shared_story: input.shared_story,
      broadcast_sent: input.broadcast_sent,
      list_names_count: clampCount(input.list_names_count),
      tickets_sold_count: clampCount(input.tickets_sold_count),
      tables_count: clampCount(input.tables_count),
      actual_entries_count: clampCount(input.actual_entries_count),
      negative_behavior: input.negative_behavior,
      notes: input.notes ?? null,
    },
    { onConflict: "event_id,collaborator_id" },
  );
  if (error) return { error: "Impossibile salvare i numeri." };

  revalidatePath(`/events/${input.event_id}`);
  revalidatePath(`/events/${input.event_id}/performance`);
  return {};
}
