import {
  ArrowRight,
  ArrowUpRight,
  LockSimple,
  Sparkle,
  Trophy,
} from "@phosphor-icons/react/dist/ssr";
import { EmpathyMirror } from "@/components/EmpathyMirror";
import { Avatar, DirectionBadge, toneDot } from "@/components/platform/bits";
import {
  reports,
  pillarSkeleton,
  type Conversation,
  type MetricState,
} from "@/content/platform";

function MetricCard({
  name,
  phase,
  seeAbove,
  metric,
}: {
  name: string;
  phase: string;
  seeAbove?: boolean;
  metric: MetricState;
}) {
  return (
    <article
      className={[
        "flex h-full flex-col rounded-xl border p-4 transition",
        metric.locked
          ? "border-dashed border-line bg-transparent"
          : "border-line bg-surface hover:border-line-strong",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {metric.locked ? (
            <LockSimple size={12} weight="bold" className="text-muted" aria-hidden />
          ) : (
            <span className={`h-2 w-2 rounded-full ${toneDot[metric.tone]}`} aria-hidden />
          )}
          <h4 className="text-sm font-semibold tracking-tight text-foreground">{name}</h4>
        </div>
        <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.1em] text-muted">
          {phase}
        </span>
      </div>
      <p className={`mt-2.5 text-sm leading-relaxed ${metric.locked ? "text-muted" : "text-ink-soft"}`}>
        {metric.state}
      </p>
      {metric.reframe && (
        <p className="mt-2.5 flex items-start gap-2 text-sm leading-relaxed text-accent-strong">
          <ArrowRight size={14} weight="bold" className="mt-1 shrink-0" aria-hidden />
          <span>{metric.reframe}</span>
        </p>
      )}
      {seeAbove && (
        <span className="mt-auto inline-flex items-center gap-1 pt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
          <ArrowUpRight size={11} weight="bold" aria-hidden />
          Shown above
        </span>
      )}
    </article>
  );
}

export function ReportView({ convo, embedded = false }: { convo: Conversation; embedded?: boolean }) {
  const report = reports[convo.reportId];

  return (
    <div className={embedded ? "px-5 py-6 sm:px-6" : "mx-auto max-w-5xl px-5 py-7 sm:px-8 sm:py-8"}>
      {/* Conversation header — hidden when embedded (the pane shows identity) */}
      {!embedded && (
        <div className="flex items-center gap-3">
          <Avatar initials={report.initials} size="lg" />
          <div>
            <p className="text-base font-semibold tracking-tight text-foreground">{report.role}</p>
            <p className="mt-0.5 text-[11px] tabular-nums text-muted">
              Session {convo.session} · {convo.dateLabel} · {convo.duration} · voice + transcript
            </p>
          </div>
        </div>
      )}

      {/* The Read */}
      <div className={embedded ? "" : "mt-8"}>
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">The Read</span>
        <p className="font-display mt-4 text-xl leading-[1.55] tracking-tight text-foreground sm:text-[23px] sm:leading-[1.55]">
          {convo.read.segments.map((s, i) =>
            s.em ? (
              <em key={i} className="italic text-accent-strong">
                {s.t}
              </em>
            ) : (
              <span key={i}>{s.t}</span>
            ),
          )}
        </p>

        {convo.reminder && (
          <p className="mt-5 flex items-start gap-2.5 border-l-2 border-line pl-4 text-sm italic leading-relaxed text-ink-soft">
            <Sparkle size={15} weight="fill" className="mt-1 shrink-0 text-muted" aria-hidden />
            <span>{convo.reminder}</span>
          </p>
        )}

        {convo.identityPraise && (
          <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-accent-soft/60 p-4">
            <Trophy size={17} weight="fill" className="mt-0.5 shrink-0 text-accent-strong" aria-hidden />
            <p className="text-sm leading-relaxed text-foreground">{convo.identityPraise}</p>
          </div>
        )}

        <div className="mt-6">
          <DirectionBadge direction={convo.direction} label={convo.directionLabel} />
        </div>
      </div>

      {/* Empathy Mirror — the evidence, one section down */}
      <section className="mt-12 border-t border-line pt-10">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">The evidence</span>
        <h2 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
          How {report.pronoun} moved, second by second.
        </h2>
        <div className="glass mt-6 rounded-2xl p-5 sm:p-8">
          {/* key forces a fresh chart when switching conversations */}
          <EmpathyMirror key={convo.id} data={convo.mirror} />
        </div>
      </section>

      {/* The 11 signals underneath */}
      <section className="mt-12 border-t border-line pt-10">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">The why</span>
        <h2 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
          The 11 signals underneath — lenses, not grades.
        </h2>
        <div className="mt-8 space-y-10">
          {pillarSkeleton.map((pillar) => (
            <div key={pillar.n}>
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-medium tabular-nums text-accent">
                  {String(pillar.n).padStart(2, "0")}
                </span>
                <h3 className="text-base font-semibold tracking-tight text-foreground">{pillar.name}</h3>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {pillar.metrics.map((m) => (
                  <MetricCard
                    key={m.name}
                    name={m.name}
                    phase={m.phase}
                    seeAbove={m.seeAbove}
                    metric={convo.metrics[m.name] ?? m.default}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
