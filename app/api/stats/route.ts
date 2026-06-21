import { NextResponse } from "next/server";

import { getSitePlayStats, getSongPlayStats } from "@/lib/analytics/plays";
import { getSongBySlug } from "@/data/songs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    if (!getSongBySlug(slug)) {
      return NextResponse.json({ ok: false, error: "Unknown song" }, { status: 404 });
    }

    const stats = await getSongPlayStats(slug);
    return NextResponse.json({
      ok: true,
      stats: stats ?? {
        songSlug: slug,
        playCount: 0,
        completeCount: 0,
        uniqueListeners: 0,
      },
    });
  }

  const stats = await getSitePlayStats(8);
  return NextResponse.json({
    ok: true,
    stats: stats ?? {
      totalPlays: 0,
      totalCompletes: 0,
      uniqueListeners: 0,
      topSongs: [],
    },
  });
}
