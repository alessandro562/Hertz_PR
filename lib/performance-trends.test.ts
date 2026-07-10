import { describe, it, expect } from "vitest";
import { pivotTrend, totalTrend, topKeys } from "./performance-trends";

const events = [
  { eventId: "e1", eventDate: "2026-06-01" },
  { eventId: "e2", eventDate: "2026-07-01" },
];

describe("pivotTrend", () => {
  it("pivots per-(key,event) rows into one point per event with one column per key", () => {
    const rows = [
      { key: "Fede", eventId: "e1", score: 10 },
      { key: "Marti", eventId: "e1", score: 20 },
      { key: "Fede", eventId: "e2", score: 30 },
      { key: "Marti", eventId: "e2", score: 40 },
    ];
    expect(pivotTrend(rows, events)).toEqual([
      { eventId: "e1", eventDate: "2026-06-01", Fede: 10, Marti: 20 },
      { eventId: "e2", eventDate: "2026-07-01", Fede: 30, Marti: 40 },
    ]);
  });

  it("fills 0 for a key with no rows in a given event, so every line spans the full axis", () => {
    const rows = [
      { key: "Fede", eventId: "e1", score: 10 },
      { key: "Marti", eventId: "e2", score: 40 },
    ];
    expect(pivotTrend(rows, events)).toEqual([
      { eventId: "e1", eventDate: "2026-06-01", Fede: 10, Marti: 0 },
      { eventId: "e2", eventDate: "2026-07-01", Fede: 0, Marti: 40 },
    ]);
  });

  it("sums multiple rows for the same key within the same event", () => {
    const rows = [
      { key: "Fede", eventId: "e1", score: 5 },
      { key: "Fede", eventId: "e1", score: 5 },
    ];
    expect(pivotTrend(rows, events)[0].Fede).toBe(10);
  });

  it("returns one bare point per event when there are no rows", () => {
    expect(pivotTrend([], events)).toEqual([
      { eventId: "e1", eventDate: "2026-06-01" },
      { eventId: "e2", eventDate: "2026-07-01" },
    ]);
  });
});

describe("totalTrend", () => {
  it("sums every row into a single 'Punteggio totale' series per event", () => {
    const rows = [
      { eventId: "e1", score: 10 },
      { eventId: "e1", score: 20 },
      { eventId: "e2", score: 5 },
    ];
    expect(totalTrend(rows, events)).toEqual([
      { eventId: "e1", eventDate: "2026-06-01", "Punteggio totale": 30 },
      { eventId: "e2", eventDate: "2026-07-01", "Punteggio totale": 5 },
    ]);
  });
});

describe("topKeys", () => {
  it("ranks keys by all-time total score descending", () => {
    const rows = [
      { key: "Fede", eventId: "e1", score: 10 },
      { key: "Marti", eventId: "e1", score: 50 },
      { key: "Tommaso", eventId: "e1", score: 30 },
    ];
    expect(topKeys(rows, 10)).toEqual(["Marti", "Tommaso", "Fede"]);
  });

  it("sums a key's score across multiple events before ranking", () => {
    const rows = [
      { key: "Fede", eventId: "e1", score: 10 },
      { key: "Fede", eventId: "e2", score: 10 },
      { key: "Marti", eventId: "e1", score: 15 },
    ];
    expect(topKeys(rows, 10)).toEqual(["Fede", "Marti"]);
  });

  it("respects the limit", () => {
    const rows = [
      { key: "Fede", eventId: "e1", score: 10 },
      { key: "Marti", eventId: "e1", score: 50 },
      { key: "Tommaso", eventId: "e1", score: 30 },
    ];
    expect(topKeys(rows, 2)).toEqual(["Marti", "Tommaso"]);
  });
});
