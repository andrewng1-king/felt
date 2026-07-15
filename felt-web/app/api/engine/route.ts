import { NextResponse } from "next/server";
import { getEngineConfig } from "@/lib/engine/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Non-secret engine status for the console header ("Live · Gemini" vs "Dry run").
// Never returns the API key.
export async function GET() {
  const { provider, model, dryRun } = getEngineConfig();
  return NextResponse.json({ provider, model, dryRun });
}
