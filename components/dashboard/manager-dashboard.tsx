import {
  Calendar,
  Users,
  UserCheck,
  AlarmClockOff,
  UsersRound,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "./stat-card";

export function ManagerDashboard({ name }: { name: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ciao {name}</h1>
          <p className="text-sm text-muted-foreground">
            Control room · panoramica della rete PR
          </p>
        </div>
        <Badge variant="secondary">Manager</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="size-4" /> Prossimo evento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nessun evento in programma. La gestione eventi arriva nella Fase 5.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          Stato CRM
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <StatCard label="Lead totali" value="—" icon={Users} />
          <StatCard label="Da contattare" value="—" icon={Users} />
          <StatCard label="Follow-up scaduti" value="—" icon={AlarmClockOff} />
          <StatCard label="Collaboratori attivi" value="—" icon={UserCheck} />
          <StatCard label="Squadre PR" value="—" icon={UsersRound} />
          <StatCard label="Score medio" value="—" icon={Trophy} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance capi PR</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              La classifica dei capi PR con lista, ticket, tavoli e score arriva
              con eventi e performance (Fase 5–6).
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alert operativi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Lead fermi, follow-up scaduti e collaboratori dormienti compariranno
              qui man mano che il CRM viene popolato.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
