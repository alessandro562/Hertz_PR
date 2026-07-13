/**
 * Browser-side Web Push helpers. The VAPID public key is client-safe, so it is
 * read from a NEXT_PUBLIC_ var (inlined into the bundle). The private key never
 * leaves the server (see lib/push/send.ts).
 */
export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

/**
 * pushManager.subscribe() wants the applicationServerKey as a Uint8Array; VAPID
 * keys are distributed as URL-safe base64. Convert here.
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const output = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}
