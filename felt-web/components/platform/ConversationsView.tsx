import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Avatar, DirectionBadge, Sparkline } from "@/components/platform/bits";
import { conversations, reports, reportTrends } from "@/content/platform";

const order = ["daniel", "priya"] as const;

export function ConversationsView({ onOpenConvo }: { onOpenConvo: (id: string) => void }) {
  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
      <h1 className="font-display text-2xl tracking-tight text-foreground sm:text-3xl">Conversations</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Every 1:1 felt. has read for you, newest first, grouped by person.
      </p>

      <div className="mt-8 space-y-10">
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
                    <h2 className="font-display text-xl tracking-tight text-foreground">{r.name}</h2>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                      {r.role} · {r.relationship}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-muted sm:inline">
                    {list.length} sessions
                  </span>
                  <Sparkline points={trend.points} direction={trend.dir} />
                </div>
              </div>

              <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-bg-alt/50">
                {list.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onOpenConvo(c.id)}
                    className="group flex w-full items-center gap-4 px-5 py-4 text-left outline-none transition hover:bg-surface/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50"
                  >
                    <span className="w-14 shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                      S{c.session}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-foreground">{c.headline}</p>
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
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
