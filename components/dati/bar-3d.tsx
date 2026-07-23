import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CountItem } from "@/lib/analytics";

/** Tallest column, in px. Bars scale relative to the largest value. */
const MAX_H = 148;
const MIN_H = 6;

/**
 * 3D isometric bar chart — a drop-in alternative to <BarPanel> for the "confronto"
 * breakdowns in Dati. Same props/shape (title + CountItem[]), but renders extruded
 * sage columns (see `.chart3d` / `.bar3d` in globals.css) with the value on top and
 * the label below. Scrolls horizontally when there are many categories. Pass items
 * already in the order you want; this never re-sorts.
 */
export function Bar3D({
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
          <div className="chart3d pl-1 pr-4 pt-8" style={{ minHeight: MAX_H + 64 }}>
            {items.map((i) => {
              const h = Math.round((i.count / max) * MAX_H) + MIN_H;
              const pct = total > 0 ? Math.round((i.count / total) * 100) : 0;
              return (
                <div key={i.key} className="flex shrink-0 flex-col items-center gap-2">
                  <span className="num text-sm leading-none">
                    {i.count}
                    {unit ? (
                      <span className="ml-0.5 text-xs font-medium text-muted-foreground">
                        {unit}
                      </span>
                    ) : null}
                  </span>
                  <div className="bar3d" style={{ height: h, marginTop: 14 }} aria-hidden />
                  <div className="flex flex-col items-center">
                    <span className="max-w-[68px] truncate text-xs text-foreground">
                      {i.label}
                    </span>
                    {showPercent ? (
                      <span className="text-[11px] text-muted-foreground tabular-nums">
                        {pct}%
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
