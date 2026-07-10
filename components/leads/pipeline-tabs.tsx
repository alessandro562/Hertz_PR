"use client";

import { useMemo, useState } from "react";
import { Search, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  PIPELINE_BUCKETS,
  bucketForStatus,
  type PipelineBucket,
} from "@/lib/constants/leads";
import { LeadCard } from "./lead-card";
import type { Lead } from "@/lib/leads/queries";

export function PipelineTabs({ leads }: { leads: Lead[] }) {
  const [bucket, setBucket] = useState<PipelineBucket>("da_contattare");
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const c: Partial<Record<PipelineBucket, number>> = {};
    for (const l of leads) {
      const b = bucketForStatus(l.status);
      c[b] = (c[b] ?? 0) + 1;
    }
    return c;
  }, [leads]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return leads
      .filter((l) => bucketForStatus(l.status) === bucket)
      .filter((l) => {
        if (!query) return true;
        const name = `${l.first_name ?? ""} ${l.last_name ?? ""}`.toLowerCase();
        return (
          l.instagram_username.toLowerCase().includes(query) ||
          name.includes(query)
        );
      });
  }, [leads, bucket, q]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cerca @ o nome…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-11 pl-9"
        />
      </div>

      <div className="-mx-4 flex items-center gap-1 overflow-x-auto border-b border-border px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PIPELINE_BUCKETS.map((b) => {
          const active = bucket === b.key;
          const count = counts[b.key] ?? 0;
          return (
            <button
              key={b.key}
              type="button"
              onClick={() => setBucket(b.key)}
              className={cn(
                "relative flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-sm font-medium outline-none transition-colors",
                "after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full",
                active
                  ? "text-foreground after:bg-primary"
                  : "text-muted-foreground hover:text-foreground after:bg-transparent",
              )}
            >
              {b.label}
              <span
                className={cn(
                  "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] tabular-nums",
                  active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <Inbox className="size-8" />
          <p className="text-sm">
            {q
              ? `Nessun risultato per "${q}".`
              : leads.length === 0
                ? "Nessun lead ancora. Tocca “Nuovo” per aggiungere il primo profilo Instagram."
                : "Nessun lead in questa fase."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((l) => (
            <LeadCard key={l.id} lead={l} />
          ))}
        </div>
      )}
    </div>
  );
}
