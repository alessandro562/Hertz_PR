# Hertz PR Hub — Piano Completo PWA Mobile-First

## 0. Obiettivo del documento

Questo documento definisce il piano completo per costruire **Hertz PR Hub**, una PWA mobile-first per gestire PR, capi PR, collaboratori, lead Instagram, gruppi, onboarding, follow-up e performance evento.

La soluzione non passa da App Store o Google Play.

La app sarà una **Progressive Web App** installabile su smartphone tramite browser:

- su iPhone: apertura da Safari e aggiunta alla schermata Home;
- su Android: installazione da Chrome tramite prompt PWA o “Aggiungi a schermata Home”.

Obiettivo:
avere un'app interna, veloce, accessibile da link, installabile su telefono, aggiornata automaticamente e iterabile nel tempo.

---

# 1. Scelta strategica: PWA mobile-first

## Perché PWA

La PWA è la scelta migliore per la v1 perché permette di:

- evitare App Store;
- evitare Google Play;
- evitare Apple Developer Program;
- evitare tempi di review;
- distribuire l'app con un semplice link;
- aggiornare l'app in tempo reale;
- mantenere una sola codebase;
- usare lo stesso prodotto su iPhone, Android e desktop;
- costruire un pannello manager più completo senza creare due prodotti separati.

## Cosa deve sembrare all'utente

L'utente deve percepirla come una vera app:

- icona sulla schermata Home;
- splash screen;
- interfaccia full-screen;
- navigazione mobile;
- bottom tab;
- notifiche/in-app alert in futuro;
- caricamenti rapidi;
- UX pensata per uso quotidiano da smartphone.

---

# 2. Visione prodotto

Hertz PR Hub è il sistema operativo interno per gestire la rete PR.

Non è un CRM generico.

È un tool verticale per organizzazioni di eventi che devono:

- scoprire persone su Instagram;
- evitare duplicati;
- assegnare ogni persona a un capo PR;
- tracciare lo stato della relazione;
- trasformare lead in collaboratori;
- organizzare collaboratori sotto capi PR;
- monitorare ogni squadra PR;
- attivare collaboratori sugli eventi;
- registrare numeri, liste, ticket, tavoli e risultati;
- confrontare le performance dei capi PR;
- capire chi cresce, chi dorme, chi porta valore e chi no.

---

# 3. Principio centrale del prodotto

Il centro dell'app non è il gruppo WhatsApp.

Il centro dell'app è la **persona**.

Ogni persona può evolvere così:

```text
Lead Instagram
  -> contattato
  -> interessato
  -> inserito in bacheca
  -> collaboratore
  -> sotto PR
  -> membro squadra
  -> attivo su evento
  -> performance storica
```

L'app deve rispondere sempre a queste domande:

1. Chi è questa persona?
2. È già stata contattata?
3. Da chi?
4. A che punto è?
5. In quale squadra sta?
6. È un collaboratore reale o solo occasionale?
7. A quali eventi ha partecipato?
8. Che numeri ha fatto?
9. Chi è il capo PR responsabile?
10. Che valore porta nel tempo?

---

# 4. Ruoli utente

La v1 prevede due tipologie di accesso.

---

## 4.1 Manager

Il Manager è il profilo di controllo.

Esempi:
- Alessandro
- founder / core team
- direzione Hertz

### Permessi Manager

Il Manager può:

- vedere tutti i dati;
- creare lead;
- modificare qualsiasi lead;
- assegnare lead a qualsiasi capo PR;
- creare capi PR;
- creare squadre;
- vedere tutti i collaboratori;
- modificare tutti i collaboratori;
- creare eventi;
- assegnare squadre agli eventi;
- vedere tutte le performance;
- modificare tutte le performance;
- vedere ranking e statistiche aggregate;
- creare template;
- modificare template;
- gestire impostazioni;
- esportare dati;
- vedere audit log;
- gestire utenti e ruoli.

### Obiettivo dashboard Manager

Il Manager deve capire:

- chi sta lavorando;
- quale capo PR sta performando;
- quale squadra sta crescendo;
- quali lead sono bloccati;
- quali collaboratori sono dormienti;
- quali persone vanno promosse;
- quali persone vanno rimosse;
- quali eventi stanno ricevendo supporto reale;
- se il sistema PR sta producendo valore.

---

## 4.2 Capo PR

Il Capo PR è il profilo operativo.

Esempi:
- Fede
- Tommaso
- Alberto
- altri responsabili di squadra

### Permessi Capo PR

Il Capo PR può:

- creare nuovi lead;
- vedere tutti i lead in sola lettura, se il Manager lo consente;
- vedere i risultati degli altri capi PR;
- modificare solo i lead assegnati a lui;
- modificare solo i lead creati da lui;
- convertire in collaboratori solo i propri lead;
- creare e gestire i propri sotto PR/collaboratori;
- modificare solo i collaboratori della propria squadra;
- assegnare i propri collaboratori agli eventi;
- inserire numeri e performance della propria squadra;
- vedere le statistiche proprie e degli altri;
- usare template messaggi;
- aggiornare follow-up e note dei propri lead;
- aggiornare status dei propri collaboratori.

### Limiti Capo PR

Il Capo PR non può:

- modificare lead assegnati ad altri;
- cancellare dati globali;
- modificare performance di altre squadre;
- modificare compensi, se non autorizzato;
- creare utenti Manager;
- cambiare ruoli;
- modificare impostazioni globali;
- eliminare eventi;
- modificare template globali, salvo permesso specifico.

### Obiettivo dashboard Capo PR

Il Capo PR deve capire:

- quanti lead ha da lavorare;
- chi deve ricontattare;
- quali persone sono pronte per entrare in bacheca;
- quali persone può trasformare in collaboratori;
- quanti sotto PR ha attivi;
- che numeri sta facendo la sua squadra;
- come si posiziona rispetto agli altri capi PR;
- dove deve migliorare.

---

# 5. Regola importante: visibilità vs modifica

La scelta prodotto è questa:

## I capi PR vedono molto, ma modificano poco.

Questo crea competizione e trasparenza, senza creare casino operativo.

### Manager

```text
Vede tutto
Modifica tutto
```

### Capo PR

```text
Vede:
- dashboard generale;
- classifiche;
- statistiche aggregate;
- performance degli altri capi PR;
- eventi;
- template;
- i propri lead;
- la propria squadra.

Modifica:
- solo i propri lead;
- solo i propri collaboratori;
- solo la propria squadra;
- solo i numeri della propria squadra;
- solo le proprie note/interazioni.
```

---

# 6. Oggetti principali del sistema

## 6.1 User

Persona che accede all'app.

Tipi:
- Manager
- Capo PR

---

## 6.2 Lead

Persona trovata, contattata o da contattare.

Esempio:
una ragazza trovata su Instagram che potrebbe entrare nella bacheca o diventare PR.

Campi principali:
- nome;
- Instagram;
- telefono;
- città;
- fonte;
- stato;
- priorità;
- interesse;
- owner;
- creato da;
- follow-up;
- note.

---

## 6.3 Collaboratore

Persona già entrata nel sistema operativo.

Può essere:
- in bacheca;
- collaboratore occasionale;
- sotto PR;
- PR attivo;
- PR stretto;
- capo PR;
- core team.

---

## 6.4 Sotto PR

Nel sistema il sotto PR è un collaboratore che appartiene a una squadra di un Capo PR e produce numeri.

Esempio:
Martina è sotto PR di Fede.

Martina può:
- condividere storie;
- portare lista;
- vendere ticket;
- portare tavoli;
- supportare evento;
- diventare più forte nel tempo.

---

## 6.5 Squadra PR

Gruppo operativo guidato da un Capo PR.

Esempio:
- Squadra Fede
- Squadra Tommaso
- Squadra Alberto

Ogni squadra ha:
- un capo;
- collaboratori;
- sotto PR;
- performance;
- storico eventi;
- statistiche.

---

## 6.6 Evento

Un evento è una campagna operativa.

Non gestisce il pubblico finale, ma misura la forza PR.

Esempio:
- Hertz Downtown
- Hertz x Classic
- Hertz Winter Closing

Ogni evento ha:
- data;
- venue;
- squadre attivate;
- collaboratori attivati;
- numeri inseriti;
- performance aggregate.

---

## 6.7 Performance

La performance misura il contributo di ogni collaboratore/sotto PR su ogni evento.

Campi:
- ha confermato supporto;
- ha condiviso storia;
- ha mandato broadcast;
- nomi lista;
- ticket venduti;
- tavoli portati;
- ingressi effettivi;
- note;
- score.

---

## 6.8 Template

Messaggi pronti da copiare.

Esempi:
- primo contatto;
- follow-up;
- spiegazione bacheca;
- spiegazione PR;
- reminder evento;
- push ticket;
- post evento;
- riattivazione dormienti.

---

# 7. Struttura generale dell'app

La PWA deve avere una struttura mobile-first.

## Navigazione principale mobile

Bottom navigation:

```text
Home
Lead
Squadra
Eventi
Altro
```

## Navigazione Manager desktop/tablet

Sidebar:

```text
Dashboard
Lead CRM
Squadre PR
Collaboratori
Eventi
Performance
Classifiche
Template
Settings
```

La stessa app deve adattarsi:

- mobile: bottom tab;
- desktop: sidebar.

---

# 8. Sezioni principali

## 8.1 Home / Dashboard

La dashboard cambia per ruolo.

---

## 8.2 Lead CRM

Sezione per gestire lead Instagram e onboarding.

---

## 8.3 Squadra

Per Capo PR:
la sua squadra.

Per Manager:
tutte le squadre.

---

## 8.4 Eventi

Sezione per creare eventi, attivare squadre e inserire numeri.

---

## 8.5 Performance

Per Manager:
analisi completa.

Per Capo PR:
statistiche proprie + confronto con gli altri.

---

## 8.6 Classifiche

Ranking dei capi PR, delle squadre e dei collaboratori.

---

## 8.7 Template

Messaggi pronti.

---

## 8.8 Settings

Utenti, permessi, categorie, tag, stati.

---

# 9. Dashboard Manager

La dashboard Manager è la control room.

## Blocchi principali

### 1. Prossimo evento

Card grande:

- nome evento;
- data;
- venue;
- giorni mancanti;
- squadre attivate;
- collaboratori attivati;
- supporti confermati;
- storie condivise;
- liste totali;
- ticket totali;
- tavoli;
- ingressi stimati/effettivi;
- alert.

---

### 2. Stato CRM

Metriche:

- lead totali;
- lead nuovi settimana;
- lead da contattare;
- lead contattati;
- lead interessati;
- lead da inserire in bacheca;
- lead da convertire;
- lead senza owner;
- follow-up scaduti;
- lead fermi da più di 7 giorni.

---

### 3. Performance capi PR

Tabella:

| Capo PR | Lead attivi | Collaboratori | Lista | Ticket | Tavoli | Score | Trend |
|---|---:|---:|---:|---:|---:|---:|---|
| Fede | 32 | 18 | 80 | 12 | 2 | 145 | ↑ |
| Tommaso | 26 | 14 | 54 | 8 | 1 | 98 | → |
| Alberto | 18 | 10 | 41 | 5 | 0 | 67 | ↓ |

---

### 4. Alert operativi

Esempi:

- 8 lead interessati non aggiornati da 5 giorni;
- 4 lead senza owner;
- 6 collaboratori dormienti;
- 2 squadre non hanno ancora aggiornato l'evento;
- Fede ha 12 follow-up scaduti;
- Tommaso ha 4 collaboratori attivi non assegnati al prossimo evento.

---

### 5. Leaderboard sintetica

- Top Capo PR del mese;
- Top Squadra ultimo evento;
- Top Collaboratore;
- Miglior crescita;
- Più dormienti da riattivare.

---

# 10. Dashboard Capo PR

La dashboard Capo PR deve essere molto operativa.

## Blocchi principali

### 1. I miei task

- lead da contattare;
- lead che hanno risposto;
- follow-up di oggi;
- follow-up scaduti;
- persone da inserire in bacheca;
- persone da convertire in collaboratore.

---

### 2. La mia squadra

- collaboratori totali;
- attivi;
- dormienti;
- sotto PR attivi;
- nuovi entrati;
- da riattivare.

---

### 3. Prossimo evento

- evento;
- data;
- collaboratori assegnati;
- supporti confermati;
- storie condivise;
- lista;
- ticket;
- tavoli;
- note.

---

### 4. I miei numeri

Metriche:

- lead creati;
- lead convertiti;
- collaboratori attivi;
- lista ultimo evento;
- ticket ultimo evento;
- tavoli ultimo evento;
- score ultimo evento;
- posizione ranking.

---

### 5. Confronto con altri capi PR

Il capo PR può vedere:

- ranking generale;
- score altri capi PR;
- lista/ticket/tavoli aggregati;
- trend.

Non può modificare nulla degli altri.

---

# 11. Lead CRM

## 11.1 Lista Lead

Ogni lead deve essere mostrato come card mobile.

Card:

- nome;
- username Instagram;
- stato;
- owner;
- priorità;
- interesse;
- follow-up;
- tag;
- quick action.

Azioni rapide:

- apri scheda;
- cambia stato;
- aggiungi nota;
- apri Instagram;
- copia template;
- assegna a me, se consentito;
- converti.

---

## 11.2 Stati Lead

Stati consigliati:

```text
da_contattare
contattato
ha_risposto
interessato
da_spiegare
da_inserire_bacheca
inserito_bacheca
da_inserire_squadra
inserito_squadra
convertito_collaboratore
non_interessato
non_risponde
da_ricontattare
scartato
```

---

## 11.3 Pipeline Lead

Su mobile evitare drag & drop complesso.

Usare tabs:

```text
Da contattare
Contattati
Interessati
Da inserire
Convertiti
Persi
```

Ogni tab mostra lead filtrati.

Su desktop si può aggiungere una Kanban board.

---

## 11.4 Aggiungi Lead

Form rapidissimo.

Obbligatori:

- Instagram username;
- owner;
- stato iniziale.

Opzionali:

- nome;
- telefono;
- città;
- fonte;
- note;
- priorità;
- interesse;
- tag;
- follow-up.

---

## 11.5 Anti-duplicato Instagram

Funzionalità fondamentale.

Regola:
lo username Instagram è unico.

Quando un utente inserisce:

```text
@Marti.Rossi
```

il sistema salva:

```text
marti.rossi
```

Prima di creare controlla se esiste già.

Se esiste:

```text
Questo profilo è già presente.
Owner: Fede
Stato: Contattato
Ultimo update: ieri
Apri scheda
```

Non deve consentire la duplicazione.

---

## 11.6 Scheda Lead

Sezioni:

1. Header
   - nome;
   - username;
   - stato;
   - owner;
   - priorità;
   - interesse.

2. Azioni rapide
   - apri Instagram;
   - copia template;
   - cambia stato;
   - assegna owner;
   - aggiungi nota;
   - converti in collaboratore.

3. Info
   - nome;
   - telefono;
   - città;
   - fonte;
   - tag.

4. Operativo
   - stato;
   - owner;
   - prossimo step;
   - follow-up;
   - interesse;
   - note.

5. Timeline
   - primo contatto;
   - follow-up;
   - risposta;
   - note;
   - cambio stato;
   - conversione.

---

# 12. Collaboratori / Sotto PR

Quando un lead viene convertito, diventa collaboratore.

## 12.1 Livelli Collaboratore

```text
bacheca
collaboratore_occasionale
sotto_pr
pr_attivo
pr_stretto
capo_pr
core_team
```

## 12.2 Stati Collaboratore

```text
in_prova
attivo
molto_attivo
occasionale
dormiente
da_riattivare
non_affidabile
uscito
```

---

## 12.3 Lista Collaboratori

Per Manager:
vede tutti.

Per Capo PR:
vede i propri collaboratori e può vedere gli altri in sola lettura se previsto.

Card:

- nome;
- Instagram;
- livello;
- stato;
- squadra;
- capo PR;
- ultimo evento;
- score;
- trend.

---

## 12.4 Scheda Collaboratore

Sezioni:

1. Header
   - nome;
   - Instagram;
   - livello;
   - stato;
   - squadra.

2. Azioni
   - apri Instagram;
   - apri WhatsApp;
   - cambia livello;
   - cambia stato;
   - assegna a evento;
   - aggiungi nota.

3. Info
   - telefono;
   - città;
   - fonte;
   - tag.

4. Squadra
   - capo PR;
   - squadra;
   - sotto PR di;
   - data ingresso;
   - note affidabilità.

5. Performance
   - eventi fatti;
   - lista totale;
   - ticket totale;
   - tavoli totale;
   - ingressi totale;
   - score medio;
   - trend.

6. Storico eventi
   - evento;
   - numeri;
   - score;
   - note.

---

# 13. Squadre PR

La squadra è il livello organizzativo principale.

## 13.1 Squadra

Ogni squadra ha:

- nome;
- capo PR;
- descrizione;
- membri;
- collaboratori attivi;
- sotto PR;
- dormienti;
- performance evento;
- performance storica;
- note.

---

## 13.2 Lista Squadre

Manager vede card di tutte le squadre.

Card:

```text
Squadra Fede
Capo PR: Fede
Membri: 24
Attivi: 14
Dormienti: 5
Lista ultimo evento: 80
Ticket ultimo evento: 12
Tavoli ultimo evento: 2
Score: 145
Trend: in crescita
```

Capo PR vede:
- la sua squadra in modifica;
- le altre squadre in sola lettura/statistiche.

---

## 13.3 Dettaglio Squadra

Sezioni:

1. Overview
   - capo PR;
   - membri;
   - attivi;
   - dormienti;
   - score.

2. Membri
   - lista collaboratori;
   - livelli;
   - stati.

3. Lead
   - lead assegnati al capo PR.

4. Eventi
   - performance squadra per evento.

5. Storico
   - andamento nel tempo.

6. Note Manager
   - visibili solo ai Manager, opzionale.

---

# 14. Eventi

Ogni evento è una campagna PR.

La app non gestisce clienti finali o guest list completa. Gestisce solo la performance dei PR/collaboratori.

---

## 14.1 Lista Eventi

Card evento:

- nome;
- data;
- venue;
- stato;
- squadre attivate;
- collaboratori attivati;
- lista;
- ticket;
- tavoli;
- score.

Stati evento:

```text
bozza
in_preparazione
attivo
chiuso
completato
annullato
```

---

## 14.2 Dettaglio Evento

Sezioni:

1. Overview
   - data;
   - venue;
   - obiettivo;
   - squadre;
   - collaboratori;
   - totale lista;
   - totale ticket;
   - totale tavoli;
   - totale ingressi;
   - score.

2. Squadre attivate
   - ogni capo PR;
   - collaboratori assegnati;
   - numeri.

3. Inserimento numeri
   - per ogni collaboratore;
   - mobile cards.

4. Classifica evento
   - capi PR;
   - squadre;
   - collaboratori.

5. Note post evento
   - chi ha performato;
   - chi ha deluso;
   - chi promuovere;
   - chi riattivare.

---

## 14.3 Inserimento numeri da parte dei Capi PR

Ogni Capo PR può modificare solo la propria squadra.

Per ogni sotto PR/collaboratore:

- confermato supporto;
- condiviso storia;
- mandato broadcast;
- numero lista;
- numero ticket;
- numero tavoli;
- ingressi effettivi;
- note.

UI mobile:

```text
Martina Rossi
Sotto PR - Squadra Fede

Confermato: sì/no
Story: sì/no
Broadcast: sì/no

Lista: [-] 8 [+]
Ticket: [-] 2 [+]
Tavoli: [-] 0 [+]
Ingressi: [-] 5 [+]

Note evento
Salva
```

---

# 15. Performance e score

## 15.1 Score base

Formula consigliata:

```text
+1 story condivisa
+1 broadcast mandato
+1 per ogni nome lista
+3 per ogni ticket venduto
+8 per ogni tavolo
+2 per ogni ingresso effettivo
-2 se conferma supporto ma fa zero
-5 se no-show o comportamento negativo
```

Lo score è indicativo, non assoluto.

Deve servire per leggere trend e confronti, non per giudicare tutto automaticamente.

---

## 15.2 Statistiche Capo PR

Per ogni Capo PR:

- lead creati;
- lead convertiti;
- conversion rate;
- collaboratori totali;
- collaboratori attivi;
- collaboratori dormienti;
- lista ultimo evento;
- ticket ultimo evento;
- tavoli ultimo evento;
- score ultimo evento;
- score mensile;
- trend;
- ranking.

---

## 15.3 Statistiche Squadra

Per ogni squadra:

- membri;
- attivi;
- nuovi entrati;
- dormienti;
- lista totale;
- ticket totale;
- tavoli totale;
- ingressi;
- score medio;
- performance per evento;
- performance ultimi 30 giorni;
- trend.

---

## 15.4 Statistiche Collaboratore

Per ogni collaboratore:

- eventi partecipati;
- lista totale;
- ticket totale;
- tavoli totale;
- ingressi;
- score medio;
- ultimo evento;
- stato attuale;
- trend.

---

# 16. Classifiche

Sezione utile per creare competizione interna.

## Classifiche disponibili

1. Miglior Capo PR ultimo evento
2. Miglior Squadra ultimo evento
3. Miglior Collaboratore ultimo evento
4. Miglior Capo PR mese
5. Miglior crescita
6. Collaboratori da riattivare
7. Lead più caldi senza follow-up
8. Squadre più dormienti

I capi PR possono vedere le classifiche.

Solo i Manager possono modificare dati di tutti.

---

# 17. Template messaggi

## Funzionalità

- lista template;
- categoria;
- preferiti;
- copia;
- modifica;
- creazione;
- visibilità globale o personale.

## Categorie

```text
primo_contatto_uomo
primo_contatto_donna
follow_up
spiegazione_hertz
spiegazione_bacheca
spiegazione_squadra_pr
spiegazione_retribuzione
reminder_evento
richiesta_condivisione
push_ticket
post_evento
riattivazione_dormienti
```

## Permessi

Manager:
- crea/modifica/elimina template globali.

Capo PR:
- usa template globali;
- crea template personali;
- modifica solo i propri template personali.

---

# 18. Settings

## Manager Settings

- utenti;
- ruoli;
- squadre;
- stati lead;
- livelli collaboratore;
- stati collaboratore;
- tag;
- fonti lead;
- categorie template;
- impostazioni score;
- export dati;
- audit log.

## Capo PR Settings

- profilo;
- preferenze;
- template personali;
- dati squadra in sola lettura/modifica limitata.

---

# 19. Database Supabase

## Tabelle principali

1. profiles
2. teams
3. leads
4. collaborators
5. team_members
6. events
7. event_team_assignments
8. event_collaborator_performances
9. interactions
10. tags
11. lead_tags
12. collaborator_tags
13. message_templates
14. audit_logs
15. app_settings

---

# 20. Schema dati dettagliato

## 20.1 profiles

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role text not null check (role in ('manager', 'capo_pr')),
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 20.2 teams

Una squadra PR.

```sql
create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  capo_pr_user_id uuid not null references public.profiles(id),
  is_active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 20.3 leads

```sql
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  instagram_username text not null unique,
  instagram_url text,
  phone text,
  city text,
  source text,
  status text not null default 'da_contattare',
  priority text not null default 'medium',
  interest_level text not null default 'warm',
  owner_user_id uuid references public.profiles(id),
  owner_team_id uuid references public.teams(id),
  created_by uuid references public.profiles(id),
  next_action text,
  notes text,
  last_contact_at timestamptz,
  next_follow_up_at timestamptz,
  converted_to_collaborator boolean not null default false,
  converted_collaborator_id uuid,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 20.4 collaborators

```sql
create table public.collaborators (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid unique references public.leads(id) on delete set null,
  first_name text,
  last_name text,
  instagram_username text not null unique,
  instagram_url text,
  phone text,
  city text,
  level text not null default 'bacheca',
  status text not null default 'in_prova',
  team_id uuid references public.teams(id),
  capo_pr_user_id uuid references public.profiles(id),
  notes text,
  reliability_notes text,
  joined_board_at timestamptz,
  joined_team_at timestamptz,
  last_active_at timestamptz,
  is_archived boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 20.5 team_members

Utile se in futuro una persona può stare in più squadre.

```sql
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  collaborator_id uuid not null references public.collaborators(id) on delete cascade,
  role_in_team text not null default 'sotto_pr',
  created_at timestamptz not null default now(),
  unique(team_id, collaborator_id)
);
```

---

## 20.6 events

```sql
create table public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  event_date timestamptz not null,
  venue text,
  city text,
  description text,
  ticket_url text,
  target_attendance integer,
  status text not null default 'bozza',
  post_event_notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 20.7 event_team_assignments

Quali squadre sono attivate su un evento.

```sql
create table public.event_team_assignments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  assigned_by uuid references public.profiles(id),
  notes text,
  created_at timestamptz not null default now(),
  unique(event_id, team_id)
);
```

---

## 20.8 event_collaborator_performances

Numeri del singolo collaboratore/sotto PR per evento.

```sql
create table public.event_collaborator_performances (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  collaborator_id uuid not null references public.collaborators(id) on delete cascade,
  team_id uuid references public.teams(id),
  capo_pr_user_id uuid references public.profiles(id),
  confirmed_support boolean not null default false,
  shared_story boolean not null default false,
  broadcast_sent boolean not null default false,
  list_names_count integer not null default 0,
  tickets_sold_count integer not null default 0,
  tables_count integer not null default 0,
  actual_entries_count integer not null default 0,
  negative_behavior boolean not null default false,
  performance_score integer not null default 0,
  notes text,
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(event_id, collaborator_id)
);
```

---

## 20.9 interactions

```sql
create table public.interactions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  collaborator_id uuid references public.collaborators(id) on delete cascade,
  user_id uuid not null references public.profiles(id),
  interaction_type text not null default 'nota_generica',
  channel text not null default 'internal',
  note text not null,
  created_at timestamptz not null default now(),
  constraint interactions_target_check check (
    lead_id is not null or collaborator_id is not null
  )
);
```

---

## 20.10 message_templates

```sql
create table public.message_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  body text not null,
  visibility text not null default 'global' check (visibility in ('global', 'personal')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 20.11 audit_logs

Serve per capire chi modifica cosa.

```sql
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);
```

---

# 21. Row Level Security

La sicurezza è fondamentale perché la PWA gira da browser.

Usare Supabase Auth + RLS.

## Regole logiche

### Manager

Manager può:

- SELECT tutto;
- INSERT tutto;
- UPDATE tutto;
- DELETE dove consentito.

### Capo PR

Capo PR può:

- SELECT statistiche globali;
- SELECT eventi;
- SELECT squadre aggregate;
- SELECT template globali;
- SELECT lead propri;
- INSERT lead;
- UPDATE lead propri;
- SELECT collaboratori propri;
- INSERT collaboratori propri;
- UPDATE collaboratori propri;
- SELECT performance globali aggregate;
- INSERT/UPDATE performance della propria squadra.

Capo PR non può:

- UPDATE dati di altri capi PR;
- DELETE dati critici;
- modificare impostazioni globali.

---

# 22. Funzioni helper database

## is_manager

```sql
create or replace function public.is_manager()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'manager'
    and is_active = true
  );
$$ language sql security definer;
```

## is_capo_pr

```sql
create or replace function public.is_capo_pr()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'capo_pr'
    and is_active = true
  );
$$ language sql security definer;
```

## owns_team

```sql
create or replace function public.owns_team(team_uuid uuid)
returns boolean as $$
  select exists (
    select 1 from public.teams
    where id = team_uuid
    and capo_pr_user_id = auth.uid()
  );
$$ language sql security definer;
```

---

# 23. Esempi policy RLS

## Leads SELECT

```sql
create policy "Managers can read all leads"
on public.leads
for select
using (public.is_manager());

create policy "Capo PR can read own leads"
on public.leads
for select
using (
  owner_user_id = auth.uid()
  or created_by = auth.uid()
  or public.owns_team(owner_team_id)
);
```

## Leads INSERT

```sql
create policy "Authenticated users can create leads"
on public.leads
for insert
with check (
  auth.uid() is not null
);
```

## Leads UPDATE

```sql
create policy "Managers can update all leads"
on public.leads
for update
using (public.is_manager())
with check (public.is_manager());

create policy "Capo PR can update own leads"
on public.leads
for update
using (
  owner_user_id = auth.uid()
  or created_by = auth.uid()
  or public.owns_team(owner_team_id)
)
with check (
  owner_user_id = auth.uid()
  or created_by = auth.uid()
  or public.owns_team(owner_team_id)
);
```

## Collaborator Performance UPDATE

```sql
create policy "Managers can update all performances"
on public.event_collaborator_performances
for update
using (public.is_manager())
with check (public.is_manager());

create policy "Capo PR can update own team performances"
on public.event_collaborator_performances
for update
using (
  capo_pr_user_id = auth.uid()
  or public.owns_team(team_id)
)
with check (
  capo_pr_user_id = auth.uid()
  or public.owns_team(team_id)
);
```

---

# 24. Stack tecnico PWA

## Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- next-pwa oppure configurazione custom service worker
- React Hook Form
- Zod
- TanStack Query
- TanStack Table per viste desktop
- Recharts per statistiche
- Zustand opzionale per stato locale
- Lucide Icons
- date-fns

## Backend

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase RLS
- Supabase Storage opzionale
- Supabase Edge Functions opzionali in futuro

## Deploy

- Vercel
- dominio opzionale
- Supabase hosted project

---

# 25. Struttura progetto

```text
hertz-pr-hub/
  app/
    layout.tsx
    page.tsx
    login/
      page.tsx
    install/
      page.tsx
    dashboard/
      page.tsx
    leads/
      page.tsx
      new/
        page.tsx
      [id]/
        page.tsx
      pipeline/
        page.tsx
    team/
      page.tsx
    teams/
      page.tsx
      [id]/
        page.tsx
    collaborators/
      page.tsx
      [id]/
        page.tsx
    events/
      page.tsx
      [id]/
        page.tsx
      [id]/performance/
        page.tsx
    rankings/
      page.tsx
    templates/
      page.tsx
      [id]/
        page.tsx
    settings/
      page.tsx
    privacy/
      page.tsx
    terms/
      page.tsx

  components/
    layout/
    navigation/
    dashboard/
    leads/
    teams/
    collaborators/
    events/
    rankings/
    templates/
    ui/

  lib/
    supabase/
      client.ts
      server.ts
      middleware.ts
    auth/
    permissions/
    constants/
    utils/
      instagram.ts
      performance.ts
      dates.ts
    validations/
    pwa/

  hooks/
    use-current-user.ts
    use-role.ts
    use-install-prompt.ts

  types/
    database.ts
    domain.ts

  supabase/
    migrations/
    seed.sql

  public/
    manifest.json
    icons/
    screenshots/
    sw.js
```

---

# 26. PWA Requirements

## Manifest

File:

```text
public/manifest.json
```

Esempio:

```json
{
  "name": "Hertz PR Hub",
  "short_name": "PR Hub",
  "description": "CRM operativo per gestione PR, collaboratori e performance eventi.",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#050505",
  "theme_color": "#050505",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/icons/maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

## App installabile

La app deve avere:

- manifest valido;
- icone;
- service worker;
- HTTPS;
- responsive design;
- install prompt per Android/Chrome;
- istruzioni manuali per iPhone/Safari.

---

# 27. Installazione da parte dei PR

## iPhone

Istruzioni:

1. Apri il link dell'app da Safari.
2. Premi il pulsante Condividi.
3. Seleziona “Aggiungi alla schermata Home”.
4. Conferma.
5. Apri l'app dall'icona.

## Android

Istruzioni:

1. Apri il link dell'app da Chrome.
2. Tocca “Installa app” se appare il banner.
3. Oppure menu tre puntini.
4. “Aggiungi a schermata Home”.
5. Apri dall'icona.

## Dentro l'app

Creare pagina:

```text
/install
```

Con istruzioni visive per iPhone e Android.

---

# 28. UX mobile-first

## Principi

- tutto deve funzionare bene da telefono;
- form brevi;
- quick action ovunque;
- bottoni grandi;
- bottom navigation;
- card al posto di tabelle su mobile;
- tabelle solo da desktop;
- filtri rapidi;
- ricerca sempre visibile;
- poche schermate profonde;
- salvataggi rapidi.

## Componenti fondamentali

- Bottom tab mobile;
- Sidebar desktop;
- Lead card;
- Collaborator card;
- Event performance card;
- Stat card;
- Ranking card;
- Status badge;
- Quick action drawer;
- Filter sheet;
- Template copy modal;
- Toast feedback.

---

# 29. Funzioni chiave

## 29.1 Normalizzazione Instagram

```ts
export function normalizeInstagramUsername(value: string): string {
  return value
    .trim()
    .replace(/^@/, "")
    .toLowerCase();
}
```

---

## 29.2 Calcolo score

```ts
export function calculatePerformanceScore(input: {
  confirmed_support: boolean;
  shared_story: boolean;
  broadcast_sent: boolean;
  list_names_count: number;
  tickets_sold_count: number;
  tables_count: number;
  actual_entries_count: number;
  negative_behavior: boolean;
}) {
  let score = 0;

  if (input.shared_story) score += 1;
  if (input.broadcast_sent) score += 1;

  score += input.list_names_count;
  score += input.tickets_sold_count * 3;
  score += input.tables_count * 8;
  score += input.actual_entries_count * 2;

  const noResults =
    input.list_names_count === 0 &&
    input.tickets_sold_count === 0 &&
    input.tables_count === 0 &&
    input.actual_entries_count === 0 &&
    !input.shared_story &&
    !input.broadcast_sent;

  if (input.confirmed_support && noResults) score -= 2;
  if (input.negative_behavior) score -= 5;

  return score;
}
```

---

# 30. Roadmap di sviluppo

## Phase 0 — Setup

Obiettivo:
creare base progetto.

Task:

- creare progetto Next.js;
- configurare TypeScript;
- configurare Tailwind;
- configurare shadcn/ui;
- configurare Supabase;
- creare repo GitHub;
- creare progetto Vercel;
- creare progetto Supabase;
- creare struttura cartelle;
- creare manifest PWA;
- creare icone placeholder;
- creare layout mobile-first.

Done:

- app apre in locale;
- deploy Vercel funziona;
- manifest esiste;
- app ha layout mobile.

---

## Phase 1 — Auth & Roles

Obiettivo:
accesso sicuro.

Task:

- Supabase Auth;
- login;
- logout;
- session persistence;
- profiles table;
- ruoli manager/capo_pr;
- middleware route protection;
- redirect dopo login;
- layout diverso per ruolo;
- dashboard placeholder.

Done:

- Manager entra e vede dashboard Manager;
- Capo PR entra e vede dashboard Capo PR.

---

## Phase 2 — CRM Lead

Obiettivo:
risolvere caos dei contatti.

Task:

- tabella leads;
- crea lead;
- lista lead;
- dettaglio lead;
- modifica lead;
- owner;
- stato;
- follow-up;
- note;
- anti-duplicato Instagram;
- filtri;
- ricerca;
- pipeline mobile a tabs.

Done:

- nessun duplicato Instagram;
- ogni lead ha owner e stato;
- capo PR modifica solo i suoi.

---

## Phase 3 — Interactions & Timeline

Obiettivo:
tracciare storico.

Task:

- tabella interactions;
- aggiungi nota;
- timeline;
- log cambio stato;
- log follow-up;
- alert follow-up;
- dashboard task.

Done:

- ogni lead ha storico;
- follow-up scaduti sono visibili.

---

## Phase 4 — Squadre & Collaboratori

Obiettivo:
mappare la rete PR.

Task:

- tabella teams;
- tabella collaborators;
- tabella team_members;
- conversione lead -> collaboratore;
- crea squadra;
- assegna capo PR;
- lista collaboratori;
- dettaglio collaboratore;
- livelli;
- stati;
- dashboard squadra.

Done:

- ogni capo PR ha la sua squadra;
- ogni sotto PR ha numeri e storico.

---

## Phase 5 — Eventi & Performance

Obiettivo:
misurare risultati.

Task:

- tabella events;
- tabella event_team_assignments;
- tabella event_collaborator_performances;
- crea evento;
- assegna squadre;
- assegna collaboratori;
- inserimento numeri mobile;
- score;
- aggregati per squadra;
- ranking evento.

Done:

- ogni evento mostra numeri per capo PR;
- ogni capo PR inserisce solo i propri numeri;
- manager vede tutto.

---

## Phase 6 — Ranking & Analytics

Obiettivo:
creare controllo e competizione.

Task:

- ranking capi PR;
- ranking squadre;
- ranking collaboratori;
- trend;
- conversion rate;
- dormienti;
- top performer;
- alert.

Done:

- manager capisce chi sta performando;
- capi PR vedono confronto.

---

## Phase 7 — Template

Obiettivo:
standardizzare comunicazione.

Task:

- template globali;
- template personali;
- copia template;
- categorie;
- preferiti;
- collegamento da lead/evento.

Done:

- PR copiano messaggi in pochi secondi.

---

## Phase 8 — PWA Polish

Obiettivo:
esperienza app.

Task:

- install page;
- service worker;
- offline fallback;
- app icon;
- splash;
- manifest;
- empty states;
- loading states;
- responsive completo;
- performance;
- caching;
- SEO base privacy/terms.

Done:

- installabile da telefono;
- sembra una vera app;
- aggiornabile senza store.

---

# 31. Prompt Master per Claude Code

Usare questo prompt iniziale.

```text
Voglio costruire una PWA mobile-first chiamata Hertz PR Hub.

Non è una app nativa e non deve passare da App Store o Google Play. Deve essere una Progressive Web App installabile su smartphone tramite browser, con manifest, service worker, icona, splash e UX mobile-first.

Stack:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security
- Vercel deploy

Prodotto:
Hertz PR Hub è un CRM operativo verticale per gestire PR, capi PR, sotto PR, collaboratori, lead Instagram, squadre PR, eventi e performance.

Ruoli:
1. Manager
- vede tutto;
- modifica tutto;
- gestisce utenti, squadre, eventi, lead, collaboratori, template, performance e settings.

2. Capo PR
- vede dashboard e statistiche globali;
- vede risultati degli altri capi PR in sola lettura;
- crea lead;
- modifica solo i propri lead;
- gestisce solo la propria squadra;
- crea/modifica solo i propri collaboratori/sotto PR;
- inserisce/modifica solo i numeri della propria squadra sugli eventi;
- usa template globali;
- crea template personali.

Funzionalità v1:
- login;
- ruoli manager/capo_pr;
- dashboard manager;
- dashboard capo PR;
- CRM lead;
- anti-duplicato Instagram username;
- owner lead;
- pipeline lead;
- follow-up;
- timeline interazioni;
- conversione lead in collaboratore;
- squadre PR;
- collaboratori/sotto PR;
- eventi;
- assegnazione squadre a eventi;
- inserimento performance evento per collaboratore;
- ranking capi PR/squadre/collaboratori;
- template messaggi;
- settings;
- PWA installabile.

Regola chiave:
i capi PR possono vedere i risultati degli altri, ma possono modificare solo le informazioni proprie e della propria squadra.

Inizia solo con Phase 0 e Phase 1:
- setup progetto;
- configurazione PWA base;
- Supabase client;
- auth;
- profiles table;
- ruoli;
- protected routes;
- layout mobile-first;
- dashboard placeholder per Manager e Capo PR.

Dopo Phase 1 fermati e spiegami:
- file creati;
- struttura progetto;
- come avviare;
- come configurare Supabase;
- come deployare su Vercel.
```

---

# 32. Prompt Phase 2 — Lead CRM

```text
Implementa Phase 2: CRM Lead.

Requirements:
- crea migration Supabase per leads;
- crea enum/constants per stati, priorità, interesse;
- crea utility normalizeInstagramUsername;
- crea form nuovo lead;
- crea lista lead mobile-first;
- crea dettaglio lead;
- implementa anti-duplicato Instagram;
- implementa ricerca;
- implementa filtri;
- implementa owner;
- implementa status update;
- implementa follow-up;
- implementa pipeline mobile a tabs;
- applica permessi:
  - Manager vede/modifica tutto;
  - Capo PR modifica solo lead propri, vede dati globali in sola lettura dove previsto.
```

---

# 33. Prompt Phase 3 — Interactions

```text
Implementa Phase 3: Interactions & Timeline.

Requirements:
- crea tabella interactions;
- aggiungi timeline nella scheda lead;
- aggiungi quick note;
- logga cambio stato;
- logga follow-up;
- dashboard follow-up oggi;
- dashboard follow-up scaduti;
- permessi coerenti con ruoli.
```

---

# 34. Prompt Phase 4 — Squadre & Collaboratori

```text
Implementa Phase 4: Squadre PR e Collaboratori.

Requirements:
- crea tabella teams;
- crea tabella collaborators;
- crea tabella team_members;
- crea conversione lead -> collaboratore;
- crea lista squadre;
- crea dettaglio squadra;
- crea lista collaboratori;
- crea dettaglio collaboratore;
- implementa livelli collaboratore;
- implementa stati collaboratore;
- ogni capo PR gestisce solo la sua squadra;
- Manager gestisce tutto;
- capi PR vedono statistiche altre squadre in sola lettura.
```

---

# 35. Prompt Phase 5 — Eventi & Performance

```text
Implementa Phase 5: Eventi e Performance.

Requirements:
- crea tabella events;
- crea tabella event_team_assignments;
- crea tabella event_collaborator_performances;
- crea lista eventi;
- crea dettaglio evento;
- assegna squadre a evento;
- assegna collaboratori a evento;
- crea UI mobile card per inserire numeri;
- campi:
  - confirmed_support;
  - shared_story;
  - broadcast_sent;
  - list_names_count;
  - tickets_sold_count;
  - tables_count;
  - actual_entries_count;
  - negative_behavior;
  - notes;
- calcola performance_score;
- aggrega per capo PR;
- aggrega per squadra;
- crea classifica evento;
- capi PR modificano solo numeri della propria squadra;
- Manager modifica tutto.
```

---

# 36. Prompt Phase 6 — Ranking & Analytics

```text
Implementa Phase 6: Ranking e Analytics.

Requirements:
- ranking capi PR ultimo evento;
- ranking capi PR mese;
- ranking squadre;
- ranking collaboratori;
- trend performance;
- lead conversion rate;
- collaboratori dormienti;
- top performer;
- dashboard Manager con insight;
- dashboard Capo PR con confronto in sola lettura.
```

---

# 37. Prompt Phase 7 — Template

```text
Implementa Phase 7: Template Messaggi.

Requirements:
- crea tabella message_templates;
- template globali;
- template personali;
- categorie;
- preferiti;
- copia negli appunti;
- accesso rapido da lead detail;
- accesso rapido da evento;
- Manager modifica template globali;
- Capo PR modifica solo template personali.
```

---

# 38. Prompt Phase 8 — PWA Polish

```text
Implementa Phase 8: PWA Polish.

Requirements:
- manifest completo;
- service worker;
- app icon;
- splash screen;
- pagina /install con istruzioni iPhone/Android;
- offline fallback;
- loading states;
- empty states;
- error states;
- mobile polish;
- desktop sidebar;
- privacy page;
- terms page;
- support page;
- Lighthouse PWA checks.
```

---

# 39. Vercel

Vercel serve per pubblicare la PWA.

Flusso:

1. crea repository GitHub;
2. collega repository a Vercel;
3. inserisci variabili ambiente;
4. deploy automatico a ogni push;
5. condividi link ai PR;
6. PR installano la PWA sul telefono.

Variabili ambiente:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Nota:
la service role key non deve mai essere usata lato client.

---

# 40. Supabase

Supabase serve per:

- autenticazione;
- database;
- ruoli;
- permessi;
- row level security;
- storage futuro;
- edge functions future.

Setup:

1. crea progetto Supabase;
2. abilita Auth email/password;
3. crea tabelle;
4. abilita RLS;
5. crea primo Manager;
6. crea capi PR;
7. testa permessi;
8. crea dati demo.

---

# 41. Costi

Per v1 PWA:

- GitHub: gratuito;
- Vercel Hobby: gratuito per iniziare;
- Supabase Free: gratuito per iniziare;
- dominio custom: opzionale;
- App Store: non necessario;
- Google Play: non necessario.

Costo iniziale realistico:
quasi zero.

Costo opzionale:
dominio custom.

Costi futuri possibili:
- Supabase Pro;
- Vercel Pro;
- dominio;
- servizi email/notifiche.

---

# 42. Privacy

La app gestisce dati personali.

Dati possibili:

- nomi;
- Instagram username;
- numeri telefono;
- note;
- performance;
- informazioni operative.

Regole:

- accesso solo con login;
- non salvare dati inutili;
- evitare note sensibili;
- manager controlla accessi;
- RLS attivo;
- privacy policy;
- possibilità di cancellare dati;
- audit log per modifiche importanti.

---

# 43. MVP finale

La v1 deve fare benissimo queste cose:

```text
1. Login Manager / Capo PR
2. Dashboard differenziata
3. Lead CRM
4. Anti-duplicato Instagram
5. Owner lead
6. Pipeline e follow-up
7. Conversione lead -> collaboratore
8. Squadre PR
9. Sotto PR/collaboratori
10. Eventi
11. Inserimento numeri per evento
12. Performance per capo PR
13. Ranking
14. Template messaggi
15. PWA installabile
```

Non costruire altro finché queste cose non funzionano bene.

---

# 44. Criteri di successo

Il prodotto funziona se:

1. nessun Instagram viene contattato due volte senza saperlo;
2. ogni lead ha un owner;
3. ogni Capo PR sa cosa deve fare;
4. ogni squadra ha membri e numeri tracciati;
5. ogni evento mostra chi ha portato valore;
6. il Manager vede tutto;
7. i capi PR vedono confronto ma non possono modificare dati altrui;
8. i collaboratori dormienti emergono;
9. i migliori sotto PR emergono;
10. la app viene davvero usata da telefono.

---

# 45. Direzione finale

La PWA deve diventare il centro operativo PR.

Prima:
caos tra Instagram, WhatsApp e memoria personale.

Dopo:
ogni persona ha stato, owner, squadra, storico e performance.

La v1 non deve essere enorme.
Deve essere usabile ogni giorno.

Costruire prima:

```text
CRM Lead
+
Squadre PR
+
Collaboratori
+
Eventi
+
Performance
+
Ranking
```

Poi iterare.
