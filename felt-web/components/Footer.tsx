import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-stone-200/70 px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xs">
          <p className="font-display text-2xl tracking-tight text-stone-900">{site.name}</p>
          <p className="mt-3 text-sm leading-relaxed text-stone-500">
            The feedback your people can&rsquo;t give you.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-stone-600">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-stone-900">
              {item.label}
            </Link>
          ))}
          <a href={`mailto:${site.email}`} className="transition hover:text-stone-900">
            {site.email}
          </a>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-6xl text-xs text-stone-400">
        © 2026 felt. All rights reserved.
      </div>
    </footer>
  );
}
