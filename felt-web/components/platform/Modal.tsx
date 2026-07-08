"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * Reusable overlay shell for the /app demo — backdrop + centered (or top-aligned)
 * panel, esc-to-close, click-out, body-scroll lock, motion. Flat/near-black to
 * match the app theme. Callers own the panel's inner content.
 */
export function Modal({
  open,
  onClose,
  children,
  align = "center",
  panelClassName = "w-full max-w-md",
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  align?: "center" | "top";
  panelClassName?: string;
  labelledBy?: string;
}) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={[
            "fixed inset-0 z-[70] flex justify-center bg-black/60 p-4 backdrop-blur-sm",
            align === "top" ? "items-start pt-[12vh]" : "items-center",
          ].join(" ")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={[
              "max-h-[80vh] overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_80px_-24px_rgba(0,0,0,0.8)]",
              panelClassName,
            ].join(" ")}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
