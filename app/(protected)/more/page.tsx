import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { MORE_NAV, navForRole } from "@/lib/constants/navigation";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Altro" };

export default async function MorePage() {
  const current = await getSessionUser();
  if (!current) return null;
  const items = navForRole(MORE_NAV, current.profile.role);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Altro</h1>
      <Card className="divide-y overflow-hidden p-0">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3.5 text-sm transition-colors hover:bg-accent"
            >
              <Icon className="size-4 text-muted-foreground" />
              <span className="flex-1">{item.label}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          );
        })}
      </Card>
    </div>
  );
}
