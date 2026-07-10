import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
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
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary text-lg font-bold tracking-tight text-primary-foreground">
            HZ
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Hertz PR Hub</h1>
            <p className="text-sm text-muted-foreground">
              Accedi al tuo pannello operativo
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            {notice ? (
              <p className="mb-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-600 dark:text-amber-400">
                {notice}
              </p>
            ) : null}
            <LoginForm />
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Uso interno · Hertz PR Network
        </p>
      </div>
    </main>
  );
}
