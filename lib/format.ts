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
