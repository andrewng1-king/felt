import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Underline } from "@/components/ui/Underline";
import { hero, site } from "@/content/site";

/**
 * Separated hero: one big centered headline that stands alone. The platform
 * shot lives in its own band (PlatformShowcase) directly below, so the words
 * land first and the product follows — the "future of finance" hero shape.
 */
export function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center lg:pt-32 lg:pb-20">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent-strong">
          {hero.eyebrow}
        </p>
        <h1 className="font-display mx-auto mt-6 text-[2.75rem] leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-[4.25rem]">
          The feedback your people{" "}
          <Underline>can&rsquo;t</Underline>{" "}
          give you.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
          {hero.subtext}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button href="#waitlist">{site.cta}</Button>
          <Button href={hero.secondaryHref} variant="ghost">
            {hero.secondaryCta}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
