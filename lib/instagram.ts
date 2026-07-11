/**
 * Instagram path segments that are NOT usernames. Sharing a post/reel/story
 * (instagram.com/p/…, /reel/…, /stories/…) would otherwise be read as a handle
 * of "p" / "reel" / "stories".
 */
const RESERVED_IG_SEGMENTS = new Set([
  "p", "reel", "reels", "stories", "story", "explore", "tv", "s",
  "direct", "accounts",
]);

/**
 * Normalize an Instagram username so duplicates collapse to a single key.
 * Strips a leading "@", trims whitespace, lowercases, and drops a full
 * profile URL down to the handle. Used to enforce the unique-handle rule
 * (spec §11.5) when leads/collaborators are created. Returns "" when the input
 * is an Instagram URL that points at a post/reel/story rather than a profile.
 */
export function normalizeInstagramUsername(value: string): string {
  let v = value.trim();

  // Accept a pasted profile URL, e.g. https://instagram.com/marti.rossi/
  const urlMatch = v.match(/instagram\.com\/([^/?#]+)/i);
  if (urlMatch) {
    if (RESERVED_IG_SEGMENTS.has(urlMatch[1].toLowerCase())) return "";
    v = urlMatch[1];
  }

  return v
    .replace(/^@+/, "")
    .replace(/\/+$/, "")
    .toLowerCase();
}

/** Build a canonical profile URL from any username input. */
export function instagramUrl(value: string): string {
  return `https://instagram.com/${normalizeInstagramUsername(value)}`;
}
