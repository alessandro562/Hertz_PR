import { describe, it, expect } from "vitest";
import { bucketForStatus, statusTone } from "./leads";

describe("pipeline bucket mapping", () => {
  it("maps each status to its pipeline bucket", () => {
    expect(bucketForStatus("da_contattare")).toBe("da_contattare");
    expect(bucketForStatus("da_ricontattare")).toBe("da_contattare");
    expect(bucketForStatus("contattato")).toBe("contattati");
    expect(bucketForStatus("ha_risposto")).toBe("interessati");
    expect(bucketForStatus("interessato")).toBe("interessati");
    expect(bucketForStatus("inserito_bacheca")).toBe("da_inserire");
    expect(bucketForStatus("convertito_collaboratore")).toBe("convertiti");
    expect(bucketForStatus("non_interessato")).toBe("persi");
    expect(bucketForStatus("scartato")).toBe("persi");
  });
});

describe("statusTone", () => {
  it("reflects the outcome", () => {
    expect(statusTone("convertito_collaboratore")).toBe("positive");
    expect(statusTone("non_interessato")).toBe("negative");
    expect(statusTone("scartato")).toBe("negative");
    expect(statusTone("interessato")).toBe("active");
    expect(statusTone("da_contattare")).toBe("new");
    expect(statusTone("da_ricontattare")).toBe("warning");
    expect(statusTone("non_risponde")).toBe("warning");
  });
});
