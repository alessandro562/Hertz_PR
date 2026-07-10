# hertz PR Hub

PWA mobile-first (CRM operativo) per gestire la rete PR di **hertz**, promoter di
serate techno/underground a Bologna: lead Instagram, capi PR, collaboratori/sotto PR,
squadre, eventi, inserimento numeri alla porta, classifiche e trend di performance.

Live: `https://hertz-pr.vercel.app`

## Stack

- **Next.js 16** (App Router, React 19, Turbopack) + TypeScript
- **Tailwind CSS v4** (CSS-first, nessun `tailwind.config.js`) + **shadcn/ui** su **Base UI**
- **Supabase** — Auth email/password, PostgreSQL, Row Level Security (`@supabase/ssr`)
- **Recharts** — grafici di andamento performance
- **PWA** — manifest + service worker custom (`public/sw.js`), installabile, Web Share Target
- React Hook Form + Zod, TanStack Query, lucide-react, date-fns
- Deploy: Vercel

## Design system

Il brand (palette sage/near-black, tipografia, componenti) è documentato in
`CLAUDE.md` (regole) e `COMPONENTS.md` (API + prompt d'uso). `preview/` contiene
anteprime statiche del design, non fanno parte del codice dell'app.

## Ruoli

| | Manager | Capo PR |
|---|---|---|
| Dati | vede e modifica tutto | vede statistiche globali in sola lettura, modifica solo i propri lead/squadra/performance |

L'enforcement reale è nel database via **RLS**; le check nel client sono solo per la UI.

## Funzionalità

- **Lead CRM** Instagram-first: cattura da @ con anti-duplicato globale, pipeline a
  tab, azioni rapide (Instagram/WhatsApp deep link, template di messaggio).
- **Collaboratori, Squadre, Gruppi WhatsApp** (bacheca/PR/sotto-PR) e conversione
  lead → collaboratore.
- **Eventi & Performance**: assegnazione squadre, inserimento numeri alla porta con
  punteggio calcolato server-side.
- **Classifiche**: leaderboard cross-evento (capo PR, squadra, collaboratore),
  crescita, dormienti, lead caldi senza follow-up.
- **Performance**: grafici di andamento nel tempo (punteggio totale, squadre, capi
  PR, top collaboratori) su tutti gli eventi con numeri inseriti.
- **Foto profilo**: upload manuale (screenshot Instagram) per lead e collaboratori,
  salvato su Supabase Storage — Instagram non espone un'API pubblica per leggere i
  profili altrui, quindi niente fetch/scraping automatico.

## 1. Requisiti

- Node.js ≥ 20.9
- Un progetto Supabase (gratuito) — https://supabase.com
- (Opzionale, per il DB in locale) Docker + Supabase CLI via `npx supabase`

## 2. Setup locale

```bash
npm install
cp .env.local.example .env.local   # poi compila i valori (vedi sotto)
npm run dev                        # http://localhost:3000
```

### Variabili d'ambiente (`.env.local`)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-or-secret-key   # SOLO server, mai NEXT_PUBLIC
# per lo script di seed:
SEED_MANAGER_EMAIL=you@example.com
SEED_MANAGER_PASSWORD=una-password-forte
SEED_MANAGER_NAME=Alessandro
```

Trovi URL e chiavi in Supabase → Project Settings → API.

## 3. Database

Applica le migrazioni in `supabase/migrations/`, **in ordine**, dal SQL Editor del
progetto Supabase (o via `npx supabase db push` se lavori in locale):

1. `0001_auth_profiles.sql` — `profiles`, ruoli, RLS, trigger.
2. `0002_leads.sql` — `leads`, anti-duplicato (`check_lead_duplicate`).
3. `0003_teams_collaborators.sql` — squadre, collaboratori, gruppi WhatsApp.
4. `0004_events_performance.sql` — eventi, assegnazioni squadra, performance.
5. `0005_rankings.sql` — funzione `ranking_collaborators()` per le classifiche.
6. `0006_avatars.sql` — `avatar_url` su lead/collaboratori + bucket Storage `avatars`.

Una migrazione già applicata **non va mai modificata**: le evoluzioni successive
dello schema arrivano sempre come nuovo file numerato.

In **Authentication → Providers → Email** disattiva *Confirm email* (tool interno).

**Alternativa locale (serve Docker):**
```bash
npx supabase init      # se non esiste già supabase/config.toml
npx supabase start
npm run db:reset       # applica migrations + seed.sql
npm run db:types       # rigenera types/database.ts dallo schema locale
```

## 4. Crea il primo Manager

Un nuovo utente creato via signup diventa `capo_pr` di default. Il primo **Manager**
va creato con metadata `role=manager`, in uno di questi modi:

**Script (service-role):**
```bash
npm run seed:manager
```

**Oppure Supabase Studio →** Authentication → Add user:
- Auto Confirm User: **ON**
- User Metadata: `{"role":"manager","full_name":"Alessandro"}`

Il trigger `handle_new_user` crea automaticamente la riga in `profiles`.

## 5. Verifica

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint
npm run test        # unit test (funzioni pure)
npm run build       # build di produzione (Turbopack)
```

Login come Manager → dashboard Manager; login come Capo PR → dashboard Capo PR.

## 6. Deploy su Vercel

1. Push del repo su GitHub.
2. Importa il progetto su Vercel.
3. Aggiungi le env var (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`). **La service role key non va mai lato client.**
4. Deploy automatico a ogni push. Condividi il link ai PR.

## 7. Installazione PWA sul telefono

Il service worker si registra **solo in produzione** (HTTPS), quindi l'installabilità
si testa sull'URL Vercel, non su `localhost`.

- **iPhone (Safari):** apri il link → Condividi → *Aggiungi alla schermata Home*.
- **Android (Chrome):** apri il link → banner *Installa app* (o menu ⋮ → *Aggiungi a schermata Home*).
- **Web Share Target (Android):** condividendo un profilo/link Instagram da un'altra
  app si può scegliere "hertz PR Hub" per pre-compilare un nuovo lead.

## Struttura

```text
app/
  (auth)/login/         # login (server action + form React 19)
  (protected)/          # layout con guard + app shell: dashboard, leads, collaborators,
                         # teams, events, rankings, performance, templates, settings
components/{layout,navigation,dashboard,leads,collaborators,teams,events,
            rankings,performance,pr-hub,common,ui}/
lib/
  supabase/{client,server,proxy}.ts   # @supabase/ssr (browser / server / session refresh)
  auth/session.ts                     # getSessionUser (cache)
  permissions.ts · instagram.ts · whatsapp.ts · performance.ts · performance-trends.ts
  constants/ · validations/
proxy.ts                # Next 16: sostituisce middleware.ts (refresh sessione + gate)
supabase/migrations/    # 0001..0006, vedi sopra
scripts/seed-manager.ts
public/{manifest.json,sw.js,offline.html,icons/,brand/}
```

## Note tecniche

- **Next 16** ha rinominato `middleware.ts` → **`proxy.ts`** (runtime Node.js): qui il
  `proxy` fa il refresh della sessione Supabase e il redirect grossolano non-auth → `/login`.
- Il service worker è **scritto a mano** e Turbopack-native (Serwist non supporta ancora
  Turbopack).
- Gli helper RLS (`is_manager`, `is_capo_pr`, `owns_team`) sono `security definer` per
  evitare la ricorsione delle policy. Funzioni come `check_lead_duplicate` e
  `ranking_collaborators` bypassano RLS in modo mirato per confronti cross-team
  privacy-aware (un Capo PR vede "chi" ma non l'intera scheda altrui).
