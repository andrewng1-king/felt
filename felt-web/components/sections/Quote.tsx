import { Reveal } from "@/components/ui/Reveal";
import { quote, quoteSecondary } from "@/content/site";

export function Quote() {
  return (
    <section className="border-t border-line px-6 py-24 lg:py-32">
      <Reveal className="mx-auto max-w-4xl">
        <blockquote className="font-display text-[1.7rem] italic leading-[1.4] tracking-tight text-foreground sm:text-[2.1rem] sm:leading-[1.35]">
          &ldquo;{quote.body}&rdquo;
        </blockquote>
        <div className="mt-8 flex items-center gap-4">
          <span className="h-px w-10 bg-highlight" aria-hidden />
          <div className="text-sm">
            <span className="font-medium text-foreground">{quote.name}</span>
            <span className="text-muted">, {quote.role}</span>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.08} className="mx-auto mt-16 max-w-4xl border-t border-line pt-12">
        <blockquote className="max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">
          &ldquo;{quoteSecondary.body}&rdquo;
        </blockquote>
        <div className="mt-6 flex items-center gap-4">
          <span className="h-px w-10 bg-line" aria-hidden />
          <div className="text-sm">
            <span className="font-medium text-foreground">{quoteSecondary.name}</span>
            <span className="text-muted">, {quoteSecondary.role}</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
