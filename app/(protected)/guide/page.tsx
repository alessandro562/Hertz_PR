/* eslint-disable react/no-unescaped-entities -- prose page: Italian apostrophes (l'app, un'app) read cleaner unescaped */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Guida" };

/** Knowledge base del PR Hub: come funziona il CRM, passo per passo. */

const SECTIONS: { id: string; n: string; kicker: string; title: string }[] = [
  { id: "panoramica", n: "01", kicker: "Panoramica", title: "Che cos'è il PR Hub" },
  { id: "ruoli", n: "02", kicker: "Ruoli", title: "Ruoli e gerarchia" },
  { id: "lead", n: "03", kicker: "Lead", title: "Lead: il cuore del CRM" },
  { id: "collaboratori", n: "04", kicker: "PR", title: "Da lead a PR (collaboratore)" },
  { id: "eventi", n: "05", kicker: "Serata", title: "Eventi e numeri alla porta" },
  { id: "classifiche", n: "06", kicker: "Analisi", title: "Classifiche e performance" },
  { id: "capi-pr", n: "07", kicker: "Capi PR", title: "Vista Capi PR" },
  { id: "utenti", n: "08", kicker: "Accessi", title: "Utenti e accessi" },
  { id: "installa", n: "09", kicker: "PWA", title: "Installare l'app sul telefono" },
  { id: "pratiche", n: "10", kicker: "Metodo", title: "Buone pratiche" },
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="size-5 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Guida</h1>
          <p className="text-sm text-muted-foreground">
            Come funziona il PR Hub, passo per passo.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Indice</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="grid gap-1.5 sm:grid-cols-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex items-baseline gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="font-mono text-[11px] text-primary">{s.n}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Section id="panoramica" n="01" kicker="Panoramica" title="Che cos'è il PR Hub">
        <P>
          Il PR Hub è il CRM operativo di hertz per gestire la rete PR dal telefono:
          lead, collaboratori, eventi e numeri alla porta, classifiche.
        </P>
        <P>Due regole da tenere sempre a mente:</P>
        <UL>
          <li>
            I <B>lead partono sempre da Instagram</B>: il numero si prende in DM, con
            calma. Niente scraping o numeri automatici.
          </li>
          <li>
            Ogni <B>PR è abbinato a un Capo PR</B>: i numeri che porta ricadono sul suo
            Capo.
          </li>
        </UL>
      </Section>

      <Section id="ruoli" n="02" kicker="Ruoli" title="Ruoli e gerarchia">
        <UL>
          <li>
            <B>Manager</B> — vede e modifica tutto, crea gli accessi, sistema gli errori
            e inserisce i numeri post-serata per chiunque.
          </li>
          <li>
            <B>Capo PR</B> — accede con email e password, gestisce e analizza i propri
            lead, ha i suoi PR e ne inserisce i numeri.
          </li>
          <li>
            <B>PR / sotto-PR</B> — non hanno un login: sono schede abbinate a un Capo PR.
            I loro risultati salgono automaticamente al Capo.
          </li>
        </UL>
      </Section>

      <Section id="lead" n="03" kicker="Lead" title="Lead: il cuore del CRM">
        <P>Un lead nasce da un profilo Instagram e attraversa una pipeline di stati.</P>
        <UL>
          <li>
            <B>Aggiungere</B>: menu <B>Lead → Nuovo</B>, inserisci l'@ (obbligatorio). Se
            il profilo è già seguito da un altro PR, l'app ti avvisa (anti-duplicato).
          </li>
          <li>
            <B>Pipeline</B>: sposti lo stato man mano — da contattare, contattato, ha
            risposto, interessato, fino a convertito o perso.
          </li>
          <li>
            <B>Azioni rapide</B> dalla scheda: apri Instagram, scrivi su WhatsApp, copia
            un template di messaggio.
          </li>
          <li>
            <B>Attività</B>: aggiungi note, usa <B>Segna contatto</B> per tracciare
            l'ultimo contatto e imposta un <B>follow-up</B> per non perdere i lead caldi.
          </li>
        </UL>
      </Section>

      <Section id="collaboratori" n="04" kicker="PR" title="Da lead a PR (collaboratore)">
        <P>
          Quando un lead entra nella rete, convertilo in collaboratore (PR) dalla sua
          scheda.
        </P>
        <UL>
          <li>
            Sulla scheda del PR imposti <B>livello</B> e <B>stato</B> (attivo, dormiente,
            ecc.).
          </li>
          <li>
            Il <B>Manager</B> lo abbina a un Capo PR con il selettore <B>Capo PR</B>: è
            questo abbinamento a far ricadere i numeri sul Capo giusto.
          </li>
          <li>
            I PR ancora senza Capo compaiono nel bucket <B>Senza Capo PR</B> nella pagina
            Capi PR: da lì si sistemano in un tocco.
          </li>
        </UL>
      </Section>

      <Section id="eventi" n="05" kicker="Serata" title="Eventi e numeri alla porta">
        <UL>
          <li>
            Il <B>Manager</B> crea l'evento (data, luogo, obiettivo ingressi) da{" "}
            <B>Eventi → Nuovo</B>.
          </li>
          <li>
            Dopo la serata si inseriscono i numeri: apri l'evento →{" "}
            <B>Inserisci numeri</B>. I PR sono raggruppati <B>per Capo PR</B>.
          </li>
          <li>
            <B>Chi inserisce</B>: il Manager per tutti, il Capo PR solo per i propri PR.
          </li>
          <li>
            <B>Cosa si conta</B>: nomi in lista, ticket venduti, tavoli, ingressi
            effettivi (più storia e broadcast). Da questi l'app calcola lo <B>score</B>.
          </li>
        </UL>
      </Section>

      <Section id="classifiche" n="06" kicker="Analisi" title="Classifiche e performance">
        <UL>
          <li>
            <B>Classifiche</B>: migliori Capi PR e collaboratori — ultimo evento, ultimi
            30 giorni, crescita — più i lead caldi da ricontattare.
          </li>
          <li>
            <B>Performance</B>: l'andamento dei numeri nel tempo, evento dopo evento.
          </li>
          <li>
            Tutto è raggruppato <B>per Capo PR</B>: i risultati dei suoi PR fanno parte
            del suo totale.
          </li>
        </UL>
      </Section>

      <Section id="capi-pr" n="07" kicker="Capi PR" title="Vista Capi PR" tag="Solo Manager">
        <UL>
          <li>
            La pagina <B>Capi PR</B> elenca ogni Capo con i suoi PR abbinati, i conteggi
            (attivi / dormienti) e lo score dell'ultimo evento.
          </li>
          <li>
            In fondo trovi il bucket <B>Senza Capo PR</B>: sistema gli abbinamenti dalla
            scheda del singolo PR.
          </li>
        </UL>
      </Section>

      <Section id="utenti" n="08" kicker="Accessi" title="Utenti e accessi" tag="Solo Manager">
        <UL>
          <li>
            Menu <B>Utenti</B>: crea un account (nome, email, ruolo) con una{" "}
            <B>password temporanea</B> generata al momento.
          </li>
          <li>
            Comunica le credenziali alla persona; la cambierà da{" "}
            <B>Impostazioni → Sicurezza</B>.
          </li>
          <li>
            Puoi <B>disattivare</B> un accesso in qualsiasi momento senza perdere i dati.
          </li>
        </UL>
      </Section>

      <Section id="installa" n="09" kicker="PWA" title="Installare l'app sul telefono">
        <P>Il PR Hub si installa come un'app, senza passare da uno store.</P>
        <UL>
          <li>
            <B>iPhone (Safari)</B>: tocca <B>Condividi</B> → <B>Aggiungi a Home</B>.
          </li>
          <li>
            <B>Android (Chrome)</B>: menu <B>⋮</B> → <B>Installa app</B> (o Aggiungi a
            schermata Home).
          </li>
        </UL>
        <P>Una volta installato si apre a schermo intero, come un'app nativa.</P>
      </Section>

      <Section id="pratiche" n="10" kicker="Metodo" title="Buone pratiche">
        <UL>
          <li>Prendi il numero in DM, con gentilezza. Niente scraping.</li>
          <li>
            Aggiorna sempre lo stato del lead e usa <B>Segna contatto</B>: la timeline è
            la memoria del CRM.
          </li>
          <li>Imposta un follow-up sui lead caldi, così non ti sfuggono.</li>
          <li>Dopo ogni serata inserisci i numeri il prima possibile, finché sono freschi.</li>
        </UL>
      </Section>

      <p className="pt-2 text-center text-xs text-muted-foreground">
        Qualcosa non torna o manca un pezzo? Scrivi a un Manager: la guida si aggiorna.
      </p>
    </div>
  );
}

function Section({
  id,
  n,
  kicker,
  title,
  tag,
  children,
}: {
  id: string;
  n: string;
  kicker: string;
  title: string;
  tag?: string;
  children: ReactNode;
}) {
  return (
    <Card id={id} className="scroll-mt-24">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            {n} · {kicker}
          </span>
          {tag ? (
            <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              {tag}
            </span>
          ) : null}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </CardContent>
    </Card>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

function UL({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-1.5 pl-4">{children}</ul>;
}

function B({ children }: { children: ReactNode }) {
  return <strong className="font-medium text-foreground">{children}</strong>;
}
