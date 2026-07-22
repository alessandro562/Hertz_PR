import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * StatCard — dashboard KPI unit. Mono kicker label, big brand numeral (.num),
 * optional unit suffix and a trend hint (success/danger). No icon: the numeral
 * carries the hierarchy, per the brand specimen. Pass `href` to make the whole
 * card a tap target (e.g. follow-up counts → /oggi).
 */
export function StatCard({
  label,
  value,
  unit,
  hint,
  hintTone = "muted",
  href,
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  hintTone?: "muted" | "success" | "danger";
  href?: string;
}) {
  const card = (
    <Card className={cn("flex flex-col h-40", href && "transition-colors hover:bg-accent/50")}>
      <CardContent className="flex-1 p-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground text-nowrap">
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

  return href ? (
    <Link href={href} className="block">
      {card}
    </Link>
  ) : (
    card
  );
}
