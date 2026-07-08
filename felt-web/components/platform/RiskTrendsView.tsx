import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { Avatar, Sparkline } from "@/components/platform/bits";
import {
  SeveritySummary,
  SignalRow,
  StatusPill,
  severityMeta,
  countBySeverity,
  bySeverity,
} from "@/components/platform/severity";
import {
  reports,
  riskView,
  reportTrends,
  conversations,
  signals,
  type Direction,
  type ReportId,
  type Signal,
} from "@/content/platform";

const trendOrder: ReportId[] = ["daniel", "priya", "elena", "marcus"];
const trendLabel: Record<Direction, { label: string; className: string }> = {
  down: { label: "Falling", className: "text-danger" },
  up: { label: "Rising", className: "text-positive" },
  steady: { label: "Steady", className: "text-muted" },
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
  // The hero owns the one critical signal; the ranked list shows the rest.
  const ranked = signals.filter((s) => s.severity !== "critical").sort(bySeverity);
  const crit = severityMeta.critical;

  return (
    <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8 sm:py-8">
      {/* Header — the plain-English promise + the glance-layer severity summary */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-md text-sm leading-relaxed text-ink-soft">
          One rough conversation is noise. A falling line across weeks is the signal. felt. watches the
          direction, not the day.
        </p>
        <SeveritySummary counts={counts} />
      </div>

      {/* Hero alert — the one thing that matters most, in danger red. Lifted with
          the pop shadow so the critical signal reads as elevated/urgent. */}
      <section className={`mt-6 rounded-2xl border border-l-2 p-6 shadow-[var(--shadow-pop)] sm:p-7 ${crit.well} ${crit.edge}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar initials={alertReport.initials} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill severity="critical" label={`Critical · ${riskView.alert.level}`} />
              </div>
              <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-foreground">
                {alertReport.name}
              </h2>
            </div>
          </div>
          <Sparkline points={reportTrends.daniel.points} direction="down" />
        </div>

        <p className="mt-5 leading-relaxed text-foreground">{riskView.alert.summary}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {riskView.alert.factors.map((f) => (
            <div key={f.label} className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-center gap-2">
                {f.dir === "down" ? (
                  <ArrowDownRight size={14} weight="bold" className="text-danger" />
                ) : (
                  <ArrowUpRight size={14} weight="bold" className="text-danger" />
                )}
                <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
                  {f.label}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-danger/20 pt-5 sm:flex-row sm:items-center sm:justify-between">
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

      {/* Ranked signals — everything else, most-severe first */}
      <section className="mt-8">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[15px] font-semibold tracking-tight text-foreground">All signals</h3>
          <span className="text-xs tabular-nums text-muted">{ranked.length} more</span>
        </div>
        <div className="mt-4 space-y-2.5">
          {ranked.map((s) => (
            <SignalRow key={s.id} signal={s} onClick={() => onSignal(s)} />
          ))}
        </div>
      </section>

      {/* Trends — direction across every tracked relationship */}
      <section className="mt-8">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[15px] font-semibold tracking-tight text-foreground">Trends</h3>
          <span className="text-xs text-muted">Direction over recent sessions</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                <div className="mt-3 flex justify-end">
                  <Sparkline points={t.points} direction={t.dir} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
