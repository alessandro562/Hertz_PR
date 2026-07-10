import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getLead } from "@/lib/leads/queries";
import { getSessionUser } from "@/lib/auth/session";
import { canEditLead } from "@/lib/permissions";
import { QuickActions } from "@/components/leads/quick-actions";
import { EditLeadForm } from "@/components/leads/edit-lead-form";
import { StatusBadge } from "@/components/leads/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PRIORITY_LABELS, INTEREST_LABELS } from "@/lib/constants/leads";
import { longDate } from "@/lib/dates";
import { displayName } from "@/lib/format";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lead, current] = await Promise.all([getLead(id), getSessionUser()]);
  if (!lead) notFound();

  const profile = current?.profile ?? null;
  const canEdit = canEditLead(profile, lead);
  const canAssign = canEdit && lead.owner_user_id !== current?.id;
  const name = displayName(lead);

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div className="flex items-center gap-2">
        <Link href="/leads" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight">{name}</h1>
          <div className="mt-0.5 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="truncate">@{lead.instagram_username}</span>
            <StatusBadge status={lead.status} />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <QuickActions lead={lead} canEdit={canEdit} canAssign={canAssign} />
        </CardContent>
      </Card>

      {canEdit ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scheda</CardTitle>
          </CardHeader>
          <CardContent>
            <EditLeadForm lead={lead} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Telefono" value={lead.phone} />
            <Row label="Città" value={lead.city} />
            <Row label="Fonte" value={lead.source} />
            <Row label="Priorità" value={PRIORITY_LABELS[lead.priority]} />
            <Row label="Interesse" value={INTEREST_LABELS[lead.interest_level]} />
            <Row
              label="Follow-up"
              value={lead.next_follow_up_at ? longDate(lead.next_follow_up_at) : null}
            />
            {lead.notes ? (
              <p className="pt-2 text-muted-foreground">{lead.notes}</p>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value || "—"}</span>
    </div>
  );
}
