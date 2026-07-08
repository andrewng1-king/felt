"use client";

import { useMemo, useState } from "react";
import {
  MagnifyingGlass,
  House,
  Target,
  ChatsCircle,
  WarningDiamond,
  Gear,
  Plus,
  CornersOut,
} from "@phosphor-icons/react/dist/ssr";
import { Modal } from "@/components/platform/Modal";
import { activity, conversations, reports, type ReportId } from "@/content/platform";

export type PaletteNav = "home" | "prepare" | "conversations" | "risk" | "settings";

type Item = {
  id: string;
  section: string;
  label: string;
  hint?: string;
  Icon: typeof House;
  keywords?: string;
  run: () => void;
};

const latestConvoFor = (id: ReportId) => {
  const list = conversations.filter((c) => c.reportId === id);
  return list.length ? list[list.length - 1].id : null;
};

export function CommandPalette({
  onClose,
  onNavigate,
  onOpenConvo,
  onOpenPrepare,
  onNewConvo,
}: {
  onClose: () => void;
  onNavigate: (v: PaletteNav) => void;
  onOpenConvo: (id: string) => void;
  onOpenPrepare: (id: ReportId) => void;
  onNewConvo: () => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const items = useMemo<Item[]>(() => {
    const go = (v: PaletteNav) => () => {
      onNavigate(v);
      onClose();
    };
    const nav: Item[] = [
      { id: "nav-home", section: "Go to", label: "Overview", Icon: House, run: go("home") },
      { id: "nav-prepare", section: "Go to", label: "Prepare", Icon: Target, run: go("prepare") },
      { id: "nav-convos", section: "Go to", label: "Conversations", Icon: ChatsCircle, run: go("conversations") },
      { id: "nav-risk", section: "Go to", label: "Risk & Trends", Icon: WarningDiamond, run: go("risk") },
      { id: "nav-settings", section: "Go to", label: "Settings", Icon: Gear, run: go("settings") },
    ];

    const actions: Item[] = [
      {
        id: "act-new",
        section: "Actions",
        label: "New 1:1",
        hint: "Bring in a conversation",
        Icon: Plus,
        run: () => {
          onNewConvo();
          onClose();
        },
      },
    ];

    const people: Item[] = activity.roster
      .filter((r) => r.reportId)
      .flatMap((r) => {
        const id = r.reportId as ReportId;
        const convo = latestConvoFor(id);
        const rows: Item[] = [];
        if (convo) {
          rows.push({
            id: `open-${id}`,
            section: "People",
            label: `Open ${reports[id].name}'s latest read`,
            hint: reports[id].role,
            keywords: r.name,
            Icon: ChatsCircle,
            run: () => {
              onOpenConvo(convo);
              onClose();
            },
          });
        }
        rows.push({
          id: `prep-${id}`,
          section: "People",
          label: `Rehearse with ${reports[id].name}`,
          keywords: r.name,
          Icon: Target,
          run: () => {
            onOpenPrepare(id);
            onClose();
          },
        });
        return rows;
      });

    return [...nav, ...actions, ...people];
  }, [onNavigate, onOpenConvo, onOpenPrepare, onNewConvo, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
      `${it.label} ${it.hint ?? ""} ${it.keywords ?? ""} ${it.section}`.toLowerCase().includes(q),
    );
  }, [items, query]);

  // Keep the active index in range as the list shrinks.
  const activeItem = filtered[Math.min(active, Math.max(0, filtered.length - 1))];

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      activeItem?.run();
    }
  }

  let lastSection = "";

  return (
    <Modal open onClose={onClose} align="top" panelClassName="w-full max-w-lg" labelledBy="palette-input">
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
        <MagnifyingGlass size={17} className="text-muted" />
        <input
          id="palette-input"
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Jump to a view, person, or action…"
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
        />
        <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-[10px] text-muted sm:block">esc</kbd>
      </div>

      <div className="max-h-[52vh] overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-muted">No matches for “{query}”.</p>
        ) : (
          filtered.map((it, i) => {
            const on = it === activeItem;
            const header = it.section !== lastSection ? it.section : null;
            lastSection = it.section;
            return (
              <div key={it.id}>
                {header && (
                  <p className="px-3 pb-1 pt-3 text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
                    {header}
                  </p>
                )}
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => it.run()}
                  data-active={on || undefined}
                  className={[
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left outline-none transition",
                    on ? "bg-surface-2 text-foreground" : "text-ink-soft hover:bg-surface-2/60",
                  ].join(" ")}
                >
                  <it.Icon size={16} className={on ? "text-accent" : "text-muted"} />
                  <span className="min-w-0 flex-1 truncate text-sm">{it.label}</span>
                  {it.hint && <span className="shrink-0 truncate text-[11px] text-muted">{it.hint}</span>}
                  {on && <CornersOut size={12} className="shrink-0 text-muted" aria-hidden />}
                </button>
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
}
