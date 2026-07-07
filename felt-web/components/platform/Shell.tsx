"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { House, ChatsCircle, WarningDiamond, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { Avatar } from "@/components/platform/bits";
import { HomeView } from "@/components/platform/HomeView";
import { ConversationsView } from "@/components/platform/ConversationsView";
import { ReportView } from "@/components/platform/ReportView";
import { RiskTrendsView } from "@/components/platform/RiskTrendsView";
import { andrew, conversations } from "@/content/platform";

type View = "home" | "conversations" | "report" | "risk";

const nav: { id: Exclude<View, "report">; label: string; Icon: typeof House }[] = [
  { id: "home", label: "Home", Icon: House },
  { id: "conversations", label: "Conversations", Icon: ChatsCircle },
  { id: "risk", label: "Risk & Trends", Icon: WarningDiamond },
];

export function Shell() {
  const reduce = useReducedMotion();
  const [view, setView] = useState<View>("home");
  const [convoId, setConvoId] = useState<string | null>(null);

  const convo = conversations.find((c) => c.id === convoId) ?? null;
  const openConvo = (id: string) => {
    setConvoId(id);
    setView("report");
  };
  const activeNav = view === "report" ? "conversations" : view;

  const logo = (
    <span className="flex items-center gap-2">
      <svg width="30" height="16" viewBox="0 0 42 22" fill="none" aria-hidden className="text-foreground">
        <path d="M3 11 Q 9 4, 15 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M15 11 Q 21 18, 27 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
        <path d="M27 11 Q 33 4, 39 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.2" />
      </svg>
      <span className="font-display text-xl leading-none tracking-tight text-foreground">felt.</span>
    </span>
  );

  return (
    <div data-theme="night" className="flex min-h-screen flex-col bg-background text-foreground md:flex-row">
      {/* Sidebar (desktop) / top bar (mobile) */}
      <aside className="sticky top-0 z-40 flex shrink-0 items-center justify-between border-b border-line bg-background/85 px-4 py-3 backdrop-blur md:h-screen md:w-60 md:flex-col md:items-stretch md:justify-start md:border-b-0 md:border-r md:px-4 md:py-6">
        <div className="md:px-2">{logo}</div>

        <nav className="flex items-center gap-1 md:mt-8 md:flex-col md:items-stretch md:gap-1">
          {nav.map(({ id, label, Icon }) => {
            const on = activeNav === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setView(id);
                }}
                className={[
                  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-accent/50 md:w-full",
                  on ? "bg-surface text-foreground" : "text-ink-soft hover:bg-surface/60 hover:text-foreground",
                ].join(" ")}
                aria-current={on ? "page" : undefined}
              >
                <Icon size={18} weight={on ? "fill" : "regular"} className={on ? "text-accent-strong" : ""} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 md:mt-auto md:flex-col md:items-stretch md:gap-3">
          <Link
            href="/"
            className="hidden items-center gap-2 rounded-xl px-3 py-2 text-xs text-muted outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50 md:flex"
          >
            <ArrowSquareOut size={15} /> Back to site
          </Link>
          <div className="flex items-center gap-2.5 rounded-xl px-1 md:px-2 md:py-2">
            <Avatar initials={andrew.initials} accent />
            <div className="hidden leading-tight md:block">
              <p className="text-sm font-medium text-foreground">{andrew.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                {andrew.role}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1">
        <div className="mx-2 mt-2 mb-4 flex items-center gap-2 rounded-full border border-line bg-bg-alt px-3 py-1.5 md:mx-8 md:mt-6">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Demo workspace · sample data, not a real account
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={view === "report" ? `report-${convoId}` : view}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {view === "home" && <HomeView onOpenConvo={openConvo} onOpenRisk={() => setView("risk")} />}
            {view === "conversations" && <ConversationsView onOpenConvo={openConvo} />}
            {view === "risk" && <RiskTrendsView onOpenConvo={openConvo} />}
            {view === "report" && convo && (
              <ReportView convo={convo} onBack={() => setView("conversations")} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
