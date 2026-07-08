# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Repo layout

The git repo root is `felt/`; the shippable app is this `felt-web/` Next.js project. The repo root also holds non-code marketing artifacts (`felt-one-pager-v4.md`, `founding-circle-landing.html`, `memory.md`) — these are copy/strategy sources, not part of the build. **Run all commands from `felt-web/`.**

## Stack & versions (read before writing code)

Next.js **16.2.10** (App Router) + React **19.2.4** + Tailwind CSS **v4** + TypeScript (strict). These are ahead of common training data — as `AGENTS.md` warns, APIs and conventions differ, so consult `node_modules/next/dist/docs/` before writing framework code rather than assuming older Next/React behavior.

Notable choices: `motion` (the `motion/react` package, successor to Framer Motion) for animation; `@phosphor-icons/react` for icons (imported from `@phosphor-icons/react/dist/ssr`); Tailwind v4 via `@tailwindcss/postcss` (no `tailwind.config.js` — theme lives in CSS, see below). Path alias `@/*` → `felt-web/*`.

## Commands

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # eslint (flat config, eslint.config.mjs)
```

There is no test suite configured. Verify changes by running the app and exercising the affected route.

## Routes

App Router pages under `app/`:
- `/` (`app/page.tsx`) — marketing landing; composes `components/sections/*` in order.
- `/app` (`app/app/page.tsx`) — the interactive **platform demo**, rendered by `components/platform/Shell.tsx`.
- `/demo` (`app/demo/page.tsx`) and `/pricing` (`app/pricing/page.tsx`).

## Architecture

**Content-as-data.** All copy and demo data live in `content/*.ts`, separate from the components that render them: `content/site.ts` (marketing copy), `content/platform.ts`, `content/demo.ts`. `content/platform.ts` is a *hand-authored, internally-consistent* scripted dataset — Andrew's 1:1 history across two relationships (Daniel declining → risk alert, Priya improving → streak). Trends, reminders, and risk are derived by hand from the per-session reads, not computed. When editing demo data, keep the whole narrative consistent (and note the rule in that file: no 0–100 grades anywhere).

**The platform demo is one client component tree.** `Shell.tsx` (`"use client"`) owns view state (`home | conversations | report | risk`), switches between `components/platform/{HomeView,ConversationsView,ReportView,RiskTrendsView}`, animates transitions with `motion`, and persists the demo palette to `localStorage` (restored in an effect, not lazy init, to avoid SSR hydration mismatch). Shared platform primitives live in `components/platform/{bits,ui}.tsx`.

**Component groups:** `components/sections/` (marketing landing sections), `components/platform/` (the `/app` demo), `components/demo/`, `components/ui/` (reusable bits like `Button`, `Reveal`, `ScrollZoom`), plus top-level `Nav`/`Footer`/`EmpathyMirror`/`PlatformPreview`.

**Theming is the load-bearing system — all in `app/globals.css`.** One CSS custom-property token set drives everything through Tailwind v4's `@theme inline` (so tokens become utilities like `bg-surface`, `text-ink-soft`, `border-line`). Themes are **scoped by data attribute on a wrapper**, not a global toggle:
- `:root` — the marketing/site theme: warm light "paper" with frosted `.glass` cards and a fine grain overlay (`body::before`).
- `[data-theme="night"]` — the `/app` demo: **flat near-black SaaS**, a single warm-orange accent, no glass/glow/grain; elevation comes from surface lightness + hairline borders only.
- `[data-accent="ember|signal|orchid|mono"]` — palette presets that override *only* the accent tokens on the near-black base (the demo's `PaletteSwitcher`).
- `[data-theme="light"]` — an alternate flat light app theme.

Type is indirected through `--app-sans/serif/mono` so a scoped theme swaps the entire font stack without touching component classes: the site uses Geist + Newsreader (serif display for emotional headlines/wordmark); the flat app collapses everything to **Switzer**. All four font families are self-hosted `.woff2` under `app/fonts/` via `next/font/local` for hermetic builds — do not add build-time external font fetches. Use `cn()` from `lib/utils.ts` to compose class strings.
