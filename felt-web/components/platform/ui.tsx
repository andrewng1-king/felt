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
    <div className="felt-card rounded-2xl p-4 sm:p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-3 flex items-baseline gap-1.5">
        <span
          className={`text-[40px] font-semibold leading-[0.95] tabular-nums tracking-[-0.02em] sm:text-[44px] ${
            accent ? "text-accent" : "text-foreground"
          }`}
        >
          {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
        </span>
        {unit && <span className="text-sm font-medium text-muted">{unit}</span>}
      </p>
      {hint && <p className="mt-2.5 text-xs leading-relaxed text-ink-soft">{hint}</p>}
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

/** Weekly cadence bars — count of 1:1s per week. Each column has a faint full-
    height track so the chart has structure on dark; the fill reads clearly
    (neutral for past weeks, accent for the current one). Shape + count, no y-axis. */
export function WeekBars({
  data,
}: {
  data: { week: string; count: number }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const TRACK = 92; // px — the column track height
  return (
    <div className="flex items-end justify-between gap-2 sm:gap-3">
      {data.map((d, i) => {
        const last = i === data.length - 1;
        const h = Math.max(6, (d.count / max) * TRACK); // proportional, min visible nub
        return (
          <div key={d.week} className="flex min-w-0 flex-1 flex-col items-center gap-2.5">
            <span
              className={`text-[13px] font-semibold tabular-nums ${
                last ? "text-accent" : "text-foreground"
              }`}
            >
              {d.count}
            </span>
            {/* Track + fill. The track gives every week a footprint so gaps read. */}
            <div
              className="flex w-full items-end justify-center rounded-lg bg-bg-alt ring-1 ring-inset ring-line"
              style={{ height: `${TRACK}px` }}
              aria-hidden
            >
              <div
                className={`w-full rounded-lg ${
                  last
                    ? "bg-accent shadow-[0_0_0_1px_var(--accent-strong)]"
                    : "bg-gradient-to-t from-line-strong to-ink-soft/70"
                }`}
                style={{ height: `${h}px` }}
              />
            </div>
            <span className="truncate text-[10px] uppercase tracking-[0.08em] text-muted">
              {d.week}
            </span>
          </div>
        );
      })}
    </div>
  );
}
