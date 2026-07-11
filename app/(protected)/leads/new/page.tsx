import type { Metadata } from "next";
import { LeadForm } from "@/components/leads/lead-form";
import { BackLink } from "@/components/common/back-link";
import { normalizeInstagramUsername } from "@/lib/instagram";

export const metadata: Metadata = { title: "Nuovo lead" };

/** Pull an IG handle out of a Web Share Target payload (Android). */
function extractHandle(sp: {
  url?: string;
  text?: string;
  title?: string;
}): string {
  const raw = sp.url || sp.text || sp.title || "";
  if (!raw) return "";
  if (/instagram\.com/i.test(raw) || raw.trim().startsWith("@")) {
    return normalizeInstagramUsername(raw);
  }
  return "";
}

export default async function NewLeadPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string; text?: string; title?: string }>;
}) {
  const sp = await searchParams;
  const initialUsername = extractHandle(sp);

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div className="flex items-center gap-2">
        <BackLink href="/leads" />
        <h1 className="text-2xl font-semibold tracking-tight">Nuovo lead</h1>
      </div>
      <LeadForm initialUsername={initialUsername} />
    </div>
  );
}
