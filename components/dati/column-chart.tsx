import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CountItem } from "@/lib/analytics";

/** Plot geometry, in px. Bars scale relative to the largest value. */
const BAR_MAX = 150;
const BAR_MIN = 6;
const PLOT_H = BAR_MAX + 30; // room for the value label above the tallest bar

/**
 * Column chart for the "confronto" breakdowns in Dati. Built to the dataviz
 * method: a single sage hue for every column (one series → one color; sage is
 * low-chroma, so multiple shades would read as the same gray and fail CVD),
 * thin 24px columns with a 4px rounded cap on a hairline baseline, the value
 * direct-labelled on each cap, names/% on a flat row below, and a robust
 * scaleY grow-in. Pure block layout — no 3D transforms — so it renders the same
 * on every browser, mobile Safari included. Pass items pre-ordered; never sorts.
 */
export function ColumnChart({
  title,
  items,
  unit,
  showPercent = false,
  emptyLabel = "Nessun dato in questo periodo.",
}: {
  title: string;
  items: CountItem[];
  unit?: string;
  showPercent?: boolean;
  emptyLabel?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  const total = items.reduce((s, i) => s + i.count, 0);
  const hasData = items.some((i) => i.count > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <p className="py-4 text-sm text-muted-foreground">{emptyLabel}</p>
        ) : (
          <div className="overflow-x-auto pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div
              className="flex items-end gap-3 border-b border-border"
              style={{ height: PLOT_H }}
            >
              {items.map((i, idx) => {
                const h = Math.round((i.count / max) * BAR_MAX) + BAR_MIN;
                return (
                  <div
                    key={i.key}
                    className="flex w-14 shrink-0 flex-col items-center justify-end gap-1.5"
                  >
                    <span className="text-sm font-semibold leading-none text-foreground">
                      {i.count}
                      {unit ? (
                        <span className="ml-0.5 text-xs font-medium text-muted-foreground">
                          {unit}
                        </span>
                      ) : null}
                    </span>
                    <div
                      className="col-bar w-6 rounded-t-[4px] bg-primary transition-colors hover:bg-[var(--color-sage-300)]"
                      style={{ height: h, animationDelay: `${idx * 55}ms` }}
                      title={`${i.label}: ${i.count}${unit ? ` ${unit}` : ""}`}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              {items.map((i) => {
                const pct = total > 0 ? Math.round((i.count / total) * 100) : 0;
                return (
                  <div key={i.key} className="w-14 shrink-0 text-center">
                    <div className="truncate text-xs text-foreground">{i.label}</div>
                    {showPercent ? (
                      <div className="text-[11px] tabular-nums text-muted-foreground">
                        {pct}%
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
