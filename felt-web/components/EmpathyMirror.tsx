"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { empathyMirror as data } from "@/content/site";

/**
 * The interactive core of the platform preview: a real (illustrative) read of a
 * single 1:1, second by second. Two channels felt. reads together — how the
 * other person felt (the ink line) and their voice warmth (the orange line) —
 * plotted across the conversation. The turning points are clickable: each
 * reveals what was said, how it landed, and which felt. signal caught it. This
 * is the ONLY interactive part of the preview; the surrounding chrome is static.
 */

// Plot geometry (SVG user units). Left→right = start→end of the 1:1.
const X0 = 40;
const X1 = 440;
const Y_OPEN = 40; // top = open
const Y_GUARD = 220; // bottom = guarded

const INK = "#1a1712";
const ORANGE = "#b85c3a";

const fx = (t: number) => X0 + t * (X1 - X0);
const fy = (v: number) => Y_GUARD - v * (Y_GUARD - Y_OPEN);
const toXY = ([t, v]: [number, number]): [number, number] => [fx(t), fy(v)];

/** Catmull-Rom → cubic bezier for a smooth curve through the given points. */
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  const d = [`M ${pts[0][0]} ${pts[0][1]}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? 0 : i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d.push(`C ${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`);
  }
  return d.join(" ");
}

/** y on a rendered path at a given x (x is monotonic along the openness curve). */
function yAtX(path: SVGPathElement, x: number): number {
  const total = path.getTotalLength();
  let lo = 0;
  let hi = total;
  for (let i = 0; i < 18; i++) {
    const mid = (lo + hi) / 2;
    if (path.getPointAtLength(mid).x < x) lo = mid;
    else hi = mid;
  }
  return path.getPointAtLength((lo + hi) / 2).y;
}

/** felt score (0-100) from a plotted y: top = open = 100, bottom = guarded = 0. */
const feltFromY = (y: number) => ((Y_GUARD - y) / (Y_GUARD - Y_OPEN)) * 100;

const opennessPts = data.signals.openness.points.map(toXY);
const voicePts = data.signals.voice.points.map(toXY);
const opennessLine = smoothPath(opennessPts);
const opennessArea = `${opennessLine} L ${X1} ${Y_GUARD} L ${X0} ${Y_GUARD} Z`;
const voiceLine = smoothPath(voicePts);

const defaultMoment = Math.max(
  0,
  data.moments.findIndex((m) => "shift" in m && m.shift),
);

export function EmpathyMirror() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(defaultMoment);
  const moment = data.moments[active];
  const mx = fx(moment.t);

  // Free-hover cursor: a dot riding the ink line + a smoothly-counting readout.
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [hovering, setHovering] = useState(false);

  const rawX = useMotionValue(fx(moment.t));
  const rawY = useMotionValue(fy(moment.value));
  const rawFelt = useMotionValue(moment.value * 100);

  const spring = { stiffness: 320, damping: 30, mass: 0.4 };
  const cx = useSpring(rawX, spring);
  const cy = useSpring(rawY, spring);
  const feltSpring = useSpring(rawFelt, { stiffness: 140, damping: 20 });

  // Use springs for the smooth ride; jump straight to values under reduced motion.
  const px = reduce ? rawX : cx;
  const py = reduce ? rawY : cy;
  const feltMv = reduce ? rawFelt : feltSpring;

  const feltText = useTransform(feltMv, (v) => Math.round(v).toString());
  const leftPct = useTransform(px, (x) => `${(x / 480) * 100}%`);
  const topPct = useTransform(py, (y) => `${(y / 260) * 100}%`);

  function handleMove(e: React.PointerEvent) {
    const svg = svgRef.current;
    const path = pathRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !path || !ctm) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const loc = pt.matrixTransform(ctm.inverse());
    const x = Math.max(X0, Math.min(X1, loc.x));
    const y = yAtX(path, x);
    rawX.set(x);
    rawY.set(y);
    rawFelt.set(feltFromY(y));
    if (!hovering) setHovering(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-[3px] bg-accent" aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            {data.label}
          </span>
        </div>
        {/* Legend for the two channels felt. reads together */}
        <div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-[3px] w-3.5 rounded-full" style={{ background: INK }} aria-hidden />
            {data.signals.openness.name}
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-0 w-3.5 border-t-2 border-dashed"
              style={{ borderColor: ORANGE }}
              aria-hidden
            />
            {data.signals.voice.name}
          </span>
        </div>
      </div>

      <div
        className="relative mt-2"
        onPointerMove={handleMove}
        onPointerLeave={() => setHovering(false)}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 480 260"
          className="w-full touch-none"
          role="img"
          aria-label="Two lines across one 1:1. The person warms up early, drops sharply to guarded at the moment things shift, then only partly recovers. Voice warmth stays higher longer, masking the drop."
        >
          <defs>
            <linearGradient id="fillFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={INK} stopOpacity="0.07" />
              <stop offset="100%" stopColor={INK} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Faint baseline grid */}
          {[40, 100, 160, 220].map((y) => (
            <line
              key={y}
              x1={X0}
              x2={X1}
              y1={y}
              y2={y}
              stroke={INK}
              strokeOpacity="0.06"
              strokeWidth="1"
            />
          ))}

          {/* Vertical guide at the active moment */}
          <motion.line
            x1={mx}
            x2={mx}
            y1={Y_OPEN}
            y2={Y_GUARD}
            stroke={ORANGE}
            strokeOpacity="0.3"
            strokeWidth="1"
            strokeDasharray="3 4"
            animate={{ x1: mx, x2: mx }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Area under the openness line */}
          <motion.path
            d={opennessArea}
            fill="url(#fillFade)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: reduce ? 0 : 1.2 }}
          />

          {/* Secondary signal: voice warmth (drawn behind, dashed) */}
          <motion.path
            d={voiceLine}
            fill="none"
            stroke={ORANGE}
            strokeWidth="2"
            strokeDasharray="4 5"
            strokeLinecap="round"
            initial={{ opacity: reduce ? 1 : 0 }}
            whileInView={{ opacity: 0.9 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: reduce ? 0 : 0.9 }}
          />

          {/* Primary signal: how they felt, drawing itself */}
          <motion.path
            ref={pathRef}
            d={opennessLine}
            fill="none"
            stroke={INK}
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduce ? 0 : 1.5, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Moment markers */}
          {data.moments.map((m, i) => {
            const [cx, cy] = toXY([m.t, m.value]);
            const on = i === active;
            return (
              <g key={m.label}>
                {on && !reduce && (
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r="7"
                    fill={ORANGE}
                    fillOpacity="0.3"
                    animate={{ r: [7, 16], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={on ? 5.5 : 4}
                  fill={on ? ORANGE : "#fbf9f3"}
                  stroke={on ? "#fbf9f3" : INK}
                  strokeWidth={on ? 2.5 : 1.75}
                />
              </g>
            );
          })}

          {/* Free-hover cursor dot, riding the ink line under the pointer */}
          <motion.circle
            cx={px}
            cy={py}
            r="5"
            fill="#fbf9f3"
            stroke={INK}
            strokeWidth="2.5"
            style={{ pointerEvents: "none" }}
            animate={{ opacity: hovering ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          />
        </svg>

        {/* Floating "felt" readout that counts to the value under the pointer */}
        <motion.div
          aria-hidden
          style={{ left: leftPct, top: topPct }}
          animate={{ opacity: hovering ? 1 : 0, scale: hovering ? 1 : 0.9 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-lg border border-line bg-background/95 px-2.5 py-1.5 text-center shadow-[0_8px_24px_-12px_rgba(26,23,18,0.4)] backdrop-blur-sm"
        >
          <div className="flex items-baseline gap-1">
            <motion.span className="text-base font-semibold leading-none tabular-nums tracking-tight text-foreground">
              {feltText}
            </motion.span>
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
              felt
            </span>
          </div>
        </motion.div>

        {/* Clickable / focusable hit targets over each marker (keyboard + SR) */}
        {data.moments.map((m, i) => {
          const [cx, cy] = toXY([m.t, m.value]);
          return (
            <button
              key={m.label}
              type="button"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              aria-pressed={i === active}
              aria-label={`${m.at}: ${m.label}. You said, ${m.said}. They felt: ${m.felt}`}
              className="absolute h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              style={{ left: `${(cx / 480) * 100}%`, top: `${(cy / 260) * 100}%` }}
            />
          );
        })}

        {/* Y hints */}
        <span className="pointer-events-none absolute left-0 top-0 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          Open
        </span>
        <span className="pointer-events-none absolute bottom-6 left-0 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          Guarded
        </span>
      </div>

      {/* X axis */}
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        <span>Start of 1:1</span>
        <span>End</span>
      </div>

      {/* Detail panel: the selected moment, decoded. Driven by the chart. */}
      <div className="mt-4 min-h-[132px] rounded-xl border border-line bg-background/60 p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -6 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2.5">
              <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-white">
                {moment.signal}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                {moment.label} · {moment.at}
              </span>
            </div>

            <p className="mt-3 font-display text-[15px] italic leading-snug text-foreground">
              &ldquo;{moment.said}&rdquo;
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{moment.felt}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
