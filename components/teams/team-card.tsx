import Link from "next/link";
import { Card } from "@/components/ui/card";

export function TeamCard({
  id,
  name,
  capoName,
  memberCount,
  activeCount,
}: {
  id: string;
  name: string;
  capoName: string;
  memberCount: number;
  activeCount: number;
}) {
  return (
    <Link href={`/teams/${id}`} className="block">
      <Card className="gap-0 p-4 transition-colors hover:bg-accent/50">
        <div className="font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">Capo PR: {capoName}</div>
        <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
          <span>
            <b className="text-foreground">{memberCount}</b> membri
          </span>
          <span>
            <b className="text-foreground">{activeCount}</b> attivi
          </span>
        </div>
      </Card>
    </Link>
  );
}
