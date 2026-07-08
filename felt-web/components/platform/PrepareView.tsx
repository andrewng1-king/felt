"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Target,
  Check,
  Sparkle,
  ArrowClockwise,
  Play,
  Prohibit,
  WarningDiamond,
} from "@phosphor-icons/react/dist/ssr";
import { Avatar } from "@/components/platform/bits";
import {
  andrew,
  activity,
  reports,
  prepScenarios,
  type ReportId,
  type RosterEntry,
} from "@/content/platform";

/**
 * The "Before" act — rehearse the hard talk. Pick a person, read the Focus Brief
 * (pulled by hand from their history), then run a scripted role-play where felt.
 * voices the other person. Readiness is a qualitative state, never a grade.
 */
export function PrepareView({ initialPerson }: { initialPerson?: ReportId }) {
  const reduce = useReducedMotion();

  // Only people with real history + an authored scenario. Urgent (Daniel) first.
  const people = activity.roster
    .filter((r): r is RosterEntry & { reportId: ReportId } => Boolean(r.reportId && prepScenarios[r.reportId]))
    .sort((a, b) => Number(!!prepScenarios[b.reportId]?.urgent) - Number(!!prepScenarios[a.reportId]?.urgent));

  const [personId, setPersonId] = useState<ReportId>(
    initialPerson && prepScenarios[initialPerson] ? initialPerson : people[0].reportId,
  );
  const [started, setStarted] = useState(false);

  const scenario = prepScenarios[personId]!;
  const report = reports[personId];

  function selectPerson(id: ReportId) {
    setPersonId(id);
    setStarted(false);
  }

  const readyDelay = reduce ? 0 : scenario.script.length * 0.55 + 0.35;

  return (
    <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8 sm:py-8">
      <div className="max-w-2xl">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Before the 1:1</span>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Rehearse the hard talk before you walk in. felt. plays the other person from their history — so the
          first time you say it isn&apos;t to their face.
        </p>
      </div>

      {/* Person selector */}
      <div className="mt-5 flex flex-wrap gap-2">
        {people.map((p) => {
          const on = p.reportId === personId;
          const urgent = prepScenarios[p.reportId]?.urgent;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => selectPerson(p.reportId)}
              aria-pressed={on}
              className={[
                "group inline-flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-accent/50",
                on
                  ? "border-line-strong bg-surface-2 text-foreground"
                  : "border-line bg-surface text-ink-soft hover:text-foreground",
              ].join(" ")}
            >
              <Avatar initials={p.initials} size="sm" />
              <span className="font-medium">{p.name}</span>
              {urgent && (
                <WarningDiamond size={13} weight="fill" className="text-accent" aria-label="Needs attention" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Focus Brief */}
        <section className="space-y-5">
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <div className="flex items-center gap-2.5">
              <Target size={17} weight="fill" className="text-accent" />
              <h2 className="text-[15px] font-semibold tracking-tight text-foreground">Focus Brief</h2>
            </div>
            <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-foreground">
              {scenario.title}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{scenario.whyNow}</p>

            <div className="mt-5 space-y-3 border-t border-line pt-5">
              {scenario.focus.map((f, i) => (
                <div key={f.label} className="flex gap-3">
                  <span className="mt-0.5 text-xs font-medium tabular-nums text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{f.label}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{f.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested phrasing */}
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <h3 className="text-[13px] font-semibold tracking-tight text-foreground">Try this opener</h3>
            <p className="mt-3 flex items-start gap-2.5 rounded-xl bg-accent-soft/60 p-3.5 text-sm leading-relaxed text-foreground">
              <Check size={15} weight="bold" className="mt-0.5 shrink-0 text-accent-strong" />
              <span>&ldquo;{scenario.opener.good}&rdquo;</span>
            </p>
            <p className="mt-2.5 flex items-start gap-2.5 px-1 text-sm leading-relaxed text-muted">
              <Prohibit size={15} weight="bold" className="mt-0.5 shrink-0" />
              <span className="line-through decoration-muted/50">&ldquo;{scenario.opener.avoid}&rdquo;</span>
            </p>
          </div>
        </section>

        {/* Rehearsal */}
        <section className="rounded-2xl border border-line bg-surface">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft">
                <Sparkle size={13} weight="fill" className="text-accent" />
              </span>
              <h2 className="text-[15px] font-semibold tracking-tight text-foreground">Rehearsal</h2>
            </div>
            {started && (
              <button
                type="button"
                onClick={() => setStarted(false)}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                <ArrowClockwise size={13} /> Reset
              </button>
            )}
          </div>

          <div className="p-5 sm:p-6">
            {!started ? (
              <div className="flex flex-col items-start gap-4 py-6">
                <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
                  felt. will play <span className="font-medium text-foreground">{report.name}</span> as{" "}
                  {report.pronoun === "she" ? "she" : "he"} really shows up — guarded where{" "}
                  {report.pronoun === "she" ? "she" : "he"} was guarded. Say your opener out loud, then start.
                </p>
                <button
                  type="button"
                  onClick={() => setStarted(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-[color:var(--on-accent)] outline-none transition hover:bg-accent-strong focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                  <Play size={14} weight="fill" /> Start rehearsal
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {scenario.script.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: reduce ? 0 : i * 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className={line.role === "you" ? "flex flex-col items-end" : "flex flex-col items-start"}
                  >
                    <div className={`flex items-end gap-2 ${line.role === "you" ? "flex-row-reverse" : ""}`}>
                      {line.role === "you" ? (
                        <Avatar initials={andrew.initials} size="sm" accent />
                      ) : (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                          <Sparkle size={12} weight="fill" className="text-accent" />
                        </span>
                      )}
                      <div
                        className={[
                          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                          line.role === "you"
                            ? "rounded-br-sm bg-surface-2 text-foreground"
                            : "rounded-bl-sm border border-line bg-background text-foreground",
                        ].join(" ")}
                      >
                        {line.text}
                      </div>
                    </div>
                    {line.note && (
                      <p className="mt-1.5 max-w-[85%] pl-9 text-[11px] italic leading-relaxed text-muted">
                        {line.note}
                      </p>
                    )}
                  </motion.div>
                ))}

                {/* Readiness — appears after the script plays out */}
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: readyDelay, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-2 rounded-xl border border-accent/40 bg-accent-soft/60 p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-accent">
                      Readiness
                    </span>
                    <span className="text-sm font-semibold text-foreground">· {scenario.readiness.level}</span>
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {scenario.focus.map((f) => (
                      <span
                        key={f.label}
                        className="inline-flex items-center gap-1 rounded-full bg-background/60 px-2.5 py-1 text-[11px] text-ink-soft"
                      >
                        <Check size={11} weight="bold" className="text-accent-strong" />
                        {f.label}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground">{scenario.readiness.note}</p>
                </motion.div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
