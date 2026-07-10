"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { upsertPerformance } from "@/lib/events/actions";
import { calculatePerformanceScore } from "@/lib/performance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { EventPerformance } from "@/lib/events/queries";

type CountKey =
  | "list_names_count"
  | "tickets_sold_count"
  | "tables_count"
  | "actual_entries_count";
type ToggleKey =
  | "confirmed_support"
  | "shared_story"
  | "broadcast_sent"
  | "negative_behavior";

export function PerformanceCard({
  eventId,
  collaboratorId,
  name,
  subtitle,
  initial,
}: {
  eventId: string;
  collaboratorId: string;
  name: string;
  subtitle: string;
  initial?: EventPerformance;
}) {
  const [state, setState] = useState({
    confirmed_support: initial?.confirmed_support ?? false,
    shared_story: initial?.shared_story ?? false,
    broadcast_sent: initial?.broadcast_sent ?? false,
    list_names_count: initial?.list_names_count ?? 0,
    tickets_sold_count: initial?.tickets_sold_count ?? 0,
    tables_count: initial?.tables_count ?? 0,
    actual_entries_count: initial?.actual_entries_count ?? 0,
    negative_behavior: initial?.negative_behavior ?? false,
    notes: initial?.notes ?? "",
  });
  const [dirty, setDirty] = useState(false);
  const [pending, start] = useTransition();

  const score = calculatePerformanceScore(state);

  function toggle(key: ToggleKey) {
    setState((s) => ({ ...s, [key]: !s[key] }));
    setDirty(true);
  }

  function step(key: CountKey, delta: number) {
    setState((s) => ({ ...s, [key]: Math.max(0, s[key] + delta) }));
    setDirty(true);
  }

  function onNotes(e: ChangeEvent<HTMLTextAreaElement>) {
    setState((s) => ({ ...s, notes: e.target.value }));
    setDirty(true);
  }

  function save() {
    start(async () => {
      const res = await upsertPerformance({
        event_id: eventId,
        collaborator_id: collaboratorId,
        ...state,
      });
      if (res.error) toast.error(res.error);
      else {
        toast.success(`${name}: salvato`);
        setDirty(false);
      }
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{name}</CardTitle>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <ToggleChip
            label="Confermato"
            active={state.confirmed_support}
            onClick={() => toggle("confirmed_support")}
          />
          <ToggleChip
            label="Story"
            active={state.shared_story}
            onClick={() => toggle("shared_story")}
          />
          <ToggleChip
            label="Broadcast"
            active={state.broadcast_sent}
            onClick={() => toggle("broadcast_sent")}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Stepper
            label="Lista"
            value={state.list_names_count}
            onChange={(d) => step("list_names_count", d)}
          />
          <Stepper
            label="Ticket"
            value={state.tickets_sold_count}
            onChange={(d) => step("tickets_sold_count", d)}
          />
          <Stepper
            label="Tavoli"
            value={state.tables_count}
            onChange={(d) => step("tables_count", d)}
          />
          <Stepper
            label="Ingressi"
            value={state.actual_entries_count}
            onChange={(d) => step("actual_entries_count", d)}
          />
        </div>

        <ToggleChip
          label="Comportamento negativo"
          active={state.negative_behavior}
          onClick={() => toggle("negative_behavior")}
          tone="negative"
        />

        <textarea
          placeholder="Note evento"
          value={state.notes}
          onChange={onNotes}
          rows={2}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Score:{" "}
            <span className="font-semibold text-foreground tabular-nums">{score}</span>
          </span>
          <Button type="button" size="sm" onClick={save} disabled={pending || !dirty}>
            {pending ? "Salvo…" : "Salva"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ToggleChip({
  label,
  active,
  onClick,
  tone = "default",
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  tone?: "default" | "negative";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? tone === "negative"
            ? "border-destructive/40 bg-destructive/15 text-destructive"
            : "border-primary bg-primary text-primary-foreground"
          : "border-input text-muted-foreground hover:bg-accent",
      )}
    >
      {label}
    </button>
  );
}

function Stepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (delta: number) => void;
}) {
  const btn =
    "flex size-11 shrink-0 items-center justify-center rounded-md border border-border " +
    "bg-secondary text-foreground transition-colors hover:bg-accent active:bg-input " +
    "disabled:pointer-events-none disabled:opacity-40";

  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange(-1)}
          disabled={value <= 0}
          className={btn}
          aria-label={`Diminuisci ${label}`}
        >
          <Minus className="size-4" />
        </button>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={(e) => {
            const next = Math.max(0, parseInt(e.target.value.replace(/\D/g, "") || "0", 10));
            onChange(next - value);
          }}
          className="num h-11 min-w-0 flex-1 rounded-md border border-input bg-card text-center text-xl text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={label}
        />
        <button
          type="button"
          onClick={() => onChange(1)}
          className={btn}
          aria-label={`Aumenta ${label}`}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
