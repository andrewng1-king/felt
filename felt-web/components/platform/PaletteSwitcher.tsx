"use client";

import { useEffect, useRef, useState } from "react";
import { Palette, Check } from "@phosphor-icons/react/dist/ssr";

export type ThemeId = "ember" | "signal" | "orchid" | "mono" | "light";

const PRESETS: { id: ThemeId; label: string; color: string; ring?: string }[] = [
  { id: "ember", label: "Ember", color: "#e8703a" },
  { id: "signal", label: "Signal", color: "#6e76f1" },
  { id: "orchid", label: "Orchid", color: "#a78bfa" },
  { id: "mono", label: "Mono", color: "#e4e4e7" },
  { id: "light", label: "Light", color: "#c65f34", ring: "#faf9f7" },
];

/** Demo-only palette control. Floating, persists to localStorage via the parent. */
export function PaletteSwitcher({
  value,
  onChange,
}: {
  value: ThemeId;
  onChange: (id: ThemeId) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="absolute bottom-12 right-0 w-52 rounded-xl border border-line bg-surface p-2 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.7)]">
          <p className="px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
            Palette · demo
          </p>
          {PRESETS.map((p) => {
            const on = value === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onChange(p.id);
                  setOpen(false);
                }}
                className={[
                  "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-accent/50",
                  on ? "bg-surface-2 text-foreground" : "text-ink-soft hover:bg-surface-2 hover:text-foreground",
                ].join(" ")}
              >
                <span
                  className="h-4 w-4 shrink-0 rounded-full"
                  style={{ background: p.color, boxShadow: p.ring ? `inset 0 0 0 2px ${p.ring}` : undefined }}
                  aria-hidden
                />
                <span className="flex-1">{p.label}</span>
                {on && <Check size={14} weight="bold" className="text-accent" />}
              </button>
            );
          })}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change palette"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-foreground shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7)] outline-none transition hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        <Palette size={18} />
      </button>
    </div>
  );
}
