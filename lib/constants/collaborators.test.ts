import { describe, it, expect } from "vitest";
import { collabStatusTone } from "./collaborators";

describe("collabStatusTone", () => {
  it("reflects the collaborator's engagement", () => {
    expect(collabStatusTone("attivo")).toBe("positive");
    expect(collabStatusTone("molto_attivo")).toBe("positive");
    expect(collabStatusTone("dormiente")).toBe("active");
    expect(collabStatusTone("da_riattivare")).toBe("active");
    expect(collabStatusTone("non_affidabile")).toBe("negative");
    expect(collabStatusTone("uscito")).toBe("negative");
    expect(collabStatusTone("in_prova")).toBe("neutral");
  });
});
