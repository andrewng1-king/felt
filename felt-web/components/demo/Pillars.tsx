import { ArrowUpRight, ArrowRight, LockSimple } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";
import { pillars, type Metric } from "@/content/demo";

const toneDot: Record<Metric["tone"], string> = {
  warm: "bg-accent",
  mixed: "bg-muted",
  cool: "bg-accent-strong",
};

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <article
      className={[
        "flex h-full flex-col rounded-2xl border p-6 transition duration-300",
        metric.locked
          ? "border-dashed border-line bg-transparent"
          : "glass hover:-translate-y-1 hover:shadow-[0_24px_44px_-28px_rgba(26,23,18,0.4)]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {metric.locked ? (
            <LockSimple size={13} weight="bold" className="text-muted" aria-hidden />
          ) : (
            <span
              className={`h-2 w-2 rounded-full ${toneDot[metric.tone]}`}
              aria-hidden
            />
          )}
          <h4 className="font-display text-lg tracking-tight text-foreground">
            {metric.name}
          </h4>
        </div>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          {metric.phase}
        </span>
      </div>

      <p
        className={`mt-3 text-sm leading-relaxed ${
          metric.locked ? "text-muted" : "text-ink-soft"
        }`}
      >
        {metric.state}
      </p>

      {metric.reframe && (
        <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-accent-strong">
          <ArrowRight size={15} weight="bold" className="mt-1 shrink-0" aria-hidden />
          <span>{metric.reframe}</span>
        </p>
      )}

      {metric.seeAbove && (
        <span className="mt-auto pt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          <ArrowUpRight size={12} weight="bold" aria-hidden />
          Shown above
        </span>
      )}
    </article>
  );
}

/** The 11 signals, grouped by the 6 pillars. The "why" under The Read. */
export function Pillars() {
  return (
    <div className="space-y-14">
      {pillars.map((pillar, pi) => (
        <Reveal key={pillar.n} delay={0.04}>
          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-muted tabular-nums">
                {String(pillar.n).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl tracking-tight text-foreground">
                {pillar.name}
              </h3>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pillar.metrics.map((m) => (
                <MetricCard key={m.name} metric={m} />
              ))}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
