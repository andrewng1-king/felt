import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowRight,
  WarningDiamond,
  Eye,
} from "@phosphor-icons/react/dist/ssr";
import { Avatar, Sparkline } from "@/components/platform/bits";
import { reports, riskView, reportTrends, conversations } from "@/content/platform";

export function RiskTrendsView({ onOpenConvo }: { onOpenConvo: (id: string) => void }) {
  const alertReport = reports[riskView.alert.reportId];
  const healthyReport = reports[riskView.healthy.reportId];
  const latestDaniel = [...conversations].reverse().find((c) => c.reportId === "daniel");

  return (
    <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8 sm:py-8">
      <p className="max-w-xl text-sm text-ink-soft">
        One rough conversation is noise. A falling line across weeks is the signal. This is where felt.
        watches the direction, not the day.
      </p>

      {/* The alert */}
      <section className="mt-6 rounded-2xl border border-accent/40 bg-accent-soft p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar initials={alertReport.initials} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <WarningDiamond size={16} weight="fill" className="text-accent" />
                <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-accent">
                  Risk signal · {riskView.alert.level}
                </span>
              </div>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                {alertReport.name}
              </h2>
            </div>
          </div>
          <Sparkline points={reportTrends.daniel.points} direction="down" />
        </div>

        <p className="mt-5 leading-relaxed text-foreground">{riskView.alert.summary}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {riskView.alert.factors.map((f) => (
            <div key={f.label} className="rounded-xl border border-line bg-background/50 p-4">
              <div className="flex items-center gap-2">
                {f.dir === "down" ? (
                  <ArrowDownRight size={14} weight="bold" className="text-accent" />
                ) : (
                  <ArrowUpRight size={14} weight="bold" className="text-accent" />
                )}
                <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
                  {f.label}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-accent/20 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-sm leading-relaxed text-accent">
            <ArrowRight size={15} weight="bold" className="mt-0.5 shrink-0" />
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

      {/* The healthy counterweight */}
      <section className="mt-4 flex items-start gap-3 rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <ArrowUpRight size={18} weight="bold" className="mt-0.5 shrink-0 text-foreground" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Avatar initials={healthyReport.initials} size="sm" />
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              {healthyReport.name} — trending the other way
            </h3>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{riskView.healthy.summary}</p>
        </div>
        <Sparkline points={reportTrends.priya.points} direction="up" />
      </section>

      {/* Andrew's own blind spot */}
      <section className="felt-hero mt-6 rounded-2xl p-6 text-white sm:p-7">
        <div className="flex items-center gap-2">
          <Eye size={16} weight="fill" className="text-white/70" />
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/60">
            Your blind spot · behavioral trend
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight sm:text-xl">
          {riskView.blindSpot.pattern}
        </h3>
        <p className="mt-3 max-w-xl leading-relaxed text-white/70">{riskView.blindSpot.detail}</p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/80">
          <ArrowUpRight size={14} weight="bold" />
          {riskView.blindSpot.slope}
        </p>
      </section>
    </div>
  );
}
