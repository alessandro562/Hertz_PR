import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth/session";
import { isManager } from "@/lib/permissions";
import { ManagerDashboard } from "@/components/dashboard/manager-dashboard";
import { CapoPrDashboard } from "@/components/dashboard/capo-pr-dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  // The protected layout already guaranteed an active user; this call is
  // deduped by React cache(). We re-read it only to branch on role.
  const current = await getSessionUser();
  if (!current) return null;

  const firstName = current.profile.full_name.split(" ")[0];

  return isManager(current.profile) ? (
    <ManagerDashboard name={firstName} />
  ) : (
    <CapoPrDashboard name={firstName} />
  );
}
