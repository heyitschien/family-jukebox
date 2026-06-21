"use client";

import type { PlayEventType, PlaySource } from "@/lib/analytics/constants";

type TrackPlayPayload = {
  songSlug: string;
  event: PlayEventType;
  source?: PlaySource;
  durationMs?: number;
};

/** Fire-and-forget analytics — never blocks or throws into playback UI. */
export function trackPlayEvent(payload: TrackPlayPayload): void {
  try {
    const body = JSON.stringify(payload);
    const url = "/api/plays";

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
      return;
    }

    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // Analytics should never interrupt the jukebox.
  }
}
