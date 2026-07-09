import type { ReactNode } from "react";
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
