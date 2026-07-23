import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CountItem } from "@/lib/analytics";

/** Tallest column, in px. Bars scale relative to the largest value. */
const MAX_H = 168;
const MIN_H = 14;

/**
 * 3D perspective bar chart — the "confronto" breakdowns in Dati. Same API as the
 * old flat panel (title + CountItem[]), but each column is a real extruded box
 * (lit top, shadowed side, gradient front — see `.chart3d-*` in globals.css),
 * grounded by a floor shadow and staggered grow-in. Value floats on top; name/%
 * sit on a flat row below so they stay readable. Scrolls horizontally when the
 * columns are wider than the card. Pass items already ordered; never re-sorts.
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
          <div className="chart3d-scroll">
            <div className="chart3d-scene">
              <div className="chart3d-stage">
                {items.map((i, idx) => {
                  const h = Math.round((i.count / max) * MAX_H) + MIN_H;
                  return (
                    <div
                      key={i.key}
                      className="c3d-bar"
                      style={{ height: h, animationDelay: `${idx * 70}ms` }}
                    >
                      <div className="c3d-face c3d-top" />
                      <div className="c3d-face c3d-right" />
                      <div className="c3d-face c3d-front" />
                      <div className="c3d-shadow" />
                      <span className="c3d-val">
                        {i.count}
                        {unit ? (
                          <span className="ml-0.5 text-xs font-medium text-muted-foreground">
                            {unit}
                          </span>
                        ) : null}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="chart3d-labels">
              {items.map((i) => {
                const pct = total > 0 ? Math.round((i.count / total) * 100) : 0;
                return (
                  <div key={i.key} className="w-11 shrink-0 text-center">
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
