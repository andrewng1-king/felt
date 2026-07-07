import { ArrowRight, ArrowUpRight, Trophy, WarningDiamond } from "@phosphor-icons/react/dist/ssr";
import { Avatar, DirectionBadge, Sparkline } from "@/components/platform/bits";
import {
  andrew,
  conversations,
  reports,
  homeSignals,
  riskView,
  reportTrends,
} from "@/content/platform";

export function HomeView({
  onOpenConvo,
  onOpenRisk,
}: {
  onOpenConvo: (id: string) => void;
  onOpenRisk: () => void;
}) {
  const recent = [...conversations].reverse().slice(0, 4);

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        Good afternoon, {andrew.name}
      </p>

      {/* YOUR OWN signal leads the screen (guidebook §5) */}
      <section className="mt-5 rounded-3xl bg-ink-deep p-7 text-white sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-lg">
            <h1 className="font-display text-2xl leading-snug tracking-tight sm:text-[28px]">
              {homeSignals.trend.headline}
            </h1>
            <p className="mt-3 leading-relaxed text-white/70">{homeSignals.trend.sub}</p>
          </div>
          <span className="hidden shrink-0 sm:block">
            <Sparkline points={[0.5, 0.55, 0.62, 0.6, 0.68]} direction="up" />
          </span>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium">
            <Trophy size={14} weight="fill" className="text-white/80" />
            {homeSignals.streak.count} {homeSignals.streak.label} · {homeSignals.streak.with}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/80">
            <ArrowUpRight size={14} weight="bold" />
            Trending up overall
          </span>
        </div>
      </section>

      {/* This session's win — the retention lever */}
      <button
        type="button"
        onClick={() => onOpenConvo(homeSignals.latestWin.convoId)}
        className="group mt-4 flex w-full items-start gap-3 rounded-2xl border border-line bg-bg-alt/70 p-5 text-left outline-none transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-28px_rgba(26,23,18,0.4)] focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        <Trophy size={18} weight="fill" className="mt-0.5 shrink-0 text-accent-strong" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Your win this session
          </p>
          <p className="mt-1.5 leading-relaxed text-foreground">{homeSignals.latestWin.text}</p>
        </div>
        <ArrowRight size={16} className="mt-1 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-foreground" />
      </button>

      {/* Risk banner — one relationship needs attention */}
      <button
        type="button"
        onClick={onOpenRisk}
        className="group mt-4 flex w-full items-start gap-3 rounded-2xl border border-accent-strong/25 bg-accent-soft/50 p-5 text-left outline-none transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-28px_rgba(154,71,51,0.5)] focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        <WarningDiamond size={18} weight="fill" className="mt-0.5 shrink-0 text-accent-strong" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-strong">
            Risk signal · {riskView.alert.level}
          </p>
          <p className="mt-1.5 leading-relaxed text-foreground">{riskView.alert.summary}</p>
        </div>
        <div className="mt-0.5 hidden shrink-0 sm:block">
          <Sparkline points={reportTrends[riskView.alert.reportId].points} direction="down" />
        </div>
      </button>

      {/* Recent conversations */}
      <section className="mt-10">
        <h2 className="font-display text-lg tracking-tight text-foreground">Recent conversations</h2>
        <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-bg-alt/50">
          {recent.map((c) => {
            const r = reports[c.reportId];
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onOpenConvo(c.id)}
                className="group flex w-full items-center gap-3 px-5 py-4 text-left outline-none transition hover:bg-surface/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50"
              >
                <Avatar initials={r.initials} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{r.name}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                      · S{c.session} · {c.whenLabel}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-ink-soft">{c.headline}</p>
                </div>
                <DirectionBadge direction={c.direction} label={c.directionLabel} subtle />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
