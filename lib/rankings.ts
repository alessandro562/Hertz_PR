export interface GrowthEntry {
  key: string;
  latestScore: number;
  previousScore: number;
  growth: number;
}

interface DatedScore {
  key: string;
  eventId: string;
  eventDate: string;
  score: number;
}

/**
 * "Miglior crescita" (spec §16): compares each entity's (capo/team/
 * collaborator) score in their most recent event against the one right
 * before it. An entity needs at least two distinct events to have a growth
 * figure — with only one, there's nothing to compare against yet, so it's
 * skipped rather than reported as +100%.
 */
export function computeGrowth(rows: DatedScore[]): GrowthEntry[] {
  const byKey = new Map<string, Map<string, { date: string; score: number }>>();
  for (const row of rows) {
    let events = byKey.get(row.key);
    if (!events) {
      events = new Map();
      byKey.set(row.key, events);
    }
    const existing = events.get(row.eventId);
    events.set(row.eventId, {
      date: row.eventDate,
      score: (existing?.score ?? 0) + row.score,
    });
  }

  const results: GrowthEntry[] = [];
  for (const [key, events] of byKey) {
    const sorted = [...events.values()].sort((a, b) => b.date.localeCompare(a.date));
    if (sorted.length < 2) continue;
    const [latest, previous] = sorted;
    results.push({
      key,
      latestScore: latest.score,
      previousScore: previous.score,
      growth: latest.score - previous.score,
    });
  }
  return results.sort((a, b) => b.growth - a.growth);
}
