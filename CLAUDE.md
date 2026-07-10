# hertz PR Hub — CLAUDE.md

Guida per Claude Code. Questo file viene caricato automaticamente: **seguilo
come legge di brand** quando generi o modifichi UI del PR Hub.

hertz è un promoter di serate techno/underground a Bologna (hertz.cc). Il PR Hub
è il **CRM operativo mobile-first (PWA)** per PR e capi promoter: lead, liste,
squadre, eventi, inserimento numeri alla porta, classifiche.

Stack: **Next.js (App Router) · React · TypeScript · Tailwind v4 (CSS-first, nessun `tailwind.config.js`) · Base UI**.

---

## ⚠️ Setup: rinomina i sorgenti

I file `.ts`/`.tsx` sono spediti con suffisso **`.txt`** (`button.tsx.txt`) per
un vincolo dell'ambiente in cui è stato prodotto il pacchetto. **Prima di usarli**,
togli il suffisso:

```bash
bash restore-extensions.sh        # oppure:
find . -name '*.tsx.txt' -o -name '*.ts.txt' | while read f; do mv "$f" "${f%.txt}"; done
```

Poi: `npm i @base-ui-components/react`, importa `app/globals.css` in `app/layout.tsx`,
tieni l'alias `"@/*": ["./*"]` in `tsconfig.json`, e copia `public/`.

---

## Le 10 regole d'oro (brand DNA)

Derivano dal rebrand **Bureau 944 × hertz (2025)**. Non sono opinioni: sono la voce del brand.

1. **Sage `#A3B7B7` è l'unico accent/primary.** Interattivo, attivo, "vincente".
   Niente neon, niente secondo accent inventato. Steel blue `#50778A` è solo secondario.
2. **Canvas near-black `#151515`**, mai `#000` puro. Dark è il default (serata, di notte).
   Il tema `.light` usa il cream `#F4F5F1`, mai bianco puro come canvas.
3. **Tipografia = 3 tagli, un ruolo ciascuno.** Helvetica Neue **Bold** (display/numeri),
   Helvetica Neue **Medium** (body/UI), **ABC Monument Grotesk Semi-Mono** (label/kicker/metadati) —
   quest'ultimo **sempre MAIUSCOLO, wide-tracked**. Nessun altro font.
4. **Numeri grandi = Helvetica Neue Black (900)**, tracking stretto, tabular. Usa `.num`.
   (Confermato: nessun secondo font display per i numeri.)
5. **Angoli piccoli e architettonici**: `0 / 2 / 4 / 8 / 12px`. Card e bottoni a **4px**.
   Il raggio pieno `999px` **solo** per pill (badge/tag/switch). Mai "rounded-2xl".
6. **I bordi separano le superfici, non le ombre.** Hairline 1px ovunque. Ombra solo per
   overlay che devono davvero fluttuare (dialog), bassa e dura — mai un glow morbido.
7. **NIENTE glassmorphism / backdrop-blur.** Non esiste nel brand: è un trope da evitare.
8. **Superfici UI piatte, nessun gradiente nel chrome.** L'unico gradiente (blue lens) è
   `--gradient-promo-lens` ed è **solo per flyer/poster**, mai per dashboard o app.
9. **Motion breve e lineare** (120/200/360ms, easing standard). Niente bounce/spring, niente
   scale/squish al press. Hover: **schiarisci** verso il bianco. Press: **scurisci**.
10. **Logo = solo asset ufficiali** (`public/brand/*`, componente `<Logo>`). Non ridisegnare
    mai il wordmark né il segno waveform. Il logo va sempre nell'app bar della dashboard.

**Motivo grafico opzionale:** anelli concentrici sottili (eco del waveform) come texture
per hero/divider — usali con parsimonia, mai come sfondo di default.

---

## Token (semantico → valore)

Definiti in `app/globals.css` (`@theme`). Usali via classi Tailwind (`bg-primary`,
`text-muted-foreground`, `border-border`, …) — **mai hex hardcoded**.

- `primary` = sage `#A3B7B7` · hover `#B4C6C6` · active `#90A6A6` · on-primary `#151515`
- `background` `#151515` · `card` `#1C1C1C` · `popover` `#232323` · `border` `#2C2C2C` · `input` `#3A3A3A`
- `foreground` `#F2F3EE` · `muted-foreground` `#7D7D7B`
- `success` `#6E9A7B` · `warning` `#C9A15A` · `destructive` `#B4614B`
- podio: `--color-gold` (= sage) · `--color-silver` `#B7B7B5` · `--color-bronze` `#B0794E`
- font: `--font-sans` (Helvetica Neue) · `--font-mono` (Monument Semi-Mono)
- radius: `--radius-sm 4` · `md 6` · `lg 10` (tienili piccoli)
- utility `.num` = Helvetica Neue 800/900, tracking -0.03em, tabular — per tutti i numeri grossi

---

## Pattern ricorrenti

- **Kicker/eyebrow**: `font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground`.
- **Metadati evento** (label-run): coppie label/valore in mono, separate da `·` — es.
  `FRIDAY · KINDERGARTEN · 18+ · 23.59 — LATE`. Ricalca i flyer reali.
- **Tap target mobile ≥ 44px** (48–52px per input rapidi alla porta).
- **Stati lead** → `<Badge>` con tono: Nuovo=sage, In lista/Confermato=success,
  Da ricontattare=warning, Perso=danger, Bozza=neutral.
- **Running order** → `<Tag>` Warm up / Main / Closing / B2B.
- **Vocabolario reale** (usalo nei sample data): Kindergarten (Via Alfredo Calzoni, Bologna),
  door 23:59, 18+, RSVP, warm up → main → closing.

---

## File map

```
CLAUDE.md                 questo file (regole — Claude Code lo carica in auto)
COMPONENTS.md             API + prompt d'uso di OGNI componente
restore-extensions.sh     toglie il suffisso .txt dai sorgenti
app/globals.css           @theme token + base layer  (import in layout.tsx)
app/metadata.ts           metadata PWA + viewport     (spread in layout.tsx)
lib/cn.ts                 helper classnames
components/ui/             primitive Base UI: button, badge, card, tabs, switch, progress
components/pr-hub/         composite: logo, dashboard-header, stat-card, rank-list,
                           number-stepper, segmented-toggle
public/brand/             logo ufficiali (bianco)
public/icons/ · manifest.webmanifest   app icon PWA (waveform su ink)
preview/                  anteprima.html (4 schermate) + componenti.html (specimen)
```

Le anteprime in `preview/` sono statiche (solo per vedere il design) — non fanno parte
del codice dell'app.
