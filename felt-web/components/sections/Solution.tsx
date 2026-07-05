import { Compass, Eye, ChartLineUp } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";
import { TimelineLine } from "@/components/ui/TimelineLine";
import { solution } from "@/content/site";

const icons = [Compass, Eye, ChartLineUp];

export function Solution() {
  return (
    <section id="how" className="bg-ink-deep px-6 py-24 text-white/90 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display max-w-2xl text-3xl leading-[1.15] tracking-tight sm:text-4xl">
            {solution.heading}
          </h2>
        </Reveal>

        <ol className="relative mt-16 max-w-2xl">
          <TimelineLine className="absolute bottom-6 left-[21px] top-6 w-px bg-white/12" />
          {solution.phases.map((phase, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={phase.tag} delay={i * 0.1}>
                <li className="relative flex gap-6 pb-12 last:pb-0">
                  <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent ring-4 ring-ink-deep">
                    <Icon size={20} weight="light" />
                  </span>
                  <div className="pt-1">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
                      {phase.tag}
                    </p>
                    <h3 className="font-display mt-2 text-xl tracking-tight text-white sm:text-2xl">
                      {phase.title}
                    </h3>
                    <p className="mt-2 max-w-md leading-relaxed text-white/55">{phase.body}</p>
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
