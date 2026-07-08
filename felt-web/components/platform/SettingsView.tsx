"use client";

import { useState } from "react";
import {
  UserCircle,
  Buildings,
  PlugsConnected,
  BellSimple,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import { Avatar } from "@/components/platform/bits";
import { SectionHeader } from "@/components/platform/ui";
import { andrew } from "@/content/platform";

/** Visual-only toggle. Demo settings don't persist anything real. */
function Switch({ defaultOn = false, label }: { defaultOn?: boolean; label: string }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => setOn((v) => !v)}
      className={[
        "relative h-5 w-9 shrink-0 rounded-full outline-none transition focus-visible:ring-2 focus-visible:ring-accent/50",
        on ? "bg-accent" : "bg-surface-2",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-0.5 h-4 w-4 rounded-full bg-foreground transition-all",
          on ? "left-[18px]" : "left-0.5",
        ].join(" ")}
      />
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">{children}</section>;
}

const INTEGRATIONS = [
  { name: "Google Calendar", note: "Auto-detects your 1:1s", connected: true },
  { name: "Zoom", note: "felt. joins & records", connected: true },
  { name: "Google Meet", note: "felt. joins & records", connected: false },
  { name: "Microsoft Teams", note: "felt. joins & records", connected: false },
  { name: "Slack", note: "Nudges before overdue 1:1s", connected: false },
];

export function SettingsView() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-7 sm:px-8 sm:py-8">
      <p className="max-w-xl text-sm text-ink-soft">
        Manage how felt. captures your 1:1s and what it nudges you about. These settings are illustrative in the
        demo.
      </p>

      <div className="mt-6 space-y-5">
        {/* Profile */}
        <Card>
          <div className="flex items-center gap-2.5">
            <UserCircle size={17} weight="fill" className="text-accent" />
            <SectionHeader title="Profile" />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Avatar initials={andrew.initials} size="lg" accent />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{andrew.name}</p>
              <p className="text-[11px] text-muted">
                {andrew.role} · {andrew.org}
              </p>
            </div>
            <button
              type="button"
              className="ml-auto rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-soft outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              Edit
            </button>
          </div>
        </Card>

        {/* Workspace */}
        <Card>
          <div className="flex items-center gap-2.5">
            <Buildings size={17} weight="fill" className="text-accent" />
            <SectionHeader title="Workspace" />
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-background/40 p-3.5">
              <dt className="text-[11px] uppercase tracking-[0.1em] text-muted">Name</dt>
              <dd className="mt-1 text-sm text-foreground">{andrew.org}</dd>
            </div>
            <div className="rounded-xl border border-line bg-background/40 p-3.5">
              <dt className="text-[11px] uppercase tracking-[0.1em] text-muted">Plan</dt>
              <dd className="mt-1 text-sm text-foreground">Proof of Signal pilot</dd>
            </div>
          </dl>
        </Card>

        {/* Integrations */}
        <Card>
          <div className="flex items-center gap-2.5">
            <PlugsConnected size={17} weight="fill" className="text-accent" />
            <SectionHeader title="Integrations" />
          </div>
          <p className="mt-1 text-xs text-ink-soft">Where felt. picks conversations up automatically.</p>
          <div className="mt-4 divide-y divide-line">
            {INTEGRATIONS.map((it) => (
              <div key={it.name} className="flex items-center gap-3 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-[11px] font-medium text-ink-soft">
                  {it.name.slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{it.name}</p>
                  <p className="truncate text-[11px] text-muted">{it.note}</p>
                </div>
                {it.connected ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-medium text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Connected
                  </span>
                ) : (
                  <button
                    type="button"
                    className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-soft outline-none transition hover:border-line-strong hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50"
                  >
                    Connect
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="flex items-center gap-2.5">
            <BellSimple size={17} weight="fill" className="text-accent" />
            <SectionHeader title="Notifications" />
          </div>
          <div className="mt-4 space-y-3.5">
            {[
              { label: "New read is ready", detail: "When felt. finishes analyzing a 1:1.", on: true },
              { label: "Risk signal rising", detail: "When a relationship starts trending down.", on: true },
              { label: "Overdue 1:1s", detail: "When you haven't met someone in over two weeks.", on: true },
              { label: "Weekly focus brief", detail: "A Monday digest of who needs attention.", on: false },
            ].map((n) => (
              <div key={n.label} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{n.label}</p>
                  <p className="text-[11px] text-muted">{n.detail}</p>
                </div>
                <Switch defaultOn={n.on} label={n.label} />
              </div>
            ))}
          </div>
        </Card>

        {/* Privacy note */}
        <div className="flex items-start gap-2.5 rounded-2xl border border-line bg-bg-alt p-4">
          <ShieldCheck size={16} weight="fill" className="mt-0.5 shrink-0 text-muted" />
          <p className="text-xs leading-relaxed text-ink-soft">
            felt. only reads your internal 1:1s. Recordings are processed for tone and never shared with the
            other participant. You can delete any conversation and its read at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
