import type { Metadata } from "next";
import { Calendar } from "lucide-react";
import { ComingSoon } from "@/components/common/coming-soon";

export const metadata: Metadata = { title: "Eventi" };

export default function EventsPage() {
  return (
    <ComingSoon
      title="Eventi"
      phase="Fase 5"
      icon={Calendar}
      description="Crea eventi, attiva le squadre e inserisci i numeri per collaboratore (lista, ticket, tavoli, ingressi). Da qui nasce lo score."
    />
  );
}
