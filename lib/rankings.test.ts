import { describe, it, expect } from "vitest";
import { computeGrowth } from "./rankings";

describe("computeGrowth", () => {
  it("compares the two most recent events for an entity", () => {
    const rows = [
      { key: "fede", eventId: "e1", eventDate: "2026-06-01", score: 10 },
      { key: "fede", eventId: "e2", eventDate: "2026-07-01", score: 30 },
    ];
    expect(computeGrowth(rows)).toEqual([
      { key: "fede", latestScore: 30, previousScore: 10, growth: 20 },
    ]);
  });

  it("skips entities with fewer than two distinct events", () => {
    const rows = [{ key: "fede", eventId: "e1", eventDate: "2026-06-01", score: 10 }];
    expect(computeGrowth(rows)).toEqual([]);
  });

  it("sums multiple rows within the same event before comparing", () => {
    const rows = [
      { key: "fede", eventId: "e1", eventDate: "2026-06-01", score: 5 },
      { key: "fede", eventId: "e1", eventDate: "2026-06-01", score: 5 },
      { key: "fede", eventId: "e2", eventDate: "2026-07-01", score: 40 },
    ];
    expect(computeGrowth(rows)).toEqual([
      { key: "fede", latestScore: 40, previousScore: 10, growth: 30 },
    ]);
  });

  it("only looks at the two most recent events when there are more than two", () => {
    const rows = [
      { key: "fede", eventId: "e1", eventDate: "2026-01-01", score: 999 },
      { key: "fede", eventId: "e2", eventDate: "2026-06-01", score: 10 },
      { key: "fede", eventId: "e3", eventDate: "2026-07-01", score: 30 },
    ];
    expect(computeGrowth(rows)).toEqual([
      { key: "fede", latestScore: 30, previousScore: 10, growth: 20 },
    ]);
  });

  it("sorts multiple entities by growth descending", () => {
    const rows = [
      { key: "fede", eventId: "e1", eventDate: "2026-06-01", score: 10 },
      { key: "fede", eventId: "e2", eventDate: "2026-07-01", score: 15 },
      { key: "tommaso", eventId: "e1", eventDate: "2026-06-01", score: 5 },
      { key: "tommaso", eventId: "e2", eventDate: "2026-07-01", score: 45 },
    ];
    expect(computeGrowth(rows).map((g) => g.key)).toEqual(["tommaso", "fede"]);
  });

  it("allows negative growth (declining performance)", () => {
    const rows = [
      { key: "fede", eventId: "e1", eventDate: "2026-06-01", score: 30 },
      { key: "fede", eventId: "e2", eventDate: "2026-07-01", score: 10 },
    ];
    expect(computeGrowth(rows)[0].growth).toBe(-20);
  });
});
