/**
 * Seeds the first Manager without email-confirmation friction.
 * Uses the service-role key to create a pre-confirmed auth user; the
 * handle_new_user() trigger then stamps the profile with role=manager
 * (read from user_metadata).
 *
 * Run: npm run seed:manager   (reads .env.local)
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
import { createClient } from "@supabase/supabase-js";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = process.env.SEED_MANAGER_EMAIL;
  const password = process.env.SEED_MANAGER_PASSWORD;
  const fullName = process.env.SEED_MANAGER_NAME ?? "Manager";

  if (!url || !serviceKey || !email || !password) {
    throw new Error(
      "Env mancanti. Servono: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SEED_MANAGER_EMAIL, SEED_MANAGER_PASSWORD.",
    );
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: "manager" },
  });

  if (error) throw error;
  console.log(`✓ Manager creato: ${email} (id: ${data.user?.id})`);
}

main().catch((err) => {
  console.error("Seed fallito:", err instanceof Error ? err.message : err);
  process.exit(1);
});
