"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/session";
import { isManager } from "@/lib/permissions";
import { normalizeInstagramUsername, instagramUrl } from "@/lib/instagram";
import { checkDuplicate, type DuplicateInfo } from "@/lib/leads/queries";
import { createLeadSchema, updateLeadSchema } from "@/lib/validations/lead";
import type { LeadStatus } from "@/types/database";

function nullify(v: FormDataEntryValue | null | undefined): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length > 0 ? s : null;
}

type SupabaseServer = Awaited<ReturnType<typeof createClient>>;
type SessionUser = NonNullable<Awaited<ReturnType<typeof getSessionUser>>>;
type InteractionType =
  | "note"
  | "status_change"
  | "contacted"
  | "created"
  | "converted";

/** Append one entry to a lead's activity log (author denormalized for display). */
async function insertInteraction(
  supabase: SupabaseServer,
  current: SessionUser,
  leadId: string,
  type: InteractionType,
  body: string | null,
): Promise<void> {
  await supabase.from("lead_interactions").insert({
    lead_id: leadId,
    author_user_id: current.id,
    author_name: current.profile.full_name,
    type,
    body,
  });
}

export interface CreateLeadState {
  error?: string;
  duplicate?: {
    lead_id: string;
    owner_name: string;
    lead_status: string;
    can_open: boolean;
  };
}

/** Live, privacy-safe duplicate lookup as the @ is typed in the new-lead form. */
export async function checkLeadDuplicate(
  username: string,
): Promise<DuplicateInfo | null> {
  const normalized = normalizeInstagramUsername(username);
  if (normalized.length < 2) return null;
  return checkDuplicate(normalized);
}

export async function createLead(
  _prev: CreateLeadState,
  formData: FormData,
): Promise<CreateLeadState> {
  const current = await getSessionUser();
  if (!current) return { error: "Sessione scaduta, rientra." };

  const parsed = createLeadSchema.safeParse({
    instagram_username: formData.get("instagram_username") ?? "",
    first_name: formData.get("first_name") ?? undefined,
    last_name: formData.get("last_name") ?? undefined,
    phone: formData.get("phone") ?? undefined,
    city: formData.get("city") ?? undefined,
    source: formData.get("source") ?? undefined,
    priority: formData.get("priority") ?? undefined,
    interest_level: formData.get("interest_level") ?? undefined,
    notes: formData.get("notes") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  }

  const username = normalizeInstagramUsername(parsed.data.instagram_username);
  if (!username) return { error: "@ Instagram non valido." };

  const supabase = await createClient();

  const { data: dup } = await supabase.rpc("check_lead_duplicate", {
    p_username: username,
  });
  if (dup && dup.length > 0) {
    return {
      duplicate: {
        lead_id: dup[0].lead_id,
        owner_name: dup[0].owner_name,
        lead_status: dup[0].lead_status,
        can_open: dup[0].can_open,
      },
    };
  }

  const { data, error } = await supabase
    .from("leads")
    .insert({
      instagram_username: username,
      instagram_url: instagramUrl(username),
      first_name: nullify(parsed.data.first_name),
      last_name: nullify(parsed.data.last_name),
      phone: nullify(parsed.data.phone),
      city: nullify(parsed.data.city),
      source: nullify(parsed.data.source),
      priority: parsed.data.priority ?? "medium",
      interest_level: parsed.data.interest_level ?? "warm",
      notes: nullify(parsed.data.notes),
      owner_user_id: current.id,
      created_by: current.id,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        duplicate: {
          lead_id: "",
          owner_name: "un altro PR",
          lead_status: "",
          can_open: false,
        },
      };
    }
    return { error: "Errore nel salvataggio del lead." };
  }

  await insertInteraction(supabase, current, data.id, "created", null);

  revalidatePath("/leads");
  redirect(`/leads/${data.id}`);
}

export interface UpdateLeadState {
  error?: string;
  ok?: boolean;
}

export async function updateLead(
  _prev: UpdateLeadState,
  formData: FormData,
): Promise<UpdateLeadState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Lead non trovato." };

  const parsed = updateLeadSchema.safeParse({
    first_name: formData.get("first_name") ?? undefined,
    last_name: formData.get("last_name") ?? undefined,
    phone: formData.get("phone") ?? undefined,
    city: formData.get("city") ?? undefined,
    source: formData.get("source") ?? undefined,
    priority: formData.get("priority") ?? undefined,
    interest_level: formData.get("interest_level") ?? undefined,
    next_action: formData.get("next_action") ?? undefined,
    notes: formData.get("notes") ?? undefined,
    next_follow_up_at: formData.get("next_follow_up_at") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({
      first_name: nullify(parsed.data.first_name),
      last_name: nullify(parsed.data.last_name),
      phone: nullify(parsed.data.phone),
      city: nullify(parsed.data.city),
      source: nullify(parsed.data.source),
      priority: parsed.data.priority ?? "medium",
      interest_level: parsed.data.interest_level ?? "warm",
      next_action: nullify(parsed.data.next_action),
      notes: nullify(parsed.data.notes),
      next_follow_up_at: nullify(parsed.data.next_follow_up_at),
    })
    .eq("id", id);

  if (error) return { error: "Errore nel salvataggio." };

  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
  return { ok: true };
}

export async function setLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<{ error?: string }> {
  const current = await getSessionUser();
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) return { error: "Impossibile aggiornare lo stato." };
  if (current) await insertInteraction(supabase, current, id, "status_change", status);
  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
  return {};
}

export interface AddNoteState {
  error?: string;
  ok?: boolean;
}

export async function addLeadNote(
  _prev: AddNoteState,
  formData: FormData,
): Promise<AddNoteState> {
  const current = await getSessionUser();
  if (!current) return { error: "Non autenticato." };
  const leadId = String(formData.get("lead_id") ?? "");
  const body = nullify(formData.get("body"));
  if (!leadId) return { error: "Lead non trovato." };
  if (!body) return { error: "Scrivi qualcosa." };

  const supabase = await createClient();
  await insertInteraction(supabase, current, leadId, "note", body);
  await supabase
    .from("leads")
    .update({ last_contact_at: new Date().toISOString() })
    .eq("id", leadId);
  revalidatePath("/leads");
  revalidatePath(`/leads/${leadId}`);
  return { ok: true };
}

/** Quick "I just reached out" — logs a contact and bumps last_contact_at. */
export async function logLeadContact(leadId: string): Promise<{ error?: string }> {
  const current = await getSessionUser();
  if (!current) return { error: "Non autenticato." };
  const supabase = await createClient();
  await insertInteraction(supabase, current, leadId, "contacted", null);
  await supabase
    .from("leads")
    .update({ last_contact_at: new Date().toISOString() })
    .eq("id", leadId);
  revalidatePath("/leads");
  revalidatePath(`/leads/${leadId}`);
  return {};
}

export async function assignOwnerToMe(
  id: string,
): Promise<{ error?: string }> {
  const current = await getSessionUser();
  if (!current) return { error: "Non autenticato." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ owner_user_id: current.id })
    .eq("id", id);
  if (error) return { error: "Impossibile assegnare il lead." };
  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
  return {};
}

export interface BulkResult {
  error?: string;
  count?: number;
}

/**
 * Change status on many leads at once. RLS scopes which of `ids` actually
 * update (a Capo PR only touches their own; a Manager touches all), so no extra
 * ownership check is needed here — mirrors setLeadStatus() with `.in()` and a
 * single batched interaction insert instead of one round-trip per lead.
 */
export async function bulkSetLeadStatus(
  ids: string[],
  status: LeadStatus,
): Promise<BulkResult> {
  const current = await getSessionUser();
  if (!current) return { error: "Non autenticato." };
  if (ids.length === 0) return { count: 0 };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .update({ status })
    .in("id", ids)
    .select("id");
  if (error) return { error: "Impossibile aggiornare gli stati." };

  const changedIds = (data ?? []).map((r) => r.id);
  if (changedIds.length > 0) {
    await supabase.from("lead_interactions").insert(
      changedIds.map((leadId) => ({
        lead_id: leadId,
        author_user_id: current.id,
        author_name: current.profile.full_name,
        type: "status_change" as const,
        body: status,
      })),
    );
  }

  revalidatePath("/leads");
  revalidatePath("/oggi");
  return { count: changedIds.length };
}

/** Assign many leads to the current user at once (mirrors assignOwnerToMe). */
export async function bulkAssignOwner(ids: string[]): Promise<BulkResult> {
  const current = await getSessionUser();
  if (!current) return { error: "Non autenticato." };
  if (ids.length === 0) return { count: 0 };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .update({ owner_user_id: current.id })
    .in("id", ids)
    .select("id");
  if (error) return { error: "Impossibile assegnare i lead." };

  revalidatePath("/leads");
  revalidatePath("/oggi");
  return { count: (data ?? []).length };
}

/**
 * Hard-delete a lead (Manager only). If it was converted, the linked
 * collaborator is the same person, so we remove that record too. Deleting
 * frees the unique @, so the lead can be re-created (useful while testing).
 */
export async function deleteLead(id: string): Promise<{ error?: string }> {
  const current = await getSessionUser();
  if (!current) return { error: "Non autenticato." };
  if (!isManager(current.profile)) {
    return { error: "Solo un Manager può eliminare un lead." };
  }
  const supabase = await createClient();

  const { data: lead } = await supabase
    .from("leads")
    .select("converted_collaborator_id")
    .eq("id", id)
    .maybeSingle();
  if (lead?.converted_collaborator_id) {
    await supabase
      .from("collaborators")
      .delete()
      .eq("id", lead.converted_collaborator_id);
  }

  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) return { error: "Impossibile eliminare il lead." };

  revalidatePath("/leads");
  revalidatePath("/collaborators");
  return {};
}

export async function setLeadAvatar(
  id: string,
  avatarUrl: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ avatar_url: avatarUrl })
    .eq("id", id);
  if (error) return { error: "Impossibile salvare la foto." };
  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
  return {};
}
