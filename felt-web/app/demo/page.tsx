import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { EmpathyMirror } from "@/components/EmpathyMirror";
import { TheRead } from "@/components/demo/TheRead";
import { Pillars } from "@/components/demo/Pillars";
import { demoMeta } from "@/content/demo";

export const metadata: Metadata = {
  title: "Live report · felt.",
  description:
    "A sample post-conversation report — how felt. reads a real 1:1, from The Read down to all 11 signals.",
};

export default function DemoPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        {/* Report header */}
        <section className="border-b border-line px-6 pt-28 pb-14 lg:pt-32">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-line bg-bg-alt px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  Demo · sample conversation
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  {demoMeta.when}
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="font-display mt-6 text-4xl tracking-tight text-foreground sm:text-5xl">
                1:1 with {demoMeta.with}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                {demoMeta.detail}
              </p>
            </Reveal>
          </div>
        </section>

        {/* The Read — the hero */}
        <section className="px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <TheRead />
          </div>
        </section>

        {/* Empathy Mirror — the evidence, one section down */}
        <section className="border-t border-line px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                The evidence
              </span>
              <h2 className="font-display mt-4 max-w-2xl text-2xl leading-snug tracking-tight text-foreground sm:text-3xl">
                How he moved, second by second.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
                The Empathy Mirror reads him, not you. Hover the line, or tap a
                turning point to see what was said and how it landed.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="glass mt-10 rounded-3xl p-6 sm:p-10">
                <EmpathyMirror />
              </div>
            </Reveal>
          </div>
        </section>

        {/* The 11 signals underneath, grouped by the 6 pillars */}
        <section className="border-t border-line px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                The why
              </span>
              <h2 className="font-display mt-4 max-w-2xl text-2xl leading-snug tracking-tight text-foreground sm:text-3xl">
                The 11 signals underneath — no grades, just what happened.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
                Every number is a lens, never a verdict. A low read is a door for
                the next conversation, not a fail on the last one.
              </p>
            </Reveal>
            <div className="mt-14">
              <Pillars />
            </div>
          </div>
        </section>

        {/* Close */}
        <section className="border-t border-line px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <h2 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
                This is one conversation. felt. is built for the next one.
              </h2>
              <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-soft">
                Read the pilot offer, or go back and see how felt. fits your team.
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <Button href="/#waitlist">Join the waitlist</Button>
                <Button href="/" variant="ghost">
                  Back to home
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
