"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/auth/session";
import { isManager } from "@/lib/permissions";
import { createUserSchema } from "@/lib/validations/users";
import type { CurrentUser } from "@/types/domain";

/**
 * Gate for every user-management action. The admin client bypasses RLS, so this
 * server-side manager check is the ONLY thing protecting these operations.
 */
async function requireManager(): Promise<CurrentUser | null> {
  const current = await getSessionUser();
  if (!current || !isManager(current.profile)) return null;
  return current;
}

export interface CreateUserState {
  error?: string;
  created?: { email: string; password: string; full_name: string };
}

export async function createUser(
  _prev: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  const manager = await requireManager();
  if (!manager) return { error: "Solo i Manager possono creare utenti." };

  const parsed = createUserSchema.safeParse({
    full_name: formData.get("full_name") ?? "",
    email: formData.get("email") ?? "",
    role: formData.get("role") ?? "capo_pr",
    password: formData.get("password") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  }
  const { full_name, email, role, password } = parsed.data;

  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch {
    return {
      error:
        "Configurazione mancante: aggiungi SUPABASE_SERVICE_ROLE_KEY tra le Environment Variables su Vercel e ridistribuisci.",
    };
  }

  try {
    const { error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, role },
    });
    if (error) {
      const msg = error.message?.toLowerCase() ?? "";
      if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
        return { error: "Esiste già un utente con questa email." };
      }
      return { error: "Impossibile creare l'utente." };
    }
  } catch {
    return { error: "Impossibile creare l'utente (servizio non raggiungibile)." };
  }
  // The handle_new_user() trigger creates the matching public.profiles row.

  revalidatePath("/users");
  return { created: { email, password, full_name } };
}

export async function setUserActive(
  id: string,
  active: boolean,
): Promise<{ error?: string }> {
  const manager = await requireManager();
  if (!manager) return { error: "Solo i Manager possono farlo." };
  if (id === manager.id && !active) {
    return { error: "Non puoi disattivare il tuo stesso account." };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ is_active: active })
    .eq("id", id);
  if (error) return { error: "Impossibile aggiornare lo stato dell'utente." };
  revalidatePath("/users");
  return {};
}

export async function resetUserPassword(
  id: string,
  password: string,
): Promise<{ error?: string }> {
  const manager = await requireManager();
  if (!manager) return { error: "Solo i Manager possono farlo." };
  if (!password || password.length < 8) {
    return { error: "La password deve avere almeno 8 caratteri." };
  }
  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch {
    return {
      error: "Configurazione mancante: aggiungi SUPABASE_SERVICE_ROLE_KEY su Vercel.",
    };
  }
  try {
    const { error } = await admin.auth.admin.updateUserById(id, { password });
    if (error) return { error: "Impossibile reimpostare la password." };
  } catch {
    return { error: "Impossibile reimpostare la password (servizio non raggiungibile)." };
  }
  return {};
}
