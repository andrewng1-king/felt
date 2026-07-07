import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";
import { theRead } from "@/content/demo";

/**
 * The hero of the report. Per the guidebook, the manager reads prose first —
 * not a form of metrics. A short honest paragraph, the spoken lines in italic
 * serif, and one direction arrow as the single "finalize" signal.
 */
export function TheRead() {
  const down = theRead.direction === "down";
  const Arrow = down ? ArrowDownRight : ArrowUpRight;

  return (
    <div className="max-w-3xl">
      <Reveal>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          The Read
        </span>
      </Reveal>

      <Reveal delay={0.08}>
        <p className="font-display mt-5 text-2xl leading-[1.5] tracking-tight text-foreground sm:text-[27px] sm:leading-[1.5]">
          {theRead.segments.map((s, i) =>
            "em" in s && s.em ? (
              <em key={i} className="text-accent-strong not-italic">
                <span className="italic">{s.t}</span>
              </em>
            ) : (
              <span key={i}>{s.t}</span>
            ),
          )}
        </p>
      </Reveal>

      <Reveal delay={0.16}>
        <div
          className="mt-7 inline-flex items-center gap-2 rounded-full border border-line bg-bg-alt px-4 py-2"
        >
          <Arrow
            size={18}
            weight="bold"
            className={down ? "text-accent-strong" : "text-foreground"}
          />
          <span className="text-sm font-medium text-foreground">
            {theRead.directionLabel}
          </span>
        </div>
      </Reveal>
    </div>
  );
}
