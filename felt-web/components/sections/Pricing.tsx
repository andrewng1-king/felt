import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { pilot } from "@/content/site";

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-stone-200/70 px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-3xl">
        {/* Primary CTA: the Proof of Signal pilot */}
        <Reveal>
          <div className="rounded-3xl border border-line bg-bg-alt p-8 shadow-[0_30px_70px_-40px_rgba(26,23,18,0.34)] sm:p-12">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent-strong">
              {pilot.eyebrow}
            </p>
            <h2 className="font-display mt-4 text-3xl leading-[1.1] tracking-tight text-foreground sm:text-[2.75rem]">
              {pilot.heading}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">{pilot.subhead}</p>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">{pilot.detail}</p>

            <div className="mt-9">
              <Button href="#waitlist" className="gap-2 px-7 py-3.5 text-base">
                {pilot.cta}
                <ArrowRight size={18} weight="bold" />
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Secondary, lighter: what happens after the pilot */}
        <Reveal delay={0.08}>
          <div className="mx-auto mt-10 max-w-xl px-2 text-center">
            <h3 className="text-sm font-medium uppercase tracking-[0.14em] text-muted">
              {pilot.after.heading}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{pilot.after.body}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
