import { Reveal } from "@/components/ui/Reveal";
import { ScrollZoom } from "@/components/ui/ScrollZoom";
import { PlatformPreview } from "@/components/PlatformPreview";

/**
 * Full-size platform band. The product shot, shown large in its own separated
 * section straight under the hero — a soft warm halo behind it lifts it off the
 * page. Scroll-zoom brings it up as it enters view.
 */
export function PlatformShowcase() {
  return (
    <section className="relative px-6 pb-24 lg:pb-32">
      {/* Soft warm halo so the shot sits on a pool of light, not flat paper. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-8 -z-10 mx-auto h-[70%] max-w-4xl rounded-full bg-accent-soft/40 blur-3xl"
      />
      <Reveal className="mx-auto max-w-5xl">
        <ScrollZoom>
          <PlatformPreview />
        </ScrollZoom>
      </Reveal>
    </section>
  );
}
