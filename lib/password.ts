/**
 * A random, reasonably strong temporary password for provisioning new users.
 * Alphabet excludes ambiguous characters (0/O, 1/l/I) so it's easy to read out
 * loud or copy into a message. Uses the Web Crypto API (browser + Node 18+).
 */
export function generateTempPassword(length = 12): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < length; i++) out += alphabet[bytes[i]! % alphabet.length];
  return out;
}
