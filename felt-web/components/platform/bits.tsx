"use client";

import { ArrowUpRight, ArrowDownRight, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion } from "motion/react";
import type { Direction, Tone } from "@/content/platform";

// Dual accent: warm = the brand orange, cool = the teal risk signal, mixed = muted.
export const toneDot: Record<Tone, string> = {
  warm: "bg-accent",
  mixed: "bg-muted",
  cool: "bg-cool",
};

export function Avatar({
  initials,
  accent = false,
  size = "md",
}: {
  initials: string;
  accent?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "lg" ? "h-11 w-11 text-sm" : size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs";
  return (
    <span
      className={[
        "inline-flex shrink-0 items-center justify-center rounded-full font-mono font-medium uppercase tracking-wide",
        dim,
        accent ? "bg-accent-strong text-white" : "bg-surface text-ink-soft",
      ].join(" ")}
      aria-hidden
    >
      {initials}
    </span>
  );
}

/** Arrow + label. Down = the alert color; up = calm positive; steady = muted. */
export function DirectionBadge({
  direction,
  label,
  subtle = false,
}: {
  direction: Direction;
  label: string;
  subtle?: boolean;
}) {
  const Icon = direction === "down" ? ArrowDownRight : direction === "up" ? ArrowUpRight : ArrowRight;
  const color =
    direction === "down" ? "text-cool" : direction === "up" ? "text-foreground" : "text-muted";
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
        subtle ? "border-transparent bg-bg-alt" : "border-line bg-bg-alt",
        color,
      ].join(" ")}
    >
      <Icon size={15} weight="bold" />
      {label}
    </span>
  );
}

/** Tiny trend line from 0-1 values. Shape only — no axis, no numbers (no grade).
    Down rides the teal risk signal; everything else stays calm foreground. Draws
    itself in on mount, with a soft pulse on the latest point. */
export function Sparkline({ points, direction }: { points: number[]; direction: Direction }) {
  const reduce = useReducedMotion();
  const W = 76;
  const H = 26;
  const pad = 3;
  const n = points.length;
  const stroke = direction === "down" ? "var(--cool)" : "var(--foreground)";
  const coords = points.map((v, i) => {
    const x = pad + (i / (n - 1)) * (W - pad * 2);
    const y = H - pad - v * (H - pad * 2);
    return [x, y];
  });
  const d = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const [lx, ly] = coords[coords.length - 1];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden className="overflow-visible">
      <motion.path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
      {direction === "down" && !reduce && (
        <motion.circle
          cx={lx}
          cy={ly}
          r="2.5"
          fill={stroke}
          animate={{ r: [2.5, 6], opacity: [0.5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <motion.circle
        cx={lx}
        cy={ly}
        r="2.5"
        fill={stroke}
        initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : 0.85 }}
        style={{ transformOrigin: `${lx}px ${ly}px` }}
      />
    </svg>
  );
}
