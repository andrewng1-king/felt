"use client";

import {
  WarningOctagon,
  WarningCircle,
  Eye,
  TrendUp,
  CaretRight,
} from "@phosphor-icons/react/dist/ssr";

type IconCmp = typeof WarningOctagon;
import { Avatar } from "@/components/platform/bits";
import type { Severity, Signal } from "@/content/platform";
import { cn } from "@/lib/utils";

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
 * One alert anatomy, reused everywhere: colored left edge + severity icon +
 * title + why + when. Optional avatar and action. Clickable as a whole row.
 */
export function SignalRow({ signal, onClick }: { signal: Signal; onClick?: () => void }) {
  const m = severityMeta[signal.severity];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-start gap-3 rounded-xl border border-line border-l-2 bg-surface p-3.5 text-left outline-none transition",
        m.edge,
        "hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-accent/50",
      )}
    >
      <Avatar initials={signal.initials} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <m.Icon size={14} weight="fill" className={cn("shrink-0", m.text)} aria-hidden />
          <span className="truncate text-sm font-medium text-foreground">{signal.title}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-soft">{signal.detail}</p>
        {signal.action && (
          <span className={cn("mt-2 inline-flex items-center gap-1 text-[11px] font-medium", m.text)}>
            {signal.action.label}
            <CaretRight size={11} weight="bold" className="transition group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="text-[11px] tabular-nums text-muted">{signal.when}</span>
        {signal.unread && <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} aria-hidden />}
      </div>
    </button>
  );
}
