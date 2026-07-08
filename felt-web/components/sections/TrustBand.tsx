import { Reveal } from "@/components/ui/Reveal";
import { trust } from "@/content/site";

/**
 * Quiet credibility strip under the platform shot — one line + design-partner
 * wordmarks in muted ink. Illustrative names, kept low-key so it reads as
 * context, not a logo wall.
 */
export function TrustBand() {
  return (
    <section className="border-y border-line px-6 py-10">
      <Reveal className="mx-auto max-w-5xl">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          {trust.line}
        </p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12">
          {trust.partners.map((name) => (
            <li
              key={name}
              className="font-display text-base tracking-tight text-ink-soft/80 sm:text-lg"
            >
              {name}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
