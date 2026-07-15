/**
 * felt. Read engine — shared types.
 *
 * The engine turns a raw 1:1 transcript into "The Read": a short coach-voice
 * paragraph that tells a manager how they LANDED — what they did and the
 * observable effect it had — never a label on the employee's inner feeling.
 *
 * These types are the contract between the model output, the memory store, and
 * the console UI. Keep them in sync with the JSON schema described in prompt.ts.
 */

/** Direction of the relationship's warmth this session. The single arrow. */
export type Direction = "up" | "down" | "steady";

/** Qualitative tone for a metric line — never a 0–100 grade (house rule). */
export type Tone = "warm" | "mixed" | "cool";

/** One span of the Read paragraph. Spoken/quoted lines carry em (italic). */
export type ReadSegment = { t: string; em?: boolean };

/** A single line in the "see detail" breakdown (opt-in evidence, not the read). */
export type MetricLine = {
  name: string;
  phase: string;
  state: string;
  tone: Tone;
  /** Reframes a low read as a next-step door, per the "no grade" rule. */
  reframe?: string;
};

/**
 * Structured signals the engine extracts each session and PERSISTS, so that code
 * (not the model) can compute honest longitudinal facts next time. Keeping the
 * counts in code is what makes the Mirror Rule safe — "a mirror can't be wrong".
 */
export type SessionSignals = {
  /** How the manager opened, e.g. "question-first", "status-first", "pressure". */
  openingStyle: string;
  /** Did the report's engagement rise, fall, or hold across the conversation. */
  engagementTrend: Direction;
  /** Did the manager hold silence / let the report lead. */
  heldPause: boolean;
  /** Did the manager acknowledge before moving to a fix. */
  acknowledgedBeforeSolving: boolean;
  /** Short topic phrases the report visibly disengaged from (drop-off signal). */
  topicsDropped: string[];
};

/** The full Read for one conversation — the engine's output. */
export type ReadResult = {
  /** The hero paragraph, as prose segments. Read once, walk away. */
  segments: ReadSegment[];
  /** The single direction arrow + a short label. */
  direction: Direction;
  directionLabel: string;
  /** The guaranteed win — one specific moment that worked. NEVER empty. */
  win: string;
  /** Woven reminder (a past win with THIS person). Null on cold start. */
  reminder?: string | null;
  /** Identity praise — only on a real consecutive-win streak (3rd/5th). */
  identityPraise?: string | null;
  /** Mirror-Rule pattern line — projects the MANAGER's pattern forward, using
      only code-computed counts. Null until real history exists. */
  patternLine?: string | null;
  /** Optional curated quote — never auto-filled with generic wisdom. */
  quote?: { text: string; author: string } | null;
  /** The "see detail" breakdown (opt-in evidence). */
  metrics: MetricLine[];
  /** Machine signals for longitudinal memory (not shown as prose). */
  signals: SessionSignals;
};

/** One persisted session in a pair's history. */
export type SessionRecord = {
  id: string;
  session: number;
  /** ISO date of the conversation. */
  date: string;
  direction: Direction;
  directionLabel: string;
  win: string;
  signals: SessionSignals;
  /** A short text summary of the Read, for the next prompt's context. */
  summary: string;
};

/** All history for one manager <-> report relationship. */
export type PairMemory = {
  pairId: string;
  managerName: string;
  reportName: string;
  reportPronoun?: string;
  sessions: SessionRecord[];
};

/**
 * Honest, code-computed facts derived from PRIOR sessions (before today) and
 * handed to the model as ground truth. The model must use these exact numbers
 * and never fabricate a count.
 */
export type PatternFacts = {
  /** 1-based index of the session being read now. */
  sessionNumber: number;
  /** True when there is no prior history (session 1). */
  isColdStart: boolean;
  /** Prior directions, oldest -> newest (excludes today). */
  priorDirections: Direction[];
  /** Trailing consecutive "down" sessions coming in. */
  priorCoolingStreak: number;
  /** Trailing consecutive "up" sessions coming in. */
  priorWarmingStreak: number;
  /** Prior openings, for a possible same-style pattern claim. */
  openingHistory: { session: number; style: string; endedColder: boolean }[];
  /** Standing risk coming into today. */
  riskLevel: "none" | "watch" | "rising" | "alert";
};

/** Input to generateRead(). */
export type GenerateReadInput = {
  transcript: string;
  /** Stable id for the manager<->report pair. Derived from names if omitted. */
  pairId?: string;
  managerName: string;
  reportName: string;
  reportPronoun?: string;
  /** ISO date of the meeting; defaults to now. */
  meetingDate?: string;
};

/** Output of generateRead(). */
export type GenerateReadOutput = {
  read: ReadResult;
  facts: PatternFacts;
  /** The updated pair memory (including today's session). */
  pair: PairMemory;
  meta: { provider: ProviderId; model: string; dryRun: boolean; ms: number };
};

/** Supported model providers (plus the keyless dry-run stub). */
export type ProviderId = "gemini" | "groq" | "anthropic" | "dry-run";

/** A single model call. */
export type ModelCall = {
  system: string;
  user: string;
  /** Ask the provider for JSON output where supported. */
  json?: boolean;
};
