import type { Database, UserRole } from "./database";

/** App roles. `manager` sees/edits everything; `capo_pr` is scoped to own data. */
export type Role = UserRole;

/** A row from `public.profiles` — the app-level user record. */
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/** The authenticated context shared through the app shell. */
export interface CurrentUser {
  id: string;
  email: string;
  profile: Profile;
}
