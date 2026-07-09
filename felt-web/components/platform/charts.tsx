"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Severity } from "@/content/platform";

type Point = { label: string; value: number; sessions: number };

const SEV_COLOR: Record<Severity, string> = {
  critical: "var(--danger)",
  warning: "var(--warn)",
  watch: "var(--warn)",
  positive: "var(--positive)",
};

/**
 * Team-health chart — clean spaced bars (Vercel-Analytics style). The current
 * week reads in the brand accent; past weeks are a calm neutral. Bars grow in
 * once on mount. Hovering a bar reveals a rich summary: week · value · delta vs
 * the prior week · sessions. CSS-only hover, so it's reduced-motion safe.
 */
export function TeamHealthBars({ data }: { data: Point[] }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-[150px] items-end gap-2.5 border-b border-line sm:gap-3">
      {data.map((d, i) => {
        const last = i === data.length - 1;
        const prev = i > 0 ? data[i - 1].value : d.value;
        const delta = Math.round((d.value - prev) * 100);
        return (
          <div key={d.label} className="group relative flex h-full min-w-0 flex-1 flex-col justify-end">
            <div className="pointer-events-none absolute -top-2 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-foreground px-3 py-2 opacity-0 shadow-lg transition-opacity duration-100 group-hover:opacity-100">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-background/70">{d.label}</p>
              <p className="mt-1 flex items-baseline gap-1.5">
                <span className="font-mono text-base font-semibold tabular-nums text-background">
                  {Math.round(d.value * 100)}%
                </span>
                <span
                  className={`font-mono text-[11px] font-semibold tabular-nums ${
                    delta > 0 ? "text-positive" : delta < 0 ? "text-danger" : "text-background/60"
                  }`}
                >
                  {delta > 0 ? "▲" : delta < 0 ? "▼" : "–"} {Math.abs(delta)}
                </span>
              </p>
              <p className="mt-0.5 text-[11px] text-background/70">
                {d.sessions} {d.sessions === 1 ? "session" : "sessions"} this week
              </p>
            </div>

            <motion.div
              className={`w-full rounded-t-md ${
                last ? "bg-accent" : "bg-gradient-to-t from-line-strong to-line-strong/60 group-hover:from-muted/50"
              }`}
              style={{ height: `${d.value * 100}%`, transformOrigin: "bottom" }}
              initial={reduce ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        );
      })}
    </div>
  );
}

/**
 * Flagged-status ring — a donut of how the tracked relationships break down by
 * severity (critical / warning / watch / healthy). Center shows the total. Thin
 * gaps separate segments; the arc sweeps in once on mount. Counts, not a grade.
 */
export function StatusRing({
  counts,
  size = 132,
  thickness = 14,
  centerLabel = "tracked",
}: {
  counts: Partial<Record<Severity, number>>;
  size?: number;
  thickness?: number;
  centerLabel?: string;
}) {
  const order: Severity[] = ["critical", "warning", "watch", "positive"];
  const data = order.filter((s) => counts[s]).map((s) => ({ s, v: counts[s]! }));
  const total = data.reduce((a, d) => a + d.v, 0) || 1;
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  const gap = 4; // px gap between segments along the circumference
  let acc = 0;

  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={thickness} />
        {data.map((d) => {
          const frac = d.v / total;
          const len = Math.max(0, frac * C - gap);
          const dash = `${len} ${C - len}`;
          const offset = -acc;
          acc += frac * C;
          return (
            <circle
              key={d.s}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={SEV_COLOR[d.s]}
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeDasharray={dash}
              strokeDashoffset={offset}
            />
          );
        })}
      </motion.svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[28px] font-semibold leading-none tabular-nums text-foreground">{total}</span>
        <span className="mt-1 text-[11px] text-muted">{centerLabel}</span>
      </div>
    </div>
  );
}

/**
 * A real trend line — warmth across recent sessions. Soft area fill under a
 * colored line (down=danger, up=positive, steady=muted), a faint baseline, and
 * an emphasized endpoint. Draws itself in once on mount.
 */
export function TrendLine({
  points,
  direction,
  className = "h-16 w-full",
}: {
  points: number[];
  direction: "up" | "down" | "steady";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const W = 220;
  const H = 64;
  const pad = 6;
  const n = points.length;
  const color = direction === "down" ? "var(--danger)" : direction === "up" ? "var(--positive)" : "var(--muted)";
  const uid = `tl-${direction}-${points.join("-")}`.replace(/[^a-z0-9-]/gi, "");
  const coords = points.map((v, i) => {
    const x = pad + (i / Math.max(1, n - 1)) * (W - pad * 2);
    const y = H - pad - v * (H - pad * 2);
    return [x, y] as const;
  });
  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L ${coords[n - 1][0].toFixed(1)} ${H} L ${coords[0][0].toFixed(1)} ${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={className} style={{ color }} aria-hidden>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.16" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="var(--line)" strokeWidth="1" />
      <motion.path
        d={area}
        fill={`url(#${uid})`}
        initial={{ opacity: reduce ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.3 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduce ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

/**
 * Readiness meter — a qualitative 3-step indicator (Not ready → Almost → Ready).
 * NEVER a 0–100 grade; it fills to the named state only. Ready reads green,
 * anything earlier reads in the brand accent.
 */
const READINESS_STEPS = ["Not ready", "Almost ready", "Ready"];

export function ReadinessMeter({ level }: { level: string }) {
  const idx = Math.max(
    0,
    READINESS_STEPS.findIndex((s) => level.toLowerCase().includes(s.toLowerCase().split(" ")[0])),
  );
  const ready = idx >= READINESS_STEPS.length - 1;
  return (
    <div>
      <div className="flex items-center gap-1.5">
        {READINESS_STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i <= idx ? (ready ? "bg-positive" : "bg-accent") : "bg-surface-2"
            }`}
          />
        ))}
      </div>
      <p className={`mt-2 text-sm font-semibold ${ready ? "text-positive" : "text-accent"}`}>{level}</p>
    </div>
  );
}
