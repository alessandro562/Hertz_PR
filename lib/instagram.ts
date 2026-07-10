/**
 * Normalize an Instagram username so duplicates collapse to a single key.
 * Strips a leading "@", trims whitespace, lowercases, and drops a full
 * profile URL down to the handle. Used to enforce the unique-handle rule
 * (spec §11.5) when leads/collaborators are created.
 */
export function normalizeInstagramUsername(value: string): string {
  let v = value.trim();

  // Accept a pasted profile URL, e.g. https://instagram.com/marti.rossi/
  const urlMatch = v.match(/instagram\.com\/([^/?#]+)/i);
  if (urlMatch) {
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
