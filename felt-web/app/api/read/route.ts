import { NextResponse } from "next/server";
import { generateRead } from "@/lib/engine/engine";
import type { GenerateReadInput } from "@/lib/engine/types";

// fs-backed memory + provider fetches -> Node runtime, always dynamic.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: Partial<GenerateReadInput>;
  try {
    body = (await req.json()) as Partial<GenerateReadInput>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const transcript = (body.transcript ?? "").toString().trim();
  const managerName = (body.managerName ?? "").toString().trim();
  const reportName = (body.reportName ?? "").toString().trim();

  if (!managerName || !reportName) {
    return NextResponse.json(
      { error: "Manager and report names are both required." },
      { status: 400 },
    );
  }
  if (!transcript) {
    return NextResponse.json({ error: "A transcript is required." }, { status: 400 });
  }
  if (transcript.length < 40) {
    return NextResponse.json(
      { error: "That transcript looks too short to read — paste the full 1:1." },
      { status: 400 },
    );
  }

  try {
    const out = await generateRead({
      transcript,
      managerName,
      reportName,
      pairId: body.pairId?.toString().trim() || undefined,
      reportPronoun: body.reportPronoun?.toString().trim() || undefined,
      meetingDate: body.meetingDate?.toString() || undefined,
    });
    return NextResponse.json(out);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "The Read failed to generate.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
