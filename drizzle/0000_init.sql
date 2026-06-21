CREATE TABLE IF NOT EXISTS "play_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "song_slug" text NOT NULL,
  "event_type" text NOT NULL,
  "source" text,
  "session_id" text NOT NULL,
  "duration_ms" integer,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "play_events_song_slug_idx" ON "play_events" ("song_slug");
CREATE INDEX IF NOT EXISTS "play_events_created_at_idx" ON "play_events" ("created_at");
CREATE INDEX IF NOT EXISTS "play_events_session_id_idx" ON "play_events" ("session_id");
