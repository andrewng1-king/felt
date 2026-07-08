"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  House,
  ChatsCircle,
  WarningDiamond,
  WarningOctagon,
  Target,
  Gear,
  ArrowSquareOut,
  CaretUpDown,
  MagnifyingGlass,
  Bell,
  Plus,
  CaretLeft,
  Command,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { Avatar } from "@/components/platform/bits";
import { HomeView } from "@/components/platform/HomeView";
import { PrepareView } from "@/components/platform/PrepareView";
import { ConversationsView } from "@/components/platform/ConversationsView";
import { ReportView } from "@/components/platform/ReportView";
import { RiskTrendsView } from "@/components/platform/RiskTrendsView";
import { SettingsView } from "@/components/platform/SettingsView";
import { Modal } from "@/components/platform/Modal";
import { NewConversationModal } from "@/components/platform/NewConversationModal";
import { NotificationCenter } from "@/components/platform/NotificationCenter";
import { CommandPalette } from "@/components/platform/CommandPalette";
import { DemoWelcome } from "@/components/platform/DemoWelcome";
import { PaletteSwitcher, type ThemeId } from "@/components/platform/PaletteSwitcher";
import { andrew, conversations, reports, signals, type ReportId, type Signal } from "@/content/platform";

type View = "home" | "prepare" | "conversations" | "report" | "risk" | "settings";

const nav: { id: "home" | "prepare" | "conversations" | "risk"; label: string; Icon: typeof House }[] = [
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
  settings: "Settings",
};

export function Shell() {
  const reduce = useReducedMotion();
  const [view, setView] = useState<View>("home");
  const [convoId, setConvoId] = useState<string | null>(null);
  const [prepPerson, setPrepPerson] = useState<ReportId | undefined>(undefined);
  const [theme, setTheme] = useState<ThemeId>("ember");
  const [newConvoOpen, setNewConvoOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifsSeen, setNotifsSeen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

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

  // ⌘K / Ctrl+K opens the command palette from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const convo = conversations.find((c) => c.id === convoId) ?? null;
  const openConvo = (id: string) => {
    setConvoId(id);
    setView("report");
  };
  const openPrepare = (id?: ReportId) => {
    setPrepPerson(id);
    setView("prepare");
  };
  // One router for every signal action, shared by the bell, the Risk view, and Home.
  const runSignal = (s: Signal) => {
    const a = s.action;
    if (!a) return;
    if (a.view === "risk") setView("risk");
    else if (a.view === "prepare") openPrepare(a.id as ReportId | undefined);
    else if (a.view === "convo" && a.id) openConvo(a.id);
    else if (a.view === "new") setNewConvoOpen(true);
  };
  const unreadCount = signals.filter((s) => s.unread).length;
  const criticalSignal = signals.find((s) => s.severity === "critical");
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

        {/* User + settings + back to site */}
        <div className="flex items-center gap-2 md:mt-auto md:flex-col md:items-stretch md:gap-1">
          <button
            type="button"
            onClick={() => setView("settings")}
            aria-current={view === "settings" ? "page" : undefined}
            className={[
              "hidden items-center gap-2 rounded-lg px-3 py-2 text-xs outline-none transition focus-visible:ring-2 focus-visible:ring-accent/50 md:flex",
              view === "settings"
                ? "bg-surface font-medium text-foreground"
                : "text-muted hover:bg-surface/60 hover:text-foreground",
            ].join(" ")}
          >
            <Gear size={14} weight={view === "settings" ? "fill" : "regular"} className={view === "settings" ? "text-accent" : ""} />
            Settings
          </button>
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
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setNotifsSeen(true);
                }}
                aria-label={`Notifications${!notifsSeen && unreadCount ? `, ${unreadCount} unread` : ""}`}
                className="relative inline-flex items-center rounded-lg border border-line bg-surface p-2 text-muted outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                <Bell size={16} weight={notifOpen ? "fill" : "regular"} />
                {!notifsSeen && unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-background tabular-nums">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <NotificationCenter
                  onClose={() => setNotifOpen(false)}
                  onSignal={runSignal}
                  onViewAll={() => setView("risk")}
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Search — open command palette"
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm text-muted outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <MagnifyingGlass size={15} />
              <span className="hidden sm:inline">Search…</span>
              <kbd className="hidden items-center gap-0.5 rounded border border-line px-1 py-0.5 text-[10px] leading-none text-muted sm:inline-flex">
                <Command size={10} weight="bold" /> K
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setNewConvoOpen(true)}
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

        {/* Critical banner — the one alert that follows you until you look at it */}
        {criticalSignal && view !== "risk" && !bannerDismissed && (
          <div className="flex items-center gap-2.5 border-b border-danger/30 bg-danger-soft px-5 py-2 sm:px-8">
            <WarningOctagon size={15} weight="fill" className="shrink-0 text-danger" aria-hidden />
            <p className="min-w-0 flex-1 truncate text-[13px] text-foreground">
              <span className="font-medium">{criticalSignal.title}.</span>{" "}
              <span className="text-ink-soft">{criticalSignal.detail}</span>
            </p>
            <button
              type="button"
              onClick={() => setView("risk")}
              className="shrink-0 rounded-md border border-danger/40 px-2.5 py-1 text-xs font-medium text-danger outline-none transition hover:bg-danger/10 focus-visible:ring-2 focus-visible:ring-danger/50"
            >
              Review
            </button>
            <button
              type="button"
              onClick={() => setBannerDismissed(true)}
              aria-label="Dismiss alert"
              className="shrink-0 rounded p-1 text-danger/70 outline-none transition hover:text-danger focus-visible:ring-2 focus-visible:ring-danger/50"
            >
              <X size={14} />
            </button>
          </div>
        )}

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
                  onSignal={runSignal}
                />
              )}
              {view === "prepare" && <PrepareView initialPerson={prepPerson} />}
              {view === "conversations" && (
                <ConversationsView onOpenConvo={openConvo} onOpenPrepare={openPrepare} />
              )}
              {view === "risk" && <RiskTrendsView onOpenConvo={openConvo} onSignal={runSignal} />}
              {view === "settings" && <SettingsView />}
              {view === "report" && convo && <ReportView convo={convo} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* New 1:1 flow */}
      <Modal open={newConvoOpen} onClose={() => setNewConvoOpen(false)} labelledBy="new-convo-title">
        <NewConversationModal
          onClose={() => setNewConvoOpen(false)}
          onOpenConvo={(id) => {
            setNewConvoOpen(false);
            openConvo(id);
          }}
        />
      </Modal>

      {/* ⌘K command palette */}
      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onNavigate={(v) => setView(v)}
          onOpenConvo={openConvo}
          onOpenPrepare={openPrepare}
          onNewConvo={() => setNewConvoOpen(true)}
        />
      )}

      <DemoWelcome onOpenPalette={() => setPaletteOpen(true)} />
      <PaletteSwitcher value={theme} onChange={setTheme} />
    </div>
  );
}
