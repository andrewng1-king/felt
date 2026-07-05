import { Reveal } from "@/components/ui/Reveal";
import { problem } from "@/content/site";

export function Problem() {
  return (
    <section id="problem" className="border-t border-stone-200/70 px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <h2 className="font-display text-3xl leading-[1.15] tracking-tight text-stone-900 sm:text-4xl">
            {problem.heading}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
            {problem.body}
          </p>
        </Reveal>

        <div className="mt-14 divide-y divide-stone-200">
          {problem.points.map((point, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="flex gap-6 py-6">
                <span className="font-mono text-sm text-emerald-700">0{i + 1}</span>
                <p className="max-w-2xl text-lg leading-relaxed text-stone-700">{point}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
