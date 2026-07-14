import type { Metadata } from "next";
import { Megaphone } from "lucide-react";
import { listAnnouncements } from "@/lib/announcements/queries";
import { getSessionUser } from "@/lib/auth/session";
import { isManager, isCapoPr } from "@/lib/permissions";
import { AnnouncementComposer } from "@/components/announcements/announcement-composer";
import { AnnouncementCard } from "@/components/announcements/announcement-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Bacheca" };

export default async function BachecaPage() {
  const [announcements, current] = await Promise.all([
    listAnnouncements(),
    getSessionUser(),
  ]);
  const profile = current?.profile ?? null;
  const manager = isManager(profile);
  const canPost = manager || isCapoPr(profile);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bacheca</h1>
        <p className="text-sm text-muted-foreground">
          Annunci per coordinare la squadra.
        </p>
      </div>

      {canPost ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nuovo annuncio</CardTitle>
          </CardHeader>
          <CardContent>
            <AnnouncementComposer />
          </CardContent>
        </Card>
      ) : null}

      {announcements.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <Megaphone className="size-8" />
          <p className="text-sm">Ancora nessun annuncio.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <AnnouncementCard
              key={a.id}
              announcement={a}
              canManage={manager || a.author_user_id === current?.id}
              canPin={manager}
            />
          ))}
        </div>
      )}
    </div>
  );
}
