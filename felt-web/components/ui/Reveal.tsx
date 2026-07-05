"use client";

import { motion, useReducedMotion } from "motion/react";

type Direction = "up" | "left" | "right";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Which way the content drifts in from. Defaults to a plain rise. */
  direction?: Direction;
};

const offset: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 20 },
  left: { x: -28, y: 0 },
  right: { x: 28, y: 0 },
};

/** Fade-and-drift on scroll into view. Honors reduced-motion. MOTION_INTENSITY 4. */
export function Reveal({ children, className, delay = 0, direction = "up" }: Props) {
  const reduce = useReducedMotion();
  const { x, y } = offset[direction];
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
