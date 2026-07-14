import Link from "next/link";
import { shortDate } from "@/lib/dates";
import type { EventPerformance } from "@/lib/events/queries";

/** Event-by-event detail under the scorecard (KPIs live in PerformanceScorecard). */
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

  const history = [...performances].sort((a, b) => {
    const da = eventById[a.event_id]?.event_date ?? "";
    const db = eventById[b.event_id]?.event_date ?? "";
    return db.localeCompare(da);
  });

  return (
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
  );
}
