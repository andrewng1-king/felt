"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MagnifyingGlass, Funnel, ChatCircle, Target, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { Avatar, Sparkline } from "@/components/platform/bits";
import { StatusPill, StatusIcon } from "@/components/platform/severity";
import { ReportView } from "@/components/platform/ReportView";
import {
  activity,
  conversations,
  reportTrends,
  prepScenarios,
  type RosterEntry,
  type ReportId,
  type Severity,
  type Team,
} from "@/content/platform";

type Sort = "attention" | "recent" | "name";

const TEAM_ORDER: Team[] = ["Engineering", "Product", "Design", "Data"];

const isAttention = (p: RosterEntry) => p.overdue || p.trend === "down";

/** Person → severity + a human status label (drives the pill; no dots). */
function personStatus(p: RosterEntry): { severity: Severity; label: string } {
  if (p.trend === "down") return { severity: "critical", label: "Risk" };
  if (p.overdue) return { severity: "warning", label: "Overdue" };
  if (p.trend === "up") return { severity: "positive", label: "On track" };
  return { severity: "watch", label: "Watch" };
}

const convosFor = (reportId?: string) =>
  reportId ? conversations.filter((c) => c.reportId === reportId) : [];

export function ConversationsView({
  onOpenConvo,
  onOpenPrepare,
}: {
  onOpenConvo: (id: string) => void;
  onOpenPrepare: (id: ReportId) => void;
}) {
  const roster = activity.roster;
  const [selectedId, setSelectedId] = useState(roster[0].id);
  const [convoId, setConvoId] = useState<string | null>(() => {
    const cvs = convosFor(roster[0].reportId);
    return cvs.length ? cvs[cvs.length - 1].id : null;
  });
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("attention");
  const [needsOnly, setNeedsOnly] = useState(false);
  const [collapsed, setCollapsed] = useState<Partial<Record<Team, boolean>>>({});

  const selected = roster.find((p) => p.id === selectedId)!;
  const personConvos = convosFor(selected.reportId);
  const convo = personConvos.find((c) => c.id === convoId) ?? null;

  const list = useMemo(() => {
    let r = roster.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));
    if (needsOnly) r = r.filter(isAttention);
    return [...r].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "recent") return a.daysSince - b.daysSince;
      const fa = isAttention(a) ? 0 : 1;
      const fb = isAttention(b) ? 0 : 1;
      return fa - fb || b.daysSince - a.daysSince;
    });
  }, [roster, query, needsOnly, sort]);

  // Group the (already filtered + sorted) list into the four teams.
  const groups = TEAM_ORDER.map((team) => ({
    team,
    members: list.filter((p) => p.team === team),
  })).filter((g) => g.members.length > 0);

  function selectPerson(p: RosterEntry) {
    setSelectedId(p.id);
    const cvs = convosFor(p.reportId);
    setConvoId(cvs.length ? cvs[cvs.length - 1].id : null);
  }

  return (
    <div className="w-full px-5 py-6 sm:px-8 lg:px-10">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-muted sm:max-w-xs">
          <MagnifyingGlass size={15} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people…"
            className="min-w-0 flex-1 bg-transparent text-foreground placeholder:text-muted focus:outline-none"
          />
        </label>
        <button
          type="button"
          onClick={() => setNeedsOnly((v) => !v)}
          className={[
            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-accent/50",
            needsOnly
              ? "border-accent/50 bg-accent-soft text-accent"
              : "border-line bg-surface text-ink-soft hover:text-foreground",
          ].join(" ")}
        >
          <Funnel size={14} weight={needsOnly ? "fill" : "regular"} /> Needs attention
        </button>
        <div className="flex items-center overflow-hidden rounded-lg border border-line bg-surface text-sm">
          {(["attention", "recent", "name"] as Sort[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSort(s)}
              className={[
                "px-3 py-1.5 capitalize outline-none transition focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50",
                sort === s ? "bg-surface-2 font-medium text-foreground" : "text-muted hover:text-foreground",
              ].join(" ")}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[300px_1fr]">
        {/* Master: grouped people list */}
        <aside className="space-y-4">
          {groups.map((g) => {
            const open = !collapsed[g.team];
            // Group severity rollup — most-severe attention first.
            const counts: Partial<Record<Severity, number>> = {};
            g.members.forEach((p) => {
              const s = personStatus(p).severity;
              counts[s] = (counts[s] ?? 0) + 1;
            });
            const rollup = (["critical", "warning", "watch"] as Severity[]).filter((s) => counts[s]);
            return (
              <div key={g.team}>
                <button
                  type="button"
                  onClick={() => setCollapsed((c) => ({ ...c, [g.team]: open }))}
                  aria-expanded={open}
                  className="flex w-full items-center gap-2 px-1.5 py-1.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                  <CaretRight
                    size={13}
                    weight="bold"
                    className={`text-muted transition-transform ${open ? "rotate-90" : ""}`}
                  />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-soft">{g.team}</span>
                  <span className="font-mono text-[11px] tabular-nums text-muted">{g.members.length}</span>
                  <span className="ml-auto flex items-center gap-2">
                    {rollup.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1">
                        <StatusIcon severity={s} />
                        <span className="font-mono text-[11px] tabular-nums text-muted">{counts[s]}</span>
                      </span>
                    ))}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1 pt-1">
                        {g.members.map((p) => {
                          const on = p.id === selectedId;
                          const st = personStatus(p);
                          const trend = reportTrends[p.id as keyof typeof reportTrends];
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => selectPerson(p)}
                              aria-current={on ? "true" : undefined}
                              className={[
                                "group relative flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-accent/50",
                                on
                                  ? "border-line-strong bg-surface-2"
                                  : "border-transparent hover:border-line hover:bg-surface",
                              ].join(" ")}
                            >
                              {on && (
                                <span
                                  className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-accent"
                                  aria-hidden
                                />
                              )}
                              <Avatar initials={p.initials} />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                                <div className="mt-1 flex items-center gap-1.5">
                                  <StatusPill severity={st.severity} label={st.label} />
                                  <span className="truncate text-[11px] text-muted">{p.lastMetLabel}</span>
                                </div>
                              </div>
                              {trend ? (
                                <Sparkline points={trend.points} direction={trend.dir} />
                              ) : (
                                <span className="font-mono text-[11px] tabular-nums text-muted">{p.sessions}×</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          {groups.length === 0 && (
            <p className="rounded-xl border border-line bg-surface px-4 py-6 text-center text-sm text-muted">
              No one matches.
            </p>
          )}
        </aside>

        {/* Detail: selected person */}
        <section className="felt-card min-w-0 rounded-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5 sm:px-6">
            <div className="flex items-center gap-2.5">
              <Avatar initials={selected.initials} />
              <div>
                <p className="text-sm font-semibold text-foreground">{selected.name}</p>
                <p className="font-mono text-[11px] tabular-nums text-muted">
                  {selected.role}
                  {convo && ` · S${convo.session} · ${convo.dateLabel} · ${convo.duration}`}
                </p>
              </div>
            </div>
            {personConvos.length > 0 && (
              <div className="flex flex-wrap items-center gap-1">
                {selected.reportId && prepScenarios[selected.reportId] && (
                  <>
                    <button
                      type="button"
                      onClick={() => onOpenPrepare(selected.reportId!)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 text-xs font-medium text-ink-soft outline-none transition hover:border-line-strong hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50"
                    >
                      <Target size={13} weight="fill" className="text-accent" /> Rehearse
                    </button>
                    <span className="mx-1 hidden h-4 w-px bg-line sm:block" aria-hidden />
                  </>
                )}
                <span className="mr-1 text-[11px] uppercase tracking-[0.1em] text-muted">Sessions</span>
                {personConvos.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setConvoId(c.id)}
                    className={[
                      "rounded-md px-2 py-1 font-mono text-xs font-medium tabular-nums outline-none transition focus-visible:ring-2 focus-visible:ring-accent/50",
                      convoId === c.id ? "bg-accent text-[color:var(--on-accent)]" : "bg-surface-2 text-ink-soft hover:text-foreground",
                    ].join(" ")}
                  >
                    S{c.session}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => convo && onOpenConvo(convo.id)}
                  className="ml-1 rounded-md px-2 py-1 text-xs text-muted outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                  Full view
                </button>
              </div>
            )}
          </div>

          {convo ? (
            <ReportView key={convo.id} convo={convo} embedded />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-20 text-center">
              <ChatCircle size={30} className="text-muted" />
              <p className="text-sm font-medium text-foreground">No analyzed 1:1s yet for {selected.name}</p>
              <p className="max-w-xs text-sm text-ink-soft">
                Last met {selected.lastMetLabel}. Record your next 1:1 and felt. will read it here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
