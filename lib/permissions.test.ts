import { describe, it, expect } from "vitest";
import { isManager, isCapoPr, canEditLead } from "./permissions";

const manager = { id: "m1", role: "manager" as const };
const capo = { id: "c1", role: "capo_pr" as const };

describe("role predicates", () => {
  it("identifies managers and capi PR", () => {
    expect(isManager(manager)).toBe(true);
    expect(isManager(capo)).toBe(false);
    expect(isCapoPr(capo)).toBe(true);
    expect(isCapoPr(manager)).toBe(false);
  });

  it("handles null/undefined safely", () => {
    expect(isManager(null)).toBe(false);
    expect(isCapoPr(undefined)).toBe(false);
  });
});

describe("canEditLead", () => {
  it("lets a manager edit any lead", () => {
    expect(canEditLead(manager, { owner_user_id: "x", created_by: "y" })).toBe(true);
  });

  it("lets a capo PR edit only leads they own or created", () => {
    expect(canEditLead(capo, { owner_user_id: "c1" })).toBe(true);
    expect(canEditLead(capo, { created_by: "c1" })).toBe(true);
    expect(canEditLead(capo, { owner_user_id: "other", created_by: "other" })).toBe(
      false,
    );
  });

  it("denies when there is no profile", () => {
    expect(canEditLead(null, { owner_user_id: "c1" })).toBe(false);
  });
});
