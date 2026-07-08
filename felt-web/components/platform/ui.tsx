import type { ReactNode } from "react";
import { AnimatedNumber } from "@/components/platform/AnimatedNumber";

/** A flat KPI tile — hairline border, one surface, tabular value. The glance layer. */
export function StatTile({
  label,
  value,
  unit,
  hint,
  accent = false,
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-2.5 flex items-baseline gap-1.5">
        <span
          className={`text-[26px] font-semibold leading-none tabular-nums tracking-tight sm:text-[28px] ${
            accent ? "text-accent" : "text-foreground"
          }`}
        >
          {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
        </span>
        {unit && <span className="text-sm font-medium text-muted">{unit}</span>}
      </p>
      {hint && <p className="mt-2 text-xs leading-relaxed text-ink-soft">{hint}</p>}
    </div>
  );
}

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

/** Flat weekly cadence bars — count of 1:1s per week. Shape + count, no y-axis. */
export function WeekBars({
  data,
}: {
  data: { week: string; count: number }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex items-end justify-between gap-2">
      {data.map((d, i) => {
        const last = i === data.length - 1;
        const h = 12 + (d.count / max) * 52; // 12–64px
        return (
          <div key={d.week} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <span className="text-[11px] font-medium tabular-nums text-ink-soft">{d.count}</span>
            <div
              className={`w-full rounded-md ${last ? "bg-accent" : "bg-surface-2"}`}
              style={{ height: `${h}px` }}
              aria-hidden
            />
            <span className="truncate text-[10px] uppercase tracking-[0.08em] text-muted">
              {d.week}
            </span>
          </div>
        );
      })}
    </div>
  );
}
