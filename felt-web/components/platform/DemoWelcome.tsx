"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, Command } from "@phosphor-icons/react/dist/ssr";

/**
 * One-time welcome for the demo — introduces the sample-data nature and teaches
 * the ⌘K palette. Dismissal persists so it shows once. Floats bottom-left (the
 * palette switcher owns bottom-right).
 */
export function DemoWelcome({ onOpenPalette }: { onOpenPalette: () => void }) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("felt-welcomed")) {
      const t = setTimeout(() => setShow(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  function dismiss() {
    localStorage.setItem("felt-welcomed", "1");
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 left-5 z-50 w-[min(20rem,calc(100vw-2.5rem))] rounded-2xl border border-line bg-surface p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-foreground">Welcome to the felt. demo</p>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="-mr-1 -mt-1 rounded-md p-1 text-muted outline-none transition hover:bg-surface-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <X size={15} />
            </button>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
            Everything here runs on sample data. Explore the reads, rehearse a hard talk, or jump anywhere with
            the command palette.
          </p>
          <button
            type="button"
            onClick={() => {
              dismiss();
              onOpenPalette();
            }}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground outline-none transition hover:bg-line focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <span className="inline-flex items-center gap-1 text-muted">
              <Command size={12} weight="bold" /> K
            </span>
            Open command palette
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
