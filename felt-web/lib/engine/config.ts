/**
 * Engine configuration — resolves the provider, model, and API key from the
 * environment. Model-agnostic by design: start free on Gemini, flip one env var
 * to run the real 5 Reads on Claude for max voice quality. No rebuild.
 *
 * Env (all optional; sensible defaults):
 *   FELT_PROVIDER = gemini | groq | anthropic | dry-run   (default: gemini)
 *   FELT_MODEL    = override the model id                 (default: per provider)
 *   GEMINI_API_KEY / GOOGLE_API_KEY   (for gemini)
 *   GROQ_API_KEY                      (for groq)
 *   ANTHROPIC_API_KEY                 (for anthropic)
 *
 * With no key for the selected provider, the engine runs in dry-run (a shaped
 * placeholder Read) so the console works before a key is added.
 */

import type { ProviderId } from "./types";

export type EngineConfig = {
  provider: ProviderId;
  model: string;
  apiKey: string | null;
  dryRun: boolean;
};

/** Sensible current defaults; override any with FELT_MODEL. */
const DEFAULT_MODEL: Record<Exclude<ProviderId, "dry-run">, string> = {
  gemini: "gemini-2.0-flash", // free tier, strong enough to prototype voice
  groq: "llama-3.3-70b-versatile",
  anthropic: "claude-sonnet-5", // flip to claude-opus-4-8 for the real Reads
};

function keyFor(provider: ProviderId): string | null {
  switch (provider) {
    case "gemini":
      return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || null;
    case "groq":
      return process.env.GROQ_API_KEY || null;
    case "anthropic":
      return process.env.ANTHROPIC_API_KEY || null;
    default:
      return null;
  }
}

export function getEngineConfig(): EngineConfig {
  const raw = (process.env.FELT_PROVIDER || "gemini").toLowerCase();
  const provider = (
    ["gemini", "groq", "anthropic", "dry-run"].includes(raw) ? raw : "gemini"
  ) as ProviderId;

  if (provider === "dry-run") {
    return { provider, model: "dry-run", apiKey: null, dryRun: true };
  }

  const apiKey = keyFor(provider);
  const model = process.env.FELT_MODEL || DEFAULT_MODEL[provider];
  return { provider, model, apiKey, dryRun: !apiKey };
}
