"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

export function Nav() {
  // Gains a shadow + firmer border once you scroll off the hero, so the page
  // reads as having depth and you can feel you've left the top.
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-[var(--background)]/80 backdrop-blur transition-[box-shadow,border-color,background-color] duration-300",
        scrolled || open
          ? "border-line bg-[var(--background)]/90 shadow-[0_10px_30px_-24px_rgba(26,23,18,0.5)]"
          : "border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 rounded outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          <svg width="34" height="18" viewBox="0 0 42 22" fill="none" aria-hidden className="text-foreground">
            <path d="M3 11 Q 9 4, 15 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M15 11 Q 21 18, 27 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
            <path d="M27 11 Q 33 4, 39 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.2" />
          </svg>
          <span className="font-display text-2xl leading-none tracking-tight text-foreground">
            {site.name}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded text-sm text-ink-soft outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <Button href="#waitlist" className="hidden px-5 py-2 md:inline-flex">
          {site.cta}
        </Button>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-1.5 inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground outline-none transition hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-accent/50 md:hidden"
        >
          {open ? <X size={22} /> : <List size={22} />}
        </button>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-[var(--background)]/95 backdrop-blur md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
              {site.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-3 text-base text-ink-soft outline-none transition hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                  {item.label}
                </Link>
              ))}
              <Button href="#waitlist" onClick={() => setOpen(false)} className="mt-2 w-full">
                {site.cta}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
