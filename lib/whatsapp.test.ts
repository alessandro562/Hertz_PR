import { describe, it, expect } from "vitest";
import { whatsappLink, hasWhatsapp } from "./whatsapp";

describe("whatsappLink", () => {
  it("strips symbols and builds a wa.me link", () => {
    expect(whatsappLink("+39 333 1234567")).toBe("https://wa.me/393331234567");
  });

  it("prepends 39 for a bare Italian mobile", () => {
    expect(whatsappLink("333 1234567")).toBe("https://wa.me/393331234567");
  });

  it("url-encodes the prefilled text", () => {
    expect(whatsappLink("+393331234567", "Ciao Marti")).toBe(
      "https://wa.me/393331234567?text=Ciao%20Marti",
    );
  });
});

describe("hasWhatsapp", () => {
  it("needs at least 8 digits", () => {
    expect(hasWhatsapp("+39 333 1234567")).toBe(true);
    expect(hasWhatsapp("123")).toBe(false);
    expect(hasWhatsapp("")).toBe(false);
    expect(hasWhatsapp(null)).toBe(false);
    expect(hasWhatsapp(undefined)).toBe(false);
  });
});
