import { Reveal } from "@/components/ui/Reveal";
import { mirrorRule } from "@/content/site";

/**
 * The Mirror Rule — felt.'s trust principle made consumer-facing. felt. only
 * reflects the manager's own pattern forward; it never predicts the other
 * person, so it can't be wrong and never breaks trust. The signature
 * forward-looking line sits in an accent card as the section's centerpiece.
 */
export function MirrorRule() {
  return (
    <section className="border-t border-line px-6 py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
        <Reveal direction="left">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent-strong">
            {mirrorRule.eyebrow}
          </p>
          <h2 className="font-display mt-6 text-3xl leading-[1.15] tracking-tight text-foreground sm:text-4xl">
            {mirrorRule.heading}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            {mirrorRule.body}
          </p>
          <p className="mt-6 max-w-xl leading-relaxed text-muted">{mirrorRule.footnote}</p>
        </Reveal>

        <Reveal direction="right" delay={0.1}>
          <figure className="rounded-2xl bg-accent-strong p-8 text-white shadow-[0_28px_50px_-28px_rgba(154,71,51,0.7)] sm:p-10">
            <span aria-hidden className="font-display block text-5xl leading-none text-white/40">
              &ldquo;
            </span>
            <blockquote className="font-display -mt-3 text-2xl leading-snug tracking-tight sm:text-[1.75rem]">
              {mirrorRule.quote}
            </blockquote>
            <figcaption className="mt-6 text-xs font-medium uppercase tracking-[0.16em] text-white/70">
              {mirrorRule.caption}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
