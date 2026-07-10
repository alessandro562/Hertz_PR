import Link from "next/link";
import { cn } from "@/lib/utils";
import { PersonAvatar } from "@/components/common/person-avatar";
import { Progress } from "@/components/ui/progress";

export interface RankingItem {
  id: string;
  name: string;
  sublabel?: string;
  value: string;
  href?: string;
  avatarUrl?: string | null;
  /** Numeric magnitude for the bar. Omit for non-score lists (no bar drawn). */
  weight?: number;
}

/** Podium tint for the top 3 — brand-muted gold/silver/bronze, never neon. */
const PODIUM_BADGE = [
  "bg-[var(--color-gold)] text-ink",
  "bg-[var(--color-silver)] text-ink",
  "bg-[var(--color-bronze)] text-ink",
];
const PODIUM_BAR = ["gold", "silver", "bronze"] as const;

export function RankingList({
  items,
  emptyLabel,
}: {
  items: RankingItem[];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  // Bars are normalized to the leader within this list.
  const maxWeight = Math.max(1, ...items.map((i) => i.weight ?? 0));

  return (
    <div className="space-y-1">
      {items.map((item, i) => {
        const podium = i < 3;
        const hasBar = item.weight != null;
        const row = (
          <div className={cn("rounded-md px-2 py-2", podium && "bg-muted/40")}>
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-sm text-xs font-bold tabular-nums",
                  podium ? PODIUM_BADGE[i] : "bg-secondary text-muted-foreground",
                )}
              >
                {i + 1}
              </span>
              <PersonAvatar name={item.name} avatarUrl={item.avatarUrl} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{item.name}</span>
                {item.sublabel ? (
                  <span className="block truncate font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    {item.sublabel}
                  </span>
                ) : null}
              </span>
              <span
                className={cn(
                  "shrink-0 tabular-nums",
                  hasBar ? "num text-lg" : "text-sm font-semibold text-muted-foreground",
                )}
              >
                {item.value}
              </span>
            </div>
            {hasBar ? (
              <Progress
                value={(item.weight! / maxWeight) * 100}
                tone={podium ? PODIUM_BAR[i] : "primary"}
                className="mt-1.5"
              />
            ) : null}
          </div>
        );
        return item.href ? (
          <Link
            key={item.id}
            href={item.href}
            className="block rounded-md transition-colors hover:bg-accent/50"
          >
            {row}
          </Link>
        ) : (
          <div key={item.id}>{row}</div>
        );
      })}
    </div>
  );
}
