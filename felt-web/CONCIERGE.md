# felt. — the concierge Read engine

This is the **v1 that actually works**: paste a real 1:1 transcript, get a real
Read in felt.'s voice. It's the tool that powers the hand-run Telestar Reads —
not the self-serve SaaS. Build order and altitude are deliberate: prove the Read
lands before investing in accounts, billing, integrations, or org dashboards.

Everything here lives inside the existing `felt-web/` app and is separate from
the `/app` VC demo (which is still scripted data).

## What it does

- **`/console`** — the founder's tool. Pick a manager↔report pair, paste a
  transcript, generate The Read (guaranteed win → impact read → one direction
  arrow), with the evidence behind "see detail".
- **Cross-session memory** — every Read is saved per pair under `.felt-data/`.
  The next Read for the same pair gets that history, so it can surface streaks
  and Mirror-Rule pattern lines. The counts behind "N of the last M" are computed
  **in code**, not by the model — that's what keeps them honest.

## Setup (5 minutes)

1. Get a free **Gemini** key: https://aistudio.google.com/apikey
2. Create your env file and paste the key in:
   ```
   cd felt-web
   copy .env.local.example .env.local      # (windows)   or: cp … (mac/linux)
   # edit .env.local -> GEMINI_API_KEY=your_key
   ```
3. Run it:
   ```
   npm install
   npm run dev
   ```
4. Open **http://localhost:3000/console**, click **Load sample**, and Generate.

No key yet? It runs in **dry-run** — the flow works and returns a shaped
placeholder Read so you can see the interface before wiring a provider.

Want the best voice for the real 5 Reads? Set `FELT_PROVIDER=anthropic` and
`ANTHROPIC_API_KEY=…` (optionally `FELT_MODEL=claude-opus-4-8`). One env change,
no rebuild.

## The two files that ARE the product

The UI is just a window. felt.'s IP is the voice, and it lives in two places
you should own and iterate on:

- **`lib/engine/prompt.ts`** — the rules: the impact reframe, the Mirror-Rule
  grammar, "name the cost / don't ask", the guaranteed win, the hard nevers, and
  the output schema.
- **`lib/engine/examples.ts`** — the gold few-shot examples the model learns the
  voice from. **This is the highest-leverage tuning surface.** When a live Read
  comes back slightly off, fix it here (or add an example) rather than fighting
  the rules. Aim for the one-pager's "15–20 example lines": cold-start, warming
  streak, a cost/regression with the "unless you" line, and a low-signal "all
  good" session. All four shapes are now seeded (Examples A–D); keep adding
  toward 15–20 — that's your taste, encoded.

## How to run the 5 Reads (the actual next business step)

1. Take a real Telestar 1:1 transcript (you're a party to it — the defensible
   case). Lightly anonymize names if you like.
2. Run it through `/console`. Read the output as the manager would.
3. The bar isn't "is it accurate?" — it's **"does it make the manager flinch?"**
   If not, the fix is almost always in `examples.ts`.
4. Run several for the same person over a couple of weeks so the cross-session
   memory (streaks, the mirror line) actually has something to reflect.

The two questions this is here to answer, from the one-pager:
**do managers pull it themselves, and does anyone come back unprompted?**

## Privacy note

Live transcripts contain real employee data. `.felt-data/` is gitignored so it
never lands in the repo. Delete a pair by deleting its JSON file under
`.felt-data/pairs/`. This tool reads text only — it does not record or analyse
audio.

## Architecture (one glance)

```
lib/engine/
  types.ts      shared types (ReadResult, PairMemory, PatternFacts…)
  config.ts     provider/model/key from env (model-agnostic)
  prompt.ts     felt.'s voice + rules + output schema      ← core IP
  examples.ts   gold few-shot examples                     ← core IP, edit me
  providers.ts  gemini / groq / anthropic + dry-run stub
  memory.ts     per-pair JSON store + code-computed facts
  engine.ts     generateRead(): orchestration + rule enforcement
app/api/
  read/         POST transcript+pair -> Read
  pairs/        GET all pairs + history
  engine/       GET provider/model/dry-run status
app/console/    the tool  ·  components/console/*
```
