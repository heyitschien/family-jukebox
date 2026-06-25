import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const playEvents = pgTable(
  "play_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    songSlug: text("song_slug").notNull(),
    eventType: text("event_type").notNull(),
    source: text("source"),
    sessionId: text("session_id").notNull(),
    durationMs: integer("duration_ms"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("play_events_song_slug_idx").on(table.songSlug),
    index("play_events_created_at_idx").on(table.createdAt),
    index("play_events_session_id_idx").on(table.sessionId),
  ],
);

export type PlayEvent = typeof playEvents.$inferSelect;
export type NewPlayEvent = typeof playEvents.$inferInsert;

/** Sliding-window API rate limit buckets (IP + route). */
export const rateLimitHits = pgTable(
  "rate_limit_hits",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bucketKey: text("bucket_key").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("rate_limit_hits_bucket_key_idx").on(table.bucketKey),
    index("rate_limit_hits_created_at_idx").on(table.createdAt),
  ],
);

export type RateLimitHit = typeof rateLimitHits.$inferSelect;
