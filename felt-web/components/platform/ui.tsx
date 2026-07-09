import type { ReactNode } from "react";
import { Info } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

/** Section heading with an optional right-aligned action. */
export function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 className="text-[15px] font-semibold tracking-tight text-foreground">{title}</h2>
      {action}
    </div>
  );
}

/** An ⓘ affordance that reveals an explainer on hover/focus. CSS-only (group +
    focus-within) so it needs no client JS; keyboard-reachable via the button. */
export function InfoTip({ label }: { label: ReactNode }) {
  return (
    <span className="group/tip relative inline-flex shrink-0 align-middle">
      <button
        type="button"
        aria-label="What this means"
        className="rounded-full p-0.5 text-muted outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        <Info size={13} weight="bold" />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full z-50 mt-1.5 w-56 rounded-lg border border-line bg-surface-2 p-2.5 text-left text-xs font-normal normal-case leading-relaxed tracking-normal text-ink-soft opacity-0 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.7)] transition-opacity duration-150 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}

/** A signed month-over-month delta chip. Colored by GOOD/BAD, not by direction —
    so a falling cadence (tighter rhythm) still reads green. Number is mono. */
export function DeltaChip({
  delta,
  goodWhenNegative = false,
  note,
}: {
  delta: number;
  goodWhenNegative?: boolean;
  note?: string;
}) {
  const good = goodWhenNegative ? delta < 0 : delta > 0;
  const arrow = delta > 0 ? "▲" : delta < 0 ? "▼" : "–";
  const tone =
    delta === 0 ? "text-muted bg-surface-2" : good ? "text-positive bg-positive-soft" : "text-danger bg-danger-soft";
  return (
    <div className="mt-3 flex items-center gap-2">
      <span
        className={cn(
          "inline-flex w-fit items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[11px] font-medium tabular-nums",
          tone,
        )}
      >
        {arrow} {Math.abs(delta)}
      </span>
      {note && <span className="text-[11px] text-muted">{note}</span>}
    </div>
  );
}
