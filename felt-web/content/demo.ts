/**
 * Scripted data for the /demo screen — one sample post-conversation report.
 * Built to the v2 metrics guidebook: The Read leads, no 0-100 grades, the 11
 * metrics sit underneath grouped by the 6 pillars, and every read carries one
 * guaranteed win. Session 1 with Daniel = cold start, so no reminder line.
 * The Empathy Mirror chart reuses `empathyMirror` from ./site.
 */

export const demoMeta = {
  with: "Daniel K.",
  detail: "1:1 · 14 min · voice + transcript",
  when: "Today, 2:30 PM",
  session: 1,
} as const;

/**
 * The hero. A short coach-voice paragraph — honest, plain, not hedgy. Rendered
 * as segments so the spoken lines can sit in italic serif. The win ("your
 * opening landed") is woven into the prose, never a labeled block. The one
 * badge is the direction arrow.
 */
export const theRead = {
  segments: [
    { t: "Your opening landed. At 0:40 you asked how he's finding the new scope — and you meant it. He warmed up fast. Then at 6:10 you said " },
    { t: "“that's just how the timeline works,”", em: true },
    { t: " and he went quiet — he never raised the real worry again. He left more guarded than he arrived, and the " },
    { t: "“you've got this”", em: true },
    { t: " at the end closed the door rather than holding it open." },
  ],
  direction: "down" as "up" | "down",
  directionLabel: "Trust cooled this session",
} as const;

type Tone = "warm" | "mixed" | "cool";

export type Metric = {
  name: string;
  phase: string;
  state: string;
  tone: Tone;
  /** Reframes a low read as a next-step door, per the "no grade" rule. */
  reframe?: string;
  /** True for PRE / OVER-TIME metrics a single conversation can't produce. */
  locked?: boolean;
  /** Points at the chart shown above instead of repeating it. */
  seeAbove?: boolean;
};

export type Pillar = {
  n: number;
  name: string;
  metrics: Metric[];
};

export const pillars: Pillar[] = [
  {
    n: 1,
    name: "Tone is the signal",
    metrics: [
      {
        name: "Empathy Mirror",
        phase: "Post",
        state: "Warmed early, dropped at 6:10, never fully recovered.",
        tone: "cool",
        seeAbove: true,
      },
      {
        name: "Tone & Language",
        phase: "Post",
        state: "Mostly warm — one dismissive line at 6:10 tipped it.",
        tone: "mixed",
      },
      {
        name: "Message Clarity",
        phase: "Pre + Post",
        state: "A clear ask — but delivered fast, right when he needed room.",
        tone: "mixed",
      },
    ],
  },
  {
    n: 2,
    name: "The pause has weight",
    metrics: [
      {
        name: "Conversation Shape",
        phase: "Post",
        state: "Warm-up, one real moment of depth, then an early close. The back half went flat.",
        tone: "cool",
      },
      {
        name: "Active Listening",
        phase: "Post",
        state: "You filled the silence after 6:10 instead of holding it.",
        tone: "cool",
        reframe: "A door, not a fail — next time, one more question before you answer.",
      },
    ],
  },
  {
    n: 3,
    name: "Control your temperature first",
    metrics: [
      {
        name: "Pre-Talk Readiness",
        phase: "Pre",
        state: "Runs before the conversation. No prep was logged for this one.",
        tone: "mixed",
        locked: true,
      },
    ],
  },
  {
    n: 4,
    name: "Validate to lower defenses",
    metrics: [
      {
        name: "Validation Index",
        phase: "Post",
        state: "His worry surfaced, but it wasn't acknowledged before you moved to the fix.",
        tone: "cool",
        reframe: "Acknowledge before you solve — even a “that's fair” lowers the guard.",
      },
    ],
  },
  {
    n: 5,
    name: "Hear what wasn't said",
    metrics: [
      {
        name: "Unspoken Concern Signal",
        phase: "Post",
        state: "One concern held back — a hesitation before “it's fine” at 6:40 says the real worry stayed in the room.",
        tone: "cool",
      },
    ],
  },
  {
    n: 6,
    name: "Win the next conversation",
    metrics: [
      {
        name: "Outcome Quality",
        phase: "Post",
        state: "Landed cooler than it opened. He left holding the thing he came to say.",
        tone: "cool",
      },
      {
        name: "Behavioral Trends",
        phase: "Over time",
        state: "Unlocks across conversations. One talk is noise; the pattern is the signal.",
        tone: "mixed",
        locked: true,
      },
      {
        name: "Risk Signals",
        phase: "Over time · Alert",
        state: "Needs two or more conversations with Daniel before a trend can be read.",
        tone: "mixed",
        locked: true,
      },
    ],
  },
];
