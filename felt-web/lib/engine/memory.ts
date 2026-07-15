/**
 * Cross-session memory — a dead-simple, inspectable per-pair store.
 *
 * One JSON file per manager<->report pair under `.felt-data/pairs/`. At the
 * concierge scale (a handful of pairs), this beats a vector DB: exact-key lookup,
 * zero setup, and you can open the file and read the history by eye.
 *
 * The important bit: computePatternFacts() derives the numbers behind any
 * "N of the last M" claim IN CODE from prior sessions, so the model never has to
 * invent a count. That is what keeps the Mirror Rule honest.
 */

import { promises as fs } from "fs";
import path from "path";
import type {
  Direction,
  PairMemory,
  PatternFacts,
  ReadResult,
  SessionRecord,
} from "./types";

const DATA_DIR = path.join(process.cwd(), ".felt-data", "pairs");

/** Derive a stable pair id from the two names. */
export function slugifyPair(manager: string, report: string): string {
  const s = (v: string) =>
    v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "x";
  return `${s(manager)}__${s(report)}`;
}

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function fileFor(pairId: string) {
  return path.join(DATA_DIR, `${pairId}.json`);
}

export async function loadPair(pairId: string): Promise<PairMemory | null> {
  try {
    const raw = await fs.readFile(fileFor(pairId), "utf8");
    const pair = JSON.parse(raw) as PairMemory;
    if (!Array.isArray(pair.sessions)) pair.sessions = [];
    return pair;
  } catch {
    return null;
  }
}

export async function listPairs(): Promise<PairMemory[]> {
  try {
    await ensureDir();
    const files = await fs.readdir(DATA_DIR);
    const pairs: PairMemory[] = [];
    for (const f of files) {
      if (!f.endsWith(".json")) continue;
      try {
        pairs.push(JSON.parse(await fs.readFile(path.join(DATA_DIR, f), "utf8")));
      } catch {
        // skip a corrupt file rather than fail the whole list
      }
    }
    pairs.sort((a, b) => (lastDate(b) ?? "").localeCompare(lastDate(a) ?? ""));
    return pairs;
  } catch {
    return [];
  }
}

function lastDate(p: PairMemory): string | undefined {
  return p.sessions[p.sessions.length - 1]?.date;
}

export async function savePair(pair: PairMemory): Promise<void> {
  await ensureDir();
  await fs.writeFile(fileFor(pair.pairId), JSON.stringify(pair, null, 2), "utf8");
}

/** Count trailing consecutive entries equal to `target`. */
function trailing(dirs: Direction[], target: Direction): number {
  let n = 0;
  for (let i = dirs.length - 1; i >= 0; i--) {
    if (dirs[i] === target) n++;
    else break;
  }
  return n;
}

/** Facts derived from PRIOR sessions only (today is not yet known). */
export function computePatternFacts(pair: PairMemory | null): PatternFacts {
  const prior = pair?.sessions ?? [];
  const priorDirections = prior.map((s) => s.direction);
  const priorCoolingStreak = trailing(priorDirections, "down");
  const priorWarmingStreak = trailing(priorDirections, "up");
  const riskLevel: PatternFacts["riskLevel"] =
    priorCoolingStreak >= 3
      ? "alert"
      : priorCoolingStreak === 2
        ? "rising"
        : priorCoolingStreak === 1
          ? "watch"
          : "none";

  return {
    sessionNumber: prior.length + 1,
    isColdStart: prior.length === 0,
    priorDirections,
    priorCoolingStreak,
    priorWarmingStreak,
    openingHistory: prior.map((s) => ({
      session: s.session,
      style: s.signals.openingStyle,
      endedColder: s.signals.engagementTrend === "down",
    })),
    riskLevel,
  };
}

/** Join Read segments back into plain text (for the stored summary). */
export function segmentsToText(segs: { t: string }[]): string {
  return segs.map((s) => s.t).join("");
}

/** Persist today's Read as a new session and return the updated pair. */
export async function appendSession(
  base: {
    pairId: string;
    managerName: string;
    reportName: string;
    reportPronoun?: string;
    date: string;
  },
  read: ReadResult,
): Promise<PairMemory> {
  const existing = await loadPair(base.pairId);
  const pair: PairMemory =
    existing ?? {
      pairId: base.pairId,
      managerName: base.managerName,
      reportName: base.reportName,
      reportPronoun: base.reportPronoun,
      sessions: [],
    };

  const session = pair.sessions.length + 1;
  const record: SessionRecord = {
    id: `${base.pairId}-${session}`,
    session,
    date: base.date,
    direction: read.direction,
    directionLabel: read.directionLabel,
    win: read.win,
    signals: read.signals,
    summary: segmentsToText(read.segments).slice(0, 280),
  };

  pair.sessions.push(record);
  // Keep identity fields current in case they were edited.
  pair.managerName = base.managerName;
  pair.reportName = base.reportName;
  if (base.reportPronoun) pair.reportPronoun = base.reportPronoun;

  await savePair(pair);
  return pair;
}
