import Link from "next/link";
import { Megaphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { shortDate } from "@/lib/dates";
import type { Announcement } from "@/lib/announcements/queries";

/** Compact "latest announcement" card for the dashboards. Renders nothing if empty. */
export function AnnouncementWidget({
  announcement,
}: {
  announcement: Announcement | null;
}) {
  if (!announcement) return null;
  return (
    <Link href="/bacheca" className="block">
      <Card className="transition-colors hover:bg-accent/50">
        <CardContent className="flex items-start gap-3 pt-4">
          <Megaphone className="size-4 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              {announcement.pinned ? "In evidenza" : "Ultimo annuncio"}
            </p>
            <p className="mt-0.5 truncate font-medium">{announcement.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {announcement.author_name ?? "—"} · {shortDate(announcement.created_at)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
