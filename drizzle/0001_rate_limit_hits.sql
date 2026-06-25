CREATE TABLE IF NOT EXISTS "rate_limit_hits" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "bucket_key" text NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "rate_limit_hits_bucket_key_idx" ON "rate_limit_hits" ("bucket_key");
CREATE INDEX IF NOT EXISTS "rate_limit_hits_created_at_idx" ON "rate_limit_hits" ("created_at");
