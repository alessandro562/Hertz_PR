import {
  Calendar,
  Inbox,
  MessageCircleReply,
  AlarmClockOff,
  UserCheck,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "./stat-card";

export function CapoPrDashboard({ name }: { name: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ciao {name}</h1>
          <p className="text-sm text-muted-foreground">
            La tua squadra e i tuoi task di oggi
          </p>
        </div>
        <Badge variant="secondary">Capo PR</Badge>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          I miei task
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Lead da contattare" value="—" icon={Inbox} />
          <StatCard label="Hanno risposto" value="—" icon={MessageCircleReply} />
          <StatCard label="Follow-up oggi" value="—" icon={Calendar} />
          <StatCard label="Follow-up scaduti" value="—" icon={AlarmClockOff} />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          La mia squadra
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Collaboratori" value="—" icon={UserCheck} />
          <StatCard label="Attivi" value="—" icon={UserCheck} />
          <StatCard label="Dormienti" value="—" icon={UserCheck} />
          <StatCard label="Score ultimo evento" value="—" icon={Trophy} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="size-4" /> Prossimo evento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Nessun evento assegnato. Comparirà qui con i tuoi numeri da inserire
              (Fase 5).
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Confronto capi PR</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Potrai vedere il ranking e i numeri degli altri capi PR (in sola
              lettura) dalla Fase 6.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
