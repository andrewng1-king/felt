"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Scroll-driven zoom for the hero visual. The child starts slightly small and
 * tilted back, then scales up and settles flat as it scrolls into view — a
 * subtle "the product comes to you" feel. Honors reduced-motion. MOTION_INTENSITY 5.
 */
export function ScrollZoom({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // 0 when the element's top meets the viewport bottom, 1 once it settles centered.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  // Smooth the raw scroll so the zoom glides instead of tracking every pixel.
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  const scale = useTransform(progress, [0, 1], [0.9, 1]);
  const y = useTransform(progress, [0, 1], [36, 0]);
  const rotateX = useTransform(progress, [0, 1], [6, 0]);

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className} style={{ perspective: 1200 }}>
      <motion.div style={{ scale, y, rotateX, transformOrigin: "center top" }}>
        {children}
      </motion.div>
    </div>
  );
}
