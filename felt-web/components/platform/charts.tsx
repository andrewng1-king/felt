"use client";

import { motion, useReducedMotion } from "motion/react";

type Point = { label: string; value: number; sessions: number };

/**
 * Team-health chart — clean spaced bars (Vercel-Analytics style). The current
 * week reads in the brand accent; past weeks are a calm neutral. Bars grow in
 * once on mount (no loop). Hovering a bar reveals a rich summary: week · value ·
 * delta vs the prior week · sessions. CSS-only hover, so it's reduced-motion safe.
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
            {/* Rich hover summary */}
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
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        );
      })}
    </div>
  );
}
