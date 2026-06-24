/** Per-song resume positions — local only, no accounts. */

export const PLAYBACK_POSITION_KEY = "family-jukebox:playback-positions";

export const MIN_RESUME_SECONDS = 8;
export const END_BUFFER_SECONDS = 12;

type PositionMap = Record<string, number>;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readPositions(): PositionMap {
  if (!isBrowser()) return {};

  try {
    const raw = localStorage.getItem(PLAYBACK_POSITION_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};

    const map: PositionMap = {};
    for (const [slug, value] of Object.entries(parsed)) {
      if (typeof slug === "string" && typeof value === "number" && Number.isFinite(value) && value >= 0) {
        map[slug] = value;
      }
    }
    return map;
  } catch {
    return {};
  }
}

function writePositions(map: PositionMap): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(PLAYBACK_POSITION_KEY, JSON.stringify(map));
  } catch {
    // Quota or privacy mode — playback still works without resume.
  }
}

export function savePlaybackPosition(songSlug: string, seconds: number): void {
  if (!songSlug || !Number.isFinite(seconds) || seconds < 0) return;

  const map = readPositions();
  map[songSlug] = seconds;
  writePositions(map);
}

export function getPlaybackPosition(songSlug: string): number | null {
  const value = readPositions()[songSlug];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function clearPlaybackPosition(songSlug: string): void {
  const map = readPositions();
  if (!(songSlug in map)) return;
  delete map[songSlug];
  writePositions(map);
}

export function shouldResumeFrom(seconds: number, duration: number): boolean {
  if (!Number.isFinite(seconds) || !Number.isFinite(duration) || duration <= 0) return false;
  if (seconds < MIN_RESUME_SECONDS) return false;
  if (seconds >= duration - END_BUFFER_SECONDS) return false;
  return true;
}
