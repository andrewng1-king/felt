"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The signature visual: a real (illustrative) chart of how the other person
 * felt across a single 1:1: warming, then a dip where trust shifted, then a
 * partial recovery. The line draws itself as it enters view. Not app chrome,
 * not a fake screenshot: a labeled editorial figure showing the product's core
 * idea. Data is illustrative and marked as an example.
 */

// Emotional arc, top = open, bottom = guarded. Hand-plotted for the story.
const LINE =
  "M 36 214 C 84 200 104 162 146 150 C 190 137 202 118 232 118 C 266 118 276 206 300 248 C 324 240 352 214 382 210 C 408 206 428 220 444 224";
const AREA = `${LINE} L 444 300 L 36 300 Z`;

export function EmpathyMirror() {
  const reduce = useReducedMotion();

  return (
    <figure className="relative rounded-2xl border border-stone-200/80 bg-white/70 p-5 shadow-[0_24px_60px_-30px_rgba(28,25,23,0.28)] backdrop-blur-sm sm:p-6">
      {/* Header: label + honest "example" tag, no fake window chrome */}
      <figcaption className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-[3px] bg-emerald-700" aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
            Empathy Mirror
          </span>
        </div>
        <span className="rounded-full bg-stone-100 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-stone-400">
          Example
        </span>
      </figcaption>

      <p className="mt-4 text-sm leading-relaxed text-stone-600">
        How your last 1:1 actually landed, second by second.
      </p>

      <div className="relative mt-4">
        <svg
          viewBox="0 0 480 300"
          className="w-full"
          role="img"
          aria-label="A line showing the other person warming up early in the conversation, then dropping sharply to guarded at a shift point, then only partly recovering."
        >
          <defs>
            <linearGradient id="fillFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#047857" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Faint baseline grid */}
          {[90, 160, 230].map((y) => (
            <line
              key={y}
              x1="36"
              x2="444"
              y1={y}
              y2={y}
              stroke="#1c1917"
              strokeOpacity="0.06"
              strokeWidth="1"
            />
          ))}

          {/* Area under the curve, fades in after the line draws */}
          <motion.path
            d={AREA}
            fill="url(#fillFade)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: reduce ? 0 : 1.1 }}
          />

          {/* The emotional arc, drawing itself */}
          <motion.path
            d={LINE}
            fill="none"
            stroke="#047857"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: reduce ? 0 : 1.5, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Shift point marker */}
          <motion.g
            initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: reduce ? 0 : 1.25 }}
            style={{ transformOrigin: "300px 248px" }}
          >
            {!reduce && (
              <motion.circle
                cx="300"
                cy="248"
                r="7"
                fill="#047857"
                fillOpacity="0.28"
                animate={{ r: [7, 16], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <circle cx="300" cy="248" r="5" fill="#047857" stroke="#faf7f2" strokeWidth="2.5" />
          </motion.g>
        </svg>

        {/* Y hint */}
        <span className="pointer-events-none absolute left-0 top-1 font-mono text-[10px] uppercase tracking-[0.14em] text-stone-400">
          Open
        </span>
        <span className="pointer-events-none absolute bottom-9 left-0 font-mono text-[10px] uppercase tracking-[0.14em] text-stone-400">
          Guarded
        </span>

        {/* Shift annotation */}
        <motion.span
          className="absolute left-[54%] top-[62%] rounded-full bg-emerald-700 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm"
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: reduce ? 0 : 1.4 }}
        >
          The moment it shifted
        </motion.span>
      </div>

      {/* X axis */}
      <div className="mt-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-stone-400">
        <span>Start of 1:1</span>
        <span>End</span>
      </div>

      {/* One-line read of the arc */}
      <p className="mt-5 border-t border-stone-200/80 pt-4 text-sm leading-relaxed text-stone-700">
        They left more guarded than they arrived. You never heard it out loud.
      </p>
    </figure>
  );
}
