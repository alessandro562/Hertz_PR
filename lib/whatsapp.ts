/**
 * Build a WhatsApp click-to-chat link (wa.me).
 * The number must be in full international form (country code + number).
 * We strip spaces/symbols; if a bare Italian mobile is passed (starts with 3,
 * 9-10 digits, no country code) we prepend 39 as a best-effort default.
 */
export function whatsappLink(phone: string, text?: string): string {
  let digits = phone.replace(/[^\d]/g, "");

  // Best-effort: bare Italian mobile -> prepend country code.
  if (/^3\d{8,9}$/.test(digits)) {
    digits = `39${digits}`;
  }

  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** True if we have enough to build a usable WhatsApp link. */
export function hasWhatsapp(phone: string | null | undefined): phone is string {
  return !!phone && phone.replace(/[^\d]/g, "").length >= 8;
}
