import { Heart, Waveform, WarningDiamond } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";
import { metrics } from "@/content/site";

const icons = [Heart, Waveform, WarningDiamond];

export function Metrics() {
  const [featured, second, third] = metrics.items;

  return (
    <section className="border-t border-zinc-200 px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
            {metrics.heading}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {/* Featured: wide emerald tile */}
          <Reveal className="md:col-span-2">
            <article className="flex h-full flex-col justify-between rounded-2xl bg-emerald-700 p-8 text-white">
              <Heart size={28} weight="light" className="text-emerald-200" />
              <div className="mt-16">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-200">
                  {featured.phase}
                </span>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">{featured.name}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-emerald-50/90">{featured.body}</p>
              </div>
            </article>
          </Reveal>

          {/* Second: tinted tile */}
          <Reveal delay={0.08}>
            <article className="flex h-full flex-col justify-between rounded-2xl bg-zinc-100 p-8">
              <Waveform size={28} weight="light" className="text-emerald-700" />
              <div className="mt-16">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                  {second.phase}
                </span>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900">
                  {second.name}
                </h3>
                <p className="mt-3 leading-relaxed text-zinc-600">{second.body}</p>
              </div>
            </article>
          </Reveal>

          {/* Third: full-width bordered tile */}
          <Reveal delay={0.12} className="md:col-span-3">
            <article className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <WarningDiamond size={28} weight="light" className="text-emerald-700" />
                <div>
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                    {third.phase}
                  </span>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900">
                    {third.name}
                  </h3>
                </div>
              </div>
              <p className="max-w-md leading-relaxed text-zinc-600">{third.body}</p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
