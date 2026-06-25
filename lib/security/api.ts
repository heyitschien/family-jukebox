import { PLAY_EVENT_TYPES, PLAY_SOURCES } from "@/lib/analytics/constants";
import { getSongBySlug } from "@/data/songs";

export function isPlayTrackingEnabled(): boolean {
  return process.env.PLAY_TRACKING_ENABLED !== "false";
}

export function parsePlayEventBody(
  body: unknown,
):
  | { ok: true; songSlug: string; event: (typeof PLAY_EVENT_TYPES)[number]; source?: (typeof PLAY_SOURCES)[number]; durationMs?: number }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid JSON body" };
  }

  const record = body as Record<string, unknown>;
  const songSlug = record.songSlug;
  const event = record.event;
  const source = record.source;
  const durationMs = record.durationMs;

  if (typeof songSlug !== "string" || songSlug.length === 0 || songSlug.length > 120) {
    return { ok: false, error: "Invalid song slug" };
  }

  if (!getSongBySlug(songSlug)) {
    return { ok: false, error: "Unknown song" };
  }

  if (typeof event !== "string" || !PLAY_EVENT_TYPES.includes(event as (typeof PLAY_EVENT_TYPES)[number])) {
    return { ok: false, error: "Invalid event type" };
  }

  if (source !== undefined) {
    if (typeof source !== "string" || !PLAY_SOURCES.includes(source as (typeof PLAY_SOURCES)[number])) {
      return { ok: false, error: "Invalid source" };
    }
  }

  if (durationMs !== undefined) {
    if (typeof durationMs !== "number" || !Number.isFinite(durationMs) || durationMs < 0 || durationMs > 3_600_000) {
      return { ok: false, error: "Invalid duration" };
    }
  }

  return {
    ok: true,
    songSlug,
    event: event as (typeof PLAY_EVENT_TYPES)[number],
    source: source as (typeof PLAY_SOURCES)[number] | undefined,
    durationMs: durationMs as number | undefined,
  };
}
