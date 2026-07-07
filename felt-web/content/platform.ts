/**
 * Scripted dataset for the /app platform demo. One user (Andrew) with real
 * history across two relationships: Daniel (declining -> Risk alert) and Priya
 * (improving -> streak). All hand-authored to be INTERNALLY consistent — the
 * trends, reminders and risk are derived by hand from the per-session reads,
 * not computed from audio. No 0-100 grades anywhere, per the v2 guidebook.
 */

import type { MirrorData } from "@/components/EmpathyMirror";

export type Tone = "warm" | "mixed" | "cool";
export type Direction = "up" | "down" | "steady";

export type MetricState = { state: string; tone: Tone; reframe?: string; locked?: boolean };

export type Conversation = {
  id: string;
  reportId: "daniel" | "priya";
  session: number;
  whenLabel: string;
  dateLabel: string;
  duration: string;
  /** One-line summary for the conversations list. */
  headline: string;
  direction: Direction;
  directionLabel: string;
  /** The Read — prose segments; spoken lines carry em. */
  read: { segments: { t: string; em?: boolean }[] };
  /** The guaranteed win, woven in prose but also stored for the home feed. */
  win: string;
  /** Woven reminder clause — session 2+ only, same-person history. */
  reminder?: string;
  /** Streak / identity praise — earned on real consecutive wins. */
  identityPraise?: string;
  mirror: MirrorData;
  /** Per-metric overrides; anything omitted falls back to pillar defaults. */
  metrics: Record<string, MetricState>;
};

export const andrew = {
  name: "Andrew",
  initials: "A",
  role: "Founder & CEO",
  org: "Telestar",
} as const;

export const reports = {
  daniel: {
    id: "daniel",
    name: "Daniel K.",
    initials: "DK",
    role: "Senior Engineer",
    relationship: "Reports to you · 8 months",
  },
  priya: {
    id: "priya",
    name: "Priya S.",
    initials: "PS",
    role: "Product Lead",
    relationship: "Reports to you · 1.5 years",
  },
} as const;

const p = (arr: number[][]) => arr as [number, number][];

export const conversations: Conversation[] = [
  // ── Daniel: the declining arc ──────────────────────────────────────────
  {
    id: "daniel-1",
    reportId: "daniel",
    session: 1,
    whenLabel: "5 weeks ago",
    dateLabel: "Jun 2",
    duration: "16 min",
    headline: "He arrived guarded and left lighter.",
    direction: "up",
    directionLabel: "Warmed up — a strong open",
    read: {
      segments: [
        { t: "He came in guarded and left lighter. At 4:10 you asked him to " },
        { t: "“walk me through what's actually on your plate,”", em: true },
        { t: " then let the silence sit — and he filled it, naming the real workload instead of the tidy version. The open question did the work." },
      ],
    },
    win: "At 4:10 you asked him to walk you through his plate, then held the pause. He filled it.",
    mirror: {
      label: "Empathy Mirror",
      signals: {
        openness: { name: "How he felt", points: p([[0, 0.45], [0.2, 0.62], [0.45, 0.74], [0.7, 0.7], [1, 0.72]]) },
        voice: { name: "Voice warmth", points: p([[0, 0.5], [0.3, 0.66], [0.6, 0.68], [1, 0.66]]) },
      },
      moments: [
        { t: 0.2, value: 0.62, at: "0:40 in", label: "He warmed up", signal: "Empathy Mirror", said: "How are you finding the new scope?", felt: "Read it as real care. Started to open up." },
        { t: 0.45, value: 0.74, at: "4:10 in", label: "He opened up", signal: "Empathy Mirror", said: "Walk me through what's actually on your plate.", felt: "Felt space to be honest. Named the real workload.", shift: true },
      ],
      read: "He arrived guarded and left lighter. The open question did the work.",
    },
    metrics: {
      "Empathy Mirror": { state: "Rose steadily and stayed open through the end.", tone: "warm" },
      "Active Listening": { state: "You asked, then waited. He did most of the talking.", tone: "warm" },
      "Validation Index": { state: "You acknowledged the load before offering any fix.", tone: "warm" },
      "Outcome Quality": { state: "Landed warmer than it opened. He left lighter.", tone: "warm" },
    },
  },
  {
    id: "daniel-2",
    reportId: "daniel",
    session: 2,
    whenLabel: "3 weeks ago",
    dateLabel: "Jun 16",
    duration: "15 min",
    headline: "Mostly warm — you stepped on his point once.",
    direction: "steady",
    directionLabel: "Held steady — one stumble",
    read: {
      segments: [
        { t: "You opened well — at 1:10 you handed him the agenda and he set the direction himself. But at 6:30 you cut in with " },
        { t: "“right, but here's the thing,”", em: true },
        { t: " mid-thought, and his answers got shorter after. Warm overall, one stumble." },
      ],
    },
    win: "You opened by handing him the agenda at 1:10 — he set the direction himself.",
    reminder: "You asked the open question last session and he unloaded; today you reached the answer first.",
    mirror: {
      label: "Empathy Mirror",
      signals: {
        openness: { name: "How he felt", points: p([[0, 0.5], [0.2, 0.64], [0.4, 0.6], [0.55, 0.42], [0.75, 0.5], [1, 0.52]]) },
        voice: { name: "Voice warmth", points: p([[0, 0.52], [0.3, 0.64], [0.6, 0.56], [1, 0.54]]) },
      },
      moments: [
        { t: 0.2, value: 0.64, at: "1:10 in", label: "Good start", signal: "Active Listening", said: "Where do you want to start today?", felt: "Appreciated the handoff. Set the agenda himself." },
        { t: 0.55, value: 0.42, at: "6:30 in", label: "You cut in", signal: "Active Listening", said: "Right, but here's the thing —", felt: "Was mid-thought. Let it go and shortened his answers.", shift: true },
      ],
      read: "Mostly warm, but you stepped on his point and he pulled back a little.",
    },
    metrics: {
      "Active Listening": { state: "One interruption at 6:30 cut a thought short.", tone: "cool", reframe: "Let him land the sentence before you respond — even when you already see the answer." },
      "Conversation Shape": { state: "Warm start, a dip at the interruption, partial recovery.", tone: "mixed" },
      "Empathy Mirror": { state: "Warm until 6:30, then a step back he didn't fully undo.", tone: "mixed" },
    },
  },
  {
    id: "daniel-3",
    reportId: "daniel",
    session: 3,
    whenLabel: "2 weeks ago",
    dateLabel: "Jun 23",
    duration: "14 min",
    headline: "“That's just how the timeline works” — he went quiet.",
    direction: "down",
    directionLabel: "Trust cooled",
    read: {
      segments: [
        { t: "Your opening landed — at 0:40 you asked how he's finding the new scope, and you meant it. He warmed up fast. Then at 6:10 you said " },
        { t: "“that's just how the timeline works,”", em: true },
        { t: " and he went quiet — he never raised the real worry again. He left more guarded than he arrived, and the " },
        { t: "“you've got this”", em: true },
        { t: " at the end closed the door rather than holding it open." },
      ],
    },
    win: "At 0:40 you asked how he's finding the new scope — and you meant it. He warmed up fast.",
    reminder: "You held the pause with him in your first talk and he opened up — this time you filled it, right after the timeline line.",
    mirror: {
      label: "Empathy Mirror",
      signals: {
        openness: { name: "How he felt", points: p([[0, 0.42], [0.15, 0.66], [0.32, 0.72], [0.5, 0.2], [0.68, 0.26], [0.85, 0.44], [1, 0.4]]) },
        voice: { name: "Voice warmth", points: p([[0, 0.5], [0.2, 0.68], [0.42, 0.66], [0.58, 0.5], [0.75, 0.4], [1, 0.46]]) },
      },
      moments: [
        { t: 0.15, value: 0.66, at: "0:40 in", label: "He warmed up", signal: "Empathy Mirror", said: "How are you finding the new scope?", felt: "Read the question as genuine care. Started to open up." },
        { t: 0.5, value: 0.2, at: "6:10 in", label: "The moment it shifted", signal: "Unspoken Concern", said: "That's just how the timeline works, so we'll make it happen.", felt: "Felt dismissed. Went quiet and stopped raising the real worry.", shift: true },
        { t: 0.85, value: 0.44, at: "11:30 in", label: "Guarded to the end", signal: "Risk Signal", said: "Anyway, you've got this.", felt: "Reassurance landed as a close-off. He left holding back." },
      ],
      read: "He left more guarded than he arrived. You never heard it out loud.",
    },
    metrics: {
      "Empathy Mirror": { state: "Warmed early, dropped hard at 6:10, never fully recovered.", tone: "cool" },
      "Tone & Language": { state: "Mostly warm — one dismissive line at 6:10 tipped it.", tone: "mixed" },
      "Message Clarity": { state: "A clear ask — but delivered fast, right when he needed room.", tone: "mixed" },
      "Conversation Shape": { state: "Warm-up, one real moment of depth, then an early close.", tone: "cool" },
      "Active Listening": { state: "You filled the silence after 6:10 instead of holding it.", tone: "cool", reframe: "A door, not a fail — next time, one more question before you answer." },
      "Validation Index": { state: "His worry surfaced, but wasn't acknowledged before you moved to the fix.", tone: "cool", reframe: "Acknowledge before you solve — even a “that's fair” lowers the guard." },
      "Unspoken Concern Signal": { state: "One held back — a hesitation before “it's fine” at 6:40.", tone: "cool" },
      "Outcome Quality": { state: "Landed cooler than it opened. He left holding the thing he came to say.", tone: "cool" },
      "Risk Signals": { state: "Rising — third session with warmth trending down.", tone: "cool" },
    },
  },
  {
    id: "daniel-4",
    reportId: "daniel",
    session: 4,
    whenLabel: "This week",
    dateLabel: "Jul 3",
    duration: "9 min",
    headline: "Guarded throughout, and he wrapped it early.",
    direction: "down",
    directionLabel: "Guarded — 4th drop in a row",
    read: {
      segments: [
        { t: "He stayed guarded the whole way and closed it out early — the call ran five minutes short. At 1:30 " },
        { t: "“how's everything going?”", em: true },
        { t: " got a flat " },
        { t: "“fine,”", em: true },
        { t: " and he never reached for more. This is the fourth session trending down with him — worth treating as a signal, not a bad day." },
      ],
    },
    win: "You didn't interrupt him once between 3:00 and 6:00 — a real change from last session.",
    reminder: "The open question worked with him twice before; it's been three sessions since you used it.",
    mirror: {
      label: "Empathy Mirror",
      signals: {
        openness: { name: "How he felt", points: p([[0, 0.4], [0.25, 0.38], [0.5, 0.34], [0.75, 0.36], [1, 0.35]]) },
        voice: { name: "Voice warmth", points: p([[0, 0.46], [0.4, 0.44], [0.7, 0.42], [1, 0.42]]) },
      },
      moments: [
        { t: 0.25, value: 0.38, at: "1:30 in", label: "Short answers", signal: "Unspoken Concern", said: "How's everything going?", felt: "Kept it to “fine.” Didn't reach for more.", shift: true },
        { t: 0.75, value: 0.36, at: "6:40 in", label: "Wrapped early", signal: "Risk Signal", said: "I think we're good, right?", felt: "Took the exit. The call ended five minutes short." },
      ],
      read: "He stayed guarded and ended it early. The fourth session in a row trending down.",
    },
    metrics: {
      "Empathy Mirror": { state: "Flat and low the whole way — no warm-up this time.", tone: "cool" },
      "Conversation Shape": { state: "No arc. Short answers, then an early exit at 6:40.", tone: "cool" },
      "Unspoken Concern Signal": { state: "A lot held back — “fine” doing heavy lifting.", tone: "cool" },
      "Active Listening": { state: "You held space well — no interruptions — but there was little to catch.", tone: "mixed" },
      "Outcome Quality": { state: "He left without saying the thing. Call ended short.", tone: "cool" },
      "Risk Signals": { state: "Alert — 4th falling session, shorter call, withdrawal words rising.", tone: "cool" },
    },
  },

  // ── Priya: the improving arc ───────────────────────────────────────────
  {
    id: "priya-1",
    reportId: "priya",
    session: 1,
    whenLabel: "4 weeks ago",
    dateLabel: "Jun 9",
    duration: "13 min",
    headline: "You reached for the data before she felt heard.",
    direction: "down",
    directionLabel: "Cool — jumped to fixing",
    read: {
      segments: [
        { t: "You reached for the data before she felt heard. At 5:00 she raised a concern and you answered with " },
        { t: "“the data says otherwise, though,”", em: true },
        { t: " and she held the rest back. She came back a little at 9:30 when you finally said " },
        { t: "“that's fair — say more”", em: true },
        { t: " and stopped talking." },
      ],
    },
    win: "At 9:30 you said “say more” and stopped talking — she took the opening.",
    mirror: {
      label: "Empathy Mirror",
      signals: {
        openness: { name: "How she felt", points: p([[0, 0.44], [0.25, 0.4], [0.5, 0.36], [0.7, 0.46], [1, 0.48]]) },
        voice: { name: "Voice warmth", points: p([[0, 0.5], [0.4, 0.48], [1, 0.5]]) },
      },
      moments: [
        { t: 0.5, value: 0.36, at: "5:00 in", label: "You went logical", signal: "Validation Index", said: "The data says otherwise, though.", felt: "Wanted to be heard, not corrected. Held the rest back.", shift: true },
        { t: 0.85, value: 0.48, at: "9:30 in", label: "Small recovery", signal: "Empathy Mirror", said: "That's fair — say more.", felt: "Eased slightly when you finally opened the door." },
      ],
      read: "You reached for the data before she felt heard. She came back a little at the end.",
    },
    metrics: {
      "Validation Index": { state: "You corrected before you acknowledged. She stopped offering.", tone: "cool", reframe: "Hear it fully before you weigh it — validation isn't agreement." },
      "Empathy Mirror": { state: "Dropped when you went to the data, recovered slightly at the end.", tone: "cool" },
      "Outcome Quality": { state: "Opened cool, nudged warmer once you made room.", tone: "mixed" },
    },
  },
  {
    id: "priya-2",
    reportId: "priya",
    session: 2,
    whenLabel: "2 weeks ago",
    dateLabel: "Jun 24",
    duration: "15 min",
    headline: "You led with a question and held the pause.",
    direction: "up",
    directionLabel: "Warmer — you made room",
    read: {
      segments: [
        { t: "Different session. You led with a question and, at 4:20, you " },
        { t: "held the pause instead of filling it", em: true },
        { t: " — and she filled it with the thing she'd been circling. She opened up more than last time." },
      ],
    },
    win: "At 4:20 you let the silence sit and she filled it with the thing she'd been circling.",
    reminder: "Last session you reached for the data first; this time you asked, then waited.",
    mirror: {
      label: "Empathy Mirror",
      signals: {
        openness: { name: "How she felt", points: p([[0, 0.48], [0.2, 0.54], [0.45, 0.66], [0.7, 0.64], [1, 0.68]]) },
        voice: { name: "Voice warmth", points: p([[0, 0.52], [0.4, 0.62], [1, 0.64]]) },
      },
      moments: [
        { t: 0.45, value: 0.66, at: "4:20 in", label: "The pause landed", signal: "Empathy Mirror", said: "(you held a beat instead of answering)", felt: "You held a beat instead of filling it. She went deeper.", shift: true },
      ],
      read: "You led with a question and held the pause. She opened up more than last time.",
    },
    metrics: {
      "Active Listening": { state: "You held the pause at 4:20 — she filled the space.", tone: "warm" },
      "Empathy Mirror": { state: "Climbed through the session and stayed up.", tone: "warm" },
      "Validation Index": { state: "You asked before you weighed in. She felt it.", tone: "warm" },
      "Outcome Quality": { state: "Warmer than it opened. She named the real blocker.", tone: "warm" },
    },
  },
  {
    id: "priya-3",
    reportId: "priya",
    session: 3,
    whenLabel: "3 days ago",
    dateLabel: "Jul 4",
    duration: "16 min",
    headline: "Open from the first minute — third strong session.",
    direction: "up",
    directionLabel: "Warm — third strong session",
    read: {
      segments: [
        { t: "Open from the first minute. At 1:20 you asked " },
        { t: "“what's actually on your mind this week?”", em: true },
        { t: " — no preamble, no agenda — and she trusted it right away. At 7:10 she named a blocker she'd been sitting on for weeks. Three sessions running you've led with a question, and it's compounding." },
      ],
    },
    win: "You opened with “what's actually on your mind” at 1:20 — no preamble. She trusted it.",
    reminder: "The pause that worked last time showed up again at 7:10.",
    identityPraise: "Three sessions in a row you've led with a question before a statement. You're building real safety with her — that's a pattern now, not luck.",
    mirror: {
      label: "Empathy Mirror",
      signals: {
        openness: { name: "How she felt", points: p([[0, 0.52], [0.25, 0.62], [0.5, 0.72], [0.75, 0.74], [1, 0.76]]) },
        voice: { name: "Voice warmth", points: p([[0, 0.56], [0.4, 0.68], [1, 0.72]]) },
      },
      moments: [
        { t: 0.25, value: 0.62, at: "1:20 in", label: "Open from the start", signal: "Active Listening", said: "What's actually on your mind this week?", felt: "Trusted the room right away.", shift: true },
        { t: 0.75, value: 0.74, at: "7:10 in", label: "Real honesty", signal: "Empathy Mirror", said: "What would make this easier?", felt: "Named a blocker she'd sat on for weeks." },
      ],
      read: "Open from the first minute. The question-first habit is compounding.",
    },
    metrics: {
      "Empathy Mirror": { state: "Open from the start and rising to the end.", tone: "warm" },
      "Active Listening": { state: "Mostly her voice. You asked and followed up.", tone: "warm" },
      "Validation Index": { state: "You made her feel heard before anything else.", tone: "warm" },
      "Pre-Talk Readiness": { state: "You logged one goal going in: let her lead. It held.", tone: "warm", locked: false },
      "Outcome Quality": { state: "She left having said the hard thing. That's the win.", tone: "warm" },
      "Behavioral Trends": { state: "Question-first, three sessions running. Your strongest habit.", tone: "warm" },
    },
  },
];

/** The 6 pillars + 11 metrics skeleton, with neutral fallback states. */
export const pillarSkeleton: {
  n: number;
  name: string;
  metrics: { name: string; phase: string; default: MetricState; seeAbove?: boolean }[];
}[] = [
  {
    n: 1,
    name: "Tone is the signal",
    metrics: [
      { name: "Empathy Mirror", phase: "Post", seeAbove: true, default: { state: "Read above, second by second.", tone: "mixed" } },
      { name: "Tone & Language", phase: "Post", default: { state: "Warm, with a couple of direct moments.", tone: "mixed" } },
      { name: "Message Clarity", phase: "Pre + Post", default: { state: "Your ask came through clearly.", tone: "mixed" } },
    ],
  },
  {
    n: 2,
    name: "The pause has weight",
    metrics: [
      { name: "Conversation Shape", phase: "Post", default: { state: "A steady arc — no sharp turns.", tone: "mixed" } },
      { name: "Active Listening", phase: "Post", default: { state: "Balanced give and take.", tone: "mixed" } },
    ],
  },
  {
    n: 3,
    name: "Control your temperature first",
    metrics: [
      { name: "Pre-Talk Readiness", phase: "Pre", default: { state: "No prep was logged for this one.", tone: "mixed", locked: true } },
    ],
  },
  {
    n: 4,
    name: "Validate to lower defenses",
    metrics: [
      { name: "Validation Index", phase: "Post", default: { state: "You acknowledged where they were before moving on.", tone: "mixed" } },
    ],
  },
  {
    n: 5,
    name: "Hear what wasn't said",
    metrics: [
      { name: "Unspoken Concern Signal", phase: "Post", default: { state: "Nothing major held back this session.", tone: "mixed" } },
    ],
  },
  {
    n: 6,
    name: "Win the next conversation",
    metrics: [
      { name: "Outcome Quality", phase: "Post", default: { state: "Landed about where it opened.", tone: "mixed" } },
      { name: "Behavioral Trends", phase: "Over time", default: { state: "Lives in Risk & Trends — your pattern across sessions.", tone: "mixed", locked: true } },
      { name: "Risk Signals", phase: "Over time", default: { state: "Healthy — no erosion signals in this relationship.", tone: "warm", locked: true } },
    ],
  },
];

/** Home dashboard — Andrew's OWN signals lead (guidebook §5), not the mirror. */
export const homeSignals = {
  trend: {
    direction: "up" as Direction,
    headline: "Your empathy is trending up across your 1:1s.",
    sub: "But one relationship is pulling hard against the line — worth your attention this week.",
  },
  streak: {
    count: 3,
    with: "Priya S.",
    label: "sessions leading with a question",
  },
  latestWin: {
    convoId: "priya-3",
    text: "You opened with “what's actually on your mind” — no preamble. She trusted it.",
  },
};

/**
 * Home = ACTIVITY dashboard. "How much am I doing, how's the cadence" — not
 * scores. Daniel & Priya have deep felt. history; the rest of the roster is
 * lightweight (last-met + cadence) so coverage/overdue reads like a real team.
 * Numbers are hand-authored to be internally consistent with the 7 conversations
 * above, as of the demo "today" (Jul 7).
 */
export type RosterEntry = {
  id: string;
  name: string;
  initials: string;
  role: string;
  /** Human label + raw days since the last 1:1. */
  lastMetLabel: string;
  daysSince: number;
  sessions: number;
  /** Set when this person has full felt. history (opens a report). */
  reportId?: "daniel" | "priya";
  trend: Direction;
  overdue?: boolean;
};

export const activity = {
  rangeLabel: "Last 30 days",
  kpis: {
    sessions: 9,
    minutes: 148, // 2h 28m across the team this month
    peopleCovered: 4,
    peopleTotal: 6,
    cadenceDays: 8, // avg days between 1:1s
  },
  /** 1:1s per week across the team, oldest → newest. Last entry = this week. */
  weekly: [
    { week: "May 19", count: 1 },
    { week: "May 26", count: 2 },
    { week: "Jun 2", count: 2 },
    { week: "Jun 9", count: 1 },
    { week: "Jun 16", count: 2 },
    { week: "Jun 23", count: 1 },
    { week: "Jun 30", count: 3 },
    { week: "This week", count: 2 },
  ],
  roster: [
    { id: "priya", name: "Priya S.", initials: "PS", role: "Product Lead", lastMetLabel: "3 days ago", daysSince: 3, sessions: 3, reportId: "priya", trend: "up" },
    { id: "daniel", name: "Daniel K.", initials: "DK", role: "Senior Engineer", lastMetLabel: "4 days ago", daysSince: 4, sessions: 4, reportId: "daniel", trend: "down" },
    { id: "elena", name: "Elena R.", initials: "ER", role: "Staff Engineer", lastMetLabel: "6 days ago", daysSince: 6, sessions: 2, trend: "steady" },
    { id: "marcus", name: "Marcus T.", initials: "MT", role: "Design Lead", lastMetLabel: "a week ago", daysSince: 7, sessions: 2, trend: "steady" },
    { id: "nadia", name: "Nadia H.", initials: "NH", role: "Data Lead", lastMetLabel: "17 days ago", daysSince: 17, sessions: 1, trend: "steady", overdue: true },
    { id: "sam", name: "Sam O.", initials: "SO", role: "Eng Manager", lastMetLabel: "25 days ago", daysSince: 25, sessions: 1, trend: "steady", overdue: true },
  ] as RosterEntry[],
};

/** Risk & Trends view content. */
export const riskView = {
  alert: {
    reportId: "daniel" as const,
    level: "Rising",
    summary: "Trust with Daniel has cooled four sessions running. This is the pattern, not a bad day.",
    factors: [
      { label: "Empathy Mirror trend", note: "Falling since your first talk — warm → guarded.", dir: "down" as Direction },
      { label: "Withdrawal words", note: "Shorter, more closed answers each session.", dir: "up" as Direction },
      { label: "Validation", note: "His concerns are surfacing less and getting acknowledged less.", dir: "down" as Direction },
      { label: "Meeting length", note: "Last 1:1 ran 9 min — down from 16. He wrapped it early.", dir: "down" as Direction },
    ],
    nextStep: "Open the next one with a question and hold the pause. It worked with him twice before.",
  },
  healthy: {
    reportId: "priya" as const,
    summary: "Priya is trending the other way — three strong sessions, warmth climbing.",
  },
  blindSpot: {
    pattern: "You interrupt more when the conversation gets uncomfortable.",
    detail: "Across your last seven 1:1s, your interruptions cluster right after a hard topic surfaces — the moment the other person most needs the floor.",
    slope: "Improving — down from last month, but still your clearest tell.",
  },
};

/** Per-report longitudinal trend of the Empathy Mirror reading, for sparklines. */
export const reportTrends: Record<"daniel" | "priya", { dir: Direction; points: number[] }> = {
  daniel: { dir: "down", points: [0.72, 0.52, 0.4, 0.35] },
  priya: { dir: "up", points: [0.44, 0.6, 0.72] },
};
