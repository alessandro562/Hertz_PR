export interface EventPoint {
  eventId: string;
  eventDate: string;
}

export interface TrendRow {
  key: string;
  eventId: string;
  score: number;
}

/** One point on a trend chart: fixed `eventId`/`eventDate` plus one numeric column per series key. */
export type TrendPoint = Record<string, string | number>;

/**
 * Pivots per-(key, event) scores into one row per event with one numeric
 * column per key — the "wide" shape a multi-line chart needs. Events with no
 * rows for a given key are filled with 0 so every line spans the full
 * x-axis instead of only appearing where that key has data. `events` is
 * trusted to already be in the order the chart should render (chronological).
 */
export function pivotTrend(rows: TrendRow[], events: EventPoint[]): TrendPoint[] {
  const totals = new Map<string, Map<string, number>>();
  for (const r of rows) {
    let byKey = totals.get(r.eventId);
    if (!byKey) {
      byKey = new Map();
      totals.set(r.eventId, byKey);
    }
    byKey.set(r.key, (byKey.get(r.key) ?? 0) + r.score);
  }

  const keys = [...new Set(rows.map((r) => r.key))];
  return events.map((e) => {
    const point: TrendPoint = { eventId: e.eventId, eventDate: e.eventDate };
    const byKey = totals.get(e.eventId);
    for (const k of keys) point[k] = byKey?.get(k) ?? 0;
    return point;
  });
}

/** All-time total score per event, chronological — the network-wide trend line. */
export function totalTrend(
  rows: Omit<TrendRow, "key">[],
  events: EventPoint[],
): TrendPoint[] {
  return pivotTrend(
    rows.map((r) => ({ ...r, key: "Punteggio totale" })),
    events,
  );
}

/** The N keys with the highest all-time total score — caps a multi-line chart to a readable size. */
export function topKeys(rows: TrendRow[], limit: number): string[] {
  const totals = new Map<string, number>();
  for (const r of rows) totals.set(r.key, (totals.get(r.key) ?? 0) + r.score);
  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key]) => key);
}
