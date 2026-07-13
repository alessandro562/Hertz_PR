"use client";

import { Bell, BellOff, Share } from "lucide-react";
import { toast } from "sonner";
import { usePushSubscription } from "@/hooks/use-push-subscription";
import { Button } from "@/components/ui/button";

/**
 * Opt-in for the daily "cosa fare oggi" push. Subscribing must come from a user
 * gesture (iOS requires it), so it's always a button. On an un-installed iPhone
 * we tell the user to add the app to the Home Screen first.
 */
export function NotificationsCard() {
  const { status, subscribed, busy, subscribe, unsubscribe } =
    usePushSubscription();

  async function onEnable() {
    try {
      const ok = await subscribe();
      if (ok) toast.success("Notifiche attive");
      else toast.error("Permesso negato dal browser");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Attivazione non riuscita");
    }
  }

  async function onDisable() {
    try {
      await unsubscribe();
      toast.success("Notifiche disattivate");
    } catch {
      toast.error("Operazione non riuscita");
    }
  }

  if (status === "loading") {
    return <p className="text-sm text-muted-foreground">Verifico…</p>;
  }

  if (status === "unsupported") {
    return (
      <p className="text-sm text-muted-foreground">
        Questo browser non supporta le notifiche push.
      </p>
    );
  }

  if (status === "needs-install") {
    return (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>
          Per ricevere le notifiche su iPhone devi prima installare l&apos;app
          in home.
        </p>
        <p className="flex items-center gap-2">
          <Share className="size-4 shrink-0" /> Safari: Condividi → «Aggiungi a
          Home», poi riapri da lì.
        </p>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <p className="text-sm text-muted-foreground">
        Notifiche bloccate. Riattivale dalle impostazioni del browser o del
        sistema, poi ricarica.
      </p>
    );
  }

  if (subscribed && status === "granted") {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Notifiche attive su questo dispositivo. Ogni mattina ricevi il
          promemoria dei follow-up da fare.
        </p>
        <Button
          variant="outline"
          className="h-11 gap-2"
          onClick={onDisable}
          disabled={busy}
        >
          <BellOff className="size-4" /> Disattiva notifiche
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Attiva il promemoria giornaliero «cosa fare oggi»: ti arriva una notifica
        con i follow-up in scadenza, anche ad app chiusa.
      </p>
      <Button className="h-11 gap-2" onClick={onEnable} disabled={busy}>
        <Bell className="size-4" /> Attiva notifiche
      </Button>
    </div>
  );
}
