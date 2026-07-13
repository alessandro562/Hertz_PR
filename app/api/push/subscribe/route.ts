import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Save (upsert) the browser's push subscription for the current user. Called
 * from the client with the session cookie present, so RLS binds the row to
 * auth.uid(). The endpoint is unique → re-subscribing the same device updates.
 */
export async function POST(request: Request) {
  const current = await getSessionUser();
  if (!current) {
    return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
  }

  let body: {
    endpoint?: string;
    p256dh?: string;
    auth?: string;
    user_agent?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body non valido." }, { status: 400 });
  }

  if (!body.endpoint || !body.p256dh || !body.auth) {
    return NextResponse.json({ error: "Subscription incompleta." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: current.id,
      endpoint: body.endpoint,
      p256dh: body.p256dh,
      auth: body.auth,
      user_agent: body.user_agent ?? null,
    },
    { onConflict: "endpoint" },
  );

  if (error) {
    return NextResponse.json({ error: "Salvataggio non riuscito." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

/** Remove a subscription (called on unsubscribe). */
export async function DELETE(request: Request) {
  const current = await getSessionUser();
  if (!current) {
    return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
  }

  let body: { endpoint?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body non valido." }, { status: 400 });
  }
  if (!body.endpoint) {
    return NextResponse.json({ error: "Endpoint mancante." }, { status: 400 });
  }

  const supabase = await createClient();
  await supabase.from("push_subscriptions").delete().eq("endpoint", body.endpoint);
  return NextResponse.json({ ok: true });
}
