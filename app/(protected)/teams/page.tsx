import type { Metadata } from "next";
import { UsersRound } from "lucide-react";
import { ComingSoon } from "@/components/common/coming-soon";

export const metadata: Metadata = { title: "Squadre PR" };

export default function TeamsPage() {
  return (
    <ComingSoon
      title="Squadre PR"
      phase="Fase 4"
      icon={UsersRound}
      description="Panoramica di tutte le squadre PR: capi, membri, attivi, dormienti e performance per squadra. Visibile ai Manager."
    />
  );
}
