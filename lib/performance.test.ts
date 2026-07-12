import { describe, it, expect } from "vitest";
import { calculatePerformanceScore, sumPerformances, groupPerformances } from "./performance";

const zero = {
  confirmed_support: false,
  shared_story: false,
  broadcast_sent: false,
  list_names_count: 0,
  tickets_sold_count: 0,
  tables_count: 0,
  actual_entries_count: 0,
  negative_behavior: false,
};

describe("calculatePerformanceScore", () => {
  it("scores zero for a totally empty input", () => {
    expect(calculatePerformanceScore(zero)).toBe(0);
  });

  it("+1 for a shared story", () => {
    expect(calculatePerformanceScore({ ...zero, shared_story: true })).toBe(1);
  });

  it("+1 for a broadcast sent", () => {
    expect(calculatePerformanceScore({ ...zero, broadcast_sent: true })).toBe(1);
  });

  it("+1 per name on the list", () => {
    expect(calculatePerformanceScore({ ...zero, list_names_count: 5 })).toBe(5);
  });

  it("+3 per ticket sold", () => {
    expect(calculatePerformanceScore({ ...zero, tickets_sold_count: 4 })).toBe(12);
  });

  it("+8 per table", () => {
    expect(calculatePerformanceScore({ ...zero, tables_count: 2 })).toBe(16);
  });

  it("+2 per actual entry", () => {
    expect(calculatePerformanceScore({ ...zero, actual_entries_count: 3 })).toBe(6);
  });

  it("confirmed support alone is neutral (no pre-event penalty)", () => {
    expect(
      calculatePerformanceScore({ ...zero, confirmed_support: true }),
    ).toBe(0);
  });

  it("confirmed support never subtracts, even alongside real numbers", () => {
    expect(
      calculatePerformanceScore({
        ...zero,
        confirmed_support: true,
        list_names_count: 1,
      }),
    ).toBe(1);
  });

  it("-5 for negative behavior, independent of everything else", () => {
    expect(
      calculatePerformanceScore({ ...zero, negative_behavior: true }),
    ).toBe(-5);
  });

  it("combines every component for a realistic full night", () => {
    // story(+1) + broadcast(+1) + 8 names(+8) + 2 tickets(+6) + 1 table(+8) + 5 entries(+10) = 34
    expect(
      calculatePerformanceScore({
        confirmed_support: true,
        shared_story: true,
        broadcast_sent: true,
        list_names_count: 8,
        tickets_sold_count: 2,
        tables_count: 1,
        actual_entries_count: 5,
        negative_behavior: false,
      }),
    ).toBe(34);
  });

  it("stacks the negative-behavior penalty with real numbers", () => {
    // 3 names(+3) - negative behavior(-5) = -2
    expect(
      calculatePerformanceScore({
        ...zero,
        list_names_count: 3,
        negative_behavior: true,
      }),
    ).toBe(-2);
  });
});

describe("sumPerformances", () => {
  it("sums an empty list to all zeros", () => {
    expect(sumPerformances([])).toEqual({
      listNames: 0,
      tickets: 0,
      tables: 0,
      entries: 0,
      score: 0,
    });
  });

  it("sums multiple rows field by field", () => {
    const rows = [
      {
        list_names_count: 5,
        tickets_sold_count: 1,
        tables_count: 0,
        actual_entries_count: 2,
        performance_score: 10,
      },
      {
        list_names_count: 3,
        tickets_sold_count: 2,
        tables_count: 1,
        actual_entries_count: 4,
        performance_score: 25,
      },
    ];
    expect(sumPerformances(rows)).toEqual({
      listNames: 8,
      tickets: 3,
      tables: 1,
      entries: 6,
      score: 35,
    });
  });
});

describe("groupPerformances", () => {
  const rows = [
    {
      team: "fede",
      list_names_count: 5,
      tickets_sold_count: 1,
      tables_count: 0,
      actual_entries_count: 2,
      performance_score: 10,
    },
    {
      team: "fede",
      list_names_count: 2,
      tickets_sold_count: 0,
      tables_count: 0,
      actual_entries_count: 1,
      performance_score: 4,
    },
    {
      team: "tommaso",
      list_names_count: 3,
      tickets_sold_count: 2,
      tables_count: 1,
      actual_entries_count: 4,
      performance_score: 25,
    },
  ];

  it("groups by key, sums each group, and sorts by score descending", () => {
    const ranking = groupPerformances(rows, (r) => r.team);
    expect(ranking).toEqual([
      { key: "tommaso", count: 1, listNames: 3, tickets: 2, tables: 1, entries: 4, score: 25 },
      { key: "fede", count: 2, listNames: 7, tickets: 1, tables: 0, entries: 3, score: 14 },
    ]);
  });

  it("returns an empty ranking for no rows", () => {
    expect(groupPerformances([], (r: (typeof rows)[number]) => r.team)).toEqual([]);
  });
});
