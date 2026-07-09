"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import { Avatar, DirectionPill, Sparkline } from "@/components/platform/bits";
import { SectionHeader, DeltaChip } from "@/components/platform/ui";
import { TeamHealthBars } from "@/components/platform/charts";
import { AnimatedNumber } from "@/components/platform/AnimatedNumber";
import {
  StatusIcon,
  severityMeta,
  countBySeverity,
  bySeverity,
} from "@/components/platform/severity";
import {
  andrew,
  activity,
  teamHealth,
  conversations,
  reports,
  recentActivity,
  reportTrends,
  prepScenarios,
  signals,
  type ReportId,
  type Signal,
  type Team,
} from "@/content/platform";
import { cn } from "@/lib/utils";

export function HomeView({
  onOpenConvo,
  onOpenRisk,
  onOpenPrepare,
  onSignal,
}: {
  onOpenConvo: (id: string) => void;
  onOpenRisk: () => void;
  onOpenPrepare: (id?: ReportId) => void;
  onSignal: (signal: Signal) => void;
}) {
  const reduce = useReducedMotion();
  const { kpis, kpiDeltas } = activity;
  const recent = recentActivity.slice(0, 4).map((id) => conversations.find((c) => c.id === id)!);

  // reportId → team, so recent rows can show the department in the meta line.
  const teamByReport = Object.fromEntries(
    activity.roster.filter((r) => r.reportId).map((r) => [r.reportId, r.team]),
  ) as Record<ReportId, Team>;

  // Needs-attention queue: everything that isn't good news, most-severe first.
  const attention = signals.filter((s) => s.severity !== "positive").sort(bySeverity);
  const riskMix = countBySeverity(signals);
  const currentPct = Math.round(teamHealth[teamHealth.length - 1].value * 100);

  // The urgent person to rehearse before the next 1:1.
  const prepTarget = activity.roster.find((r) => r.reportId && prepScenarios[r.reportId]?.urgent);
  const prepId = prepTarget?.reportId;
  const prepScenario = prepId ? prepScenarios[prepId] : undefined;

  const kpiCells: {
    label: string;
    value: string | number;
    unit?: string;
    delta: number;
    goodWhenNegative?: boolean;
    note: string;
  }[] = [
    { label: "Sessions", value: kpis.sessions, delta: kpiDeltas.sessions, note: "vs last month" },
    { label: "Time in 1:1s", value: kpis.minutes, unit: "min", delta: kpiDeltas.minutes, note: "vs last month" },
    { label: "People covered", value: `${kpis.peopleCovered}/${kpis.peopleTotal}`, delta: kpiDeltas.peopleCovered, note: "new this month" },
    { label: "Cadence", value: kpis.cadenceDays, unit: "days", delta: kpiDeltas.cadenceDays, goodWhenNegative: true, note: "tighter rhythm" },
  ];
  // Explicit border classes: mobile = 2-col (mid divider + row divider), lg = 4-col rail.
  const cellBorder = [
    "lg:border-l-0",
    "border-l border-line",
    "border-t border-line lg:border-t-0 lg:border-l",
    "border-l border-line border-t lg:border-t-0",
  ];

  const mixOrder: { key: "critical" | "warning" | "watch" | "positive"; label: string }[] = [
    { key: "critical", label: "critical" },
    { key: "warning", label: "overdue" },
    { key: "watch", label: "watch" },
    { key: "positive", label: "healthy" },
  ];

  return (
    <div className="w-full px-5 py-6 sm:px-8 lg:px-10">
      {/* greeting */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-ink-soft">
          Good afternoon, <span className="font-medium text-foreground">{andrew.name}</span>
        </p>
        <span className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs text-ink-soft">
          <CalendarBlank size={13} className="text-muted" />
          {activity.rangeLabel}
        </span>
      </div>

      {/* KPI row — airy, hairline dividers, no boxes */}
      <div className="mt-6 grid grid-cols-2 border-y border-line lg:grid-cols-4">
        {kpiCells.map((k, i) => (
          <div key={k.label} className={cn("px-5 py-5 first:pl-0", cellBorder[i])}>
            <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-muted">{k.label}</p>
            <p className="mt-3 flex items-baseline gap-1.5">
              <span className="text-[38px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-foreground sm:text-[40px]">
                {typeof k.value === "number" ? <AnimatedNumber value={k.value} /> : k.value}
              </span>
              {k.unit && <span className="text-sm font-medium text-muted">{k.unit}</span>}
            </p>
            <DeltaChip delta={k.delta} goodWhenNegative={k.goodWhenNegative} note={k.note} />
          </div>
        ))}
      </div>

      {/* main grid — hero + airy rail */}
      <div className="mt-7 grid gap-6 lg:grid-cols-[1.85fr_1fr]">
        {/* LEFT */}
        <div>
          {/* Hero: team health */}
          <section className="felt-card rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-foreground">Team health</h2>
              <span className="text-xs text-muted">avg warmth · last 8 weeks</span>
            </div>
            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[34px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-foreground">
                {currentPct}
                <span className="text-lg text-muted">%</span>
              </span>
              <span className="text-[13px] text-ink-soft">
                Trending up over the quarter — one relationship pulling against it.
              </span>
            </div>
            <div className="mt-6">
              <TeamHealthBars data={teamHealth} />
            </div>
            {/* risk mix — muted, minimal (red/amber/green only) */}
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4">
              {mixOrder
                .filter((m) => riskMix[m.key])
                .map((m) => (
                  <span key={m.key} className="inline-flex items-center gap-2 text-[13px] text-ink-soft">
                    <StatusIcon severity={m.key} />
                    <span className="font-mono font-semibold tabular-nums text-foreground">{riskMix[m.key]}</span>
                    {m.label}
                  </span>
                ))}
            </div>
          </section>

          {/* Recent conversations */}
          <div className="mt-7">
            <SectionHeader
              title="Recent conversations"
              action={
                <button
                  type="button"
                  onClick={onOpenRisk}
                  className="inline-flex items-center gap-1 text-xs font-medium text-accent outline-none transition hover:text-accent-strong focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                  View all <ArrowRight size={12} />
                </button>
              }
            />
            <div className="mt-2">
              {recent.map((c, i) => {
                const r = reports[c.reportId];
                return (
                  <motion.button
                    key={c.id}
                    type="button"
                    onClick={() => onOpenConvo(c.id)}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: reduce ? 0 : i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    className="group flex w-full items-center gap-3 rounded-lg border-line px-2 py-3.5 text-left outline-none transition-colors [&:not(:first-child)]:border-t hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50"
                  >
                    <Avatar initials={r.initials} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">{r.name}</div>
                      <div className="mt-0.5 text-xs text-muted">
                        {teamByReport[c.reportId]} · session {c.session} · {c.duration}
                      </div>
                    </div>
                    <DirectionPill direction={c.direction} />
                    <ArrowRight
                      size={15}
                      className="hidden shrink-0 text-muted opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 sm:block"
                    />
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT rail */}
        <div>
          <SectionHeader
            title="Needs attention"
            action={
              <button
                type="button"
                onClick={onOpenRisk}
                className="inline-flex items-center gap-1 text-xs font-medium text-accent outline-none transition hover:text-accent-strong focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                Risk &amp; Trends <ArrowRight size={12} />
              </button>
            }
          />
          {/* summary counts */}
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {mixOrder
              .filter((m) => m.key !== "positive" && riskMix[m.key])
              .map((m) => (
                <span key={m.key} className="inline-flex items-center gap-2 text-xs text-ink-soft">
                  <StatusIcon severity={m.key} />
                  <span className="font-mono font-semibold tabular-nums text-foreground">{riskMix[m.key]}</span>
                  {m.label}
                </span>
              ))}
          </div>
          {/* rows */}
          <div className="mt-2">
            {attention.map((s) => {
              const meta = severityMeta[s.severity];
              const trend = s.reportId ? reportTrends[s.reportId] : undefined;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSignal(s)}
                  className="group flex w-full items-center gap-3 rounded-lg border-line px-2 py-3 text-left outline-none transition-colors [&:not(:first-child)]:border-t hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50"
                >
                  <StatusIcon severity={s.severity} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground">{s.name}</div>
                    <div className="mt-0.5 truncate text-xs text-muted">
                      <span className={cn("font-medium", meta.text)}>{meta.label}</span> · {s.detail}
                    </div>
                  </div>
                  {trend && <Sparkline points={trend.points} direction={trend.dir} />}
                </button>
              );
            })}
          </div>

          {/* Prepare */}
          {prepId && prepScenario && (
            <button
              type="button"
              onClick={() => onOpenPrepare(prepId)}
              className="felt-card felt-card-pop mt-6 flex w-full flex-col rounded-2xl p-5 text-left outline-none transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
                Prepare · before your next 1:1
              </span>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{prepScenario.title}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent">
                Rehearse with {reports[prepId].name}
                <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
