"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/session";
import { isManager, isCapoPr } from "@/lib/permissions";
import { sendPushToUser } from "@/lib/push/send";

type SupabaseServer = Awaited<ReturnType<typeof createClient>>;

export interface AnnouncementState {
  error?: string;
  ok?: boolean;
}

/**
 * Push the announcement to the other login users (Manager + Capi PR). Best-effort:
 * a missing VAPID config or a dead subscription must never block publishing.
 */
async function notifyAnnouncement(
  supabase: SupabaseServer,
  authorId: string,
  title: string,
): Promise<void> {
  try {
    const { data: recipients } = await supabase
      .from("profiles")
      .select("id")
      .in("role", ["manager", "capo_pr"])
      .eq("is_active", true);
    const ids = (recipients ?? [])
      .map((r) => r.id)
      .filter((id) => id !== authorId);
    await Promise.all(
      ids.map((id) =>
        sendPushToUser(id, {
          title: "📣 Nuovo annuncio",
          body: title,
          url: "/bacheca",
        }).catch(() => 0),
      ),
    );
  } catch {
    // best-effort only
  }
}

export async function createAnnouncement(
  _prev: AnnouncementState,
  formData: FormData,
): Promise<AnnouncementState> {
  const current = await getSessionUser();
  if (!current) return { error: "Non autenticato." };
  if (!isManager(current.profile) && !isCapoPr(current.profile)) {
    return { error: "Solo Manager e Capi PR possono pubblicare." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!title) return { error: "Scrivi un titolo." };
  if (!body) return { error: "Scrivi il testo dell'annuncio." };

  const supabase = await createClient();
  const { error } = await supabase.from("announcements").insert({
    author_user_id: current.id,
    author_name: current.profile.full_name,
    title,
    body,
  });
  if (error) return { error: "Errore nella pubblicazione." };

  await notifyAnnouncement(supabase, current.id, title);

  revalidatePath("/bacheca");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteAnnouncement(id: string): Promise<{ error?: string }> {
  const current = await getSessionUser();
  if (!current) return { error: "Non autenticato." };
  const supabase = await createClient();
  // RLS lets the author delete their own and a Manager delete any.
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) return { error: "Impossibile eliminare l'annuncio." };
  revalidatePath("/bacheca");
  revalidatePath("/dashboard");
  return {};
}

export async function togglePin(
  id: string,
  pinned: boolean,
): Promise<{ error?: string }> {
  const current = await getSessionUser();
  if (!current || !isManager(current.profile)) {
    return { error: "Solo un Manager può mettere in evidenza." };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("announcements")
    .update({ pinned })
    .eq("id", id);
  if (error) return { error: "Operazione non riuscita." };
  revalidatePath("/bacheca");
  revalidatePath("/dashboard");
  return {};
}
