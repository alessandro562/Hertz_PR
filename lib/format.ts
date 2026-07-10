interface NameableEntity {
  first_name: string | null;
  last_name: string | null;
  instagram_username: string;
}

/** "Nome Cognome" if we have it, otherwise "@handle". Used for leads and collaborators alike. */
export function displayName(entity: NameableEntity): string {
  return (
    [entity.first_name, entity.last_name].filter(Boolean).join(" ") ||
    `@${entity.instagram_username}`
  );
}

/** "+12" / "-5" / "0" — for growth/trend figures where the sign carries meaning. */
export function formatSigned(n: number): string {
  return n > 0 ? `+${n}` : `${n}`;
}
