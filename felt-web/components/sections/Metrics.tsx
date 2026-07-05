import { Heart, Waveform, WarningDiamond } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";
import { metrics } from "@/content/site";

const icons = [Heart, Waveform, WarningDiamond];

export function Metrics() {
  const [featured, second, third] = metrics.items;

  return (
    <section className="border-t border-line px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display max-w-2xl text-3xl leading-[1.15] tracking-tight text-foreground sm:text-4xl">
            {metrics.heading}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {/* Featured: wide accent tile */}
          <Reveal className="md:col-span-2">
            <article className="flex h-full flex-col justify-between rounded-2xl bg-accent-strong p-8 text-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-28px_rgba(154,71,51,0.7)]">
              <Heart size={28} weight="light" className="text-white/70" />
              <div className="mt-16">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-white/70">
                  {featured.phase}
                </span>
                <h3 className="font-display mt-2 text-2xl tracking-tight">{featured.name}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-white/85">{featured.body}</p>
              </div>
            </article>
          </Reveal>

          {/* Second: tinted tile */}
          <Reveal delay={0.08}>
            <article className="flex h-full flex-col justify-between rounded-2xl bg-surface p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_-28px_rgba(26,23,18,0.4)]">
              <Waveform size={28} weight="light" className="text-accent-strong" />
              <div className="mt-16">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
                  {second.phase}
                </span>
                <h3 className="font-display mt-2 text-xl tracking-tight text-foreground">
                  {second.name}
                </h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{second.body}</p>
              </div>
            </article>
          </Reveal>

          {/* Third: full-width bordered tile */}
          <Reveal delay={0.12} className="md:col-span-3">
            <article className="flex flex-col gap-4 rounded-2xl border border-line p-8 transition duration-300 hover:-translate-y-1 hover:border-accent-soft hover:shadow-[0_24px_44px_-28px_rgba(26,23,18,0.4)] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <WarningDiamond size={28} weight="light" className="text-highlight" />
                <div>
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
                    {third.phase}
                  </span>
                  <h3 className="font-display mt-1 text-xl tracking-tight text-foreground">
                    {third.name}
                  </h3>
                </div>
              </div>
              <p className="max-w-md leading-relaxed text-ink-soft">{third.body}</p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
