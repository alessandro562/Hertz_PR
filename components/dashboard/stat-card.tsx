import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  hintTone = "muted",
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  hint?: string;
  hintTone?: "muted" | "success" | "danger";
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            {label}
          </span>
          {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
        </div>
        <div className="num mt-2 text-3xl">{value}</div>
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
