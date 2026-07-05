import {
  ChatsCircle,
  Heart,
  ChartLineUp,
  WarningDiamond,
  TrendUp,
  TrendDown,
} from "@phosphor-icons/react/dist/ssr";
import { EmpathyMirror } from "@/components/EmpathyMirror";
import { platform } from "@/content/site";

/**
 * The hero visual: a realistic (illustrative) slice of felt.'s platform — window
 * chrome, a signal rail, the conversation header and the three core scores —
 * built as static chrome around the one interactive piece, the Empathy Mirror
 * chart. Only the chart's moments respond to clicks; everything else is a figure.
 */

const railIcons = [ChatsCircle, Heart, ChartLineUp, WarningDiamond];

function TrendMark({ trend }: { trend: string }) {
  if (trend === "down") return <TrendDown size={14} weight="bold" className="text-accent" />;
  if (trend === "up") return <TrendUp size={14} weight="bold" className="text-accent" />;
  return <WarningDiamond size={13} weight="fill" className="text-accent" />;
}

export function PlatformPreview() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-bg-alt/80 shadow-[0_30px_70px_-32px_rgba(26,23,18,0.34)] backdrop-blur-sm">
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-line bg-background/50 px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
          </span>
          <span className="ml-1 flex items-center gap-1.5">
            <svg width="26" height="14" viewBox="0 0 42 22" fill="none" aria-hidden className="text-foreground">
              <path d="M3 11 Q 9 4, 15 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M15 11 Q 21 18, 27 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
              <path d="M27 11 Q 33 4, 39 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.2" />
            </svg>
            <span className="font-display text-sm leading-none tracking-tight text-foreground">felt.</span>
          </span>
        </div>
        <span className="rounded-full bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          Example
        </span>
      </div>

      <div className="flex">
        {/* Signal rail (static) */}
        <div className="flex shrink-0 flex-col items-center gap-1.5 border-r border-line py-4">
          <div className="px-2.5">
            {railIcons.map((Icon, i) => (
              <div
                key={i}
                className={
                  i === 1
                    ? "mb-1.5 rounded-lg bg-accent/12 p-2 text-accent"
                    : "mb-1.5 rounded-lg p-2 text-muted"
                }
                aria-hidden
              >
                <Icon size={18} weight={i === 1 ? "fill" : "regular"} />
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          {/* Conversation header (static) */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display text-base tracking-tight text-foreground">
                {platform.conversation}
              </h3>
              <p className="mt-0.5 truncate text-[11px] text-muted">{platform.meta}</p>
            </div>
            <span className="shrink-0 rounded-full border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
              Post
            </span>
          </div>

          {/* Core scores (static) */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {platform.stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-line bg-background/50 p-2.5">
                <p className="text-[9px] font-medium uppercase leading-tight tracking-[0.1em] text-muted">
                  {stat.label}
                </p>
                <div className="mt-1.5 flex items-center gap-1">
                  <span className="text-lg font-semibold leading-none tracking-tight text-foreground">
                    {stat.value}
                  </span>
                  <TrendMark trend={stat.trend} />
                </div>
                <p className="mt-1 text-[9px] leading-tight text-muted">{stat.note}</p>
              </div>
            ))}
          </div>

          {/* The one interactive piece */}
          <div className="mt-5 border-t border-line pt-4">
            <EmpathyMirror />
          </div>
        </div>
      </div>
    </figure>
  );
}
