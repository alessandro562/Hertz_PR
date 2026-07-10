import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { SUPABASE_URL } from "./config";

/**
 * Service-role Supabase client — bypasses RLS entirely.
 *
 * SECURITY: only ever use this inside server code that has ALREADY verified the
 * caller is a manager (see lib/users/actions.ts). Never import it into a Client
 * Component. The key is read from SUPABASE_SERVICE_ROLE_KEY, which is NOT a
 * NEXT_PUBLIC var, so it is never inlined into the browser bundle; if this file
 * were ever bundled client-side the key would be undefined and this throws
 * rather than leaking anything.
 */
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY mancante: configurala tra le Environment Variables server su Vercel (mai come NEXT_PUBLIC_).",
    );
  }
  return createClient<Database>(SUPABASE_URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
