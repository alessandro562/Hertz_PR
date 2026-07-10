import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { CurrentUser } from "@/types/domain";

/**
 * Returns the authenticated user + their profile, or null.
 * Wrapped in React `cache()` so calling it in both the protected layout and a
 * page only hits Supabase once per request.
 */
export const getSessionUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (!profile) return null;

  return {
    id: user.id,
    email: user.email ?? profile.email,
    profile,
  };
});
