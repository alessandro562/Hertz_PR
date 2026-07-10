/**
 * Supabase connection config, resolved once.
 * Supports both key namings so the app works whichever the dashboard/Vercel
 * gives you:
 *   - NEW:    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (sb_publishable_…)
 *   - LEGACY: NEXT_PUBLIC_SUPABASE_ANON_KEY (eyJ… JWT)
 * Both references are static, so Next.js inlines them into the client bundle.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;
