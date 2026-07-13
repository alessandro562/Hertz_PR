import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Server-only Web Push sender. Uses the service-role admin client to read a
 * user's subscriptions (RLS-bypassing, needed from the unauthenticated cron)
 * and web-push to deliver. NEVER import this from a Client Component: it reads
 * VAPID_PRIVATE_KEY, a server-only secret.
 */

let configured = false;

/** Lazily wire VAPID details; returns false if the keys aren't set. */
function configure(): boolean {
  if (configured) return true;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:hertz@hertz.cc";
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
  return true;
}

export function isPushConfigured(): boolean {
  return configure();
}

export interface PushPayload {
  title: string;
  body: string;
  /** Where notificationclick should land (defaults to /oggi in the SW). */
  url?: string;
}

/**
 * Send a push to every subscription a user has. Dead subscriptions (the push
 * service replies 404/410 = Gone) are pruned so they don't pile up. Returns how
 * many pushes were actually delivered.
 */
export async function sendPushToUser(
  userId: string,
  payload: PushPayload,
): Promise<number> {
  if (!configure()) {
    throw new Error(
      "Chiavi VAPID mancanti: configura NEXT_PUBLIC_VAPID_PUBLIC_KEY e VAPID_PRIVATE_KEY su Vercel.",
    );
  }

  const admin = createAdminClient();
  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", userId);
  if (!subs || subs.length === 0) return 0;

  const body = JSON.stringify(payload);
  const dead: string[] = [];
  let sent = 0;

  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          body,
        );
        sent++;
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) dead.push(s.endpoint);
      }
    }),
  );

  if (dead.length > 0) {
    await admin.from("push_subscriptions").delete().in("endpoint", dead);
  }

  return sent;
}
