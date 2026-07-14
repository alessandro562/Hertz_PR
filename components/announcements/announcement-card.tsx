"use client";

import { useTransition } from "react";
import { Pin, PinOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteAnnouncement, togglePin } from "@/lib/announcements/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { dateTime } from "@/lib/dates";
import type { Announcement } from "@/lib/announcements/queries";

export function AnnouncementCard({
  announcement,
  canManage,
  canPin,
}: {
  announcement: Announcement;
  /** Author or Manager → can delete. */
  canManage: boolean;
  /** Manager → can pin/unpin. */
  canPin: boolean;
}) {
  const [pending, start] = useTransition();
  const a = announcement;

  function onDelete() {
    start(async () => {
      const res = await deleteAnnouncement(a.id);
      if (res.error) toast.error(res.error);
      else toast.success("Annuncio eliminato");
    });
  }

  function onPin() {
    start(async () => {
      const res = await togglePin(a.id, !a.pinned);
      if (res.error) toast.error(res.error);
    });
  }

  return (
    <Card className={cn(a.pinned && "border-primary/40")}>
      <CardContent className="space-y-2 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {a.pinned ? (
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-primary">
                📌 In evidenza
              </span>
            ) : null}
            <h3 className="font-medium">{a.title}</h3>
          </div>
          {canPin || canManage ? (
            <div className="flex shrink-0 gap-1">
              {canPin ? (
                <Button
                  variant="ghost"
                  className="size-9 p-0"
                  onClick={onPin}
                  disabled={pending}
                  aria-label={a.pinned ? "Togli dall'evidenza" : "Metti in evidenza"}
                >
                  {a.pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
                </Button>
              ) : null}
              {canManage ? (
                <Button
                  variant="ghost"
                  className="size-9 p-0 text-muted-foreground hover:text-destructive"
                  onClick={onDelete}
                  disabled={pending}
                  aria-label="Elimina annuncio"
                >
                  <Trash2 className="size-4" />
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
        <p className="text-sm whitespace-pre-wrap text-muted-foreground">{a.body}</p>
        <p className="text-xs text-muted-foreground">
          {a.author_name ?? "—"} · {dateTime(a.created_at)}
        </p>
      </CardContent>
    </Card>
  );
}
