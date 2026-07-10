import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ComingSoon({
  title,
  description,
  phase,
  icon: Icon,
}: {
  title: string;
  description: string;
  phase?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {phase ? <Badge variant="outline">{phase}</Badge> : null}
      </div>
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
          {Icon ? (
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Icon className="size-6 text-muted-foreground" />
            </div>
          ) : null}
          <p className="max-w-md text-sm text-muted-foreground">{description}</p>
          <p className="text-xs text-muted-foreground">In arrivo</p>
        </CardContent>
      </Card>
    </div>
  );
}
