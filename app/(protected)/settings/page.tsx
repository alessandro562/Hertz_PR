import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { ROLE_LABELS } from "@/lib/constants/roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SignOutButton } from "@/components/navigation/sign-out-button";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const current = await getSessionUser();
  if (!current) return null;
  const { profile } = current;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="size-5 text-muted-foreground" />
        <h1 className="text-2xl font-semibold tracking-tight">Impostazioni</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Il mio profilo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Nome</span>
            <span className="font-medium">{profile.full_name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{profile.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Ruolo</span>
            <Badge variant="secondary">{ROLE_LABELS[profile.role]}</Badge>
          </div>
          <div className="pt-2">
            <SignOutButton />
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Gestione utenti, ruoli, tag, stati e impostazioni score arriveranno nelle
        fasi successive.
      </p>
    </div>
  );
}
