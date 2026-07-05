import { Heart, Waveform, WarningDiamond } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";
import { metrics } from "@/content/site";

const icons = [Heart, Waveform, WarningDiamond];

export function Metrics() {
  const [featured, second, third] = metrics.items;

  return (
    <section className="border-t border-stone-200/70 px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display max-w-2xl text-3xl leading-[1.15] tracking-tight text-stone-900 sm:text-4xl">
            {metrics.heading}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {/* Featured: wide accent tile */}
          <Reveal className="md:col-span-2">
            <article className="flex h-full flex-col justify-between rounded-2xl bg-accent-strong p-8 text-white">
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
            <article className="flex h-full flex-col justify-between rounded-2xl bg-stone-100 p-8">
              <Waveform size={28} weight="light" className="text-accent-strong" />
              <div className="mt-16">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-stone-500">
                  {second.phase}
                </span>
                <h3 className="font-display mt-2 text-xl tracking-tight text-stone-900">
                  {second.name}
                </h3>
                <p className="mt-3 leading-relaxed text-stone-600">{second.body}</p>
              </div>
            </article>
          </Reveal>

          {/* Third: full-width bordered tile */}
          <Reveal delay={0.12} className="md:col-span-3">
            <article className="flex flex-col gap-4 rounded-2xl border border-stone-200 p-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <WarningDiamond size={28} weight="light" className="text-highlight" />
                <div>
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-stone-500">
                    {third.phase}
                  </span>
                  <h3 className="font-display mt-1 text-xl tracking-tight text-stone-900">
                    {third.name}
                  </h3>
                </div>
              </div>
              <p className="max-w-md leading-relaxed text-stone-600">{third.body}</p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
