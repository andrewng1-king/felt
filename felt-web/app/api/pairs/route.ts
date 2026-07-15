import { NextResponse } from "next/server";
import { listPairs } from "@/lib/engine/memory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Every manager<->report pair with its full session history, for the console
// sidebar and the "cross-session memory" strip.
export async function GET() {
  const pairs = await listPairs();
  return NextResponse.json({ pairs });
}
