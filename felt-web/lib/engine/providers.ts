/**
 * Model adapters — one thin fetch call per provider, no SDK dependency (keeps
 * the build hermetic). Swap providers with the FELT_PROVIDER env var; the rest
 * of the engine doesn't change.
 *
 * With no key configured, callModel() returns a shaped dry-run Read so the whole
 * flow is testable before you add a key.
 */

import type { EngineConfig } from "./config";
import type { ModelCall, ReadResult } from "./types";

export async function callModel(cfg: EngineConfig, call: ModelCall): Promise<string> {
  if (cfg.dryRun || cfg.provider === "dry-run" || !cfg.apiKey) return dryRunRead();
  switch (cfg.provider) {
    case "gemini":
      return callGemini(cfg, call);
    case "groq":
      return callGroq(cfg, call);
    case "anthropic":
      return callAnthropic(cfg, call);
    default:
      return dryRunRead();
  }
}

// --- Gemini (Google AI Studio, free tier) ---------------------------------
async function callGemini(cfg: EngineConfig, call: ModelCall): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${cfg.model}:generateContent?key=${cfg.apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: call.system }] },
      contents: [{ role: "user", parts: [{ text: call.user }] }],
      generationConfig: {
        temperature: 0.7,
        ...(call.json ? { responseMimeType: "application/json" } : {}),
      },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text: string =
    data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ??
    "";
  if (!text) throw new Error("Gemini returned no text (check the model id and quota).");
  return text;
}

// --- Groq (OpenAI-compatible) ---------------------------------------------
async function callGroq(cfg: EngineConfig, call: ModelCall): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${cfg.apiKey}` },
    body: JSON.stringify({
      model: cfg.model,
      temperature: 0.7,
      ...(call.json ? { response_format: { type: "json_object" } } : {}),
      messages: [
        { role: "system", content: call.system },
        { role: "user", content: call.user },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text: string = data?.choices?.[0]?.message?.content ?? "";
  if (!text) throw new Error("Groq returned no text.");
  return text;
}

// --- Anthropic (Claude) ----------------------------------------------------
async function callAnthropic(cfg: EngineConfig, call: ModelCall): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": cfg.apiKey as string,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: cfg.model,
      max_tokens: 1600,
      temperature: 0.7,
      system: call.system,
      messages: [{ role: "user", content: call.user }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text: string = Array.isArray(data?.content)
    ? data.content.map((b: { text?: string }) => b.text ?? "").join("")
    : "";
  if (!text) throw new Error("Anthropic returned no text.");
  return text;
}

// --- Dry run (no key) ------------------------------------------------------
function dryRunRead(): string {
  const read: ReadResult = {
    segments: [
      { t: "This is a dry-run Read — no provider key is set, so felt. hasn't actually read the transcript yet. The words are placeholder, but the shape is exactly what a live Read returns. Add a " },
      { t: "GEMINI_API_KEY", em: true },
      { t: " to .env.local and generate again to see the real thing." },
    ],
    direction: "steady",
    directionLabel: "Dry run — no key set",
    win: "You wired up the console and ran a transcript through it end to end — the plumbing works.",
    reminder: null,
    identityPraise: null,
    patternLine: null,
    quote: null,
    metrics: [
      { name: "How It Landed", phase: "Post", state: "Runs live once a provider key is set.", tone: "mixed" },
      { name: "Quiet / Drop-off Signal", phase: "Post", state: "Runs live once a provider key is set.", tone: "mixed" },
    ],
    signals: {
      openingStyle: "unknown",
      engagementTrend: "steady",
      heldPause: false,
      acknowledgedBeforeSolving: false,
      topicsDropped: [],
    },
  };
  return JSON.stringify(read);
}
