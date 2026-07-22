"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { isManager } from "@/lib/permissions";
import { daysAgoIso, isOverdue } from "@/lib/dates";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { TrendChart } from "@/components/performance/trend-chart";
import { BarPanel } from "./bar-panel";
import { ConversionFunnel } from "./conversion-funnel";
import { ConversionPanel } from "./conversion-panel";
import {
  leadTypeCounts,
  tagCounts,
  sourceCounts,
  byWeek,
  countBy,
  collabByLevel,
  collabByStatus,
  progressiveIndex,
  conversionFunnel,
  conversionBySource,
  conversionByOwner,
  leadsByOwner,
} from "@/lib/analytics";
import { bucketForStatus } from "@/lib/constants/leads";
import { sumPerformances, groupPerformances } from "@/lib/performance";
import type { Lead } from "@/lib/leads/queries";
import type { Collaborator } from "@/lib/network/queries";
import type { EventPerformance } from "@/lib/events/queries";

type Period = "all" | "30" | "90" | "365";
type Section = "lead" | "collab" | "perf";

const PERIODS: { key: Period; label: string }[] = [
  { key: "all", label: "Sempre" },
  { key: "30", label: "30g" },
  { key: "90", label: "90g" },
  { key: "365", label: "Anno" },
];

const SECTIONS: { key: Section; label: string }[] = [
  { key: "lead", label: "Lead" },
  { key: "collab", label: "Collaboratori" },
  { key: "perf", label: "Performance" },
];

export function DataDashboard({
  leads,
  collaborators,
  performances,
  eventDates,
  names,
  capi,
  reachedByLead,
}: {
  leads: Lead[];
  collaborators: Collaborator[];
  performances: EventPerformance[];
  eventDates: Record<string, string>;
  names: Record<string, string>;
  capi: { id: string; name: string }[];
  reachedByLead: Record<string, number>;
}) {
  const manager = isManager(useCurrentUser().profile);
  const [period, setPeriod] = useState<Period>("all");
  const [capo, setCapo] = useState<string>("all");
  const [section, setSection] = useState<Section>("lead");

  const cutoff = period === "all" ? null : daysAgoIso(Number(period));

  const scopedLeads = useMemo(
    () =>
      leads.filter(
        (l) =>
          (!cutoff || l.created_at >= cutoff) &&
          (capo === "all" || l.owner_user_id === capo),
      ),
    [leads, cutoff, capo],
  );

  const scopedCollabs = useMemo(
    () =>
      collaborators.filter(
        (c) =>
          (!cutoff || c.created_at >= cutoff) &&
          (capo === "all" || c.capo_pr_user_id === capo),
      ),
    [collaborators, cutoff, capo],
  );

  const scopedPerf = useMemo(
    () =>
      performances.filter((p) => {
        const date = eventDates[p.event_id];
        return (
          (!cutoff || (date != null && date >= cutoff)) &&
          (capo === "all" || p.capo_pr_user_id === capo)
        );
      }),
    [performances, eventDates, cutoff, capo],
  );

  const leadKpis = useMemo(() => {
    const total = scopedLeads.length;
    const converted = scopedLeads.filter(
      (l) => l.converted_to_collaborator || l.status === "convertito_collaboratore",
    ).length;
    const overdue = scopedLeads.filter((l) => isOverdue(l.next_follow_up_at)).length;
    const unowned = scopedLeads.filter((l) => !l.owner_user_id).length;
    const toContact = scopedLeads.filter((l) => l.status === "da_contattare").length;
    const rate = total > 0 ? Math.round((converted / total) * 100) : 0;
    return { total, converted, overdue, unowned, toContact, rate };
  }, [scopedLeads]);

  const newLeadsTrend = useMemo(
    () => byWeek(scopedLeads, (l) => l.created_at, "Nuovi"),
    [scopedLeads],
  );

  const funnel = useMemo(() => {
    const reached = scopedLeads.map(
      (l) => reachedByLead[l.id] ?? Math.max(0, progressiveIndex(l.status)),
    );
    const lost = scopedLeads.filter(
      (l) => bucketForStatus(l.status) === "persi",
    ).length;
    const stages = conversionFunnel(reached);
    const contacted = stages[1]?.reached ?? 0;
    const responded = stages[2]?.reached ?? 0;
    const responseRate =
      contacted > 0 ? Math.round((responded / contacted) * 100) : 0;
    return { stages, lost, responseRate };
  }, [scopedLeads, reachedByLead]);

  const convBySource = useMemo(
    () => conversionBySource(scopedLeads),
    [scopedLeads],
  );
  const convByOwner = useMemo(
    () => conversionByOwner(scopedLeads, names),
    [scopedLeads, names],
  );
  const leadsByPr = useMemo(
    () => leadsByOwner(scopedLeads, names),
    [scopedLeads, names],
  );

  const collabKpis = useMemo(() => {
    const total = scopedCollabs.length;
    const active = scopedCollabs.filter(
      (c) => c.status === "attivo" || c.status === "affidabile",
    ).length;
    const dormant = scopedCollabs.filter(
      (c) => c.status === "inattivo" || c.status === "da_riattivare",
    ).length;
    const capiCount = new Set(
      scopedCollabs.map((c) => c.capo_pr_user_id).filter(Boolean),
    ).size;
    return { total, active, dormant, capiCount };
  }, [scopedCollabs]);

  const collabByCapo = useMemo(
    () => countBy(scopedCollabs, (c) => c.capo_pr_user_id, (id) => names[id] ?? "—"),
    [scopedCollabs, names],
  );

  const perfKpis = useMemo(() => {
    const totals = sumPerformances(scopedPerf);
    const eventCount = new Set(scopedPerf.map((p) => p.event_id)).size;
    const avg = eventCount > 0 ? Math.round(totals.score / eventCount) : 0;
    return { score: totals.score, eventCount, avg };
  }, [scopedPerf]);

  const capoRanking = useMemo(
    () =>
      groupPerformances(
        scopedPerf.filter((p) => p.capo_pr_user_id),
        (p) => names[p.capo_pr_user_id as string] ?? "—",
      ).map((g) => ({ key: g.key, label: g.key, count: g.score })),
    [scopedPerf, names],
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dati</h1>
        <p className="text-sm text-muted-foreground">
          Segmenta e analizza tutto in un colpo d&apos;occhio.
        </p>
      </div>

      {/* Filtri — una riga, scope globale */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-0.5 rounded-sm border border-border p-0.5">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPeriod(p.key)}
              className={cn(
                "rounded-[3px] px-2.5 py-1.5 text-xs font-medium transition-colors",
                period === p.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        {manager ? (
          <Select value={capo} onValueChange={(v) => setCapo(v ?? "all")}>
            <SelectTrigger size="sm" aria-label="Filtra per Capo PR" className="min-w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti i capi</SelectItem>
              {capi.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>

      {/* Sezioni */}
      <div className="-mx-4 flex items-center gap-1 overflow-x-auto border-b border-border px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SECTIONS.map((s) => {
          const active = section === s.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setSection(s.key)}
              className={cn(
                "relative shrink-0 whitespace-nowrap px-3 py-2.5 text-sm font-medium outline-none transition-colors",
                "after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full",
                active
                  ? "text-foreground after:bg-primary"
                  : "text-muted-foreground hover:text-foreground after:bg-transparent",
              )}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {section === "lead" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Lead totali" value={leadKpis.total} />
            <StatCard
              label="Convertiti"
              value={leadKpis.converted}
              hint={`${leadKpis.rate}% del totale`}
              hintTone="success"
            />
            <StatCard
              label="Follow-up scaduti"
              value={leadKpis.overdue}
              href="/oggi"
              hintTone="danger"
            />
            <StatCard
              label={manager ? "Senza owner" : "Da contattare"}
              value={manager ? leadKpis.unowned : leadKpis.toContact}
            />
          </div>

          <ConversionFunnel stages={funnel.stages} lost={funnel.lost} />

          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Tasso di risposta" value={`${funnel.responseRate}%`} />
            <StatCard label="Tasso di conversione" value={`${leadKpis.rate}%`} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <BarPanel title="Per tipo" items={leadTypeCounts(scopedLeads)} showPercent />
            <BarPanel
              title="Per etichetta"
              items={tagCounts(scopedLeads)}
              emptyLabel="Nessuna etichetta assegnata."
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <BarPanel
              title="Per fonte"
              items={sourceCounts(scopedLeads)}
              emptyLabel="Nessuna fonte indicata."
            />
            <BarPanel
              title="Lead per PR"
              items={leadsByPr}
              showPercent
              emptyLabel="Nessun lead attribuito a un PR."
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ConversionPanel
              title="Conversione per fonte"
              rows={convBySource}
              emptyLabel="Nessuna fonte indicata."
            />
            <ConversionPanel
              title="Conversione per PR"
              rows={convByOwner}
              emptyLabel="Nessun lead attribuito a un PR."
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Nuovi lead nel tempo</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart data={newLeadsTrend} series={["Nuovi"]} />
            </CardContent>
          </Card>
        </div>
      ) : null}

      {section === "collab" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Collaboratori" value={collabKpis.total} />
            <StatCard label="Attivi" value={collabKpis.active} hintTone="success" />
            <StatCard label="Dormienti" value={collabKpis.dormant} hintTone="danger" />
            {manager ? <StatCard label="Capi PR" value={collabKpis.capiCount} /> : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <BarPanel title="Per livello" items={collabByLevel(scopedCollabs)} showPercent />
            <BarPanel title="Per stato" items={collabByStatus(scopedCollabs)} showPercent />
          </div>

          {manager ? <BarPanel title="PR per Capo" items={collabByCapo} /> : null}
        </div>
      ) : null}

      {section === "perf" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Punteggio totale" value={perfKpis.score} unit="pt" />
            <StatCard label="Eventi con dati" value={perfKpis.eventCount} />
            <StatCard label="Media per evento" value={perfKpis.avg} unit="pt" />
          </div>

          <BarPanel
            title="Classifica Capi PR"
            items={capoRanking}
            unit="pt"
            emptyLabel="Ancora nessun numero registrato."
          />

          <Card>
            <CardContent className="py-4">
              <p className="mb-3 text-sm text-muted-foreground">
                Vuoi l&apos;andamento evento per evento nel tempo?
              </p>
              <Link
                href="/performance"
                className={cn(buttonVariants({ variant: "outline" }), "h-11 gap-2")}
              >
                Vai a Performance <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
