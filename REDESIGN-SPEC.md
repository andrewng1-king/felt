# felt. — /app Redesign Spec (locked, v2 — "light-first, Vercel-calm")

> **HOW TO USE THIS:** Paste into a new Claude Code chat and say "continue the felt
> redesign — build it." Everything below is decided. Recommended start = **tokens → Overview**.

**Date locked:** 2026-07-09 · **App:** `felt-web/` (the `/app` platform demo) · **Audience:** VC / design-partner / investor showcase.

> **This supersedes the earlier "dense ops-grid, near-black, Switzer" spec.** After a taste
> interview + an approved Overview sketch, the direction flipped: **calm & expensive, light-first,
> spacious, Vercel-style typography.** Where the old spec conflicts, this wins.

---

## The taste (north star)
- **Feeling:** calm & expensive — NOT an ops command-center. References: **Stripe · Vercel · Superhuman · Notion**.
- **Win condition:** a VC thinks "this team can really build" *and* "I get it instantly" — craft + clarity.
- **"Expensive" = space + typography + smooth motion.** NOT depth/material (stays flat & clean).
- **Never:** gray box soup · loud gradients/glows/glass · cramped clutter · generic icons & charts.

## Locked decisions
- **Theme:** **light-first, cool clean white** (Vercel), dark as a toggle option. Flat — no glow/glass/heavy shadow.
- **Type:** **Geist Sans** (UI + big tabular numbers) + **Geist Mono** (numbers/deltas/axis ONLY — never on reading text). Drop Switzer in /app.
- **Color:** near-monochrome. Orange `#e8703a` = the disciplined **guide** (brand/interactive). Semantic status **muted & minimal**. **Only red / amber / green — no blue.** "Watch" folds into amber.
- **Layout:** full app shell (sidebar + content using the **whole screen width**, no centered column). Spacious, fewer-bigger. **Mixed containers** — hero blocks in soft rounded cards, supporting data floats with hairline dividers. Rounded cards + tight/snappy controls.
- **Charts:** clean **spaced bars** (rounded-top, real gaps), Vercel-Analytics style. Rich hover summary (week + value + delta + sessions).
- **Status language:** **NO colored dots.** Needs-attention → Vercel-style **status icon + short colored word** (Critical / Warning / Watch). Recent conversations → **small text pills** (Warming / Cooling / Steady). Duration lives in the meta line, never far-right.
- **Motion:** quick & snappy (~200ms), one-time (count-ups, one draw-in, hover lift). NO loops (remove the infinite red down-sparkline pulse). Reduced-motion → static.

---

## Section A — Overview (`HomeView.tsx`) — the approved sketch
- **Header:** quiet. "Overview" title + "Good afternoon, Andrew" muted. Date range chip right. No prose H1, no per-tile hint sentences.
- **KPI row:** airy, 4 across, **hairline dividers, no boxes.** Big Geist number + label + a mono **delta chip** (▲/▼ + "vs last month"). Deltas colored by good/bad, not direction.
- **Hero card — Team health:** one big card, 8-week **spaced bars** (avg warmth), current week in accent, rest neutral. Big "72%" read + one-line caption. Hover a bar → summary (week · `72% ▲2` · N sessions). Under it: a **muted risk-mix** legend (status icons + counts, red/amber/green only).
- **Recent conversations:** airy list. `avatar · name · [team · session · duration] · status pill · → `. The **pill replaces the old direction prose.**
- **Needs attention (right):** summary counts (icons) → severity-ranked rows: **status icon + name + colored severity word + short reason + optional sparkline.** Critical leads by **position + weight**, not a loud red block.
- **Prepare card:** soft card, "before your next 1:1 — Rehearse with Daniel →".

## Section B — Conversations (`ConversationsView.tsx`)
- Left master list → **4 collapsible team groups**: Engineering (Daniel · Elena · Sam) · Product (Priya) · Design (Marcus) · Data (Nadia). Group header: team · count · severity rollup (icon + count). Person rows: avatar + name + status pill (no dots).
- Right detail pane unchanged (report + session switcher).

## Section C — Cross-app
- One vocabulary everywhere: status icons + pills + sparklines + mono delta chips. No dots, no blue.
- Every view inherits the light theme via tokens; spot-fix any hardcoded dark-only assumptions.

---

## Implementation (files + order)

**Order:** tokens/fonts → data → primitives → Overview → verify → Conversations → verify.

### 1. `app/globals.css`
- Redefine `[data-theme="light"]` → **cool clean white** (bg `#fafafa`, surface `#fff`, ink `#0a0a0a`, muted `#8f8f8f`, line `#ececec`). This becomes the /app default.
- Point `--app-sans` → `--font-geist-sans`, `--app-mono` → `--font-geist-mono`, `--app-serif` → Geist, in BOTH `[data-theme="light"]` and `[data-theme="night"]`.
- Cool the `night` (dark) ramp to a cool near-black (`#0a0a0b` base) so the dark option matches the sketch.

### 2. `Shell.tsx`
- Default theme = **light** (`data-theme="light"`), dark ("night") is the toggle. Palette switcher keeps working.
- Content area: keep the sidebar; let the content fill full width (no artificial max-w centering on Overview).

### 3. Data — `content/platform.ts`
- `RosterEntry.team: "Engineering" | "Product" | "Design" | "Data"` — Eng: daniel/elena/sam · Product: priya · Design: marcus · Data: nadia.
- `teamHealth: { label: string; value: number; sessions: number }[]` — 8 weekly points (0–1), net UP but dragged by Daniel; sessions consistent with `weekly`.
- `kpiDeltas: { sessions; minutes; peopleCovered; cadenceDays }` — signed MoM deltas (e.g. +2 / +18 / +1 / −2).
- Risk-mix derives from `signals`: **1 critical · 2 warning · 2 watch · 2 positive**.

### 4. Primitives
- `severity.tsx`: **watch color info→warn** (amber). `severityMeta` gains a Vercel-style **status icon** (ringed dot). Keep `StatusPill`, `SeveritySummary`, `bySeverity`, `countBySeverity`.
- `bits.tsx`: remove the infinite red pulse on down-sparklines (keep one-time draw-in). Add `DirectionPill` (Warming/Cooling/Steady). `DirectionBadge` retained for other views but recolored (already red/green/steady).
- `ui.tsx`: `StatTile` → airy variant with a `delta` chip, drop reliance on `hint`. New `TeamHealthBars` (spaced bars + rich hover tooltip). `WeekBars` retired on Home.

### 5. `HomeView.tsx` — rebuild per Section A.
### 6. `ConversationsView.tsx` — group roster by `team`, collapsible + severity rollups.

### 7. Verify
- `npm run build` clean (TS + routes prerender), `npm run lint` clean (pre-existing Pillars/Metrics warnings OK).
- Headless screenshot gotcha: mount animation sets `initial opacity 0` — force reduced motion when capturing (`--force-prefers-reduced-motion` or CDP `Emulation.setEmulatedMedia prefers-reduced-motion=reduce`).

## Design tokens already in place (don't reinvent)
- Themes scoped by `data-theme` on the Shell wrapper; fonts indirected via `--app-sans/serif/mono`. Change values, not components.
- Semantic scale `--danger/--warn/--positive` (each `-soft`). `--info` (blue) is being retired from /app usage.
- Utilities `.felt-card`, `.felt-card-pop`. Severity helpers in `components/platform/severity.tsx`.

## Approved sketch
Light-first Overview mockup (real Geist, full shell, status icons + pills): the design this spec encodes.
