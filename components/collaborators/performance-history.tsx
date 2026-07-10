import Link from "next/link";
import { sumPerformances } from "@/lib/performance";
import { StatCard } from "@/components/dashboard/stat-card";
import { shortDate } from "@/lib/dates";
import type { EventPerformance } from "@/lib/events/queries";

export function PerformanceHistory({
  performances,
  eventById,
}: {
  performances: EventPerformance[];
  eventById: Record<string, { id: string; name: string; event_date: string }>;
}) {
  if (performances.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nessun evento ancora. I numeri compariranno qui dopo il primo evento.
      </p>
    );
  }

  const totals = sumPerformances(performances);
  const avgScore = Math.round(totals.score / performances.length);
  const history = [...performances].sort((a, b) => {
    const da = eventById[a.event_id]?.event_date ?? "";
    const db = eventById[b.event_id]?.event_date ?? "";
    return db.localeCompare(da);
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Eventi" value={performances.length} />
        <StatCard label="Score medio" value={avgScore} />
        <StatCard label="Score totale" value={totals.score} />
      </div>

      <div className="space-y-2">
        {history.map((p) => {
          const event = eventById[p.event_id];
          return (
            <Link
              key={p.id}
              href={`/events/${p.event_id}`}
              className="flex items-center justify-between rounded-md border border-input px-3 py-2 text-sm hover:bg-accent"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{event?.name ?? "Evento"}</p>
                {event ? (
                  <p className="text-xs text-muted-foreground">
                    {shortDate(event.event_date)}
                  </p>
                ) : null}
              </div>
              <span className="shrink-0 font-medium tabular-nums">
                {p.performance_score} pt
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
