"use client";

import {
  WarningOctagon,
  WarningCircle,
  Eye,
  TrendUp,
  CaretRight,
} from "@phosphor-icons/react/dist/ssr";

type IconCmp = typeof WarningOctagon;
import { Sparkline } from "@/components/platform/bits";
import type { Direction, Severity, Signal } from "@/content/platform";
import { cn } from "@/lib/utils";

export type SignalTrend = { points: number[]; dir: Direction };

/**
 * The status design-system. One severity → one icon, one color token, one label.
 * Class strings are LITERAL so Tailwind's scanner emits the utilities. Colors are
 * the semantic status tokens (danger/warn/positive/info), never the brand accent.
 */
export const severityMeta: Record<
  Severity,
  { label: string; Icon: IconCmp; text: string; edge: string; dot: string; pill: string; well: string }
> = {
  critical: {
    label: "Critical",
    Icon: WarningOctagon,
    text: "text-danger",
    edge: "border-l-danger",
    dot: "bg-danger",
    pill: "text-danger bg-danger-soft border-danger/30",
    well: "border-danger/40 bg-danger-soft",
  },
  warning: {
    label: "Warning",
    Icon: WarningCircle,
    text: "text-warn",
    edge: "border-l-warn",
    dot: "bg-warn",
    pill: "text-warn bg-warn-soft border-warn/30",
    well: "border-warn/40 bg-warn-soft",
  },
  watch: {
    label: "Watch",
    Icon: Eye,
    // Watch folds into the amber family (no blue) — distinguished from Warning by
    // the label + Eye icon, not by hue. Keeps the palette to red/amber/green.
    text: "text-warn",
    edge: "border-l-warn",
    dot: "bg-warn",
    pill: "text-warn bg-warn-soft border-warn/30",
    well: "border-warn/40 bg-warn-soft",
  },
  positive: {
    label: "Healthy",
    Icon: TrendUp,
    text: "text-positive",
    edge: "border-l-positive",
    dot: "bg-positive",
    pill: "text-positive bg-positive-soft border-positive/30",
    well: "border-positive/40 bg-positive-soft",
  },
};

/** Most-severe-first ordering. */
export const severityRank: Record<Severity, number> = {
  critical: 0,
  warning: 1,
  watch: 2,
  positive: 3,
};

export const bySeverity = (a: Signal, b: Signal) => severityRank[a.severity] - severityRank[b.severity];

export function countBySeverity(list: Signal[]): Partial<Record<Severity, number>> {
  return list.reduce<Partial<Record<Severity, number>>>((acc, s) => {
    acc[s.severity] = (acc[s.severity] ?? 0) + 1;
    return acc;
  }, {});
}

/** Vercel-style status glyph — a filled dot inside a soft same-color halo.
    The calm replacement for the bare colored dot; pairs with a short label. */
export function StatusIcon({
  severity,
  size = 16,
  className,
}: {
  severity: Severity;
  size?: number;
  className?: string;
}) {
  const m = severityMeta[severity];
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span className={cn("absolute inset-0 rounded-full opacity-20", m.dot)} />
      <span className={cn("rounded-full", m.dot)} style={{ width: size * 0.5, height: size * 0.5 }} />
    </span>
  );
}

/** A small status chip: colored icon + label. The atom of the whole system. */
export function StatusPill({ severity, label }: { severity: Severity; label?: string }) {
  const m = severityMeta[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        m.pill,
      )}
    >
      <m.Icon size={12} weight="fill" aria-hidden />
      {label ?? m.label}
    </span>
  );
}

/** The severity summary row — "1 critical · 2 warning · …". The glance layer. */
export function SeveritySummary({
  counts,
  className,
}: {
  counts: Partial<Record<Severity, number>>;
  className?: string;
}) {
  const order: Severity[] = ["critical", "warning", "watch", "positive"];
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {order
        .filter((s) => counts[s])
        .map((s) => {
          const m = severityMeta[s];
          return (
            <span
              key={s}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium tabular-nums",
                m.pill,
              )}
            >
              <StatusIcon severity={s} size={13} />
              {counts[s]} {m.label}
            </span>
          );
        })}
    </div>
  );
}

/**
 * One signal row, reused everywhere through SignalsPanel. Icon + title + why +
 * when, on a NEUTRAL card — no colored stripe. Severity reads from the group
 * header + the status icon; only a Critical row carries a faint color accent, so
 * nothing else shouts. Optional trend sparkline (Home). Clickable as a whole row.
 */
export function SignalRow({
  signal,
  onClick,
  trend,
  compact = false,
}: {
  signal: Signal;
  onClick?: () => void;
  trend?: SignalTrend;
  compact?: boolean;
}) {
  const m = severityMeta[signal.severity];
  const critical = signal.severity === "critical";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-start gap-3 rounded-xl border text-left outline-none transition focus-visible:ring-2 focus-visible:ring-accent/50",
        compact ? "p-3" : "p-3.5",
        critical
          ? "border-danger/25 bg-danger-soft/50 hover:bg-danger-soft"
          : "border-line bg-surface hover:bg-surface-2",
      )}
    >
      <StatusIcon severity={signal.severity} size={compact ? 15 : 17} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{signal.title}</span>
          <span className="shrink-0 text-[11px] tabular-nums text-muted">{signal.when}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-soft">{signal.detail}</p>
        {signal.action && (
          <span className={cn("mt-2 inline-flex items-center gap-1 text-[11px] font-medium", m.text)}>
            {signal.action.label}
            <CaretRight size={11} weight="bold" className="transition group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
      {trend && (
        <span className="mt-0.5 shrink-0">
          <Sparkline points={trend.points} direction={trend.dir} />
        </span>
      )}
    </button>
  );
}

/** Small section header inside SignalsPanel — colored severity word + count. */
function SignalGroupHeader({ severity, count }: { severity: Severity; count: number }) {
  const m = severityMeta[severity];
  return (
    <div className="flex items-center gap-2 px-1">
      <span className={cn("text-[11px] font-semibold uppercase tracking-[0.07em]", m.text)}>{m.label}</span>
      <span className="font-mono text-[11px] tabular-nums text-muted">{count}</span>
    </div>
  );
}

const panelOrder: Severity[] = ["critical", "warning", "watch", "positive"];

/**
 * THE Signals module — one glance summary (optional) over a severity-grouped list.
 * Reused on Home (needs-attention), Risk & Trends, and Notifications so the signal
 * feed reads identically everywhere. Critical leads by position + a faint accent.
 */
export function SignalsPanel({
  items,
  onSignal,
  showSummary = false,
  compact = false,
  getTrend,
  className,
}: {
  items: Signal[];
  onSignal: (s: Signal) => void;
  showSummary?: boolean;
  compact?: boolean;
  getTrend?: (s: Signal) => SignalTrend | undefined;
  className?: string;
}) {
  const groups = panelOrder
    .map((severity) => ({ severity, list: items.filter((s) => s.severity === severity) }))
    .filter((g) => g.list.length > 0);

  return (
    <div className={className}>
      {showSummary && <SeveritySummary counts={countBySeverity(items)} className="mb-4" />}
      <div className="space-y-4">
        {groups.map((g) => (
          <div key={g.severity} className="space-y-1.5">
            <SignalGroupHeader severity={g.severity} count={g.list.length} />
            <div className="space-y-2">
              {g.list.map((s) => (
                <SignalRow
                  key={s.id}
                  signal={s}
                  onClick={() => onSignal(s)}
                  trend={getTrend?.(s)}
                  compact={compact}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
