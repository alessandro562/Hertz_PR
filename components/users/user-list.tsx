import { UserRow } from "./user-row";
import type { Profile } from "@/types/domain";

export function UserList({
  users,
  currentUserId,
}: {
  users: Profile[];
  currentUserId: string;
}) {
  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground">Nessun utente ancora.</p>;
  }
  return (
    <div className="space-y-2">
      {users.map((u) => (
        <UserRow key={u.id} user={u} isSelf={u.id === currentUserId} />
      ))}
    </div>
  );
}
