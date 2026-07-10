import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UsersRound } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { getTeamForCapo } from "@/lib/network/queries";
import { isManager } from "@/lib/permissions";
import { ComingSoon } from "@/components/common/coming-soon";

export const metadata: Metadata = { title: "La mia squadra" };

export default async function MyTeamPage() {
  const current = await getSessionUser();
  if (!current) return null;

  // Managers have no "own" team — send them to the full overview instead.
  if (isManager(current.profile)) redirect("/teams");

  const team = await getTeamForCapo(current.id);
  if (team) redirect(`/teams/${team.id}`);

  return (
    <ComingSoon
      title="La mia squadra"
      icon={UsersRound}
      description="Non hai ancora una squadra assegnata. Chiedi a un Manager di crearla e assegnartela da Squadre PR."
    />
  );
}
