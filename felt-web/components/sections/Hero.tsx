import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { hero, site } from "@/content/site";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:pt-24 lg:pb-32">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">
          {hero.eyebrow}
        </p>
        <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
          {hero.headline}
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-600">
          {hero.subtext}
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button href="#waitlist">{site.cta}</Button>
          <Button href={hero.secondaryHref} variant="ghost">
            {hero.secondaryCta}
          </Button>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="relative">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-200">
          <Image
            src="https://picsum.photos/seed/felt-quiet-conversation/900/1125"
            alt="Two colleagues in a quiet one-on-one conversation"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="img-editorial object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-900/25 to-transparent" />
        </div>
      </Reveal>
    </section>
  );
}
