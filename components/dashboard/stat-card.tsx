import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * StatCard — dashboard KPI unit. Mono kicker label, big brand numeral (.num),
 * optional unit suffix and a trend hint (success/danger). No icon: the numeral
 * carries the hierarchy, per the brand specimen.
 */
export function StatCard({
  label,
  value,
  unit,
  hint,
  hintTone = "muted",
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  hintTone?: "muted" | "success" | "danger";
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </span>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="num text-3xl">{value}</span>
          {unit ? <span className="text-sm text-muted-foreground">{unit}</span> : null}
        </div>
        {hint ? (
          <p
            className={cn(
              "mt-1 text-xs font-medium",
              hintTone === "success" && "text-success",
              hintTone === "danger" && "text-destructive",
              hintTone === "muted" && "text-muted-foreground",
            )}
          >
            {hint}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
