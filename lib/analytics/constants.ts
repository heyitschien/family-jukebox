export const SESSION_COOKIE = "fj_session";

export const PLAY_EVENT_TYPES = ["start", "complete"] as const;
export type PlayEventType = (typeof PLAY_EVENT_TYPES)[number];

export const PLAY_SOURCES = [
  "hero",
  "shelf",
  "queue",
  "detail",
  "mini-player",
  "auto-advance",
  "unknown",
] as const;
export type PlaySource = (typeof PLAY_SOURCES)[number];

export const MAX_EVENTS_PER_SESSION_PER_MINUTE = 40;
