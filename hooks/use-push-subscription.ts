"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { VAPID_PUBLIC_KEY, urlBase64ToUint8Array } from "@/lib/push/client";

export type PushStatus =
  | "loading"
  | "unsupported"
  | "needs-install"
  | "default"
  | "granted"
  | "denied";

function supportsPush(): boolean {
  return (
    typeof navigator !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

/** false during SSR / first paint, true once mounted on the client. */
function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * Web Push opt-in for the current device. `status` is derived in render (no
 * setState-in-effect); the only effect reads the existing subscription, and its
 * setState runs inside a promise callback, so it's lint-safe.
 *
 * On iOS, Push is only exposed to a home-screen-installed PWA (iOS 16.4+), so an
 * un-installed iPhone reports "needs-install" rather than "unsupported".
 */
export function usePushSubscription() {
  const mounted = useMounted();
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!mounted || !supportsPush()) return;
    let active = true;
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => {
        if (active) setSubscribed(!!sub);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [mounted]);

  const status: PushStatus = !mounted
    ? "loading"
    : !supportsPush()
      ? isIos() && !isStandalone()
        ? "needs-install"
        : "unsupported"
      : (Notification.permission as PushStatus);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!VAPID_PUBLIC_KEY) {
      throw new Error(
        "Chiave VAPID pubblica mancante: aggiungi NEXT_PUBLIC_VAPID_PUBLIC_KEY su Vercel.",
      );
    }
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return false;

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      const json = sub.toJSON();
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          p256dh: json.keys?.p256dh,
          auth: json.keys?.auth,
          user_agent: navigator.userAgent,
        }),
      });
      if (!res.ok) throw new Error("Salvataggio della subscription non riuscito.");

      setSubscribed(true);
      return true;
    } finally {
      setBusy(false);
    }
  }, []);

  const unsubscribe = useCallback(async (): Promise<void> => {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setSubscribed(false);
    } finally {
      setBusy(false);
    }
  }, []);

  return { status, subscribed, busy, subscribe, unsubscribe };
}
