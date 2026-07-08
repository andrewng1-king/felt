"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  CalendarBlank,
  UploadSimple,
  ClipboardText,
  CheckCircle,
  Check,
  CircleNotch,
  ArrowRight,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { reports } from "@/content/platform";

type Step = "source" | "working" | "done";

const SOURCES = [
  {
    id: "calendar",
    Icon: CalendarBlank,
    label: "Connect your calendar",
    note: "felt. joins your 1:1s automatically on Zoom, Meet & Teams — nothing to remember.",
    recommended: true,
  },
  {
    id: "upload",
    Icon: UploadSimple,
    label: "Upload a recording",
    note: "Drop an audio or video file from a 1:1 you already had.",
    recommended: false,
  },
  {
    id: "paste",
    Icon: ClipboardText,
    label: "Paste a transcript",
    note: "Already have a transcript? Paste it and felt. reads the tone underneath.",
    recommended: false,
  },
] as const;

const STAGES = [
  "Transcribing the conversation",
  "Reading tone, pace & pauses",
  "Building the Empathy Mirror",
  "Scoring the 11 signals",
];

// The sample read this scripted flow "produces" — Daniel's latest ties to the
// risk story. Framed as the 1:1 felt. just processed.
const RESULT_CONVO = "daniel-4";
const RESULT_PERSON = reports.daniel.name;

export function NewConversationModal({
  onClose,
  onOpenConvo,
}: {
  onClose: () => void;
  onOpenConvo: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState<Step>("source");
  const [stage, setStage] = useState(0);

  // Drive the analyzing sequence stage-by-stage, then land on "done".
  useEffect(() => {
    if (step !== "working") return;
    const per = reduce ? 260 : 720;
    const timers = STAGES.map((_, i) =>
      setTimeout(() => {
        setStage(i + 1);
        if (i === STAGES.length - 1) setTimeout(() => setStep("done"), per * 0.7);
      }, per * (i + 1)),
    );
    return () => timers.forEach(clearTimeout);
  }, [step, reduce]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <h2 id="new-convo-title" className="text-[15px] font-semibold tracking-tight text-foreground">
          {step === "done" ? "Your read is ready" : "New 1:1"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mr-1 rounded-md p-1 text-muted outline-none transition hover:bg-surface-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          <X size={17} />
        </button>
      </div>

      <div className="p-5">
        {step === "source" && (
          <>
            <p className="mb-4 text-sm leading-relaxed text-ink-soft">
              How should felt. bring this conversation in?
            </p>
            <div className="space-y-2.5">
              {SOURCES.map(({ id, Icon, label, note, recommended }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setStep("working")}
                  className="group flex w-full items-start gap-3 rounded-xl border border-line bg-background/40 p-3.5 text-left outline-none transition hover:-translate-y-0.5 hover:border-line-strong focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-accent">
                    <Icon size={18} weight="fill" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{label}</span>
                      {recommended && (
                        <span className="rounded-full bg-accent-soft px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-accent">
                          Recommended
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted">{note}</span>
                  </span>
                  <ArrowRight
                    size={15}
                    className="mt-2 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-foreground"
                  />
                </button>
              ))}
            </div>
          </>
        )}

        {step === "working" && (
          <div className="py-2">
            <p className="mb-5 text-sm leading-relaxed text-ink-soft">
              Reading your 1:1 with <span className="font-medium text-foreground">{RESULT_PERSON}</span>…
            </p>
            <div className="space-y-3">
              {STAGES.map((label, i) => {
                const done = i < stage;
                const active = i === stage;
                return (
                  <div key={label} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                      {done ? (
                        <CheckCircle size={18} weight="fill" className="text-accent" />
                      ) : active ? (
                        <motion.span
                          animate={reduce ? undefined : { rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="text-accent"
                        >
                          <CircleNotch size={16} weight="bold" />
                        </motion.span>
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-line" />
                      )}
                    </span>
                    <span
                      className={`text-sm transition-colors ${
                        done || active ? "text-foreground" : "text-muted"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="py-2">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                <Check size={22} weight="bold" className="text-accent" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Read complete</p>
                <p className="text-xs text-muted">1:1 with {RESULT_PERSON} · just now</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              felt. read the tone underneath the words — here&apos;s how it actually landed.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => onOpenConvo(RESULT_CONVO)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-[color:var(--on-accent)] outline-none transition hover:bg-accent-strong focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                Open the read <ArrowRight size={15} weight="bold" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-soft outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
