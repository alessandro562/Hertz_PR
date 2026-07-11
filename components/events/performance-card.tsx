"use client";

import { useState } from "react";
import { Minus, Plus, Check, ChevronDown } from "lucide-react";
import {
  calculatePerformanceScore,
  scoreBreakdown,
  type PerformanceInput,
} from "@/lib/performance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type PerformanceFields = PerformanceInput & { notes: string };

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
  name,
  subtitle,
  value,
  onChange,
  saved,
}: {
  name: string;
  subtitle: string;
  value: PerformanceFields;
  onChange: (patch: Partial<PerformanceFields>) => void;
  saved: boolean;
}) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const score = calculatePerformanceScore(value);
  const lines = scoreBreakdown(value);

  function toggle(key: ToggleKey) {
    onChange({ [key]: !value[key] });
  }
  function step(key: CountKey, delta: number) {
    onChange({ [key]: Math.max(0, value[key] + delta) });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">{name}</CardTitle>
          {saved ? (
            <span
              className="inline-flex size-4 items-center justify-center rounded-full bg-primary/20 text-primary"
              title="Numeri salvati"
            >
              <Check className="size-3" />
            </span>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <ToggleChip
            label="Confermato"
            active={value.confirmed_support}
            onClick={() => toggle("confirmed_support")}
          />
          <ToggleChip
            label="Story"
            active={value.shared_story}
            onClick={() => toggle("shared_story")}
          />
          <ToggleChip
            label="Broadcast"
            active={value.broadcast_sent}
            onClick={() => toggle("broadcast_sent")}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Stepper
            label="Lista"
            value={value.list_names_count}
            onChange={(d) => step("list_names_count", d)}
          />
          <Stepper
            label="Ticket"
            value={value.tickets_sold_count}
            onChange={(d) => step("tickets_sold_count", d)}
          />
          <Stepper
            label="Tavoli"
            value={value.tables_count}
            onChange={(d) => step("tables_count", d)}
          />
          <Stepper
            label="Ingressi"
            value={value.actual_entries_count}
            onChange={(d) => step("actual_entries_count", d)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          <b className="font-medium text-foreground">Lista</b> = nomi messi in lista ·{" "}
          <b className="font-medium text-foreground">Ingressi</b> = presenze effettive
          alla porta.
        </p>

        <ToggleChip
          label="Comportamento negativo"
          active={value.negative_behavior}
          onClick={() => toggle("negative_behavior")}
          tone="negative"
        />

        <textarea
          placeholder="Note evento"
          value={value.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          rows={2}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowBreakdown((v) => !v)}
            className="flex w-full items-center justify-between gap-2 text-left"
            aria-expanded={showBreakdown}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Punteggio
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className={cn(
                  "num text-2xl",
                  score < 0 ? "text-warning" : "text-foreground",
                )}
              >
                {score}
              </span>
              <ChevronDown
                className={cn(
                  "size-4 text-muted-foreground transition-transform",
                  showBreakdown && "rotate-180",
                )}
              />
            </span>
          </button>
          {showBreakdown ? (
            lines.length ? (
              <ul className="space-y-1 rounded-md border border-border bg-muted/40 p-2 text-xs">
                {lines.map((l) => (
                  <li key={l.label} className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">{l.label}</span>
                    <span
                      className={cn(
                        "tabular-nums",
                        l.points < 0 ? "text-warning" : "text-foreground",
                      )}
                    >
                      {l.points > 0 ? `+${l.points}` : l.points}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">
                Ancora nessun numero inserito.
              </p>
            )
          ) : null}
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
        "inline-flex min-h-11 items-center rounded-full border px-4 text-xs font-medium transition-colors",
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
    "flex size-12 shrink-0 items-center justify-center rounded-md border border-border " +
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
          className="num h-12 min-w-0 flex-1 rounded-md border border-input bg-card text-center text-xl text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
