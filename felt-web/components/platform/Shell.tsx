"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  House,
  ChatsCircle,
  WarningDiamond,
  Target,
  ArrowSquareOut,
  CaretUpDown,
  MagnifyingGlass,
  Plus,
  CaretLeft,
} from "@phosphor-icons/react/dist/ssr";
import { Avatar } from "@/components/platform/bits";
import { HomeView } from "@/components/platform/HomeView";
import { PrepareView } from "@/components/platform/PrepareView";
import { ConversationsView } from "@/components/platform/ConversationsView";
import { ReportView } from "@/components/platform/ReportView";
import { RiskTrendsView } from "@/components/platform/RiskTrendsView";
import { PaletteSwitcher, type ThemeId } from "@/components/platform/PaletteSwitcher";
import { andrew, conversations, reports, type ReportId } from "@/content/platform";

type View = "home" | "prepare" | "conversations" | "report" | "risk";

const nav: { id: Exclude<View, "report">; label: string; Icon: typeof House }[] = [
  { id: "home", label: "Overview", Icon: House },
  { id: "prepare", label: "Prepare", Icon: Target },
  { id: "conversations", label: "Conversations", Icon: ChatsCircle },
  { id: "risk", label: "Risk & Trends", Icon: WarningDiamond },
];

const titles: Record<Exclude<View, "report">, string> = {
  home: "Overview",
  prepare: "Prepare",
  conversations: "Conversations",
  risk: "Risk & Trends",
};

export function Shell() {
  const reduce = useReducedMotion();
  const [view, setView] = useState<View>("home");
  const [convoId, setConvoId] = useState<string | null>(null);
  const [prepPerson, setPrepPerson] = useState<ReportId | undefined>(undefined);
  const [theme, setTheme] = useState<ThemeId>("ember");

  useEffect(() => {
    // Restore the demo palette from a prior visit. Done in an effect (not lazy
    // init) so SSR and first client render agree, avoiding a hydration mismatch.
    const saved = localStorage.getItem("felt-theme") as ThemeId | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setTheme(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("felt-theme", theme);
  }, [theme]);

  const convo = conversations.find((c) => c.id === convoId) ?? null;
  const openConvo = (id: string) => {
    setConvoId(id);
    setView("report");
  };
  const openPrepare = (id?: ReportId) => {
    setPrepPerson(id);
    setView("prepare");
  };
  const activeNav = view === "report" ? "conversations" : view;
  const pageTitle =
    view === "report" && convo ? `1:1 with ${reports[convo.reportId].name}` : titles[activeNav];

  const wordmark = (
    <svg width="26" height="14" viewBox="0 0 42 22" fill="none" aria-hidden className="text-foreground">
      <path d="M3 11 Q 9 4, 15 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15 11 Q 21 18, 27 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      <path d="M27 11 Q 33 4, 39 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.2" />
    </svg>
  );

  const navList = (
    <nav className="flex items-center gap-1 md:flex-col md:items-stretch md:gap-0.5">
      {nav.map(({ id, label, Icon }) => {
        const on = activeNav === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setView(id)}
            aria-current={on ? "page" : undefined}
            className={[
              "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-accent/50 md:w-full",
              on
                ? "bg-surface font-medium text-foreground"
                : "text-ink-soft hover:bg-surface/60 hover:text-foreground",
            ].join(" ")}
          >
            {on && (
              <span className="absolute left-0 top-1/2 hidden h-5 w-[3px] -translate-y-1/2 rounded-full bg-accent md:block" aria-hidden />
            )}
            <Icon size={18} weight={on ? "fill" : "regular"} className={on ? "text-accent" : ""} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <div
      data-theme={theme === "light" ? "light" : "night"}
      data-accent={theme === "light" ? undefined : theme}
      className="flex min-h-screen flex-col bg-background text-foreground md:flex-row"
    >
      {/* Sidebar (desktop) / top strip (mobile) */}
      <aside className="sticky top-0 z-40 flex shrink-0 items-center justify-between gap-3 border-b border-line bg-background px-4 py-2.5 md:h-screen md:w-60 md:flex-col md:items-stretch md:justify-start md:border-b-0 md:border-r md:px-3 md:py-4">
        {/* Workspace switcher */}
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left outline-none transition hover:bg-surface/60 focus-visible:ring-2 focus-visible:ring-accent/50 md:mb-6"
        >
          {wordmark}
          <span className="hidden min-w-0 leading-tight md:block">
            <span className="block truncate text-sm font-semibold text-foreground">{andrew.org}</span>
            <span className="block truncate text-[11px] text-muted">Workspace</span>
          </span>
          <CaretUpDown size={14} className="hidden shrink-0 text-muted md:block" />
        </button>

        <div className="hidden px-2 pb-2 md:block">
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">Workspace</span>
        </div>
        {navList}

        {/* User + back to site */}
        <div className="flex items-center gap-2 md:mt-auto md:flex-col md:items-stretch md:gap-1">
          <Link
            href="/"
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted outline-none transition hover:bg-surface/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50 md:flex"
          >
            <ArrowSquareOut size={14} /> Back to site
          </Link>
          <div className="flex items-center gap-2.5 rounded-lg px-1 py-1 md:px-2 md:py-2">
            <Avatar initials={andrew.initials} accent />
            <div className="hidden leading-tight md:block">
              <p className="truncate text-sm font-medium text-foreground">{andrew.name}</p>
              <p className="truncate text-[11px] text-muted">{andrew.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-background/85 px-5 py-3 backdrop-blur sm:px-8">
          <div className="flex min-w-0 items-center gap-2.5">
            {view === "report" && (
              <button
                type="button"
                onClick={() => setView("conversations")}
                className="-ml-1 rounded-md p-1 text-muted outline-none transition hover:bg-surface hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50"
                aria-label="Back to conversations"
              >
                <CaretLeft size={18} />
              </button>
            )}
            <h1 className="truncate text-[15px] font-semibold tracking-tight text-foreground">{pageTitle}</h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <label className="hidden items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-muted sm:flex">
              <MagnifyingGlass size={15} />
              <input
                type="text"
                placeholder="Search 1:1s…"
                className="w-28 bg-transparent text-foreground placeholder:text-muted focus:outline-none lg:w-40"
              />
            </label>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-[color:var(--on-accent)] outline-none transition hover:bg-accent-strong focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <Plus size={15} weight="bold" /> <span className="hidden sm:inline">New 1:1</span>
            </button>
          </div>
        </header>

        {/* Demo notice */}
        <div className="flex items-center gap-2 border-b border-line bg-bg-alt px-5 py-1.5 sm:px-8">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
          <span className="text-[11px] tracking-wide text-muted">
            Demo workspace · sample data, not a real account
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={view === "report" ? `report-${convoId}` : view}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {view === "home" && (
                <HomeView
                  onOpenConvo={openConvo}
                  onOpenRisk={() => setView("risk")}
                  onOpenPrepare={openPrepare}
                />
              )}
              {view === "prepare" && <PrepareView initialPerson={prepPerson} />}
              {view === "conversations" && (
                <ConversationsView onOpenConvo={openConvo} onOpenPrepare={openPrepare} />
              )}
              {view === "risk" && <RiskTrendsView onOpenConvo={openConvo} />}
              {view === "report" && convo && <ReportView convo={convo} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <PaletteSwitcher value={theme} onChange={setTheme} />
    </div>
  );
}
