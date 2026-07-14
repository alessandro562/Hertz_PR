import type { Metadata } from "next";
import { listLeads, listLeadStatusChanges } from "@/lib/leads/queries";
import { listCollaborators, listCapiPr, profilesNameMap } from "@/lib/network/queries";
import { listEvents } from "@/lib/events/queries";
import { listAllPerformances } from "@/lib/rankings/queries";
import { progressiveIndex } from "@/lib/analytics";
import { DataDashboard } from "@/components/dati/data-dashboard";
import type { LeadStatus } from "@/types/database";

export const metadata: Metadata = { title: "Dati" };

export default async function DatiPage() {
  // RLS scopes every fetch: a Manager gets the whole network, a Capo PR only
  // their own leads/collaborators/performances. Aggregation happens client-side
  // in <DataDashboard> so the filters respond instantly.
  const [leads, collaborators, capiProfiles, names, events, performances, statusChanges] =
    await Promise.all([
      listLeads(),
      listCollaborators(),
      listCapiPr(),
      profilesNameMap(),
      listEvents(),
      listAllPerformances(),
      listLeadStatusChanges(),
    ]);

  const eventDates = Object.fromEntries(events.map((e) => [e.id, e.event_date]));
  const capi = capiProfiles.map((p) => ({ id: p.id, name: p.full_name }));

  // Furthest pipeline stage each lead ever reached (current status + history),
  // so the conversion funnel attributes lost leads to where they dropped.
  const reachedByLead: Record<string, number> = {};
  for (const l of leads) {
    reachedByLead[l.id] = Math.max(0, progressiveIndex(l.status));
  }
  for (const c of statusChanges) {
    if (!(c.lead_id in reachedByLead)) continue;
    const idx = progressiveIndex(c.status as LeadStatus);
    if (idx >= 0) {
      reachedByLead[c.lead_id] = Math.max(reachedByLead[c.lead_id], idx);
    }
  }

  return (
    <DataDashboard
      leads={leads}
      collaborators={collaborators}
      performances={performances}
      eventDates={eventDates}
      names={names}
      capi={capi}
      reachedByLead={reachedByLead}
    />
  );
}
