import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth/session";
import { isManager } from "@/lib/permissions";
import { listLeads } from "@/lib/leads/queries";
import { listCollaborators, listCapiPr, profilesNameMap } from "@/lib/network/queries";
import { listEvents } from "@/lib/events/queries";
import { listAllPerformances } from "@/lib/rankings/queries";
import { listAnnouncements } from "@/lib/announcements/queries";
import { groupPerformances, sumPerformances } from "@/lib/performance";
import { leadStatsByOwner } from "@/lib/analytics";
import { isOverdue } from "@/lib/dates";
import { ManagerDashboard } from "@/components/dashboard/manager-dashboard";
import { CapoPrDashboard } from "@/components/dashboard/capo-pr-dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  // The protected layout already guaranteed an active user; this call is
  // deduped by React cache(). We re-read it only to branch on role.
  const current = await getSessionUser();
  if (!current) return null;

  const firstName = current.profile.full_name.split(" ")[0];

  const [leads, collaborators, capi, events, performances, names, announcements] =
    await Promise.all([
      listLeads(),
      listCollaborators(),
      listCapiPr(),
      listEvents(),
      listAllPerformances(),
      profilesNameMap(),
      listAnnouncements(),
    ]);
  const latestAnnouncement = announcements[0] ?? null;

  const now = new Date().toISOString();
  const nextEvent =
    [...events]
      .filter((e) => e.event_date >= now && e.status !== "annullato")
      .sort((a, b) => a.event_date.localeCompare(b.event_date))[0] ?? null;

  const activeCollaborators = collaborators.filter(
    (c) => c.status === "attivo" || c.status === "affidabile",
  );
  const dormantCollaborators = collaborators.filter(
    (c) => c.status === "inattivo" || c.status === "da_riattivare",
  );

  if (isManager(current.profile)) {
    const totals = sumPerformances(performances);
    const avgScore = performances.length
      ? Math.round(totals.score / performances.length)
      : 0;

    const topCapos = groupPerformances(
      performances,
      (p) => p.capo_pr_user_id ?? "senza-capo",
    )
      .slice(0, 3)
      .map((g) => ({ id: g.key, name: names[g.key] ?? "—", score: g.score }));

    // Per-PR lead scorecard: volume + conversion, top 6 by volume.
    const leadsByPr = leadStatsByOwner(leads, names)
      .slice(0, 6)
      .map((r) => ({
        id: r.key,
        name: r.label,
        total: r.total,
        converted: r.converted,
        pct: r.pct,
      }));

    const alerts: { label: string; href: string }[] = [];
    const overdueFollowUps = leads.filter((l) => isOverdue(l.next_follow_up_at)).length;
    const unownedLeads = leads.filter((l) => !l.owner_user_id).length;
    if (overdueFollowUps > 0) {
      alerts.push({
        label: `${overdueFollowUps} follow-up ${overdueFollowUps === 1 ? "scaduto" : "scaduti"}`,
        href: "/oggi",
      });
    }
    if (unownedLeads > 0) {
      alerts.push({ label: `${unownedLeads} lead senza owner`, href: "/leads" });
    }
    if (dormantCollaborators.length > 0) {
      alerts.push({
        label: `${dormantCollaborators.length} collaboratori dormienti da riattivare`,
        href: "/collaborators",
      });
    }

    return (
      <ManagerDashboard
        name={firstName}
        latestAnnouncement={latestAnnouncement}
        nextEvent={nextEvent}
        stats={{
          totalLeads: leads.length,
          toContact: leads.filter((l) => l.status === "da_contattare").length,
          overdueFollowUps,
          activeCollaborators: activeCollaborators.length,
          capiCount: capi.length,
          avgScore,
        }}
        topCapos={topCapos}
        leadsByPr={leadsByPr}
        alerts={alerts}
      />
    );
  }

  const myCollaborators = collaborators.filter(
    (c) => c.capo_pr_user_id === current.id,
  );
  const myActive = myCollaborators.filter(
    (c) => c.status === "attivo" || c.status === "affidabile",
  );
  const myDormant = myCollaborators.filter(
    (c) => c.status === "inattivo" || c.status === "da_riattivare",
  );

  const myPerformances = performances.filter((p) => p.capo_pr_user_id === current.id);
  const latestOwnEventId =
    [...myPerformances].sort((a, b) => {
      const da = events.find((e) => e.id === a.event_id)?.event_date ?? "";
      const db = events.find((e) => e.id === b.event_id)?.event_date ?? "";
      return db.localeCompare(da);
    })[0]?.event_id ?? null;
  const latestOwnScore = latestOwnEventId
    ? sumPerformances(myPerformances.filter((p) => p.event_id === latestOwnEventId)).score
    : 0;

  const topCapos = groupPerformances(performances, (p) => p.capo_pr_user_id ?? "senza-capo")
    .slice(0, 5)
    .map((g) => ({
      id: g.key,
      name: g.key === current.id ? "Tu" : (names[g.key] ?? "—"),
      score: g.score,
    }));

  return (
    <CapoPrDashboard
      name={firstName}
      latestAnnouncement={latestAnnouncement}
      nextEvent={nextEvent}
      tasks={{
        toContact: leads.filter((l) => l.status === "da_contattare").length,
        replied: leads.filter((l) => l.status === "ha_risposto").length,
        followUpToday: leads.filter((l) => {
          if (!l.next_follow_up_at) return false;
          const d = new Date(l.next_follow_up_at);
          const today = new Date();
          return d.toDateString() === today.toDateString();
        }).length,
        overdueFollowUps: leads.filter((l) => isOverdue(l.next_follow_up_at)).length,
      }}
      team={{
        collaboratorsCount: myCollaborators.length,
        active: myActive.length,
        dormant: myDormant.length,
        latestEventScore: latestOwnScore,
      }}
      topCapos={topCapos}
    />
  );
}
