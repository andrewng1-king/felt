"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Emphasis word with a hand-drawn underline that draws itself in on load —
 * used on the one word the whole pitch hinges on. Honors reduced-motion by
 * showing the underline fully drawn. MOTION_INTENSITY 4.
 */
export function Underline({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <span className="font-display relative inline-block italic text-highlight">
      {children}
      <motion.span
        aria-hidden
        className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left rounded-full bg-highlight"
        initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
      />
    </span>
  );
}
