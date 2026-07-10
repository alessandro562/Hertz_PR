import type { Metadata } from "next";
import Link from "next/link";
import { Settings, UserCog } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { isManager } from "@/lib/permissions";
import { ROLE_LABELS } from "@/lib/constants/roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/navigation/sign-out-button";
import { ChangePasswordForm } from "@/components/settings/change-password-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const current = await getSessionUser();
  if (!current) return null;
  const { profile } = current;
  const manager = isManager(profile);

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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sicurezza</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      {manager ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gestione</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/users"
              className={cn(buttonVariants({ variant: "outline" }), "h-11 w-full gap-2")}
            >
              <UserCog className="size-4" /> Gestione utenti
            </Link>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
