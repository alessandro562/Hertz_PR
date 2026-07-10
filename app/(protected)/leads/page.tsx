import type { Metadata } from "next";
import { Users } from "lucide-react";
import { ComingSoon } from "@/components/common/coming-soon";

export const metadata: Metadata = { title: "Lead CRM" };

export default function LeadsPage() {
  return (
    <ComingSoon
      title="Lead CRM"
      phase="Fase 2"
      icon={Users}
      description="Cattura i lead Instagram, evita i duplicati, assegna un owner e lavora la pipeline a stati. È il cuore operativo del prodotto e arriva nella prossima fase."
    />
  );
}
