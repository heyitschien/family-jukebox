import { NextResponse } from "next/server";

import { getSitePlayStats, getSongPlayStats } from "@/lib/analytics/plays";
import { getSongBySlug } from "@/data/songs";
import { getClientIp } from "@/lib/security/client-ip";
import { API_RATE_LIMITS, buildIpBucket, checkRateLimit } from "@/lib/security/rate-limit";

export async function GET(request: Request) {
  const ipLimit = await checkRateLimit({
    bucketKey: buildIpBucket("stats", getClientIp(request)),
    limit: API_RATE_LIMITS.statsPerIpPerMinute,
    windowMs: 60_000,
  });

  if (ipLimit.limited) {
    return NextResponse.json(
      { ok: false, error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(ipLimit.retryAfterSeconds),
          "Cache-Control": "private, max-age=30",
        },
      },
    );
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    if (!getSongBySlug(slug)) {
      return NextResponse.json({ ok: false, error: "Unknown song" }, { status: 404 });
    }

    const stats = await getSongPlayStats(slug);
    return NextResponse.json(
      {
        ok: true,
        stats: stats ?? {
          songSlug: slug,
          playCount: 0,
          completeCount: 0,
          uniqueListeners: 0,
        },
      },
      { headers: { "Cache-Control": "private, max-age=30" } },
    );
  }

  const stats = await getSitePlayStats(8);
  return NextResponse.json(
    {
      ok: true,
      stats: stats ?? {
        totalPlays: 0,
        totalCompletes: 0,
        uniqueListeners: 0,
        topSongs: [],
      },
    },
    { headers: { "Cache-Control": "private, max-age=30" } },
  );
}
