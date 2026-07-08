"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, WarningDiamond, CalendarBlank, Clock, Target } from "@phosphor-icons/react/dist/ssr";
import { Avatar, DirectionBadge } from "@/components/platform/bits";
import { StatTile, SectionHeader, WeekBars } from "@/components/platform/ui";
import {
  andrew,
  activity,
  conversations,
  reports,
  riskView,
  recentActivity,
  prepScenarios,
  type ReportId,
} from "@/content/platform";

export function HomeView({
  onOpenConvo,
  onOpenRisk,
  onOpenPrepare,
}: {
  onOpenConvo: (id: string) => void;
  onOpenRisk: () => void;
  onOpenPrepare: (id?: ReportId) => void;
}) {
  const reduce = useReducedMotion();
  const recent = recentActivity.map((id) => conversations.find((c) => c.id === id)!);
  const overdue = activity.roster.filter((r) => r.overdue);
  const { kpis } = activity;

  // The person most worth rehearsing before your next 1:1 (the urgent scenario).
  const prepTarget = activity.roster.find((r) => r.reportId && prepScenarios[r.reportId]?.urgent);
  const prepId = prepTarget?.reportId;
  const prepScenario = prepId ? prepScenarios[prepId] : undefined;

  return (
    <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8 sm:py-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm text-ink-soft">
          Good afternoon, <span className="font-medium text-foreground">{andrew.name}</span>
        </p>
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
          {activity.rangeLabel}
        </span>
      </div>

      {/* KPI row — the glance layer: how much am I doing, how's the cadence */}
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Sessions" value={kpis.sessions} hint="1:1s logged this month" />
        <StatTile label="Time in 1:1s" value={kpis.minutes} unit="min" hint="≈ 2h 44m total" />
        <StatTile
          label="People covered"
          value={`${kpis.peopleCovered}/${kpis.peopleTotal}`}
          hint="met in the last 2 weeks"
        />
        <StatTile label="Cadence" value={kpis.cadenceDays} unit="days" hint="avg between 1:1s" />
      </div>

      {/* Main + side rail */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Cadence */}
          <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <SectionHeader
              title="Your cadence"
              action={
                <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft">
                  <CalendarBlank size={14} className="text-muted" /> 1:1s per week
                </span>
              }
            />
            <p className="mt-1 text-sm text-ink-soft">
              You&apos;ve kept a steady rhythm — {kpis.sessions} conversations over the last eight weeks.
            </p>
            <div className="mt-6">
              <WeekBars data={activity.weekly} />
            </div>
          </section>

          {/* Recent conversations */}
          <section className="rounded-2xl border border-line bg-surface">
            <div className="px-5 pt-5 sm:px-6">
              <SectionHeader title="Recent conversations" />
            </div>
            <div className="mt-3 divide-y divide-line">
              {recent.map((c, i) => {
                const r = reports[c.reportId];
                return (
                  <motion.button
                    key={c.id}
                    type="button"
                    onClick={() => onOpenConvo(c.id)}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: reduce ? 0 : i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="group flex w-full items-center gap-3 px-5 py-3.5 text-left outline-none transition-colors hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50 sm:px-6"
                  >
                    <Avatar initials={r.initials} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{r.name}</span>
                        <span className="text-[11px] tabular-nums text-muted">
                          S{c.session} · {c.whenLabel}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-sm text-ink-soft">{c.headline}</p>
                    </div>
                    <DirectionBadge direction={c.direction} label={c.directionLabel} subtle />
                    <ArrowRight
                      size={15}
                      className="hidden shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-foreground sm:block"
                    />
                  </motion.button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Side rail — needs attention */}
        <div className="space-y-5">
          {/* Risk nudge */}
          <button
            type="button"
            onClick={onOpenRisk}
            className="group flex w-full flex-col rounded-2xl border border-accent/40 bg-accent-soft p-5 text-left outline-none transition hover:-translate-y-0.5 hover:border-accent/70 focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <div className="flex items-center gap-2">
              <WarningDiamond size={16} weight="fill" className="text-accent" />
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-accent">
                Risk signal · {riskView.alert.level}
              </span>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-foreground">{riskView.alert.summary}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent">
              Open Risk &amp; Trends
              <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
            </span>
          </button>

          {/* Focus Brief — rehearse before the next hard 1:1 */}
          {prepId && prepScenario && (
            <button
              type="button"
              onClick={() => onOpenPrepare(prepId)}
              className="group flex w-full flex-col rounded-2xl border border-line bg-surface p-5 text-left outline-none transition hover:-translate-y-0.5 hover:border-line-strong focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <div className="flex items-center gap-2">
                <Target size={16} weight="fill" className="text-accent" />
                <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                  Prepare · before your next 1:1
                </span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-foreground">{prepScenario.title}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent">
                Rehearse with {reports[prepId].name}
                <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
              </span>
            </button>
          )}

          {/* Overdue 1:1s */}
          <section className="rounded-2xl border border-line bg-surface p-5">
            <SectionHeader title="Overdue 1:1s" />
            <p className="mt-1 text-xs text-ink-soft">Haven&apos;t met in over two weeks.</p>
            <div className="mt-4 space-y-3">
              {overdue.map((r) => (
                <div key={r.id} className="flex items-center gap-3">
                  <Avatar initials={r.initials} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{r.name}</p>
                    <p className="truncate text-[11px] text-muted">{r.role}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium tabular-nums text-accent">
                    <Clock size={12} weight="fill" />
                    {r.daysSince}d
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
