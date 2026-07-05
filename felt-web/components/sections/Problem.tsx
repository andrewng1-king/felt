import { Reveal } from "@/components/ui/Reveal";
import { problem } from "@/content/site";

export function Problem() {
  return (
    <section id="problem" className="border-t border-zinc-200 px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
            {problem.heading}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
            {problem.body}
          </p>
        </Reveal>

        <div className="mt-14 divide-y divide-zinc-200 border-t border-zinc-200">
          {problem.points.map((point, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="flex gap-6 py-6">
                <span className="font-mono text-sm text-emerald-700">0{i + 1}</span>
                <p className="max-w-2xl text-lg leading-relaxed text-zinc-700">{point}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
