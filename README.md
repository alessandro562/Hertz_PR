# hertz PR Hub — brand kit for the Next.js repo

Drop-in code applying the **hertz** design system to the PR Hub. Sage `#A3B7B7`
stays the primary (consistent with the design system) — no neon. Dark is the
default surface; a `.light` theme is included for day/print views.

Stack assumed: **Next.js (App Router) · Tailwind v4 (CSS-first) · Base UI**.

## What's here

```
app/globals.css                 @theme tokens (palette, radius, fonts) + base layer
app/metadata.ts.txt             PWA metadata + viewport (paste into layout.tsx)
lib/cn.ts.txt                   classnames helper (swap for your clsx+twMerge)
components/ui/                   Base UI primitives
  button · badge · card · tabs · switch · progress   (*.tsx.txt)
components/pr-hub/               product composites   (*.tsx.txt)
  logo                          OFFICIAL brand asset renderer — never redraw
  dashboard-header              top bar carrying the wordmark
  stat-card                     dashboard KPI unit (big Helvetica numeral)
  rank-list                     Classifiche podium (gold/silver/bronze, muted)
  number-stepper                fast numeric entry for event night
  segmented-toggle              compact view switcher
public/brand/                    official hertz logo files (white)
public/icons/ · manifest.webmanifest   PWA app icon (waveform mark on ink)
preview/anteprima.html           static visual preview of 4 screens
```

> **`.txt` suffix:** every `.ts`/`.tsx` source ships as `name.tsx.txt` so this
> design-system project's compiler leaves them alone. When copying into your
> repo, **strip the trailing `.txt`** (`button.tsx.txt` → `button.tsx`). Nothing
> else changes.

## Install

1. **Tailwind v4** — `@import "tailwindcss";` is already the first line of
   `globals.css`. No `tailwind.config.js` needed. Import the file once in
   `app/layout.tsx`.
2. **Fonts** — self-host the brand faces. Copy the `fonts/` files from the
   design system and add matching `@font-face` rules (Helvetica Neue 100–900 +
   italics; ABC Monument Grotesk Semi-Mono for the mono/label face). `globals.css`
   already declares `--font-sans` / `--font-mono` — point them at the loaded
   families.
3. **Base UI** — `npm i @base-ui-components/react`. `tabs` and `switch` import
   from it.
4. **Path alias** — components use `@/…`; keep the standard `"@/*": ["./*"]`
   in `tsconfig.json`.
5. **PWA** — copy `public/`, then spread `metadata` / `viewport` from
   `app/metadata.ts` in your root layout.

## The logo rule

Always render `components/pr-hub/logo.tsx` — it points at the official files in
`public/brand/`. **Never** re-typeset "hertz" or redraw the sine-wave mark by
hand. `variant`: `lockup` (mark over wordmark), `wordmark`, `mark` (app icon /
avatar). White assets ship for dark surfaces; add the black files to
`public/brand/` for light surfaces.

## Tokens (semantic → value)

- `primary` = sage `#A3B7B7` · hover `#B4C6C6` · active `#90A6A6`
- `background` `#151515` · `card` `#1C1C1C` · `border` `#2C2C2C`
- `success` `#6E9A7B` · `warning` `#C9A15A` · `destructive` `#B4614B`
- podium: `--color-gold` (= sage) · `--color-silver` `#B7B7B5` · `--color-bronze` `#B0794E`
- radius small (`--radius-lg` = 10px) — technical, nightlife feel
- `.num` utility = Helvetica Neue 800, tight tracking, tabular — for all scores/rankings

## Typography decision

Confirmed: **Helvetica Neue Bold/Black is enough** for large numerals — no
second display face. The `.num` class carries the weight + tracking.
