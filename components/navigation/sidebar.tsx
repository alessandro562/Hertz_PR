"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SIDEBAR_NAV, navForRole } from "@/lib/constants/navigation";
import { useRole } from "@/hooks/use-role";
import { Logo } from "@/components/pr-hub/logo";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const role = useRole();
  const items = navForRole(SIDEBAR_NAV, role);

  return (
    <aside className={cn("flex-col gap-1 border-r bg-sidebar p-3", className)}>
      <div className="mb-4 flex items-center gap-3 px-2 py-2">
        <Logo variant="lockup" height={44} priority />
        <span className="h-6 w-px bg-border" aria-hidden />
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          PR Hub
        </span>
      </div>

      <nav aria-label="Sezioni" className="flex flex-col gap-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
