"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The vertical connector behind a stepped timeline. Draws itself downward as the
 * list scrolls into view, tying the steps into one sequence. Honors
 * reduced-motion by rendering fully drawn. MOTION_INTENSITY 4.
 */
export function TimelineLine({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={className}
      style={{ transformOrigin: "top" }}
      initial={reduce ? { scaleY: 1 } : { scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
