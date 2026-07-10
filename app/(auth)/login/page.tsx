import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/pr-hub/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Accedi",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const notice =
    error === "inactive"
      ? "Il tuo account è disattivato. Contatta un manager."
      : null;

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-3 text-center">
          <Logo variant="lockup" height={72} priority className="mx-auto" />
          <p className="text-sm text-muted-foreground">Accedi al tuo pannello operativo</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {notice ? (
              <p className="mb-4 rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning">
                {notice}
              </p>
            ) : null}
            <LoginForm />
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">Uso interno · hertz PR network</p>
      </div>
    </main>
  );
}
