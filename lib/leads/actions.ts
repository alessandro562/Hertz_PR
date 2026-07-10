"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/session";
import { normalizeInstagramUsername, instagramUrl } from "@/lib/instagram";
import { createLeadSchema, updateLeadSchema } from "@/lib/validations/lead";
import type { LeadStatus } from "@/types/database";

function nullify(v: FormDataEntryValue | null | undefined): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length > 0 ? s : null;
}

export interface CreateLeadState {
  error?: string;
  duplicate?: { owner_name: string; lead_status: string };
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
        owner_name: dup[0].owner_name,
        lead_status: dup[0].lead_status,
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
      return { duplicate: { owner_name: "un altro PR", lead_status: "" } };
    }
    return { error: "Errore nel salvataggio del lead." };
  }

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
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) return { error: "Impossibile aggiornare lo stato." };
  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
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
