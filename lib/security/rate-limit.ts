import { and, count, eq, gte, lt } from "drizzle-orm";

import { getDb, isDatabaseConfigured } from "@/db";
import { rateLimitHits } from "@/db/schema";

export type RateLimitResult =
  | { limited: false }
  | { limited: true; retryAfterSeconds: number };

type RateLimitOptions = {
  bucketKey: string;
  limit: number;
  windowMs: number;
};

const CLEANUP_AGE_MS = 5 * 60_000;

export async function checkRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  if (!isDatabaseConfigured()) return { limited: false };

  const db = getDb();
  if (!db) return { limited: false };

  const windowStart = new Date(Date.now() - options.windowMs);

  try {
    const [row] = await db
      .select({ total: count() })
      .from(rateLimitHits)
      .where(and(eq(rateLimitHits.bucketKey, options.bucketKey), gte(rateLimitHits.createdAt, windowStart)));

    const total = Number(row?.total ?? 0);
    if (total >= options.limit) {
      return {
        limited: true,
        retryAfterSeconds: Math.ceil(options.windowMs / 1000),
      };
    }

    await db.insert(rateLimitHits).values({ bucketKey: options.bucketKey });

    const cleanupBefore = new Date(Date.now() - CLEANUP_AGE_MS);
    void db.delete(rateLimitHits).where(lt(rateLimitHits.createdAt, cleanupBefore));

    return { limited: false };
  } catch {
    // If the table is missing or Neon is unavailable, do not block legitimate traffic.
    return { limited: false };
  }
}

export const API_RATE_LIMITS = {
  playsPerIpPerMinute: 100,
  statsPerIpPerMinute: 30,
  artworkPerIpPerMinute: 60,
} as const;

export function buildIpBucket(route: string, ip: string): string {
  return `${route}:ip:${ip}`;
}
