import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listCapiPr } from "@/lib/network/queries";
import { CreateTeamForm } from "@/components/teams/create-team-form";

export const metadata: Metadata = { title: "Nuova squadra" };

export default async function NewTeamPage() {
  const capi = await listCapiPr();

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div className="flex items-center gap-2">
        <Link href="/teams" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Nuova squadra</h1>
      </div>
      <CreateTeamForm capi={capi} />
    </div>
  );
}
