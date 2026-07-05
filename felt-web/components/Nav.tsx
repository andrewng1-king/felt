import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-[var(--background)]/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-display text-2xl leading-none tracking-tight text-stone-900">
          {site.name}
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
