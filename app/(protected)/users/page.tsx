import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UserCog } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { isManager } from "@/lib/permissions";
import { listUsers } from "@/lib/users/queries";
import { CreateUserForm } from "@/components/users/create-user-form";
import { UserList } from "@/components/users/user-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Utenti" };

export default async function UsersPage() {
  const current = await getSessionUser();
  // Manager-only. RLS also protects the data, but this hides the page outright.
  if (!current || !isManager(current.profile)) notFound();

  const users = await listUsers();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <UserCog className="size-5 text-muted-foreground" />
          <h1 className="text-2xl font-semibold tracking-tight">Utenti</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Crea e gestisci gli accessi di Manager e Capo PR.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nuovo utente</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateUserForm />
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          {users.length} {users.length === 1 ? "utente" : "utenti"}
        </h2>
        <UserList users={users} currentUserId={current.id} />
      </div>
    </div>
  );
}
