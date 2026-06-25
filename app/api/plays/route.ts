import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { recordPlayEvent } from "@/lib/analytics/plays";
import { SESSION_COOKIE } from "@/lib/analytics/constants";
import { getClientIp } from "@/lib/security/client-ip";
import { isPlayTrackingEnabled, parsePlayEventBody } from "@/lib/security/api";
import { API_RATE_LIMITS, buildIpBucket, checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  if (!isPlayTrackingEnabled()) {
    return NextResponse.json({ ok: true, tracked: false, reason: "disabled" });
  }

  const ipLimit = await checkRateLimit({
    bucketKey: buildIpBucket("plays", getClientIp(request)),
    limit: API_RATE_LIMITS.playsPerIpPerMinute,
    windowMs: 60_000,
  });

  if (ipLimit.limited) {
    return NextResponse.json(
      { ok: false, error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(ipLimit.retryAfterSeconds) },
      },
    );
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

  const result = await recordPlayEvent({
    songSlug: parsed.songSlug,
    eventType: parsed.event,
    source: parsed.source,
    sessionId,
    durationMs: parsed.durationMs,
  });

  if (result.status === "rate_limited") {
    return NextResponse.json(
      { ok: false, error: "Session rate limit exceeded" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  if (result.status === "invalid_slug") {
    return NextResponse.json({ ok: false, error: "Unknown song" }, { status: 400 });
  }

  if (result.status === "unavailable") {
    return NextResponse.json({ ok: true, tracked: false, reason: "unavailable" });
  }

  return NextResponse.json({ ok: true, tracked: true });
}
