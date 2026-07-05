import { Check } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";
import { differentiators } from "@/content/site";

export function Differentiators() {
  return (
    <section className="border-t border-line px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl leading-[1.15] tracking-tight text-foreground sm:text-4xl">
            {differentiators.heading}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">{differentiators.body}</p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {differentiators.points.map((point, i) => (
            <Reveal key={i} delay={i * 0.08} direction={i % 2 === 0 ? "left" : "right"}>
              <div className="flex h-full gap-4 rounded-2xl bg-surface p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_-28px_rgba(26,23,18,0.4)]">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-strong text-white">
                  <Check size={14} weight="bold" />
                </span>
                <p className="text-lg leading-relaxed text-ink-soft">{point}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
