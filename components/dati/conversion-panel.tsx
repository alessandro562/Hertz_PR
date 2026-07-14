import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ConversionRow } from "@/lib/analytics";

/**
 * "Conversion by X" list (source, owner, …): one row per group with the
 * conversion % as the bar and converted/total as context. Rows come pre-sorted.
 */
export function ConversionPanel({
  title,
  rows,
  emptyLabel = "Nessun dato in questo periodo.",
}: {
  title: string;
  rows: ConversionRow[];
  emptyLabel?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">{emptyLabel}</p>
        ) : (
          <ul className="space-y-3">
            {rows.map((r) => (
              <li
                key={r.key}
                className="group -mx-2 rounded-sm px-2 py-1 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate">{r.label}</span>
                  <span className="shrink-0 tabular-nums">
                    <span className="font-medium text-foreground">{r.pct}%</span>
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      {r.converted}/{r.total}
                    </span>
                  </span>
                </div>
                <Progress value={r.pct} className="mt-1.5" />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
