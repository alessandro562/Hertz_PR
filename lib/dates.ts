import { format, isPast } from "date-fns";
import { it } from "date-fns/locale";

/** e.g. "15 lug" */
export function shortDate(iso: string): string {
  return format(new Date(iso), "d MMM", { locale: it });
}

/** e.g. "15 luglio 2026" */
export function longDate(iso: string): string {
  return format(new Date(iso), "d MMMM yyyy", { locale: it });
}

/** ISO date (yyyy-MM-dd) for <input type="date"> defaultValue. */
export function toDateInput(iso: string | null): string {
  return iso ? format(new Date(iso), "yyyy-MM-dd") : "";
}

export function isOverdue(iso: string | null): boolean {
  return !!iso && isPast(new Date(iso));
}
