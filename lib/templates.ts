/**
 * Built-in message templates for the "copy template" quick action.
 * Full CRUD (global/personal, favourites) lands in Phase 7 — these are the
 * starter set so the WhatsApp/DM flow is useful from day one. Edit freely.
 */
export interface MessageTemplate {
  id: string;
  title: string;
  category: string;
  body: string;
}

/** Fill placeholders in a template. `{nome}` expands to " Marco" (or "" if
 * unknown), so "Ehi{nome}!" reads "Ehi Marco!" or "Ehi!". */
export function fillTemplate(body: string, firstName?: string | null): string {
  return body.replace(/\{nome\}/g, firstName ? ` ${firstName}` : "");
}

export const BUILT_IN_TEMPLATES: MessageTemplate[] = [
  {
    id: "primo_contatto",
    title: "Primo contatto",
    category: "primo_contatto",
    body: "Ehi{nome}! Ti seguo e mi piace un sacco il tuo profilo 🔥 Facciamo parte di un giro di eventi qui in zona e cerchiamo persone giuste — ti va se ti spiego in due parole?",
  },
  {
    id: "follow_up",
    title: "Follow-up",
    category: "follow_up",
    body: "Ciao{nome}! Ci eravamo scritti qualche giorno fa 🙌 Ti va di riprendere il discorso? Nessun impegno, giusto per capire se ti interessa.",
  },
  {
    id: "spiegazione_bacheca",
    title: "Spiegazione bacheca",
    category: "spiegazione_bacheca",
    body: "La bacheca è il nostro gruppo dove ogni tanto ricondividi le nostre storie degli eventi: zero impegno, solo un po' di visibilità reciproca. Ti aggiungo? 😊",
  },
  {
    id: "spiegazione_pr",
    title: "Spiegazione PR",
    category: "spiegazione_squadra_pr",
    body: "Come PR entri in una squadra: porti lista e ticket agli eventi e vieni riconosciuto per i risultati che porti. Ti spiego meglio come funziona?",
  },
  {
    id: "reminder_evento",
    title: "Reminder evento",
    category: "reminder_evento",
    body: "Reminder evento! 🎉 Mandami la tua lista entro giovedì sera così ti sistemo tutto all'ingresso.",
  },
  {
    id: "push_ticket",
    title: "Push ticket",
    category: "push_ticket",
    body: "Restano pochi ticket in prevendita a prezzo ridotto 👀 Vuoi che te ne blocco un paio prima che finiscano?",
  },
];
