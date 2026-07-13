import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPushToUser } from "@/lib/push/send";
import { TERMINAL_LEAD_STATUSES } from "@/lib/constants/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Daily "cosa fare oggi" digest. Triggered by Vercel Cron (see vercel.json).
 * A cron request has no session, so it is authenticated with a shared secret;
 * the proxy whitelists /api/cron so this route is actually reached.
 *
 * Reads every lead whose follow-up is due (overdue or today) via the service-
 * role admin client (RLS-bypassing), groups by owner, and pushes one digest per
 * owner who has at least one due follow-up and an active subscription.
 */
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const cutoff = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999),
  );

  const admin = createAdminClient();
  const { data: leads, error } = await admin
    .from("leads")
    .select("owner_user_id, status, next_follow_up_at, is_archived")
    .eq("is_archived", false)
    .not("next_follow_up_at", "is", null)
    .lte("next_follow_up_at", cutoff.toISOString());

  if (error) {
    return NextResponse.json({ error: "Query fallita." }, { status: 500 });
  }

  // Count due follow-ups per owner (skip terminal statuses and unowned leads).
  const perOwner = new Map<string, number>();
  for (const l of leads ?? []) {
    if (!l.owner_user_id) continue;
    if (TERMINAL_LEAD_STATUSES.has(l.status)) continue;
    perOwner.set(l.owner_user_id, (perOwner.get(l.owner_user_id) ?? 0) + 1);
  }

  let notified = 0;
  let pushes = 0;
  for (const [userId, count] of perOwner) {
    const body =
      count === 1
        ? "Hai 1 follow-up da fare oggi"
        : `Hai ${count} follow-up da fare oggi`;
    try {
      const sent = await sendPushToUser(userId, {
        title: "hertz PR Hub",
        body,
        url: "/oggi",
      });
      if (sent > 0) notified++;
      pushes += sent;
    } catch {
      // A single user's failure (e.g. missing keys) shouldn't abort the run.
    }
  }

  return NextResponse.json({ ok: true, owners: perOwner.size, notified, pushes });
}
