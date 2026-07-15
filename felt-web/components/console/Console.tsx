"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowSquareOut,
  ArrowUpRight,
  CircleNotch,
  Plus,
  Sparkle,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";
import { ReadCard } from "@/components/console/ReadCard";
import type { Direction, GenerateReadOutput, PairMemory } from "@/lib/engine/types";
import { cn } from "@/lib/utils";

type EngineStatus = { provider: string; model: string; dryRun: boolean };

// Mirror of slugifyPair on the server, so the UI can match typed names to an
// existing pair before the first request.
function slugifyPair(manager: string, report: string): string {
  const s = (v: string) =>
    v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "x";
  return `${s(manager)}__${s(report)}`;
}

function trailing(dirs: Direction[], target: Direction): number {
  let n = 0;
  for (let i = dirs.length - 1; i >= 0; i--) {
    if (dirs[i] === target) n++;
    else break;
  }
  return n;
}

const SAMPLE = `[00:40] Andrew: How are you finding the new scope so far?
[00:55] Daniel: Honestly, it's a lot. Still finding my feet.
[01:10] Andrew: Walk me through what's actually on your plate right now.
[01:22] Daniel: The migration, the on-call rotation, and now the new dashboards. It keeps stacking up.
[06:10] Andrew: Right, but that's just how the timeline works, so we'll make it happen.
[06:24] Daniel: ...Sure. Okay.
[10:30] Daniel: I guess it's fine.
[11:30] Andrew: Anyway — you've got this.
[11:38] Daniel: Thanks. I think we're good, right?`;

const dirChip = {
  up: { Icon: ArrowUpRight, cls: "text-positive" },
  down: { Icon: ArrowDownRight, cls: "text-danger" },
  steady: { Icon: ArrowRight, cls: "text-muted" },
} as const;

export function Console() {
  const [engine, setEngine] = useState<EngineStatus | null>(null);
  const [pairs, setPairs] = useState<PairMemory[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [manager, setManager] = useState("");
  const [report, setReport] = useState("");
  const [pronoun, setPronoun] = useState("");
  const [transcript, setTranscript] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateReadOutput | null>(null);

  // Load engine status + existing pairs, and restore the last manager name.
  useEffect(() => {
    fetch("/api/engine").then((r) => r.json()).then(setEngine).catch(() => {});
    refreshPairs();
    const savedManager = localStorage.getItem("felt-console-manager");
    // Restored post-mount (not lazy init) so SSR and first client render agree.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedManager) setManager(savedManager);
  }, []);

  useEffect(() => {
    if (manager.trim()) localStorage.setItem("felt-console-manager", manager.trim());
  }, [manager]);

  async function refreshPairs() {
    try {
      const data = await fetch("/api/pairs").then((r) => r.json());
      setPairs(data.pairs ?? []);
    } catch {
      /* leave pairs as-is */
    }
  }

  // The pair the typed names currently resolve to (existing history), if any.
  const matchedPair = useMemo(() => {
    if (!manager.trim() || !report.trim()) return null;
    const id = slugifyPair(manager, report);
    return pairs.find((p) => p.pairId === id) ?? null;
  }, [manager, report, pairs]);

  const history = result?.pair ?? matchedPair;
  const priorSessions = matchedPair?.sessions ?? [];
  const sessionNumber = priorSessions.length + 1;
  const coolingStreak = trailing(priorSessions.map((s) => s.direction), "down");
  const warmingStreak = trailing(priorSessions.map((s) => s.direction), "up");

  function selectPair(p: PairMemory) {
    setSelectedId(p.pairId);
    setManager(p.managerName);
    setReport(p.reportName);
    setPronoun(p.reportPronoun ?? "");
    setResult(null);
    setError(null);
  }

  function newRelationship() {
    setSelectedId(null);
    setReport("");
    setPronoun("");
    setResult(null);
    setError(null);
  }

  async function generate() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/read", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          transcript,
          managerName: manager.trim(),
          reportName: report.trim(),
          reportPronoun: pronoun.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong.");
      setResult(data as GenerateReadOutput);
      setSelectedId((data as GenerateReadOutput).pair.pairId);
      refreshPairs();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const canRun = manager.trim() && report.trim() && transcript.trim().length >= 40 && !loading;

  return (
    <div data-theme="light" className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-background/85 px-5 py-3 backdrop-blur sm:px-8">
        <Link href="/app" className="flex items-center" aria-label="felt.">
          <span className="text-[19px] font-semibold tracking-[-0.03em]">
            felt<span className="text-accent">.</span>
          </span>
        </Link>
        <span className="rounded-full border border-line bg-surface px-2.5 py-0.5 text-[11px] font-medium text-ink-soft">
          Console
        </span>

        <div className="ml-auto flex items-center gap-3">
          {engine && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                engine.dryRun
                  ? "border-warn/30 bg-warn-soft text-warn"
                  : "border-positive/30 bg-positive-soft text-positive",
              )}
              title={`${engine.provider} · ${engine.model}`}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", engine.dryRun ? "bg-warn" : "bg-positive")} />
              {engine.dryRun ? "Dry run — no key" : `Live · ${engine.provider}`}
            </span>
          )}
          <Link
            href="/"
            className="hidden items-center gap-1.5 text-xs text-muted transition hover:text-foreground sm:flex"
          >
            <ArrowSquareOut size={13} /> Site
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-6 lg:grid-cols-[300px_minmax(0,1fr)] sm:px-8">
        {/* ── Left rail: relationships ─────────────────────────────── */}
        <aside className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              Relationships
            </span>
            <button
              type="button"
              onClick={newRelationship}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-ink-soft transition hover:text-foreground"
            >
              <Plus size={13} weight="bold" /> New
            </button>
          </div>

          {pairs.length === 0 ? (
            <p className="rounded-lg border border-dashed border-line px-3 py-4 text-xs leading-relaxed text-muted">
              No relationships yet. Add a manager and a report on the right, paste a transcript, and
              run your first Read.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {pairs.map((p) => {
                const last = p.sessions[p.sessions.length - 1]?.direction ?? "steady";
                const C = dirChip[last];
                const on = selectedId === p.pairId;
                return (
                  <li key={p.pairId}>
                    <button
                      type="button"
                      onClick={() => selectPair(p)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition",
                        on
                          ? "border-accent/40 bg-accent-soft"
                          : "border-line bg-surface hover:border-line-strong",
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {p.reportName}
                        </p>
                        <p className="truncate text-[11px] text-muted">
                          {p.sessions.length} session{p.sessions.length === 1 ? "" : "s"} · with{" "}
                          {p.managerName}
                        </p>
                      </div>
                      <C.Icon size={15} weight="bold" className={C.cls} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        {/* ── Main: input + result ─────────────────────────────────── */}
        <main className="min-w-0 space-y-6">
          {/* Input card */}
          <section className="felt-card rounded-2xl p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_120px]">
              <Field label="Manager">
                <input
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  placeholder="e.g. Andrew"
                  className={inputCls}
                />
              </Field>
              <Field label="Report">
                <input
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  placeholder="e.g. Daniel"
                  className={inputCls}
                />
              </Field>
              <Field label="Pronoun">
                <input
                  value={pronoun}
                  onChange={(e) => setPronoun(e.target.value)}
                  placeholder="he / she / they"
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Incoming-context hint */}
            {manager.trim() && report.trim() && (
              <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted">
                <span className="font-medium text-ink-soft">
                  Session {sessionNumber} with {report.trim()}
                </span>
                {sessionNumber === 1 ? (
                  <span>· cold start — no pattern yet, so no streak or mirror line</span>
                ) : (
                  <>
                    {coolingStreak >= 1 && (
                      <span className="text-danger">· cooling {coolingStreak} in a row</span>
                    )}
                    {warmingStreak >= 1 && (
                      <span className="text-positive">· warming {warmingStreak} in a row</span>
                    )}
                    <span>· cross-session memory is on</span>
                  </>
                )}
              </p>
            )}

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  Transcript
                </span>
                <button
                  type="button"
                  onClick={() => setTranscript(SAMPLE)}
                  className="text-[11px] text-accent transition hover:text-accent-strong"
                >
                  Load sample
                </button>
              </div>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={12}
                placeholder={
                  "Paste the 1:1 transcript here.\nSpeaker labels and timestamps help but aren't required — e.g.\n[06:10] Andrew: That's just how the timeline works.\n[06:24] Daniel: ...Sure."
                }
                className="w-full resize-y rounded-xl border border-line bg-bg-alt px-3.5 py-3 font-mono text-[13px] leading-relaxed text-foreground outline-none transition placeholder:text-muted/70 focus:border-accent/50 focus:bg-surface"
              />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={generate}
                disabled={!canRun}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-[color:var(--on-accent)] outline-none transition hover:bg-accent-strong focus-visible:ring-2 focus-visible:ring-accent/50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <CircleNotch size={16} weight="bold" className="animate-spin" /> Reading…
                  </>
                ) : (
                  <>
                    <Sparkle size={16} weight="fill" /> Generate the Read
                  </>
                )}
              </button>
              {engine?.dryRun && (
                <span className="text-[12px] text-muted">
                  Dry run — add a key in <code className="text-ink-soft">.env.local</code> for a real Read.
                </span>
              )}
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm text-foreground">
                <WarningCircle size={16} weight="fill" className="mt-0.5 shrink-0 text-danger" />
                <span>{error}</span>
              </div>
            )}
          </section>

          {/* Result */}
          {result ? (
            <ReadCard result={result} />
          ) : (
            <section className="rounded-2xl border border-dashed border-line px-6 py-14 text-center">
              <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
                The Read appears here — a short coach-voice paragraph on how the manager landed, one
                direction arrow, and the evidence behind it. Paste a transcript and generate.
              </p>
            </section>
          )}

          {/* Cross-session memory strip */}
          {history && history.sessions.length > 0 && (
            <section>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                History · {history.reportName}
              </span>
              <ul className="mt-2 space-y-1.5">
                {[...history.sessions].reverse().map((s) => {
                  const C = dirChip[s.direction];
                  return (
                    <li
                      key={s.id}
                      className="flex items-start gap-3 rounded-lg border border-line bg-surface px-3.5 py-2.5"
                    >
                      <C.Icon size={15} weight="bold" className={cn("mt-0.5 shrink-0", C.cls)} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] leading-snug text-ink-soft">{s.summary}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-muted">
                          session {s.session} · {new Date(s.date).toLocaleDateString()} ·{" "}
                          {s.directionLabel}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-line bg-bg-alt px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-accent/50 focus:bg-surface";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
