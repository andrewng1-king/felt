import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { EmpathyMirror } from "@/components/EmpathyMirror";
import { hero, site } from "@/content/site";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pt-16 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24 lg:pb-32">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">
          {hero.eyebrow}
        </p>
        <h1 className="font-display mt-6 text-[2.6rem] leading-[1.06] tracking-tight text-stone-900 sm:text-5xl lg:text-[3.75rem]">
          The feedback your people{" "}
          <em className="font-display italic text-emerald-800">can&rsquo;t</em> give you.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-stone-600">
          {hero.subtext}
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button href="#waitlist">{site.cta}</Button>
          <Button href={hero.secondaryHref} variant="ghost">
            {hero.secondaryCta}
          </Button>
        </div>
      </Reveal>

      <Reveal delay={0.12}>
        <EmpathyMirror />
      </Reveal>
    </section>
  );
}
