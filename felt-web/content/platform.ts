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
export type ReportId = "daniel" | "priya" | "elena" | "marcus";

export type MetricState = { state: string; tone: Tone; reframe?: string; locked?: boolean };

export type Conversation = {
  id: string;
  reportId: ReportId;
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
    pronoun: "he",
  },
  priya: {
    id: "priya",
    name: "Priya S.",
    initials: "PS",
    role: "Product Lead",
    relationship: "Reports to you · 1.5 years",
    pronoun: "she",
  },
  elena: {
    id: "elena",
    name: "Elena R.",
    initials: "ER",
    role: "Staff Engineer",
    relationship: "Reports to you · 2 years",
    pronoun: "she",
  },
  marcus: {
    id: "marcus",
    name: "Marcus T.",
    initials: "MT",
    role: "Design Lead",
    relationship: "Reports to you · 5 months",
    pronoun: "he",
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

  // ── Elena: the healthy, peer-level relationship ────────────────────────
  {
    id: "elena-1",
    reportId: "elena",
    session: 1,
    whenLabel: "2 weeks ago",
    dateLabel: "Jun 20",
    duration: "14 min",
    headline: "No warm-up needed — you two talk like peers.",
    direction: "steady",
    directionLabel: "Level and open",
    read: {
      segments: [
        { t: "No warm-up needed. At 2:00 you skipped the check-in and went straight to the migration call she'd flagged — you gave her the real constraint, not the tidy version. She matched it, naming the risk she saw " },
        { t: "without softening it", em: true },
        { t: ". This is a relationship where directness reads as respect, not pressure." },
      ],
    },
    win: "You handed her the real constraint at 2:00 instead of the tidy version — she trusted you with hers back.",
    mirror: {
      label: "Empathy Mirror",
      signals: {
        openness: { name: "How she felt", points: p([[0, 0.58], [0.3, 0.66], [0.6, 0.64], [1, 0.68]]) },
        voice: { name: "Voice warmth", points: p([[0, 0.6], [0.5, 0.66], [1, 0.66]]) },
      },
      moments: [
        { t: 0.3, value: 0.66, at: "2:00 in", label: "Straight to substance", signal: "Message Clarity", said: "Where do you actually land on the migration?", felt: "Gave you the real risk, unsoftened. Read the candor as respect.", shift: true },
      ],
      read: "Level and open from the first minute. Directness is the trust here.",
    },
    metrics: {
      "Empathy Mirror": { state: "High and steady — a peer-level talk, no warm-up needed.", tone: "warm" },
      "Message Clarity": { state: "You led with the actual constraint. She met it in kind.", tone: "warm" },
      "Active Listening": { state: "Even give and take — two people who trust the room.", tone: "warm" },
    },
  },
  {
    id: "elena-2",
    reportId: "elena",
    session: 2,
    whenLabel: "6 days ago",
    dateLabel: "Jul 1",
    duration: "15 min",
    headline: "She pushed back hard — and you let her win the point.",
    direction: "up",
    directionLabel: "She challenged; you made room",
    read: {
      segments: [
        { t: "At 5:30 she pushed back on your call, directly. Instead of defending it you asked " },
        { t: "“what would you do?”", em: true },
        { t: " and changed your mind on the spot when she was right — and she saw you move. Disagreement in this relationship makes it stronger, not tenser." },
      ],
    },
    win: "At 5:30 you asked “what would you do?” and actually changed your mind when she was right. She noticed.",
    reminder: "Same directness as last time — she brings the risk, you make room for it.",
    mirror: {
      label: "Empathy Mirror",
      signals: {
        openness: { name: "How she felt", points: p([[0, 0.62], [0.3, 0.6], [0.55, 0.7], [1, 0.72]]) },
        voice: { name: "Voice warmth", points: p([[0, 0.6], [0.5, 0.64], [1, 0.68]]) },
      },
      moments: [
        { t: 0.55, value: 0.7, at: "5:30 in", label: "You conceded the point", signal: "Validation Index", said: "What would you do?", felt: "Felt heard — then saw you actually move. Trust climbed.", shift: true },
      ],
      read: "She challenged you and you made room. The relationship got stronger.",
    },
    metrics: {
      "Validation Index": { state: "You asked instead of defending, then changed course. She felt it.", tone: "warm" },
      "Empathy Mirror": { state: "Rose right after you conceded the point — trust, visibly.", tone: "warm" },
      "Outcome Quality": { state: "Left stronger than it opened. Disagreement done well.", tone: "warm" },
    },
  },

  // ── Marcus: smooth on the surface, low disclosure underneath ───────────
  {
    id: "marcus-1",
    reportId: "marcus",
    session: 1,
    whenLabel: "3 weeks ago",
    dateLabel: "Jun 18",
    duration: "12 min",
    headline: "Smooth, agreeable — and hard to read.",
    direction: "steady",
    directionLabel: "Pleasant, but flat",
    read: {
      segments: [
        { t: "Easy conversation, but a strangely even one. Every question landed a version of " },
        { t: "“yeah, all good”", em: true },
        { t: " — at 3:40 you asked about the redesign workload and got " },
        { t: "“it's fine, we'll figure it out.”", em: true },
        { t: " Nothing was wrong, but nothing opened either. Agreeableness can be its own kind of distance." },
      ],
    },
    win: "You asked twice at 3:40 instead of taking the first “fine” — the right instinct, even if it didn't land yet.",
    mirror: {
      label: "Empathy Mirror",
      signals: {
        openness: { name: "How he felt", points: p([[0, 0.5], [0.3, 0.5], [0.6, 0.48], [1, 0.5]]) },
        voice: { name: "Voice warmth", points: p([[0, 0.52], [0.5, 0.5], [1, 0.5]]) },
      },
      moments: [
        { t: 0.3, value: 0.5, at: "3:40 in", label: "“All good”", signal: "Unspoken Concern", said: "It's fine, we'll figure it out.", felt: "Kept it smooth. Didn't let you in.", shift: true },
      ],
      read: "Pleasant and even the whole way. Nothing wrong, nothing open.",
    },
    metrics: {
      "Empathy Mirror": { state: "Even the whole way — pleasant, never quite open.", tone: "mixed" },
      "Unspoken Concern Signal": { state: "Politeness doing a lot of work. Something's parked.", tone: "cool" },
      "Active Listening": { state: "You followed up instead of accepting the first answer. Good instinct.", tone: "warm" },
    },
  },
  {
    id: "marcus-2",
    reportId: "marcus",
    session: 2,
    whenLabel: "a week ago",
    dateLabel: "Jun 30",
    duration: "13 min",
    headline: "Three “all goods” — felt. isn't sure it is.",
    direction: "steady",
    directionLabel: "Still smooth, still closed",
    read: {
      segments: [
        { t: "He said " },
        { t: "“all good”", em: true },
        { t: " three separate times — 1:10, 4:00, and on his way out. This isn't conflict; it's a relationship that hasn't found its way to candor yet. He's not unhappy on the signal — he's just not showing you much. The one exception: at 6:00 you named something specific you appreciated, and his tone actually warmed." },
      ],
    },
    win: "At 6:00 you named something specific you appreciated — the one moment his tone actually warmed.",
    reminder: "Same even line as two weeks ago. That warm beat at 6:00 is the thread to pull next time.",
    mirror: {
      label: "Empathy Mirror",
      signals: {
        openness: { name: "How he felt", points: p([[0, 0.5], [0.25, 0.52], [0.5, 0.5], [0.7, 0.58], [1, 0.54]]) },
        voice: { name: "Voice warmth", points: p([[0, 0.5], [0.5, 0.52], [1, 0.54]]) },
      },
      moments: [
        { t: 0.25, value: 0.52, at: "1:10 in", label: "“All good” again", signal: "Unspoken Concern", said: "Yeah, all good on my end.", felt: "Held it smooth, same as always." },
        { t: 0.7, value: 0.58, at: "6:00 in", label: "One warm beat", signal: "Validation Index", said: "The onboarding flow you shipped was genuinely clean.", felt: "Warmed for a second — specific praise got through.", shift: true },
      ],
      read: "Three “all goods” and one real warm beat. Pull that thread next time.",
    },
    metrics: {
      "Unspoken Concern Signal": { state: "Three “all goods” — that's a pattern, not a mood.", tone: "cool" },
      "Empathy Mirror": { state: "Flat until 6:00, when specific praise finally moved it.", tone: "mixed" },
      "Validation Index": { state: "The specific appreciation at 6:00 got his one honest reaction.", tone: "warm" },
      "Outcome Quality": { state: "Cordial, low-disclosure — but you found the one opening.", tone: "mixed" },
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
/** The four functional teams the roster groups into (Conversations IA). */
export type Team = "Engineering" | "Product" | "Design" | "Data";

export type RosterEntry = {
  id: string;
  name: string;
  initials: string;
  role: string;
  /** Which functional team this person sits on. */
  team: Team;
  /** Human label + raw days since the last 1:1. */
  lastMetLabel: string;
  daysSince: number;
  sessions: number;
  /** Set when this person has full felt. history (opens a report). */
  reportId?: ReportId;
  trend: Direction;
  overdue?: boolean;
};

export const activity = {
  rangeLabel: "Last 30 days",
  kpis: {
    sessions: 11,
    minutes: 164, // 2h 44m across the team this month
    peopleCovered: 4,
    peopleTotal: 6,
    cadenceDays: 8, // avg days between 1:1s
  },
  /** Signed month-over-month deltas for the KPI chips. cadenceDays down = a
      tighter rhythm (good), so its sign is inverted when coloring. */
  kpiDeltas: {
    sessions: 2,
    minutes: 18,
    peopleCovered: 1,
    cadenceDays: -2,
  },
  /** 1:1s per week across the team, oldest → newest. Last entry = this week. */
  weekly: [
    { week: "May 19", count: 1 },
    { week: "May 26", count: 2 },
    { week: "Jun 2", count: 2 },
    { week: "Jun 9", count: 1 },
    { week: "Jun 16", count: 4 },
    { week: "Jun 23", count: 1 },
    { week: "Jun 30", count: 5 },
    { week: "This week", count: 2 },
  ],
  roster: [
    { id: "priya", name: "Priya S.", initials: "PS", role: "Product Lead", team: "Product", lastMetLabel: "3 days ago", daysSince: 3, sessions: 3, reportId: "priya", trend: "up" },
    { id: "daniel", name: "Daniel K.", initials: "DK", role: "Senior Engineer", team: "Engineering", lastMetLabel: "4 days ago", daysSince: 4, sessions: 4, reportId: "daniel", trend: "down" },
    { id: "elena", name: "Elena R.", initials: "ER", role: "Staff Engineer", team: "Engineering", lastMetLabel: "6 days ago", daysSince: 6, sessions: 2, reportId: "elena", trend: "up" },
    { id: "marcus", name: "Marcus T.", initials: "MT", role: "Design Lead", team: "Design", lastMetLabel: "a week ago", daysSince: 7, sessions: 2, reportId: "marcus", trend: "steady" },
    { id: "nadia", name: "Nadia H.", initials: "NH", role: "Data Lead", team: "Data", lastMetLabel: "17 days ago", daysSince: 17, sessions: 1, trend: "steady", overdue: true },
    { id: "sam", name: "Sam O.", initials: "SO", role: "Eng Manager", team: "Engineering", lastMetLabel: "25 days ago", daysSince: 25, sessions: 1, trend: "steady", overdue: true },
  ] as RosterEntry[],
};

/** Team-health trend — the Overview hero. Per-week average warmth (0–1) across
    the team, oldest → newest; net UP over the quarter but dragged by Daniel's
    decline. `sessions` matches `activity.weekly` so the hover reads true. */
export const teamHealth: { label: string; value: number; sessions: number }[] = [
  { label: "May 19", value: 0.62, sessions: 1 },
  { label: "May 26", value: 0.66, sessions: 2 },
  { label: "Jun 2", value: 0.63, sessions: 2 },
  { label: "Jun 9", value: 0.69, sessions: 1 },
  { label: "Jun 16", value: 0.74, sessions: 4 },
  { label: "Jun 23", value: 0.7, sessions: 1 },
  { label: "Jun 30", value: 0.75, sessions: 5 },
  { label: "This week", value: 0.72, sessions: 2 },
];

/** Home "recent" feed — curated most-recent-first across everyone (by real date),
    so the activity list reads chronologically without reordering the grouped
    conversations array above. */
export const recentActivity = ["priya-3", "daniel-4", "elena-2", "marcus-2", "priya-2"];

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

/**
 * Severity ladder — meaning-first, drives the status colors:
 *   critical (red) = a relationship eroding now
 *   warning  (amber) = needs action soon (overdue, drifting)
 *   watch    (blue) = keep an eye on it / a coaching insight
 *   positive (green) = healthy or improving
 */
export type Severity = "critical" | "warning" | "watch" | "positive";

export type SignalTarget = { view: "risk" | "prepare" | "convo" | "new"; id?: string };

export type Signal = {
  id: string;
  severity: Severity;
  /** Who it's about (for the avatar). reportId set only when it opens a report. */
  name: string;
  initials: string;
  reportId?: ReportId;
  title: string;
  detail: string;
  when: string;
  action?: { label: string } & SignalTarget;
  unread?: boolean;
};

/**
 * The one ranked signal feed — powers the notification center, the Risk & Trends
 * ranked list, and the Home "needs attention" rail. Hand-authored to stay
 * consistent with the roster and reads above (no computed scores).
 */
export const signals: Signal[] = [
  {
    id: "daniel-risk",
    severity: "critical",
    name: "Daniel K.",
    initials: "DK",
    reportId: "daniel",
    title: "Trust with Daniel is eroding",
    detail: "Fourth session cooling in a row — warmth down, answers shorter, last 1:1 ended early.",
    when: "2h ago",
    action: { label: "Review risk", view: "risk" },
    unread: true,
  },
  {
    id: "sam-overdue",
    severity: "warning",
    name: "Sam O.",
    initials: "SO",
    title: "Sam O. is overdue",
    detail: "25 days since your last 1:1 — the longest gap on your team.",
    when: "Today",
    action: { label: "Schedule 1:1", view: "new" },
    unread: true,
  },
  {
    id: "nadia-overdue",
    severity: "warning",
    name: "Nadia H.",
    initials: "NH",
    title: "Nadia H. is overdue",
    detail: "17 days since your last 1:1. One session logged all month.",
    when: "Today",
    action: { label: "Schedule 1:1", view: "new" },
    unread: true,
  },
  {
    id: "andrew-blindspot",
    severity: "watch",
    name: "You",
    initials: "A",
    title: "You interrupt more under tension",
    detail: "Your interruptions cluster right after a hard topic surfaces — improving, but still your clearest tell.",
    when: "This week",
    action: { label: "See the trend", view: "risk" },
  },
  {
    id: "marcus-guarded",
    severity: "watch",
    name: "Marcus T.",
    initials: "MT",
    reportId: "marcus",
    title: "Marcus stays guarded",
    detail: "Three “all good” sessions — low disclosure, not conflict. Specific praise is your way in.",
    when: "3 days ago",
    action: { label: "Rehearse", view: "prepare", id: "marcus" },
  },
  {
    id: "priya-climbing",
    severity: "positive",
    name: "Priya S.",
    initials: "PS",
    reportId: "priya",
    title: "Priya keeps climbing",
    detail: "Three strong sessions running — warmth trending up, real candor returning.",
    when: "3 days ago",
    action: { label: "Open report", view: "convo", id: "priya-3" },
  },
  {
    id: "elena-healthy",
    severity: "positive",
    name: "Elena R.",
    initials: "ER",
    reportId: "elena",
    title: "Elena is in a good place",
    detail: "Peer-level candor, trend up. No erosion signals in this relationship.",
    when: "6 days ago",
    action: { label: "Open report", view: "convo", id: "elena-2" },
  },
];

/** Per-report longitudinal trend of the Empathy Mirror reading, for sparklines. */
export const reportTrends: Record<ReportId, { dir: Direction; points: number[] }> = {
  daniel: { dir: "down", points: [0.72, 0.52, 0.4, 0.35] },
  priya: { dir: "up", points: [0.44, 0.6, 0.72] },
  elena: { dir: "up", points: [0.62, 0.7] },
  marcus: { dir: "steady", points: [0.5, 0.52] },
};

/**
 * PREPARE (the "Before" act). A scripted rehearsal per person: the hard talk,
 * why it matters now, what to practice (pulled by hand from their history), and
 * a role-play where felt. voices the other person. Readiness is qualitative —
 * a state, never a 0-100 grade — same rule as the reads.
 */
export type PrepLine = { role: "you" | "them"; text: string; note?: string };
export type PrepScenario = {
  reportId: ReportId;
  urgent?: boolean;
  title: string;
  whyNow: string;
  focus: { label: string; detail: string }[];
  opener: { good: string; avoid: string };
  script: PrepLine[];
  readiness: { level: string; note: string };
};

export const prepScenarios: Partial<Record<ReportId, PrepScenario>> = {
  daniel: {
    reportId: "daniel",
    urgent: true,
    title: "Raise the slipping timeline — without him going quiet again.",
    whyNow: "Trust has cooled four sessions running. Last time you moved to the fix before he felt heard, and he shut down. This is the conversation to get right.",
    focus: [
      { label: "Open with a question, then hold the pause", detail: "It worked with him twice before. Last time you filled the silence after the timeline line — don't." },
      { label: "Acknowledge before you solve", detail: "His worry surfaced but went unmet. A simple “that's fair” lowers the guard before you problem-solve." },
      { label: "Don't reassure to close", detail: "“You've got this” landed as a door shutting. Leave it open instead." },
    ],
    opener: {
      good: "How's the timeline actually feeling from where you sit — not the status, the feel of it?",
      avoid: "So the timeline's basically fixed, but here's the thing —",
    },
    script: [
      { role: "you", text: "Before we get into status — how's the timeline actually feeling from where you sit?" },
      { role: "them", text: "Honestly? Tight. But we'll make it work.", note: "He's testing whether you'll take the tidy version and move on." },
      { role: "you", text: "Say more about the tight part. I've got time." },
      { role: "them", text: "The scope keeps growing and I haven't said no to any of it. I'm the bottleneck and I know it.", note: "He opened — because you asked and waited instead of reassuring." },
      { role: "you", text: "That's fair, and it's not all on you. What would “not the bottleneck” actually look like?" },
      { role: "them", text: "Maybe I hand off the migration piece. I just didn't want to look like I couldn't handle it.", note: "The real worry, out loud. This is the exact moment you missed last time." },
    ],
    readiness: {
      level: "Almost ready",
      note: "You held the pause and acknowledged before fixing — the two beats you missed in your last real 1:1 with him. One watch-out: you reached for the solution at the end again. Next time, leave that last step for him to fill.",
    },
  },
  marcus: {
    reportId: "marcus",
    title: "Get past “all good” — find what he's actually parking.",
    whyNow: "Three sessions of low disclosure. He's not unhappy on the signal, just not showing you much. The one warm beat was specific praise — that's your way in.",
    focus: [
      { label: "Trade a real thing first", detail: "He mirrors your candor. Open something small and true and he'll follow." },
      { label: "Ask what he can't answer with “fine”", detail: "“What's the most annoying part of the redesign right now?” beats “how's it going?”" },
      { label: "Name something specific you value", detail: "Specific praise got his one honest reaction last time. Lead with it, don't save it." },
    ],
    opener: {
      good: "The onboarding flow you shipped was genuinely clean. What's the part of the redesign that's quietly driving you nuts?",
      avoid: "How's everything going on your end?",
    },
    script: [
      { role: "you", text: "The onboarding flow you shipped was clean. What's the part of the redesign that's quietly driving you nuts, though?" },
      { role: "them", text: "Ha — I mean, it's all good, we're on track.", note: "The reflex. Don't accept it; trade something real." },
      { role: "you", text: "I'll go first — the timeline stress is getting to me too. So: what's the annoying part?" },
      { role: "them", text: "…The handoffs, honestly. I redo half of them and I've just been eating it.", note: "He followed your candor with his own. That's the pattern working." },
    ],
    readiness: {
      level: "Ready",
      note: "You led with specific praise and traded a real thing before asking — exactly what moved him last time. Keep the first question concrete, not open-ended, and you'll get past “fine.”",
    },
  },
  priya: {
    reportId: "priya",
    title: "Keep the momentum — and give her a stretch, not just support.",
    whyNow: "Three strong sessions. The risk here isn't conflict, it's autopilot. Don't coast on a good thing.",
    focus: [
      { label: "Keep leading with the question", detail: "It's your strongest habit with her. Protect it." },
      { label: "Offer a stretch", detail: "She's ready for more scope. Safety is built — now use it to push a little." },
    ],
    opener: {
      good: "You've been on a roll. What's the thing you'd take on if you knew I'd back you?",
      avoid: "Everything still going well?",
    },
    script: [
      { role: "you", text: "You've been on a roll. What would you take on next if you knew I'd back you?" },
      { role: "them", text: "I've been wanting to own the whole activation surface, honestly.", note: "Safety turned into ambition — because you asked for it." },
      { role: "you", text: "Then let's make that yours. What do you need from me to do it well?" },
    ],
    readiness: {
      level: "Ready",
      note: "Nothing to fix here — just don't let a good relationship run on autopilot. Bring one real stretch to offer and this stays a growth conversation.",
    },
  },
  elena: {
    reportId: "elena",
    title: "A peer-level check-in — where directness is the trust.",
    whyNow: "Stable and candid. She reads directness as respect, so don't over-soften — bring her a real decision to weigh in on.",
    focus: [
      { label: "Bring a real, unsettled call", detail: "She's at her best weighing a genuine trade-off, not reviewing a done deal." },
      { label: "Make room to be wrong", detail: "Last time you changed your mind when she was right, and trust climbed. Do that on purpose." },
    ],
    opener: {
      good: "I'm genuinely torn on the migration sequencing. Where do you land?",
      avoid: "Just wanted to check in and see how things are going.",
    },
    script: [
      { role: "you", text: "I'm torn on the migration sequencing and I trust your read. Where do you land?" },
      { role: "them", text: "I'd flip it — do the risky piece first while we still have slack.", note: "Straight to the substance, because you gave her something real." },
      { role: "you", text: "That's better than my plan. Let's do it your way.", note: "Conceding when she's right is the whole trust engine with her." },
    ],
    readiness: {
      level: "Ready",
      note: "This one's easy as long as you bring a real question. Over-soften it and you'll bore her; hand her a genuine call and she'll sharpen it.",
    },
  },
};
