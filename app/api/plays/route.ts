import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { recordPlayEvent } from "@/lib/analytics/plays";
import { SESSION_COOKIE } from "@/lib/analytics/constants";
import { isPlayTrackingEnabled, parsePlayEventBody } from "@/lib/security/api";

export async function POST(request: Request) {
  if (!isPlayTrackingEnabled()) {
    return NextResponse.json({ ok: true, tracked: false, reason: "disabled" });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parsePlayEventBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) {
    return NextResponse.json({ ok: false, error: "Missing session" }, { status: 401 });
  }

  const tracked = await recordPlayEvent({
    songSlug: parsed.songSlug,
    eventType: parsed.event,
    source: parsed.source,
    sessionId,
    durationMs: parsed.durationMs,
  });

  if (!tracked) {
    return NextResponse.json({ ok: true, tracked: false, reason: "skipped" });
  }

  return NextResponse.json({ ok: true, tracked: true });
}
