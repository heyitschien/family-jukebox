import { and, count, countDistinct, desc, eq, gte, sql } from "drizzle-orm";

import { getDb, isDatabaseConfigured } from "@/db";
import { playEvents } from "@/db/schema";
import {
  MAX_EVENTS_PER_SESSION_PER_MINUTE,
  type PlayEventType,
  type PlaySource,
} from "@/lib/analytics/constants";
import { getSongBySlug } from "@/data/songs";

export type RecordPlayInput = {
  songSlug: string;
  eventType: PlayEventType;
  source?: PlaySource;
  sessionId: string;
  durationMs?: number;
};

export type SongPlayStats = {
  songSlug: string;
  playCount: number;
  completeCount: number;
  uniqueListeners: number;
};

export type SitePlayStats = {
  totalPlays: number;
  totalCompletes: number;
  uniqueListeners: number;
  topSongs: SongPlayStats[];
};

function isValidSlug(slug: string): boolean {
  return Boolean(getSongBySlug(slug));
}

export async function isSessionRateLimited(sessionId: string): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  const oneMinuteAgo = new Date(Date.now() - 60_000);
  const [row] = await db
    .select({ total: count() })
    .from(playEvents)
    .where(and(eq(playEvents.sessionId, sessionId), gte(playEvents.createdAt, oneMinuteAgo)));

  return Number(row?.total ?? 0) >= MAX_EVENTS_PER_SESSION_PER_MINUTE;
}

export type RecordPlayResult =
  | { status: "recorded" }
  | { status: "rate_limited" }
  | { status: "invalid_slug" }
  | { status: "unavailable" };

export async function recordPlayEvent(input: RecordPlayInput): Promise<RecordPlayResult> {
  if (!isDatabaseConfigured()) return { status: "unavailable" };
  if (!isValidSlug(input.songSlug)) return { status: "invalid_slug" };

  const db = getDb();
  if (!db) return { status: "unavailable" };

  if (await isSessionRateLimited(input.sessionId)) {
    return { status: "rate_limited" };
  }

  await db.insert(playEvents).values({
    songSlug: input.songSlug,
    eventType: input.eventType,
    source: input.source ?? "unknown",
    sessionId: input.sessionId,
    durationMs: input.durationMs ?? null,
  });

  return { status: "recorded" };
}

export async function getSongPlayStats(songSlug: string): Promise<SongPlayStats | null> {
  if (!isDatabaseConfigured()) return null;

  const db = getDb();
  if (!db) return null;

  const [row] = await db
    .select({
      playCount: sql<number>`count(*) filter (where ${playEvents.eventType} = 'start')`,
      completeCount: sql<number>`count(*) filter (where ${playEvents.eventType} = 'complete')`,
      uniqueListeners: countDistinct(playEvents.sessionId),
    })
    .from(playEvents)
    .where(eq(playEvents.songSlug, songSlug));

  if (!row) return null;

  return {
    songSlug,
    playCount: Number(row.playCount ?? 0),
    completeCount: Number(row.completeCount ?? 0),
    uniqueListeners: Number(row.uniqueListeners ?? 0),
  };
}

export async function getSitePlayStats(limit = 5): Promise<SitePlayStats | null> {
  if (!isDatabaseConfigured()) return null;

  const db = getDb();
  if (!db) return null;

  const [totals] = await db
    .select({
      totalPlays: sql<number>`count(*) filter (where ${playEvents.eventType} = 'start')`,
      totalCompletes: sql<number>`count(*) filter (where ${playEvents.eventType} = 'complete')`,
      uniqueListeners: countDistinct(playEvents.sessionId),
    })
    .from(playEvents);

  const topRows = await db
    .select({
      songSlug: playEvents.songSlug,
      playCount: sql<number>`count(*) filter (where ${playEvents.eventType} = 'start')`,
      completeCount: sql<number>`count(*) filter (where ${playEvents.eventType} = 'complete')`,
      uniqueListeners: countDistinct(playEvents.sessionId),
    })
    .from(playEvents)
    .groupBy(playEvents.songSlug)
    .orderBy(desc(sql`count(*) filter (where ${playEvents.eventType} = 'start')`))
    .limit(limit);

  return {
    totalPlays: Number(totals?.totalPlays ?? 0),
    totalCompletes: Number(totals?.totalCompletes ?? 0),
    uniqueListeners: Number(totals?.uniqueListeners ?? 0),
    topSongs: topRows.map((row) => ({
      songSlug: row.songSlug,
      playCount: Number(row.playCount ?? 0),
      completeCount: Number(row.completeCount ?? 0),
      uniqueListeners: Number(row.uniqueListeners ?? 0),
    })),
  };
}
