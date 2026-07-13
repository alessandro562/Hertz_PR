"use client";

import { useMemo, useState, useTransition } from "react";
import { Search, Inbox, CheckSquare, UserCheck, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  PIPELINE_BUCKETS,
  bucketForStatus,
  statusesByBucket,
  LEAD_STATUS_LABELS,
  type PipelineBucket,
} from "@/lib/constants/leads";
import { bulkSetLeadStatus, bulkAssignOwner } from "@/lib/leads/actions";
import { LeadCard } from "./lead-card";
import { BulkWhatsapp } from "./bulk-whatsapp";
import type { Lead } from "@/lib/leads/queries";
import type { LeadStatus } from "@/types/database";

export function PipelineTabs({ leads }: { leads: Lead[] }) {
  const [bucket, setBucket] = useState<PipelineBucket>("da_contattare");
  const [q, setQ] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showWhatsapp, setShowWhatsapp] = useState(false);
  const [pending, start] = useTransition();

  const statusGroups = statusesByBucket();

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

  const selectedLeads = useMemo(
    () => leads.filter((l) => selectedIds.has(l.id)),
    [leads, selectedIds],
  );
  const allFilteredSelected =
    filtered.length > 0 && filtered.every((l) => selectedIds.has(l.id));

  function toggleSelectMode() {
    setSelectMode((on) => !on);
    setSelectedIds(new Set());
  }

  function exitSelect() {
    setSelectMode(false);
    setSelectedIds(new Set());
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) filtered.forEach((l) => next.delete(l.id));
      else filtered.forEach((l) => next.add(l.id));
      return next;
    });
  }

  function onBulkStatus(status: LeadStatus) {
    const ids = [...selectedIds];
    start(async () => {
      const res = await bulkSetLeadStatus(ids, status);
      if (res.error) toast.error(res.error);
      else {
        toast.success(`Stato aggiornato · ${res.count ?? 0} lead`);
        exitSelect();
      }
    });
  }

  function onBulkAssign() {
    const ids = [...selectedIds];
    start(async () => {
      const res = await bulkAssignOwner(ids);
      if (res.error) toast.error(res.error);
      else {
        toast.success(`Assegnati a te · ${res.count ?? 0} lead`);
        exitSelect();
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cerca @ o nome…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-11 pl-9"
          />
        </div>
        <Button
          variant={selectMode ? "default" : "outline"}
          className="h-11 shrink-0 gap-1.5"
          onClick={toggleSelectMode}
        >
          {selectMode ? (
            "Fine"
          ) : (
            <>
              <CheckSquare className="size-4" /> Seleziona
            </>
          )}
        </Button>
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

      {selectMode && filtered.length > 0 ? (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground tabular-nums">
            {selectedIds.size} selezionati
          </span>
          <button
            type="button"
            onClick={toggleAll}
            className="text-xs font-medium text-primary underline"
          >
            {allFilteredSelected ? "Deseleziona tutti" : "Seleziona tutti"}
          </button>
        </div>
      ) : null}

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
        <div className={cn("space-y-2", selectMode && selectedIds.size > 0 && "pb-24")}>
          {filtered.map((l) =>
            selectMode ? (
              <LeadCard
                key={l.id}
                lead={l}
                selectMode
                selected={selectedIds.has(l.id)}
                onToggle={toggleOne}
              />
            ) : (
              <LeadCard key={l.id} lead={l} />
            ),
          )}
        </div>
      )}

      {selectMode && selectedIds.size > 0 ? (
        <div className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-40 px-4 md:bottom-6 md:left-64">
          <div className="mx-auto w-full max-w-5xl">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-popover p-2 shadow-[0_2px_16px_rgba(0,0,0,0.4)]">
              <span className="shrink-0 px-1 text-sm font-medium tabular-nums">
                {selectedIds.size}
              </span>
              <div className="flex flex-1 items-center gap-2 overflow-x-auto">
                <Select
                  value={null}
                  onValueChange={(v) => v && onBulkStatus(v as LeadStatus)}
                  disabled={pending}
                >
                  <SelectTrigger className="h-10 shrink-0" aria-label="Cambia stato">
                    <SelectValue placeholder="Cambia stato" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusGroups.map((g) => (
                      <SelectGroup key={g.key}>
                        <SelectLabel>{g.label}</SelectLabel>
                        {g.statuses.map((s) => (
                          <SelectItem key={s} value={s}>
                            {LEAD_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="secondary"
                  className="h-10 shrink-0 gap-1.5"
                  onClick={onBulkAssign}
                  disabled={pending}
                >
                  <UserCheck className="size-4" /> A me
                </Button>
                <Button
                  variant="secondary"
                  className="h-10 shrink-0 gap-1.5"
                  onClick={() => setShowWhatsapp(true)}
                  disabled={pending}
                >
                  <MessageCircle className="size-4" /> WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showWhatsapp ? (
        <BulkWhatsapp
          leads={selectedLeads}
          onClose={() => setShowWhatsapp(false)}
        />
      ) : null}
    </div>
  );
}
