"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BOTTOM_NAV, MORE_NAV } from "@/lib/constants/navigation";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

// The "Altro" tab owns every page reachable from the Altro menu, so it stays lit
// on /settings, /performance, etc. — not just on /more itself.
const MORE_HREFS = ["/more", ...MORE_NAV.map((m) => m.href)];

export function BottomTabs({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigazione principale"
      className={cn(
        // Small, capped bottom padding instead of the full safe-area inset, so
        // the icons sit as low as possible on the device without a big reserved
        // strip underneath. max() keeps a hair of clearance on notched phones.
        "grid shrink-0 grid-cols-5 border-t bg-background pb-[max(0.25rem,calc(env(safe-area-inset-bottom)_-_1.25rem))]",
        className,
      )}
    >
      {BOTTOM_NAV.map((item) => {
        const active =
          item.href === "/more"
            ? MORE_HREFS.some((h) => isActive(pathname, h))
            : isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="size-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
