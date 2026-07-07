import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Avatar, DirectionBadge, Sparkline } from "@/components/platform/bits";
import { conversations, reports, reportTrends } from "@/content/platform";

const order = ["daniel", "priya"] as const;

export function ConversationsView({ onOpenConvo }: { onOpenConvo: (id: string) => void }) {
  return (
    <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8 sm:py-8">
      <p className="text-sm text-ink-soft">
        Every 1:1 felt. has read for you, newest first, grouped by person.
      </p>

      <div className="mt-6 space-y-8">
        {order.map((rid) => {
          const r = reports[rid];
          const trend = reportTrends[rid];
          const list = conversations.filter((c) => c.reportId === rid).reverse();
          return (
            <section key={rid}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar initials={r.initials} size="lg" />
                  <div>
                    <h2 className="text-base font-semibold tracking-tight text-foreground">{r.name}</h2>
                    <p className="text-[11px] text-muted">
                      {r.role} · {r.relationship}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden text-[11px] tabular-nums text-muted sm:inline">
                    {list.length} sessions
                  </span>
                  <Sparkline points={trend.points} direction={trend.dir} />
                </div>
              </div>

              <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
                {list.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onOpenConvo(c.id)}
                    className="group flex w-full items-center gap-4 px-5 py-3.5 text-left outline-none transition hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50"
                  >
                    <span className="w-12 shrink-0 text-[11px] font-medium tabular-nums text-muted">
                      S{c.session}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-foreground">{c.headline}</p>
                      <p className="mt-0.5 text-[11px] tabular-nums text-muted">
                        {c.dateLabel} · {c.duration}
                      </p>
                    </div>
                    <DirectionBadge direction={c.direction} label={c.directionLabel} subtle />
                    <ArrowRight
                      size={16}
                      className="hidden shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-foreground sm:block"
                    />
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
