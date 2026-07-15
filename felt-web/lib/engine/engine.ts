/**
 * generateRead() — the orchestration:
 *   load pair memory -> compute honest FACTS -> build prompt -> call model
 *   -> parse + coerce -> enforce cold-start/streak rules IN CODE -> persist.
 *
 * The code-side rule enforcement is deliberate belt-and-suspenders: even if the
 * model slips and writes a pattern line on a cold start, we strip it, so the
 * "a mirror can't be wrong" guarantee holds regardless of model behaviour.
 */

import { getEngineConfig } from "./config";
import { callModel } from "./providers";
import { buildSystemPrompt, buildUserPrompt } from "./prompt";
import { appendSession, computePatternFacts, loadPair, slugifyPair } from "./memory";
import type {
  Direction,
  GenerateReadInput,
  GenerateReadOutput,
  MetricLine,
  PatternFacts,
  ReadResult,
  ReadSegment,
  Tone,
} from "./types";

export async function generateRead(input: GenerateReadInput): Promise<GenerateReadOutput> {
  const started = Date.now();
  const cfg = getEngineConfig();

  const pairId = input.pairId?.trim() || slugifyPair(input.managerName, input.reportName);
  const priorPair = await loadPair(pairId);
  const facts = computePatternFacts(priorPair);

  const system = buildSystemPrompt();
  const user = buildUserPrompt({ ...input, pairId }, facts);

  const raw = await callModel(cfg, { system, user, json: true });
  const read = enforceRules(parseReadResult(raw), facts);

  const date = input.meetingDate || new Date().toISOString();
  const pair = await appendSession(
    {
      pairId,
      managerName: input.managerName,
      reportName: input.reportName,
      reportPronoun: input.reportPronoun,
      date,
    },
    read,
  );

  return {
    read,
    facts,
    pair,
    meta: { provider: cfg.provider, model: cfg.model, dryRun: cfg.dryRun, ms: Date.now() - started },
  };
}

// --- Parsing --------------------------------------------------------------

function extractJson(raw: string): string {
  let s = raw.trim();
  if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  }
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first >= 0 && last > first) s = s.slice(first, last + 1);
  return s;
}

function parseReadResult(raw: string): ReadResult {
  const json = extractJson(raw);
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(json) as Record<string, unknown>;
  } catch {
    throw new Error(
      `The model did not return valid JSON. First 400 chars of its reply:\n${raw.slice(0, 400)}`,
    );
  }
  return coerce(obj);
}

const isDir = (v: unknown): v is Direction => v === "up" || v === "down" || v === "steady";
const isTone = (v: unknown): v is Tone => v === "warm" || v === "mixed" || v === "cool";

function coerce(o: Record<string, unknown>): ReadResult {
  const direction: Direction = isDir(o.direction) ? o.direction : "steady";

  const rawSegs = Array.isArray(o.segments) ? (o.segments as unknown[]) : [];
  let segments: ReadSegment[] = rawSegs
    .map((x) => {
      const seg = x as { t?: unknown; em?: unknown };
      return { t: String(seg?.t ?? ""), ...(seg?.em ? { em: true as const } : {}) };
    })
    .filter((s) => s.t.length > 0);
  if (segments.length === 0) {
    segments = [{ t: String(o.paragraph ?? "felt. couldn't compose a Read from this transcript.") }];
  }

  const metrics: MetricLine[] = (Array.isArray(o.metrics) ? (o.metrics as unknown[]) : []).map(
    (m) => {
      const mm = m as { name?: unknown; phase?: unknown; state?: unknown; tone?: unknown; reframe?: unknown };
      return {
        name: String(mm?.name ?? "Signal"),
        phase: String(mm?.phase ?? "Post"),
        state: String(mm?.state ?? ""),
        tone: isTone(mm?.tone) ? mm.tone : "mixed",
        ...(mm?.reframe ? { reframe: String(mm.reframe) } : {}),
      };
    },
  );

  const sig = (o.signals ?? {}) as Record<string, unknown>;
  const quote = o.quote as { text?: unknown; author?: unknown } | null | undefined;

  return {
    segments,
    direction,
    directionLabel: String(
      o.directionLabel ?? (direction === "up" ? "Warmer" : direction === "down" ? "Cooler" : "Steady"),
    ),
    win: String(o.win ?? "").trim() || "One true good beat this session — see the read.",
    reminder: o.reminder ? String(o.reminder) : null,
    identityPraise: o.identityPraise ? String(o.identityPraise) : null,
    patternLine: o.patternLine ? String(o.patternLine) : null,
    quote: quote?.text ? { text: String(quote.text), author: String(quote.author ?? "") } : null,
    metrics,
    signals: {
      openingStyle: String(sig.openingStyle ?? "unknown"),
      engagementTrend: isDir(sig.engagementTrend) ? sig.engagementTrend : "steady",
      heldPause: Boolean(sig.heldPause),
      acknowledgedBeforeSolving: Boolean(sig.acknowledgedBeforeSolving),
      topicsDropped: Array.isArray(sig.topicsDropped)
        ? (sig.topicsDropped as unknown[]).map(String).slice(0, 6)
        : [],
    },
  };
}

// --- Rule enforcement (code-side guarantees) ------------------------------

function enforceRules(read: ReadResult, facts: PatternFacts): ReadResult {
  if (facts.isColdStart) {
    read.reminder = null;
    read.patternLine = null;
    read.identityPraise = null;
  }
  if (facts.sessionNumber < 2) read.reminder = null;

  // Identity praise only survives on a real 3rd+ consecutive win.
  const wouldBeWarmingStreak = read.direction === "up" ? facts.priorWarmingStreak + 1 : 0;
  if (wouldBeWarmingStreak < 3) read.identityPraise = null;

  return read;
}
