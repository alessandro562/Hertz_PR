# Hertz PR Hub

PWA mobile-first (CRM operativo) per gestire la rete PR di eventi: lead Instagram,
capi PR, collaboratori/sotto PR, squadre, eventi e performance.

Questa è la **Fase 0 + Fase 1**: setup progetto, base PWA installabile, autenticazione
Supabase, ruoli (Manager / Capo PR), route protette, layout mobile-first e dashboard
placeholder differenziate. Le funzionalità (Lead CRM, squadre, eventi, performance,
ranking, template) arrivano nelle fasi successive — vedi `docs/hertz_pr_hub_pwa_mobile_first_plan.md`.

## Stack

- **Next.js 16** (App Router, React 19, Turbopack) + TypeScript
- **Tailwind CSS v4** + **shadcn/ui** (Base UI)
- **Supabase** — Auth email/password, PostgreSQL, Row Level Security (`@supabase/ssr`)
- **PWA** — manifest + service worker custom (`public/sw.js`), installabile
- React Hook Form + Zod, TanStack Query, lucide-react, date-fns
- Deploy: Vercel

## Ruoli

| | Manager | Capo PR |
|---|---|---|
| Dati | vede e modifica tutto | vede statistiche globali in sola lettura, modifica solo i propri lead/squadra/performance |

L'enforcement reale è nel database via **RLS**; le check nel client sono solo per la UI.

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

Applica la migrazione `supabase/migrations/0001_auth_profiles.sql` (crea `profiles`,
gli helper di ruolo, le policy RLS e i trigger).

**Opzione A — Supabase hosted (consigliata):**
apri il **SQL Editor** del tuo progetto, incolla il contenuto del file ed esegui.
Poi in **Authentication → Providers → Email** disattiva *Confirm email* (tool interno).

**Opzione B — Supabase in locale (serve Docker):**
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

## Struttura

```text
app/
  (auth)/login/         # login (server action + form React 19)
  (protected)/          # layout con guard + app shell; dashboard e sezioni placeholder
components/{layout,navigation,dashboard,pwa,common,ui}/
lib/
  supabase/{client,server,proxy}.ts   # @supabase/ssr (browser / server / session refresh)
  auth/session.ts                     # getSessionUser (cache)
  permissions.ts · instagram.ts · constants/ · validations/
proxy.ts                # Next 16: sostituisce middleware.ts (refresh sessione + gate)
supabase/migrations/    # 0001_auth_profiles.sql
scripts/seed-manager.ts
public/{manifest.json,sw.js,offline.html,icons/}
```

## Note tecniche

- **Next 16** ha rinominato `middleware.ts` → **`proxy.ts`** (runtime Node.js): qui il
  `proxy` fa il refresh della sessione Supabase e il redirect grossolano non-auth → `/login`.
- Il service worker è **scritto a mano** e Turbopack-native (Serwist non supporta ancora
  Turbopack). In Fase 8 si può passare a un caching più ricco.
- Gli helper RLS (`is_manager`, `is_capo_pr`) sono `security definer` per evitare la
  ricorsione delle policy su `profiles`. `owns_team()` arriva con le squadre (Fase 4).
