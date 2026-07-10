import Link from "next/link";
import { cn } from "@/lib/utils";
import { PersonAvatar } from "@/components/common/person-avatar";

export interface RankingItem {
  id: string;
  name: string;
  sublabel?: string;
  value: string;
  href?: string;
  avatarUrl?: string | null;
}

/** Podium tint for the top 3 — brand-muted gold/silver/bronze, never neon. */
const PODIUM_BADGE = [
  "bg-[var(--color-gold)] text-ink",
  "bg-[var(--color-silver)] text-ink",
  "bg-[var(--color-bronze)] text-ink",
];

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

  return (
    <div className="space-y-1">
      {items.map((item, i) => {
        const row = (
          <div
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
              i < 3 && "bg-muted/40",
            )}
          >
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-sm text-xs font-bold",
                i < 3 ? PODIUM_BADGE[i] : "text-muted-foreground",
              )}
            >
              {i + 1}
            </span>
            <PersonAvatar name={item.name} avatarUrl={item.avatarUrl} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate">{item.name}</span>
              {item.sublabel ? (
                <span className="block truncate font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  {item.sublabel}
                </span>
              ) : null}
            </span>
            <span className="shrink-0 font-semibold tabular-nums">{item.value}</span>
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
