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

/** Sum a set of performance rows (event totals, per-team totals, ...). */
export function sumPerformances(
  rows: {
    list_names_count: number;
    tickets_sold_count: number;
    tables_count: number;
    actual_entries_count: number;
    performance_score: number;
  }[],
): PerformanceTotals {
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
