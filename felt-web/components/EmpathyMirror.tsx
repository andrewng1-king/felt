"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Play, Pause } from "@phosphor-icons/react/dist/ssr";
import { empathyMirror } from "@/content/site";

/** Shape of one conversation's Empathy Mirror read. Matches `empathyMirror`. */
export type MirrorData = {
  label: string;
  signals: {
    openness: { name: string; points: readonly (readonly [number, number])[] };
    voice: { name: string; points: readonly (readonly [number, number])[] };
  };
  moments: readonly {
    t: number;
    value: number;
    at: string;
    label: string;
    signal: string;
    said: string;
    felt: string;
    shift?: boolean;
  }[];
  read: string;
};

/**
 * The interactive core: a single "emotional line" of one 1:1, second by second.
 * ONE line is the protagonist — how the other person felt — its stroke colored by
 * temperature (accent when open, muted when guarded). Voice warmth sits behind as
 * a faint band, context not competition. Play sweeps a scrubber across the talk;
 * hover scrubs by hand. Turning points dock a caption below.
 */

// Plot geometry (SVG user units). Left→right = start→end of the 1:1.
const X0 = 40;
const X1 = 440;
const Y_OPEN = 40; // top = open
const Y_GUARD = 220; // bottom = guarded
const Y_MID = (Y_OPEN + Y_GUARD) / 2;

const INK = "var(--foreground)";
const ACCENT = "var(--accent)";
const PAPER = "var(--bg-alt)";

const fx = (t: number) => X0 + t * (X1 - X0);
const fy = (v: number) => Y_GUARD - v * (Y_GUARD - Y_OPEN);
const toXY = ([t, v]: readonly [number, number]): [number, number] => [fx(t), fy(v)];

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

export function EmpathyMirror({
  data = empathyMirror as MirrorData,
  autoPlay = false,
}: { data?: MirrorData; autoPlay?: boolean } = {}) {
  const reduce = useReducedMotion();

  const { opennessLine, voiceArea, defaultMoment } = useMemo(() => {
    const oPts = data.signals.openness.points.map(toXY);
    const vPts = data.signals.voice.points.map(toXY);
    const vLine = smoothPath(vPts);
    return {
      opennessLine: smoothPath(oPts),
      voiceArea: `${vLine} L ${X1} ${Y_GUARD} L ${X0} ${Y_GUARD} Z`,
      defaultMoment: Math.max(0, data.moments.findIndex((m) => m.shift)),
    };
  }, [data]);

  const [active, setActive] = useState(defaultMoment);
  const moment = data.moments[active];
  const mx = fx(moment.t);

  // Free-hover / playhead cursor: a dot riding the line + a counting readout.
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [hovering, setHovering] = useState(false);
  const [playing, setPlaying] = useState(false);

  const rawX = useMotionValue(fx(moment.t));
  const rawY = useMotionValue(fy(moment.value));
  const rawFelt = useMotionValue(moment.value * 100);

  const spring = { stiffness: 320, damping: 30, mass: 0.4 };
  const cx = useSpring(rawX, spring);
  const cy = useSpring(rawY, spring);
  const feltSpring = useSpring(rawFelt, { stiffness: 140, damping: 20 });

  const px = reduce ? rawX : cx;
  const py = reduce ? rawY : cy;
  const feltMv = reduce ? rawFelt : feltSpring;

  const feltText = useTransform(feltMv, (v) => Math.round(v).toString());
  const leftPct = useTransform(px, (x) => `${(x / 480) * 100}%`);
  const topPct = useTransform(py, (y) => `${(y / 260) * 100}%`);

  // Playhead position (in user units) while playing.
  const playX = useMotionValue(fx(0));
  const playLeft = useTransform(playX, (x) => `${(x / 480) * 100}%`);
  const playControls = useRef<ReturnType<typeof animate> | null>(null);

  const cursorVisible = hovering || playing;

  function driveTo(x: number) {
    const path = pathRef.current;
    if (!path) return;
    const y = yAtX(path, x);
    rawX.set(x);
    rawY.set(y);
    rawFelt.set(feltFromY(y));
  }

  function play() {
    if (reduce) return;
    playControls.current?.stop();
    setPlaying(true);
    playX.set(fx(0));
    playControls.current = animate(playX, fx(1), {
      duration: 4.2,
      ease: "linear",
      onUpdate: (x) => {
        driveTo(x);
        const t = (x - X0) / (X1 - X0);
        let idx = 0;
        for (let i = 0; i < data.moments.length; i++) if (data.moments[i].t <= t) idx = i;
        setActive(idx);
      },
      onComplete: () => setPlaying(false),
    });
  }

  function stop() {
    playControls.current?.stop();
    setPlaying(false);
  }

  function handleMove(e: React.PointerEvent) {
    if (playing) stop();
    const svg = svgRef.current;
    const path = pathRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !path || !ctm) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const loc = pt.matrixTransform(ctm.inverse());
    const x = Math.max(X0, Math.min(X1, loc.x));
    driveTo(x);
    if (!hovering) setHovering(true);
  }

  // The signature moment: when asked to (e.g. opening a 1:1 report), let the line
  // draw itself in, then sweep the playhead across the whole conversation once.
  // Opt-in so the marketing shot stays hover-only; skipped under reduced motion.
  const didAuto = useRef(false);
  useEffect(() => {
    if (!autoPlay || reduce || didAuto.current) return;
    didAuto.current = true;
    const id = setTimeout(() => play(), 1700); // after the line finishes drawing
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, reduce]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => (playing ? stop() : play())}
            disabled={!!reduce}
            aria-label={playing ? "Pause replay" : "Replay the conversation"}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[color:var(--on-accent)] outline-none transition hover:bg-accent-strong focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-40"
          >
            {playing ? <Pause size={13} weight="fill" /> : <Play size={13} weight="fill" />}
          </button>
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            {data.label}
          </span>
        </div>
        {/* Legend: the one line vs. the voice band behind it */}
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.08em] text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-[3px] w-3.5 rounded-full bg-accent" aria-hidden />
            {data.signals.openness.name}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-3.5 rounded-sm bg-accent/15" aria-hidden />
            {data.signals.voice.name}
          </span>
        </div>
      </div>

      <div
        className="relative mt-3"
        onPointerMove={handleMove}
        onPointerLeave={() => setHovering(false)}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 480 260"
          className="w-full touch-none"
          role="img"
          aria-label="One line across a single 1:1. The person warms up early, drops sharply to guarded at the moment things shift, then only partly recovers."
        >
          <defs>
            {/* Stroke colored by temperature: accent when open (top), muted when guarded (bottom). */}
            <linearGradient id="feltStroke" x1="0" y1={Y_OPEN} x2="0" y2={Y_GUARD} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--muted)" />
            </linearGradient>
            {/* Faint open-zone wash. */}
            <linearGradient id="zoneWash" x1="0" y1={Y_OPEN} x2="0" y2={Y_GUARD} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.06" />
              <stop offset="60%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="voiceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Open-zone wash + a single quiet mid baseline */}
          <rect x={X0} y={Y_OPEN} width={X1 - X0} height={Y_GUARD - Y_OPEN} fill="url(#zoneWash)" />
          <line x1={X0} x2={X1} y1={Y_MID} y2={Y_MID} stroke={INK} strokeOpacity="0.08" strokeWidth="1" strokeDasharray="2 6" />

          {/* Voice warmth: a faint band behind the line (context, not a competitor) */}
          <motion.path
            d={voiceArea}
            fill="url(#voiceFill)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: reduce ? 0 : 0.9 }}
          />

          {/* Vertical guide at the active moment */}
          <motion.line
            x1={mx}
            x2={mx}
            y1={Y_OPEN}
            y2={Y_GUARD}
            stroke={ACCENT}
            strokeOpacity="0.3"
            strokeWidth="1"
            strokeDasharray="3 4"
            animate={{ x1: mx, x2: mx }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* The one emotional line — thin, temperature-colored, drawing itself in */}
          <motion.path
            ref={pathRef}
            d={opennessLine}
            fill="none"
            stroke="url(#feltStroke)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduce ? 0 : 1.5, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Moment markers */}
          {data.moments.map((m, i) => {
            const [cxi, cyi] = toXY([m.t, m.value]);
            const on = i === active;
            return (
              <g key={m.label}>
                {on && !reduce && (
                  <motion.circle
                    cx={cxi}
                    cy={cyi}
                    r="6"
                    fill={ACCENT}
                    fillOpacity="0.3"
                    animate={{ r: [6, 15], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <circle
                  cx={cxi}
                  cy={cyi}
                  r={on ? 5 : 3.5}
                  fill={on ? ACCENT : PAPER}
                  stroke={on ? PAPER : INK}
                  strokeWidth={on ? 2 : 1.5}
                />
              </g>
            );
          })}

          {/* Playhead while replaying */}
          <motion.line
            x1={playX}
            x2={playX}
            y1={Y_OPEN - 6}
            y2={Y_GUARD}
            stroke={ACCENT}
            strokeWidth="1.5"
            style={{ opacity: playing ? 0.7 : 0 }}
          />

          {/* Cursor dot riding the line (hover or playback) */}
          <motion.circle
            cx={px}
            cy={py}
            r="4.5"
            fill={PAPER}
            stroke={ACCENT}
            strokeWidth="2.5"
            style={{ pointerEvents: "none" }}
            animate={{ opacity: cursorVisible ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          />
        </svg>

        {/* Floating "felt" readout that counts to the value under the cursor */}
        <motion.div
          aria-hidden
          style={{ left: cursorVisible ? leftPct : playLeft, top: topPct }}
          animate={{ opacity: cursorVisible ? 1 : 0, scale: cursorVisible ? 1 : 0.9 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-lg border border-line bg-surface px-2.5 py-1.5 text-center shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]"
        >
          <div className="flex items-baseline gap-1">
            <motion.span className="text-base font-semibold leading-none tabular-nums tracking-tight text-foreground">
              {feltText}
            </motion.span>
            <span className="text-[9px] uppercase tracking-[0.12em] text-muted">felt</span>
          </div>
        </motion.div>

        {/* Clickable / focusable hit targets over each marker (keyboard + SR) */}
        {data.moments.map((m, i) => {
          const [cxi, cyi] = toXY([m.t, m.value]);
          return (
            <button
              key={m.label}
              type="button"
              onClick={() => {
                stop();
                setActive(i);
              }}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              aria-pressed={i === active}
              aria-label={`${m.at}: ${m.label}. You said, ${m.said}. They felt: ${m.felt}`}
              className="absolute h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              style={{ left: `${(cxi / 480) * 100}%`, top: `${(cyi / 260) * 100}%` }}
            />
          );
        })}

        {/* Y hints */}
        <span className="pointer-events-none absolute left-0 top-0 text-[10px] uppercase tracking-[0.14em] text-muted">
          Open
        </span>
        <span className="pointer-events-none absolute bottom-6 left-0 text-[10px] uppercase tracking-[0.14em] text-muted">
          Guarded
        </span>
      </div>

      {/* Labeled time ticks for the turning points */}
      <div className="relative mt-1 h-4">
        {data.moments.map((m) => (
          <span
            key={m.label}
            className="absolute -translate-x-1/2 whitespace-nowrap text-[10px] tabular-nums text-muted"
            style={{ left: `${(fx(m.t) / 480) * 100}%` }}
          >
            {m.at.replace(" in", "")}
          </span>
        ))}
      </div>

      {/* X axis */}
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-muted">
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
              <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-[color:var(--on-accent)]">
                {moment.signal}
              </span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-muted">
                {moment.label} · {moment.at}
              </span>
            </div>

            <p className="mt-3 text-[15px] italic leading-snug text-foreground">
              &ldquo;{moment.said}&rdquo;
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{moment.felt}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
