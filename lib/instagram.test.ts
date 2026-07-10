import { describe, it, expect } from "vitest";
import { normalizeInstagramUsername, instagramUrl } from "./instagram";

describe("normalizeInstagramUsername", () => {
  it("strips a leading @ and lowercases", () => {
    expect(normalizeInstagramUsername("@Marti.Rossi")).toBe("marti.rossi");
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeInstagramUsername("  Foo_Bar  ")).toBe("foo_bar");
  });

  it("extracts the handle from a full profile URL", () => {
    expect(normalizeInstagramUsername("https://instagram.com/Marti.Rossi/")).toBe(
      "marti.rossi",
    );
    expect(normalizeInstagramUsername("http://www.instagram.com/foo?hl=it")).toBe(
      "foo",
    );
  });

  it("removes extra @ and trailing slashes", () => {
    expect(normalizeInstagramUsername("@@foo//")).toBe("foo");
  });

  it("collapses different inputs for the same person to one key", () => {
    const a = normalizeInstagramUsername("@Marti.Rossi");
    const b = normalizeInstagramUsername("https://instagram.com/marti.rossi");
    expect(a).toBe(b);
  });
});

describe("instagramUrl", () => {
  it("builds a canonical profile url", () => {
    expect(instagramUrl("@Marti.Rossi")).toBe("https://instagram.com/marti.rossi");
  });
});
