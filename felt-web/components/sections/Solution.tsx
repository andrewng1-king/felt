import { Compass, Eye, ChartLineUp } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";
import { solution } from "@/content/site";

const icons = [Compass, Eye, ChartLineUp];

export function Solution() {
  return (
    <section id="how" className="bg-zinc-900 px-6 py-24 text-zinc-100 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {solution.heading}
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {solution.phases.map((phase, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={phase.tag} delay={i * 0.1}>
                <div className="border-t border-zinc-700 pt-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                    <Icon size={22} weight="light" />
                  </span>
                  <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-emerald-400">
                    {phase.tag}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight">{phase.title}</h3>
                  <p className="mt-3 leading-relaxed text-zinc-400">{phase.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
