import { notFound } from "next/navigation";
import { getLead, getLeadInteractions } from "@/lib/leads/queries";
import { setLeadAvatar } from "@/lib/leads/actions";
import { getSessionUser } from "@/lib/auth/session";
import { canEditLead, isManager } from "@/lib/permissions";
import { QuickActions } from "@/components/leads/quick-actions";
import { EditLeadForm } from "@/components/leads/edit-lead-form";
import { DeleteLeadButton } from "@/components/leads/delete-lead-button";
import { StatusBadge } from "@/components/leads/status-badge";
import { LeadTypeBadge } from "@/components/leads/lead-type-badge";
import { AddNoteForm } from "@/components/leads/add-note-form";
import { LeadTimeline } from "@/components/leads/lead-timeline";
import { AvatarUpload } from "@/components/common/avatar-upload";
import { PersonAvatar } from "@/components/common/person-avatar";
import { BackLink } from "@/components/common/back-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PRIORITY_LABELS,
  INTEREST_LABELS,
  LEAD_TYPE_LABELS,
  LEAD_TAG_LABELS,
} from "@/lib/constants/leads";
import { longDate, dateTime } from "@/lib/dates";
import { displayName } from "@/lib/format";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lead, current, interactions] = await Promise.all([
    getLead(id),
    getSessionUser(),
    getLeadInteractions(id),
  ]);
  if (!lead) notFound();

  const profile = current?.profile ?? null;
  const canEdit = canEditLead(profile, lead);
  const canAssign = canEdit && lead.owner_user_id !== current?.id;
  const manager = isManager(profile);
  const name = displayName(lead);

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div className="flex items-center gap-3">
        <BackLink href="/leads" />
        {canEdit ? (
          <AvatarUpload
            entity="leads"
            entityId={lead.id}
            name={name}
            avatarUrl={lead.avatar_url}
            onUploaded={setLeadAvatar.bind(null, lead.id)}
          />
        ) : (
          <PersonAvatar name={name} avatarUrl={lead.avatar_url} size="lg" />
        )}
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight">{name}</h1>
          <div className="mt-0.5 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="truncate">@{lead.instagram_username}</span>
            <StatusBadge status={lead.status} />
            {lead.lead_type !== "pr" ? <LeadTypeBadge type={lead.lead_type} /> : null}
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <QuickActions lead={lead} canEdit={canEdit} canAssign={canAssign} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Attività</CardTitle>
          {lead.last_contact_at ? (
            <p className="text-xs text-muted-foreground">
              Ultimo contatto: {dateTime(lead.last_contact_at)}
            </p>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4">
          {canEdit ? <AddNoteForm leadId={lead.id} /> : null}
          <LeadTimeline interactions={interactions} />
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
            <Row label="Tipo" value={LEAD_TYPE_LABELS[lead.lead_type]} />
            <Row
              label="Etichette"
              value={
                lead.tags.length
                  ? lead.tags.map((t) => LEAD_TAG_LABELS[t] ?? t).join(", ")
                  : null
              }
            />
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

      {manager ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-destructive">Elimina</CardTitle>
          </CardHeader>
          <CardContent>
            <DeleteLeadButton
              leadId={lead.id}
              isConverted={lead.converted_to_collaborator}
            />
          </CardContent>
        </Card>
      ) : null}
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
