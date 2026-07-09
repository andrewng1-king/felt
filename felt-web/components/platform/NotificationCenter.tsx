"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import {
  SignalsPanel,
  SeveritySummary,
  countBySeverity,
} from "@/components/platform/severity";
import { signals as allSignals, type Signal } from "@/content/platform";

/** Floating notification panel — the ranked feed, anchored under the top-bar bell. */
export function NotificationCenter({
  onClose,
  onSignal,
  onViewAll,
}: {
  onClose: () => void;
  onSignal: (s: Signal) => void;
  onViewAll: () => void;
}) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const counts = countBySeverity(allSignals);
  const unread = allSignals.filter((s) => s.unread).length;

  const handle = (s: Signal) => {
    onClose();
    onSignal(s);
  };

  return (
    <>
      {/* Click-away layer */}
      <button
        aria-hidden
        tabIndex={-1}
        onClick={onClose}
        className="fixed inset-0 z-40 cursor-default"
      />
      <motion.div
        role="dialog"
        aria-label="Notifications"
        initial={reduce ? false : { opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-0 top-full z-50 mt-2 w-[min(92vw,23rem)] overflow-hidden rounded-2xl border border-line bg-background shadow-[0_18px_50px_-12px_rgba(0,0,0,0.7)]"
      >
        <div className="border-b border-line px-4 py-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
            {unread > 0 && (
              <span className="rounded-full bg-danger-soft px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-danger">
                {unread} new
              </span>
            )}
          </div>
          <SeveritySummary counts={counts} className="mt-2.5" />
        </div>

        <div className="max-h-[24rem] overflow-y-auto p-3">
          <SignalsPanel items={allSignals} onSignal={handle} compact />
        </div>

        <button
          type="button"
          onClick={() => {
            onClose();
            onViewAll();
          }}
          className="flex w-full items-center justify-center gap-1.5 border-t border-line px-4 py-2.5 text-xs font-medium text-ink-soft outline-none transition hover:bg-surface hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50"
        >
          View all in Risk &amp; Trends
          <ArrowRight size={13} weight="bold" />
        </button>
      </motion.div>
    </>
  );
}
