/**
 * Performance score (spec §15.1). Mirrored server-side by the
 * compute_performance_row() trigger in migration 0004, which is the source
 * of truth — this copy is for instant UI feedback while entering numbers.
 */
export interface PerformanceInput {
  confirmed_support: boolean;
  shared_story: boolean;
  broadcast_sent: boolean;
  list_names_count: number;
  tickets_sold_count: number;
  tables_count: number;
  actual_entries_count: number;
  negative_behavior: boolean;
}

export function calculatePerformanceScore(input: PerformanceInput): number {
  let score = 0;

  if (input.shared_story) score += 1;
  if (input.broadcast_sent) score += 1;

  score += input.list_names_count;
  score += input.tickets_sold_count * 3;
  score += input.tables_count * 8;
  score += input.actual_entries_count * 2;

  const noResults =
    input.list_names_count === 0 &&
    input.tickets_sold_count === 0 &&
    input.tables_count === 0 &&
    input.actual_entries_count === 0 &&
    !input.shared_story &&
    !input.broadcast_sent;

  if (input.confirmed_support && noResults) score -= 2;
  if (input.negative_behavior) score -= 5;

  return score;
}

export interface ScoreLine {
  label: string;
  points: number;
}

/**
 * Per-line breakdown of a performance score, so the number is explainable in
 * the UI (a lone "-2" reads like an error otherwise). Mirrors
 * calculatePerformanceScore exactly — keep the two in sync.
 */
export function scoreBreakdown(input: PerformanceInput): ScoreLine[] {
  const lines: ScoreLine[] = [];
  if (input.list_names_count)
    lines.push({ label: "Lista ×1", points: input.list_names_count });
  if (input.tickets_sold_count)
    lines.push({ label: "Ticket ×3", points: input.tickets_sold_count * 3 });
  if (input.tables_count)
    lines.push({ label: "Tavoli ×8", points: input.tables_count * 8 });
  if (input.actual_entries_count)
    lines.push({ label: "Ingressi ×2", points: input.actual_entries_count * 2 });
  if (input.shared_story) lines.push({ label: "Story condivisa", points: 1 });
  if (input.broadcast_sent) lines.push({ label: "Broadcast", points: 1 });

  const noResults =
    input.list_names_count === 0 &&
    input.tickets_sold_count === 0 &&
    input.tables_count === 0 &&
    input.actual_entries_count === 0 &&
    !input.shared_story &&
    !input.broadcast_sent;

  if (input.confirmed_support && noResults)
    lines.push({ label: "Confermato, ancora nessun numero", points: -2 });
  if (input.negative_behavior)
    lines.push({ label: "Comportamento negativo", points: -5 });

  return lines;
}

export interface PerformanceTotals {
  listNames: number;
  tickets: number;
  tables: number;
  entries: number;
  score: number;
}

const EMPTY_TOTALS: PerformanceTotals = {
  listNames: 0,
  tickets: 0,
  tables: 0,
  entries: 0,
  score: 0,
};

type PerformanceRow = {
  list_names_count: number;
  tickets_sold_count: number;
  tables_count: number;
  actual_entries_count: number;
  performance_score: number;
};

/** Sum a set of performance rows (event totals, per-team totals, ...). */
export function sumPerformances(rows: PerformanceRow[]): PerformanceTotals {
  return rows.reduce(
    (acc, r) => ({
      listNames: acc.listNames + r.list_names_count,
      tickets: acc.tickets + r.tickets_sold_count,
      tables: acc.tables + r.tables_count,
      entries: acc.entries + r.actual_entries_count,
      score: acc.score + r.performance_score,
    }),
    EMPTY_TOTALS,
  );
}

export interface RankedGroup extends PerformanceTotals {
  key: string;
  count: number;
}

/**
 * Groups performance rows by an arbitrary key (team, capo, collaborator, ...),
 * sums each group's totals, and sorts by score descending. Used for every
 * leaderboard in the app (per-event and cross-event).
 */
export function groupPerformances<T extends PerformanceRow>(
  rows: T[],
  keyFn: (row: T) => string,
): RankedGroup[] {
  const byKey = new Map<string, T[]>();
  for (const row of rows) {
    const key = keyFn(row);
    const bucket = byKey.get(key);
    if (bucket) bucket.push(row);
    else byKey.set(key, [row]);
  }
  return [...byKey.entries()]
    .map(([key, group]) => ({ key, count: group.length, ...sumPerformances(group) }))
    .sort((a, b) => b.score - a.score);
}
