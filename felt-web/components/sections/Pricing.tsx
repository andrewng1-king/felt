import { Check } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { pricing, site } from "@/content/site";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-zinc-200 px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
            {pricing.heading}
          </h2>
        </Reveal>

        <div className="mt-14 grid items-start gap-6 md:grid-cols-3">
          {pricing.tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.08}>
              <article
                className={cn(
                  "flex h-full flex-col rounded-2xl p-8",
                  tier.featured
                    ? "bg-zinc-900 text-white ring-1 ring-zinc-900"
                    : "border border-zinc-200 bg-white text-zinc-900",
                )}
              >
                {tier.featured && (
                  <span className="mb-4 inline-flex w-fit rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-emerald-400">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold tracking-tight">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">{tier.price}</span>
                  <span className={cn("text-sm", tier.featured ? "text-zinc-400" : "text-zinc-500")}>
                    {tier.cadence}
                  </span>
                </div>
                <p className={cn("mt-3 text-sm leading-relaxed", tier.featured ? "text-zinc-400" : "text-zinc-600")}>
                  {tier.pitch}
                </p>

                <ul className="mt-8 flex flex-col gap-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check
                        size={16}
                        weight="bold"
                        className={cn("mt-0.5 shrink-0", tier.featured ? "text-emerald-400" : "text-emerald-700")}
                      />
                      <span className={tier.featured ? "text-zinc-200" : "text-zinc-700"}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  href="#waitlist"
                  variant={tier.featured ? "primary" : "ghost"}
                  className="mt-8 w-full"
                >
                  {site.cta}
                </Button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
