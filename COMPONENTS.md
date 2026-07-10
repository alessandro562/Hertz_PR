# hertz PR Hub — componenti: API & prompt d'uso

Per ogni componente: **import**, **props**, uno **snippet** pronto e un **prompt**
da dare a Claude Code. Rispetta sempre le regole in `CLAUDE.md`.

---

## Base UI primitives (`components/ui/`)

### Button
`import { Button } from "@/components/ui/button"`

- `variant`: `"default"` (sage) · `"secondary"` · `"outline"` · `"ghost"` · `"destructive"` — default `default`
- `size`: `"sm"` (36) · `"md"` (44) · `"lg"` (48) · `"icon"` (44²) — default `md`
- + tutti gli attributi nativi `<button>` (`onClick`, `disabled`, `type`, …)

```tsx
<Button>Aggiungi lead</Button>
<Button variant="outline" size="sm">Filtra</Button>
<Button variant="destructive">Elimina</Button>
<Button size="icon" aria-label="aggiungi"><Plus /></Button>
```
> **Prompt:** "Usa `<Button>` per le azioni: `default` per l'azione primaria della schermata,
> `outline`/`ghost` per le secondarie, `destructive` per eliminazioni. Mai due primari nella stessa vista."

### Badge
`import { Badge } from "@/components/ui/badge"`

- `tone`: `"neutral"` · `"sage"` · `"success"` · `"warning"` · `"danger"` — default `neutral`

```tsx
<Badge tone="sage">Nuovo</Badge>
<Badge tone="success">In lista</Badge>
<Badge tone="warning">Da ricontattare</Badge>
<Badge tone="danger">Perso</Badge>
```
> **Prompt:** "Mappa gli stati lead sui toni Badge: Nuovo→sage, In lista/Confermato→success,
> Da ricontattare→warning, Perso→danger, Bozza→neutral. Il badge è una pill in mono maiuscolo."

### Card
`import { Card, CardHeader, CardKicker, CardTitle, CardContent, CardFooter } from "@/components/ui/card"`

Superficie base di ogni pannello. `CardKicker` = eyebrow mono. Tutte accettano `className`.

```tsx
<Card>
  <CardHeader>
    <CardKicker>Evento · Sabato</CardKicker>
    <CardTitle>Techno Sequence</CardTitle>
  </CardHeader>
  <CardContent>Kindergarten, Bologna · door 23:59 · 18+</CardContent>
  <CardFooter><Button size="sm">Apri</Button></CardFooter>
</Card>
```
> **Prompt:** "Ogni pannello è una `<Card>` (fill piatto + bordo 1px, niente ombra).
> Usa `<CardKicker>` in mono per l'etichetta di contesto sopra il titolo."

### Tabs (Base UI)
`import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/ui/tabs"`

Wrapper su `@base-ui-components/react/tabs`. `Tabs` inoltra le props di `Tabs.Root`
(`value`, `defaultValue`, `onValueChange`). Indicatore underline sage, scroll orizzontale su mobile.

```tsx
<Tabs defaultValue="nuovi">
  <TabsList>
    <TabsTab value="nuovi">Nuovi</TabsTab>
    <TabsTab value="contattati">Contattati</TabsTab>
    <TabsTab value="lista">In lista</TabsTab>
    <TabsTab value="confermati">Confermati</TabsTab>
    <TabsTab value="persi">Persi</TabsTab>
  </TabsList>
  <TabsPanel value="nuovi">{/* … */}</TabsPanel>
</Tabs>
```
> **Prompt:** "Usa `<Tabs>` per la pipeline del Lead CRM (Nuovi/Contattati/In lista/Confermati/Persi).
> Aggiungi un contatore accanto all'etichetta della tab."

### Switch (Base UI)
`import { Switch } from "@/components/ui/switch"`

Inoltra le props di `Switch.Root` (`checked`, `defaultChecked`, `onCheckedChange`). Track sage quando on.

```tsx
<Switch defaultChecked />
<Switch checked={notifiche} onCheckedChange={setNotifiche} />
```
> **Prompt:** "Usa `<Switch>` per toggle booleani (notifiche, evento pubblico/privato).
> Abbina sempre una `<label>` cliccabile."

### Progress
`import { Progress } from "@/components/ui/progress"`

- `value`: number 0–100
- `tone`: `"primary"` · `"gold"` · `"silver"` · `"bronze"` · `"success"` — default `primary`

```tsx
<Progress value={72} />
<Progress value={100} tone="gold" />
```
> **Prompt:** "Usa `<Progress>` per quote e barre di classifica. Nelle classifiche i primi 3
> usano tone gold/silver/bronze, gli altri primary."

---

## Composite PR Hub (`components/pr-hub/`)

### Logo
`import { Logo } from "@/components/pr-hub/logo"`

- `variant`: `"lockup"` · `"wordmark"` · `"mark"` — default `lockup`
- `height`: px (larghezza in proporzione) · `priority?: boolean`

```tsx
<Logo variant="wordmark" height={20} priority />   // app bar
<Logo variant="mark" height={40} />                 // avatar/icona
```
> **Prompt:** "Rendi SEMPRE il logo con `<Logo>` (asset ufficiali). Non ridisegnare mai il
> wordmark o il segno waveform. Nell'app bar usa `variant='wordmark'`."

### DashboardHeader
`import { DashboardHeader } from "@/components/pr-hub/dashboard-header"`

- `title?: string` · `right?: ReactNode` (azioni: notifiche, avatar)
- Sticky, bordo inferiore hairline, porta il wordmark ufficiale a sinistra.

```tsx
<DashboardHeader title="Dashboard" right={<Avatar>MR</Avatar>} />
```
> **Prompt:** "Ogni schermata inizia con `<DashboardHeader title='…'/>`. Il logo hertz sta
> sempre a sinistra dell'header."

### StatCard
`import { StatCard } from "@/components/pr-hub/stat-card"`

- `label: string` · `value: string|number` · `unit?: string`
- `delta?: { value: string; direction: "up"|"down"|"flat" }`

```tsx
<StatCard label="Ingressi" value="1.284" delta={{ value: "12% vs mese", direction: "up" }} />
<StatCard label="Conferma" value={68} unit="%" delta={{ value: "3%", direction: "down" }} />
```
> **Prompt:** "Costruisci la griglia KPI della dashboard con `<StatCard>` (2 colonne su mobile).
> Il numero è grande in Helvetica Black; il delta up=success, down=danger."

### RankList
`import { RankList } from "@/components/pr-hub/rank-list"`

- `entries: { id: string; name: string; meta?: string; score: number }[]`
- I primi 3 ricevono podio (badge + barra gold/silver/bronze), gli altri righe compatte. Barre normalizzate al leader.

```tsx
<RankList entries={[
  { id: "1", name: "Giulia Ferrari", meta: "Team Aurora", score: 238 },
  { id: "2", name: "Dario Villa",    meta: "Neon Collective", score: 211 },
  { id: "3", name: "Sara Lombardi",  meta: "Basement Crew", score: 187 },
]} />
```
> **Prompt:** "La pagina Classifiche usa `<RankList>`. Passa le entry già ordinate per score
> decrescente; il componente applica il podio ai primi 3."

### NumberStepper
`import { NumberStepper } from "@/components/pr-hub/number-stepper"`

- `value?` / `defaultValue` / `min` / `max` / `step` / `onChange(v)` / `label?`
- Controlled o uncontrolled. Target 48–52px, input tabular, `inputMode="numeric"`.

```tsx
<NumberStepper label="Ingressi lista" defaultValue={0} min={0} step={1} onChange={setN} />
```
> **Prompt:** "Per l'inserimento numeri alla porta usa `<NumberStepper>`: tasti grandi (48px),
> tastiera numerica, un campo per 'ingressi lista' e uno per 'paganti in cassa'."

### SegmentedToggle
`import { SegmentedToggle } from "@/components/pr-hub/segmented-toggle"`

- `options: { value: string; label: string }[]` · `value` · `onChange(v)`

```tsx
<SegmentedToggle
  options={[{value:"oggi",label:"Oggi"},{value:"sett",label:"Settimana"},{value:"mese",label:"Mese"}]}
  value={range} onChange={setRange} />
```
> **Prompt:** "Usa `<SegmentedToggle>` per switch di vista brevi (Oggi/Settimana/Mese,
> Squadre/Collaboratori) — 2–3 opzioni corte. Oltre, passa a un select."

---

## Prompt di schermata (esempi end-to-end per Claude Code)

- **Dashboard Manager** — "Crea `app/(app)/dashboard/page.tsx`: `<DashboardHeader title='Dashboard'>`,
  saluto in Helvetica Bold, `<SegmentedToggle>` Oggi/Settimana/Mese, griglia di 4 `<StatCard>`,
  e un blocco 'Top squadre' con `<RankList>` (prime 3). Palette sage su near-black, tutto mobile-first."
- **Lead CRM** — "Crea la schermata Lead: `<DashboardHeader title='Lead'>` con `<Button size='icon'>` +,
  `<Tabs>` per la pipeline (Nuovi/Contattati/In lista/Confermati/Persi) con contatori, e righe lead
  (avatar iniziali + nome + meta IG/telefono in mono + `<Badge>` di stato allineato a destra)."
- **Classifiche** — "Crea la pagina Classifiche: header, `<SegmentedToggle>` Ingressi/Incasso/Conversione,
  e `<RankList>` a tutta larghezza con podio. Numeri in `.num`."
- **Evento / inserimento numeri** — "Crea il dettaglio evento con kicker mono (`SABATO · MAIN ROOM`),
  titolo, riga metadati (door 23:59 · 18+ · RSVP), due `<NumberStepper>` (ingressi lista, paganti),
  due `<StatCard>` (totale, capienza), e in fondo `<Button>` 'Salva numeri' + `<Button variant='ghost'>` 'Chiudi serata'."
