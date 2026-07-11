import { describe, it, expect } from "vitest";
import { collabStatusTone } from "./collaborators";

describe("collabStatusTone", () => {
  it("reflects the collaborator's engagement", () => {
    expect(collabStatusTone("attivo")).toBe("active");
    expect(collabStatusTone("affidabile")).toBe("positive");
    expect(collabStatusTone("da_riattivare")).toBe("warning");
    expect(collabStatusTone("inattivo")).toBe("neutral");
  });
});
