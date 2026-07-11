"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/session";
import { isManager } from "@/lib/permissions";
import {
  createTeamSchema,
  createGroupSchema,
  updateCollaboratorSchema,
} from "@/lib/validations/network";
import type {
  CollaboratorLevel,
  CollaboratorStatus,
} from "@/types/database";

function nullify(v: FormDataEntryValue | null | undefined): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length > 0 ? s : null;
}

// --- Conversion -------------------------------------------------------------
export async function convertLead(
  leadId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("convert_lead_to_collaborator", {
    p_lead_id: leadId,
  });
  if (error) return { error: error.message };
  revalidatePath("/leads");
  revalidatePath("/collaborators");
  redirect(`/collaborators/${data}`);
}

// --- Collaborator quick edits ----------------------------------------------
export async function setCollaboratorLevel(
  id: string,
  level: CollaboratorLevel,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("collaborators")
    .update({ level })
    .eq("id", id);
  if (error) return { error: "Impossibile aggiornare il livello." };
  revalidatePath(`/collaborators/${id}`);
  revalidatePath("/collaborators");
  return {};
}

export async function setCollaboratorStatus(
  id: string,
  status: CollaboratorStatus,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("collaborators")
    .update({ status })
    .eq("id", id);
  if (error) return { error: "Impossibile aggiornare lo stato." };
  revalidatePath(`/collaborators/${id}`);
  revalidatePath("/collaborators");
  return {};
}

export async function setCollaboratorAvatar(
  id: string,
  avatarUrl: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("collaborators")
    .update({ avatar_url: avatarUrl })
    .eq("id", id);
  if (error) return { error: "Impossibile salvare la foto." };
  revalidatePath(`/collaborators/${id}`);
  revalidatePath("/collaborators");
  return {};
}

export async function assignCollaboratorTeam(
  id: string,
  teamId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const patch: { team_id: string | null; joined_team_at?: string } = {
    team_id: teamId || null,
  };
  if (teamId) {
    patch.joined_team_at = new Date().toISOString();
  }
  const { error } = await supabase
    .from("collaborators")
    .update(patch)
    .eq("id", id);
  if (error) return { error: "Impossibile assegnare la squadra." };
  revalidatePath(`/collaborators/${id}`);
  revalidatePath("/collaborators");
  return {};
}

/**
 * Pair a PR (collaborator) to a Capo PR. Manager-only in practice: RLS
 * `collaborators_manager_all` lets managers write any row, while a Capo PR is
 * blocked by the WITH CHECK of `collaborators_update_own` from moving a PR under
 * a different capo. Pass "" to clear the pairing.
 */
export async function assignCollaboratorCapo(
  id: string,
  capoUserId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("collaborators")
    .update({ capo_pr_user_id: capoUserId || null })
    .eq("id", id);
  if (error) return { error: "Impossibile assegnare il Capo PR." };
  revalidatePath(`/collaborators/${id}`);
  revalidatePath("/collaborators");
  revalidatePath("/capi-pr");
  return {};
}

/**
 * Hard-delete a collaborator (Manager only). If it came from a lead, that lead
 * is sent back to the pipeline (un-converted) instead of being left pointing at
 * a record that no longer exists.
 */
export async function deleteCollaborator(
  id: string,
): Promise<{ error?: string }> {
  const current = await getSessionUser();
  if (!current) return { error: "Non autenticato." };
  if (!isManager(current.profile)) {
    return { error: "Solo un Manager può eliminare un collaboratore." };
  }
  const supabase = await createClient();

  const { data: collab } = await supabase
    .from("collaborators")
    .select("lead_id")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("collaborators").delete().eq("id", id);
  if (error) return { error: "Impossibile eliminare il collaboratore." };

  if (collab?.lead_id) {
    await supabase
      .from("leads")
      .update({
        converted_to_collaborator: false,
        converted_collaborator_id: null,
        status: "da_contattare",
      })
      .eq("id", collab.lead_id);
  }

  revalidatePath("/collaborators");
  revalidatePath("/leads");
  return {};
}

export interface UpdateCollaboratorState {
  error?: string;
  ok?: boolean;
}

export async function updateCollaborator(
  _prev: UpdateCollaboratorState,
  formData: FormData,
): Promise<UpdateCollaboratorState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Collaboratore non trovato." };

  const parsed = updateCollaboratorSchema.safeParse({
    phone: formData.get("phone") ?? undefined,
    city: formData.get("city") ?? undefined,
    notes: formData.get("notes") ?? undefined,
    reliability_notes: formData.get("reliability_notes") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("collaborators")
    .update({
      phone: nullify(parsed.data.phone),
      city: nullify(parsed.data.city),
      notes: nullify(parsed.data.notes),
      reliability_notes: nullify(parsed.data.reliability_notes),
    })
    .eq("id", id);
  if (error) return { error: "Errore nel salvataggio." };
  revalidatePath(`/collaborators/${id}`);
  return { ok: true };
}

// --- Group membership -------------------------------------------------------
export async function toggleGroupMembership(
  collaboratorId: string,
  groupId: string,
  isMember: boolean,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  if (isMember) {
    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("collaborator_id", collaboratorId)
      .eq("group_id", groupId);
    if (error) return { error: "Impossibile rimuovere dal gruppo." };
  } else {
    const { error } = await supabase
      .from("group_members")
      .insert({ collaborator_id: collaboratorId, group_id: groupId });
    if (error) return { error: "Impossibile aggiungere al gruppo." };
  }
  revalidatePath(`/collaborators/${collaboratorId}`);
  return {};
}

// --- Teams & groups creation -----------------------------------------------
export interface CreateState {
  error?: string;
}

export async function createTeam(
  _prev: CreateState,
  formData: FormData,
): Promise<CreateState> {
  const current = await getSessionUser();
  if (!current) return { error: "Non autenticato." };

  const parsed = createTeamSchema.safeParse({
    name: formData.get("name") ?? "",
    description: formData.get("description") ?? undefined,
    capo_pr_user_id: formData.get("capo_pr_user_id") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teams")
    .insert({
      name: parsed.data.name,
      description: nullify(parsed.data.description),
      capo_pr_user_id: parsed.data.capo_pr_user_id,
      created_by: current.id,
    })
    .select("id")
    .single();
  if (error) return { error: "Errore nel creare la squadra (solo i manager possono)." };

  revalidatePath("/teams");
  redirect(`/teams/${data.id}`);
}

export async function createGroup(
  _prev: CreateState,
  formData: FormData,
): Promise<CreateState> {
  const current = await getSessionUser();
  if (!current) return { error: "Non autenticato." };

  const parsed = createGroupSchema.safeParse({
    name: formData.get("name") ?? "",
    type: formData.get("type") ?? "pr",
    invite_link: formData.get("invite_link") ?? undefined,
    team_id: formData.get("team_id") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("whatsapp_groups").insert({
    name: parsed.data.name,
    type: parsed.data.type,
    invite_link: nullify(parsed.data.invite_link),
    team_id: parsed.data.team_id ?? null,
    created_by: current.id,
  });
  if (error) return { error: "Errore nel creare il gruppo." };

  if (parsed.data.team_id) {
    revalidatePath(`/teams/${parsed.data.team_id}`);
  } else {
    revalidatePath("/teams");
  }
  return {};
}
