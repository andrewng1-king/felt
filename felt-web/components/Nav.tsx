"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

export function Nav() {
  // Gains a shadow + firmer border once you scroll off the hero, so the page
  // reads as having depth and you can feel you've left the top.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-[var(--background)]/80 backdrop-blur transition-[box-shadow,border-color,background-color] duration-300",
        scrolled
          ? "border-line bg-[var(--background)]/90 shadow-[0_10px_30px_-24px_rgba(26,23,18,0.5)]"
          : "border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
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
        <Button href="#waitlist" className="px-5 py-2">
          {site.cta}
        </Button>
      </nav>
    </header>
  );
}
