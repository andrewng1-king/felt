import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xs">
          <p className="font-display text-2xl tracking-tight text-foreground">{site.name}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            The feedback your people can&rsquo;t give you.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-ink-soft">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="w-fit rounded outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="w-fit rounded outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            {site.email}
          </a>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-6xl text-xs text-muted">
        © 2026 felt. All rights reserved.
      </div>
    </footer>
  );
}
