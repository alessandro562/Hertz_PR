import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { FunnelStage } from "@/lib/analytics";

/**
 * Conversion funnel: how far leads get down the pipeline, with stage-to-stage
 * conversion % and drop-off. Bar width ∝ leads that reached that stage; "persi"
 * (lost) is shown apart as it's a side-exit, not a stage.
 */
export function ConversionFunnel({
  stages,
  lost,
}: {
  stages: FunnelStage[];
  lost: number;
}) {
  const max = Math.max(1, ...stages.map((s) => s.reached));
  const hasData = stages.some((s) => s.reached > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Funnel di conversione</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <p className="py-4 text-sm text-muted-foreground">
            Nessun lead in questo periodo.
          </p>
        ) : (
          <ul className="space-y-3">
            {stages.map((s, i) => {
              const dropoff = i > 0 ? stages[i - 1].reached - s.reached : 0;
              return (
                <li
                  key={s.key}
                  className="group -mx-2 rounded-sm px-2 py-1 transition-colors hover:bg-accent/50"
                >
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate">{s.label}</span>
                    <span className="shrink-0 tabular-nums">
                      <span className="font-medium text-foreground">{s.reached}</span>
                      {i > 0 ? (
                        <span className="ml-1.5 text-xs text-muted-foreground">
                          {s.conversionPct}%{dropoff > 0 ? ` · -${dropoff}` : ""}
                        </span>
                      ) : null}
                    </span>
                  </div>
                  <Progress value={(s.reached / max) * 100} className="mt-1.5" />
                </li>
              );
            })}
          </ul>
        )}
        {lost > 0 ? (
          <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
            Persi lungo il percorso:{" "}
            <span className="font-medium text-destructive">{lost}</span>
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
