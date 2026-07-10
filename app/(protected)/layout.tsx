import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { CurrentUserProvider } from "@/hooks/use-current-user";
import { AppShell } from "@/components/layout/app-shell";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const current = await getSessionUser();

  if (!current) {
    redirect("/login");
  }
  if (!current.profile.is_active) {
    redirect("/login?error=inactive");
  }

  return (
    <CurrentUserProvider value={current}>
      <AppShell>{children}</AppShell>
    </CurrentUserProvider>
  );
}
