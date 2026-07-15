import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import type { GenerateReadOutput, ReadSegment } from "@/lib/engine/types";
import { cn } from "@/lib/utils";

const dirMeta = {
  up: { Icon: ArrowUpRight, cls: "text-positive", ring: "border-positive/30 bg-positive-soft" },
  down: { Icon: ArrowDownRight, cls: "text-danger", ring: "border-danger/30 bg-danger-soft" },
  steady: { Icon: ArrowRight, cls: "text-muted", ring: "border-line bg-bg-alt" },
} as const;

const toneCls = {
  warm: "text-positive",
  mixed: "text-muted",
  cool: "text-danger",
} as const;

/** The hero paragraph — prose first, quoted lines in italic accent (per TheRead). */
function Prose({ segments }: { segments: ReadSegment[] }) {
  return (
    <p className="font-display text-[22px] leading-[1.55] tracking-tight text-foreground sm:text-[26px] sm:leading-[1.55]">
      {segments.map((s, i) =>
        s.em ? (
          <em key={i} className="text-accent-strong not-italic">
            <span className="italic">{s.t}</span>
          </em>
        ) : (
          <span key={i}>{s.t}</span>
        ),
      )}
    </p>
  );
}

export function ReadCard({ result }: { result: GenerateReadOutput }) {
  const { read, facts, meta } = result;
  const d = dirMeta[read.direction];

  return (
    <div className="felt-card rounded-2xl p-6 sm:p-8">
      {/* Header: label + the single direction arrow */}
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          The Read
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
            d.ring,
          )}
        >
          <d.Icon size={15} weight="bold" className={d.cls} />
          <span className="text-foreground">{read.directionLabel}</span>
        </span>
      </div>

      {/* The paragraph */}
      <div className="mt-5">
        <Prose segments={read.segments} />
      </div>

      {/* Identity praise — rare, earned, celebratory */}
      {read.identityPraise && (
        <p className="mt-5 border-l-2 border-positive/40 bg-positive-soft/50 py-2 pl-4 text-sm leading-relaxed text-foreground">
          {read.identityPraise}
        </p>
      )}

      {/* The Mirror — the forward-looking pattern projection */}
      {read.patternLine && (
        <div className="mt-5 rounded-xl border border-accent/25 bg-accent-soft px-4 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent-strong">
            The mirror
          </span>
          <p className="mt-1.5 text-[15px] leading-relaxed text-foreground">
            {read.patternLine}
          </p>
        </div>
      )}

      {/* See detail — the evidence + QA, opt-in (per "behind see detail") */}
      <details className="group mt-6 border-t border-line pt-4">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-ink-soft transition hover:text-foreground">
          <ArrowRight
            size={14}
            weight="bold"
            className="transition group-open:rotate-90"
          />
          See detail
        </summary>

        <div className="mt-4 space-y-5">
          {/* The guaranteed win */}
          <Detail label="The win">{read.win}</Detail>
          {read.reminder && <Detail label="Reminder">{read.reminder}</Detail>}

          {/* Metric breakdown */}
          {read.metrics.length > 0 && (
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Signals
              </span>
              <ul className="mt-2 divide-y divide-line">
                {read.metrics.map((m, i) => (
                  <li key={i} className="flex flex-col gap-0.5 py-2 sm:flex-row sm:items-baseline sm:gap-3">
                    <span className="w-44 shrink-0 text-sm font-medium text-foreground">
                      {m.name}
                    </span>
                    <span className="flex-1 text-sm text-ink-soft">
                      {m.state}
                      {m.reframe && (
                        <span className="mt-0.5 block text-[13px] text-muted">↳ {m.reframe}</span>
                      )}
                    </span>
                    <span className={cn("font-mono text-[10px] uppercase tracking-wider", toneCls[m.tone])}>
                      {m.tone}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Machine signals + facts used (QA for the founder) */}
          <div className="rounded-lg bg-bg-alt px-3 py-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              Extracted signals (stored for memory)
            </span>
            <p className="mt-1 font-mono text-[11px] leading-relaxed text-ink-soft">
              opening: {read.signals.openingStyle} · engagement: {read.signals.engagementTrend} ·
              held-pause: {String(read.signals.heldPause)} · ack-before-fix:{" "}
              {String(read.signals.acknowledgedBeforeSolving)}
              {read.signals.topicsDropped.length > 0 && (
                <> · dropped: {read.signals.topicsDropped.join(", ")}</>
              )}
            </p>
          </div>

          {/* Provenance */}
          <p className="font-mono text-[11px] text-muted">
            session {facts.sessionNumber} · {meta.dryRun ? "dry-run" : meta.provider} · {meta.model}
            {" · "}
            {(meta.ms / 1000).toFixed(1)}s · risk coming in: {facts.riskLevel}
          </p>
        </div>
      </details>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      <p className="mt-1 text-[15px] leading-relaxed text-foreground">{children}</p>
    </div>
  );
}
