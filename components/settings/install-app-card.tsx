"use client";

import { useSyncExternalStore } from "react";
import { Download, Share } from "lucide-react";
import { useInstallPrompt } from "@/hooks/use-install-prompt";
import { Button } from "@/components/ui/button";

/** True when the app is already running installed (standalone). SSR-safe. */
function useStandalone(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true,
    () => false,
  );
}

/** Turns the built-but-unused install prompt into a real "Installa" CTA. */
export function InstallAppCard() {
  const { canInstall, installed, promptInstall } = useInstallPrompt();
  const standalone = useStandalone();

  if (standalone || installed) {
    return (
      <p className="text-sm text-muted-foreground">
        App già installata sul dispositivo.
      </p>
    );
  }

  if (canInstall) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Installa il PR Hub in home: si apre come un&apos;app, a schermo intero.
        </p>
        <Button onClick={() => void promptInstall()} className="h-11 gap-2">
          <Download className="size-4" /> Installa l&apos;app
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2 text-sm text-muted-foreground">
      <p className="flex items-center gap-2">
        <Share className="size-4 shrink-0" /> iPhone (Safari): Condividi → «Aggiungi a
        Home».
      </p>
      <p>Android (Chrome): menu ⋮ → «Installa app».</p>
    </div>
  );
}
