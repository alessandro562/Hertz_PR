import Link from "next/link";

export interface RankingItem {
  id: string;
  name: string;
  sublabel?: string;
  value: string;
  href?: string;
}

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
    <div className="space-y-2">
      {items.map((item, i) => {
        const row = (
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span className="shrink-0 text-muted-foreground">#{i + 1}</span>
              <span className="min-w-0">
                <span className="block truncate">{item.name}</span>
                {item.sublabel ? (
                  <span className="block truncate text-xs text-muted-foreground">
                    {item.sublabel}
                  </span>
                ) : null}
              </span>
            </span>
            <span className="shrink-0 font-medium tabular-nums">{item.value}</span>
          </div>
        );
        return item.href ? (
          <Link key={item.id} href={item.href} className="block hover:underline">
            {row}
          </Link>
        ) : (
          <div key={item.id}>{row}</div>
        );
      })}
    </div>
  );
}
