import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep @supabase/supabase-js (used by the service-role admin client in
  // lib/supabase/admin.ts) out of the server bundle: its lazy realtime/ws
  // requires break under Turbopack bundling and crash the /users route at
  // runtime. Externalizing it makes Node require it normally.
  serverExternalPackages: ["@supabase/supabase-js"],
};

export default nextConfig;
