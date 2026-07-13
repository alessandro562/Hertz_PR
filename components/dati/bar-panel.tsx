import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { CountItem } from "@/lib/analytics";

/**
 * A titled list of horizontal magnitude bars — one sage hue (sequential), value
 * direct-labelled on every row, hover lifts the row. Used for every "count by X"
 * breakdown and for the pipeline funnel (pass items already in the order you want;
 * this component never re-sorts). Bar width is relative to the largest row.
 */
export function BarPanel({
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
          <ul className="space-y-3">
            {items.map((i) => {
              const pct = total > 0 ? Math.round((i.count / total) * 100) : 0;
              return (
                <li
                  key={i.key}
                  className="group -mx-2 rounded-sm px-2 py-1 transition-colors hover:bg-accent/50"
                >
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate">{i.label}</span>
                    <span className="shrink-0 tabular-nums">
                      <span className="font-medium text-foreground">{i.count}</span>
                      {unit ? <span className="text-muted-foreground"> {unit}</span> : null}
                      {showPercent ? (
                        <span className="ml-1.5 text-xs text-muted-foreground">{pct}%</span>
                      ) : null}
                    </span>
                  </div>
                  <Progress value={(i.count / max) * 100} className="mt-1.5" />
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
