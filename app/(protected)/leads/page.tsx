import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listLeads } from "@/lib/leads/queries";
import { PipelineTabs } from "@/components/leads/pipeline-tabs";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Lead CRM" };

export default async function LeadsPage() {
  const leads = await listLeads();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Lead</h1>
          <p className="text-sm text-muted-foreground">
            {leads.length} {leads.length === 1 ? "lead" : "lead"} in pipeline
          </p>
        </div>
        <Link href="/leads/new" className={cn(buttonVariants(), "h-10 gap-2")}>
          <Plus className="size-4" /> Nuovo
        </Link>
      </div>

      <PipelineTabs leads={leads} />
    </div>
  );
}
