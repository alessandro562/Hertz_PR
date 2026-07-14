"use client";

import { sumPerformances } from "@/lib/performance";
import { totalTrend } from "@/lib/performance-trends";
import { StatCard } from "@/components/dashboard/stat-card";
import { TrendChart } from "@/components/performance/trend-chart";
import { shortDate } from "@/lib/dates";
import type { EventPerformance } from "@/lib/events/queries";

/**
 * Scorecard del PR: sintesi analitica sopra lo storico evento-per-evento —
 * KPI, andamento del punteggio nel tempo, affidabilità. Torna null se non ci
 * sono ancora numeri (l'empty state lo mostra PerformanceHistory sotto).
 */
export function PerformanceScorecard({
  performances,
  eventById,
  lastActiveAt,
}: {
  performances: EventPerformance[];
  eventById: Record<string, { id: string; name: string; event_date: string }>;
  lastActiveAt: string | null;
}) {
  if (performances.length === 0) return null;

  const totals = sumPerformances(performances);
  const eventCount = performances.length;
  const avg = Math.round(totals.score / eventCount);
  const best = performances.reduce((m, p) => Math.max(m, p.performance_score), 0);
  const negatives = performances.filter((p) => p.negative_behavior).length;

  const points = [
    ...new Map(
      performances.map((p) => [p.event_id, eventById[p.event_id]?.event_date ?? ""]),
    ).entries(),
  ]
    .filter(([, date]) => date)
    .map(([eventId, eventDate]) => ({ eventId, eventDate }))
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate));

  const trend = totalTrend(
    performances.map((p) => ({ eventId: p.event_id, score: p.performance_score })),
    points,
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Eventi" value={eventCount} />
        <StatCard label="Score medio" value={avg} unit="pt" />
        <StatCard label="Score totale" value={totals.score} unit="pt" />
        <StatCard label="Miglior evento" value={best} unit="pt" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Ingressi" value={totals.entries} />
        <StatCard label="Ticket" value={totals.tickets} />
        <StatCard label="Tavoli" value={totals.tables} />
      </div>

      {trend.length > 1 ? (
        <TrendChart data={trend} series={["Punteggio totale"]} height={200} />
      ) : null}

      <p className="text-xs text-muted-foreground">
        {lastActiveAt ? `Ultima attività: ${shortDate(lastActiveAt)}. ` : ""}
        {negatives > 0 ? (
          <span className="text-destructive">
            {negatives}{" "}
            {negatives === 1 ? "comportamento negativo" : "comportamenti negativi"}.
          </span>
        ) : (
          "Nessun comportamento negativo."
        )}
      </p>
    </div>
  );
}
