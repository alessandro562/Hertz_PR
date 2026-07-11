"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { upsertPerformance } from "@/lib/events/actions";
import { PerformanceCard, type PerformanceFields } from "./performance-card";
import { Button } from "@/components/ui/button";
import type { EventPerformance } from "@/lib/events/queries";

export interface EntryRow {
  collaboratorId: string;
  name: string;
  subtitle: string;
  initial?: EventPerformance;
}
export interface EntryGroup {
  key: string;
  name: string | null;
  rows: EntryRow[];
}

function toFields(p?: EventPerformance): PerformanceFields {
  return {
    confirmed_support: p?.confirmed_support ?? false,
    shared_story: p?.shared_story ?? false,
    broadcast_sent: p?.broadcast_sent ?? false,
    list_names_count: p?.list_names_count ?? 0,
    tickets_sold_count: p?.tickets_sold_count ?? 0,
    tables_count: p?.tables_count ?? 0,
    actual_entries_count: p?.actual_entries_count ?? 0,
    negative_behavior: p?.negative_behavior ?? false,
    notes: p?.notes ?? "",
  };
}

/**
 * Holds every PR's numbers for one event and saves them together, so the
 * Manager isn't tapping "Salva" once per card and losing un-saved rows on the
 * way out. Tracks a completion counter and guards against leaving with unsaved
 * changes.
 */
export function PerformanceEntry({
  eventId,
  groups,
}: {
  eventId: string;
  groups: EntryGroup[];
}) {
  const allRows = groups.flatMap((g) => g.rows);
  const total = allRows.length;

  const [values, setValues] = useState<Record<string, PerformanceFields>>(() =>
    Object.fromEntries(allRows.map((r) => [r.collaboratorId, toFields(r.initial)])),
  );
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(
    () => new Set(allRows.filter((r) => r.initial).map((r) => r.collaboratorId)),
  );
  const [pending, start] = useTransition();

  useEffect(() => {
    if (dirty.size === 0) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty.size]);

  function updateRow(id: string, patch: Partial<PerformanceFields>) {
    setValues((v) => ({ ...v, [id]: { ...v[id], ...patch } }));
    setDirty((d) => (d.has(id) ? d : new Set(d).add(id)));
  }

  function saveAll() {
    const ids = [...dirty];
    if (ids.length === 0) return;
    start(async () => {
      const results = await Promise.all(
        ids.map((id) =>
          upsertPerformance({ event_id: eventId, collaborator_id: id, ...values[id] }),
        ),
      );
      const ok = ids.filter((_, i) => !results[i]?.error);
      const failed = ids.length - ok.length;
      if (ok.length) {
        setSaved((s) => {
          const n = new Set(s);
          ok.forEach((id) => n.add(id));
          return n;
        });
        setDirty((d) => {
          const n = new Set(d);
          ok.forEach((id) => n.delete(id));
          return n;
        });
      }
      if (failed) toast.error(`${failed} schede non salvate, riprova.`);
      else
        toast.success(
          `${ok.length} ${ok.length === 1 ? "scheda salvata" : "schede salvate"}`,
        );
    });
  }

  const dirtyCount = dirty.size;
  const saveLabel = pending
    ? "Salvo…"
    : dirtyCount
      ? `Salva tutto (${dirtyCount})`
      : "Tutto salvato";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-card p-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          <span className="num text-base text-foreground">{saved.size}</span> / {total}{" "}
          inseriti
        </span>
        <Button onClick={saveAll} disabled={pending || dirtyCount === 0} className="h-11">
          {saveLabel}
        </Button>
      </div>

      {groups.map((g) => (
        <div key={g.key} className="space-y-3">
          {g.name ? (
            <h2 className="text-sm font-medium text-muted-foreground">{g.name}</h2>
          ) : null}
          <div className="space-y-3">
            {g.rows.map((r) => (
              <PerformanceCard
                key={r.collaboratorId}
                name={r.name}
                subtitle={r.subtitle}
                value={values[r.collaboratorId]}
                onChange={(patch) => updateRow(r.collaboratorId, patch)}
                saved={saved.has(r.collaboratorId) && !dirty.has(r.collaboratorId)}
              />
            ))}
          </div>
        </div>
      ))}

      {total > 3 ? (
        <Button
          onClick={saveAll}
          disabled={pending || dirtyCount === 0}
          className="h-11 w-full"
        >
          {saveLabel}
        </Button>
      ) : null}
    </div>
  );
}
