import { describe, it, expect } from "vitest";
import {
  countBy,
  weekStart,
  byWeek,
  funnelCounts,
  leadTypeCounts,
  tagCounts,
  sourceCounts,
  progressiveIndex,
  conversionFunnel,
  conversionBySource,
  leadOwnerId,
  leadsByOwner,
  conversionByOwner,
  leadStatsByOwner,
} from "./analytics";
import type { Lead } from "@/lib/leads/queries";

function lead(partial: Partial<Lead>): Lead {
  return {
    status: "da_contattare",
    lead_type: "pr",
    tags: [],
    source: null,
    created_at: "2026-01-01T00:00:00Z",
    ...partial,
  } as unknown as Lead;
}

describe("countBy", () => {
  it("counts and sorts desc, skipping null/empty keys", () => {
    const items = [{ c: "a" }, { c: "a" }, { c: "b" }, { c: "" }, { c: null }];
    expect(countBy(items, (i) => i.c)).toEqual([
      { key: "a", label: "a", count: 2 },
      { key: "b", label: "b", count: 1 },
    ]);
  });

  it("applies a label function", () => {
    expect(countBy([{ c: "x" }], (i) => i.c, (k) => k.toUpperCase())).toEqual([
      { key: "x", label: "X", count: 1 },
    ]);
  });
});

describe("weekStart", () => {
  it("returns the Monday of the week (UTC)", () => {
    // 2026-01-01 is a Thursday → its Monday is 2025-12-29.
    expect(weekStart("2026-01-01T12:00:00Z")).toBe("2025-12-29");
    expect(weekStart("2025-12-29T00:00:00Z")).toBe("2025-12-29"); // a Monday maps to itself
    expect(weekStart("2026-01-04T23:00:00Z")).toBe("2025-12-29"); // Sunday → same week's Monday
  });
});

describe("byWeek", () => {
  it("groups by week, chronological, with the given series name", () => {
    const rows = [
      { d: "2025-12-29T00:00:00Z" },
      { d: "2025-12-31T00:00:00Z" },
      { d: "2026-01-06T00:00:00Z" },
    ];
    expect(byWeek(rows, (r) => r.d, "Nuovi")).toEqual([
      { eventDate: "2025-12-29", Nuovi: 2 },
      { eventDate: "2026-01-05", Nuovi: 1 },
    ]);
  });

  it("skips rows without a date", () => {
    expect(byWeek([{ d: null }], (r) => r.d)).toEqual([]);
  });
});

describe("funnelCounts", () => {
  it("returns every bucket in pipeline order with correct counts", () => {
    const f = funnelCounts([
      lead({ status: "da_contattare" }),
      lead({ status: "contattato" }),
      lead({ status: "convertito_collaboratore" }),
    ]);
    expect(f.map((x) => x.key)).toEqual([
      "da_contattare",
      "contattati",
      "interessati",
      "da_inserire",
      "convertiti",
      "persi",
    ]);
    expect(f.find((x) => x.key === "da_contattare")!.count).toBe(1);
    expect(f.find((x) => x.key === "convertiti")!.count).toBe(1);
    expect(f.find((x) => x.key === "interessati")!.count).toBe(0);
  });
});

describe("leadTypeCounts", () => {
  it("shows all three types in order, including zeros", () => {
    const counts = leadTypeCounts([
      lead({ lead_type: "pr" }),
      lead({ lead_type: "festaiolo" }),
      lead({ lead_type: "festaiolo" }),
    ]);
    expect(counts).toEqual([
      { key: "pr", label: "PR", count: 1 },
      { key: "festaiolo", label: "Festaiolo", count: 2 },
      { key: "supporter_social", label: "Supporter social", count: 0 },
    ]);
  });
});

describe("tagCounts", () => {
  it("counts each tag a lead carries, sorted desc", () => {
    const t = tagCounts([
      lead({ tags: ["vip", "porta_gruppo"] }),
      lead({ tags: ["vip"] }),
    ]);
    expect(t[0]).toEqual({ key: "vip", label: "VIP", count: 2 });
    expect(t.find((x) => x.key === "porta_gruppo")!.count).toBe(1);
    expect(t.find((x) => x.key === "amico_staff")!.count).toBe(0);
  });
});

describe("sourceCounts", () => {
  it("folds the tail past topN into Altro", () => {
    const s = sourceCounts(
      [
        lead({ source: "a" }),
        lead({ source: "a" }),
        lead({ source: "b" }),
        lead({ source: "c" }),
      ],
      2,
    );
    expect(s).toEqual([
      { key: "a", label: "a", count: 2 },
      { key: "b", label: "b", count: 1 },
      { key: "__altro", label: "Altro", count: 1 },
    ]);
  });
});

describe("progressiveIndex", () => {
  it("maps statuses to their progressive stage index, -1 for the lost branch", () => {
    expect(progressiveIndex("da_contattare")).toBe(0);
    expect(progressiveIndex("contattato")).toBe(1);
    expect(progressiveIndex("convertito_collaboratore")).toBe(4);
    expect(progressiveIndex("non_interessato")).toBe(-1);
  });
});

describe("conversionFunnel", () => {
  it("counts reached-at-least per stage and stage-to-stage conversion %", () => {
    const f = conversionFunnel([0, 0, 2, 4]);
    expect(f.map((s) => s.reached)).toEqual([4, 2, 2, 1, 1]);
    expect(f[0].conversionPct).toBe(100);
    expect(f[1].conversionPct).toBe(50); // 2 of 4
    expect(f[2].conversionPct).toBe(100); // 2 of 2
    expect(f[3].conversionPct).toBe(50); // 1 of 2
  });
});

describe("conversionBySource", () => {
  it("computes converted/total and % per source, sorted by volume", () => {
    const rows = conversionBySource([
      lead({
        source: "ig",
        status: "convertito_collaboratore",
        converted_to_collaborator: true,
      }),
      lead({ source: "ig" }),
      lead({ source: "passaparola", converted_to_collaborator: true }),
    ]);
    expect(rows[0]).toMatchObject({ key: "ig", total: 2, converted: 1, pct: 50 });
    expect(rows.find((r) => r.key === "passaparola")).toMatchObject({
      total: 1,
      converted: 1,
      pct: 100,
    });
  });
});

describe("leadOwnerId", () => {
  it("prefers owner, falls back to creator, else null", () => {
    expect(leadOwnerId(lead({ owner_user_id: "o", created_by: "c" }))).toBe("o");
    expect(leadOwnerId(lead({ owner_user_id: null, created_by: "c" }))).toBe("c");
    expect(leadOwnerId(lead({ owner_user_id: null, created_by: null }))).toBeNull();
  });
});

describe("leadsByOwner", () => {
  it("counts lead volume per PR, resolving names, desc", () => {
    const rows = leadsByOwner(
      [
        lead({ owner_user_id: "u1" }),
        lead({ owner_user_id: "u1" }),
        lead({ owner_user_id: null, created_by: "u2" }),
      ],
      { u1: "Andrea", u2: "Fede" },
    );
    expect(rows[0]).toEqual({ key: "u1", label: "Andrea", count: 2 });
    expect(rows[1]).toEqual({ key: "u2", label: "Fede", count: 1 });
  });
});

describe("conversionByOwner", () => {
  it("attributes conversion to owner, falling back to creator", () => {
    const rows = conversionByOwner(
      [
        lead({ owner_user_id: "u1", converted_to_collaborator: true }),
        lead({ owner_user_id: "u1" }),
        lead({ owner_user_id: null, created_by: "u2" }),
      ],
      { u1: "Andrea", u2: "Fede" },
    );
    expect(rows.find((r) => r.key === "u1")).toMatchObject({
      total: 2,
      converted: 1,
      pct: 50,
    });
    expect(rows.find((r) => r.key === "u2")).toMatchObject({ total: 1, converted: 0 });
  });
});

describe("leadStatsByOwner", () => {
  it("adds a per-type breakdown to each PR's conversion row", () => {
    const rows = leadStatsByOwner(
      [
        lead({ owner_user_id: "u1", lead_type: "pr" }),
        lead({ owner_user_id: "u1", lead_type: "festaiolo" }),
      ],
      { u1: "Andrea" },
    );
    expect(rows[0]).toMatchObject({ key: "u1", total: 2 });
    expect(rows[0].byType).toEqual({ pr: 1, festaiolo: 1, supporter_social: 0 });
  });
});
