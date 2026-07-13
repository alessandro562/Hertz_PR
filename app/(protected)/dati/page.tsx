import type { Metadata } from "next";
import { listLeads } from "@/lib/leads/queries";
import { listCollaborators, listCapiPr, profilesNameMap } from "@/lib/network/queries";
import { listEvents } from "@/lib/events/queries";
import { listAllPerformances } from "@/lib/rankings/queries";
import { DataDashboard } from "@/components/dati/data-dashboard";

export const metadata: Metadata = { title: "Dati" };

export default async function DatiPage() {
  // RLS scopes every fetch: a Manager gets the whole network, a Capo PR only
  // their own leads/collaborators/performances. Aggregation happens client-side
  // in <DataDashboard> so the filters respond instantly.
  const [leads, collaborators, capiProfiles, names, events, performances] =
    await Promise.all([
      listLeads(),
      listCollaborators(),
      listCapiPr(),
      profilesNameMap(),
      listEvents(),
      listAllPerformances(),
    ]);

  const eventDates = Object.fromEntries(events.map((e) => [e.id, e.event_date]));
  const capi = capiProfiles.map((p) => ({ id: p.id, name: p.full_name }));

  return (
    <DataDashboard
      leads={leads}
      collaborators={collaborators}
      performances={performances}
      eventDates={eventDates}
      names={names}
      capi={capi}
    />
  );
}
