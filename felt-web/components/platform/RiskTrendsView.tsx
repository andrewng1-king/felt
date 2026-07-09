import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { Avatar } from "@/components/platform/bits";
import { StatusRing, TrendLine } from "@/components/platform/charts";
import {
  SignalsPanel,
  StatusPill,
  StatusIcon,
  countBySeverity,
} from "@/components/platform/severity";
import {
  reports,
  riskView,
  reportTrends,
  conversations,
  signals,
  type Direction,
  type ReportId,
  type Severity,
  type Signal,
} from "@/content/platform";

const trendOrder: ReportId[] = ["daniel", "priya", "elena", "marcus"];
const trendLabel: Record<Direction, { label: string; className: string }> = {
  down: { label: "Falling", className: "text-danger" },
  up: { label: "Rising", className: "text-positive" },
  steady: { label: "Steady", className: "text-muted" },
};
const legendLabel: Record<Severity, string> = {
  critical: "Critical",
  warning: "Overdue",
  watch: "Watch",
  positive: "Healthy",
};

export function RiskTrendsView({
  onOpenConvo,
  onSignal,
}: {
  onOpenConvo: (id: string) => void;
  onSignal: (signal: Signal) => void;
}) {
  const alertReport = reports[riskView.alert.reportId];
  const latestDaniel = [...conversations].reverse().find((c) => c.reportId === "daniel");
  const counts = countBySeverity(signals);
  // Critical is the hero card above; the panel groups + ranks everything else.
  const ranked = signals.filter((s) => s.severity !== "critical");
  const legendOrder: Severity[] = ["critical", "warning", "watch", "positive"];

  return (
    <div className="w-full px-5 py-7 sm:px-8 lg:px-10">
      <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">
        One rough conversation is noise. A falling line across weeks is the signal. felt. watches the
        direction, not the day.
      </p>

      {/* Hero — status ring (glance) + the one critical alert (calm white card) */}
      <div className="mt-6 grid gap-5 lg:grid-cols-[300px_1fr]">
        {/* Ring */}
        <section className="felt-card flex flex-col items-center rounded-2xl p-6">
          <h2 className="mb-4 self-start text-[13px] font-semibold tracking-tight text-foreground">
            Team status
          </h2>
          <StatusRing counts={counts} centerLabel="tracked" />
          <div className="mt-5 grid w-full grid-cols-2 gap-x-3 gap-y-2.5">
            {legendOrder
              .filter((s) => counts[s])
              .map((s) => (
                <span key={s} className="inline-flex items-center gap-2 text-xs text-ink-soft">
                  <StatusIcon severity={s} size={14} />
                  <span className="font-mono font-semibold tabular-nums text-foreground">{counts[s]}</span>
                  {legendLabel[s]}
                </span>
              ))}
          </div>
        </section>

        {/* Critical alert — calm: white card, faint danger border (the StatusPill carries the red word) */}
        <section className="rounded-2xl border border-danger/25 bg-surface p-6 shadow-[var(--shadow-card)] sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar initials={alertReport.initials} size="lg" />
              <div>
                <StatusPill severity="critical" label={`Critical · ${riskView.alert.level}`} />
                <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-foreground">{alertReport.name}</h2>
              </div>
            </div>
            <div className="w-28 shrink-0">
              <TrendLine points={reportTrends.daniel.points} direction="down" className="h-12 w-full" />
            </div>
          </div>

          <p className="mt-5 leading-relaxed text-foreground">{riskView.alert.summary}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {riskView.alert.factors.map((f) => (
              <div key={f.label} className="rounded-xl border border-line bg-bg-alt p-4">
                <div className="flex items-center gap-2">
                  {f.dir === "down" ? (
                    <ArrowDownRight size={14} weight="bold" className="text-danger" />
                  ) : (
                    <ArrowUpRight size={14} weight="bold" className="text-danger" />
                  )}
                  <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">{f.label}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
              <ArrowRight size={15} weight="bold" className="mt-0.5 shrink-0 text-danger" />
              <span>
                <span className="font-medium">Next conversation:</span> {riskView.alert.nextStep}
              </span>
            </p>
            {latestDaniel && (
              <button
                type="button"
                onClick={() => onOpenConvo(latestDaniel.id)}
                className="shrink-0 self-start rounded-lg border border-line bg-surface px-4 py-2 text-sm font-medium text-foreground outline-none transition hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                Open his latest 1:1
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Trends — a real line per relationship (warmth across sessions) */}
      <section className="mt-8">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[15px] font-semibold tracking-tight text-foreground">Trends</h3>
          <span className="text-xs text-muted">Warmth across recent sessions</span>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trendOrder.map((id) => {
            const t = reportTrends[id];
            const tl = trendLabel[t.dir];
            return (
              <div key={id} className="felt-card rounded-xl p-4">
                <div className="flex items-center gap-2.5">
                  <Avatar initials={reports[id].initials} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{reports[id].name}</p>
                    <p className={`text-[11px] font-medium ${tl.className}`}>{tl.label}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <TrendLine points={t.points} direction={t.dir} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ranked signals — everything else, most-severe first */}
      <section className="mt-8">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[15px] font-semibold tracking-tight text-foreground">All signals</h3>
          <span className="font-mono text-xs tabular-nums text-muted">{ranked.length} more</span>
        </div>
        <SignalsPanel items={ranked} onSignal={onSignal} className="mt-4 max-w-2xl" />
      </section>
    </div>
  );
}
