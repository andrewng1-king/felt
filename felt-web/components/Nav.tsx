import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-[var(--background)]/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
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
              className="text-sm text-stone-600 transition hover:text-stone-900"
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
