import { getAlbumForSong } from "@/data/albums";
import type { FamilyMember } from "@/data/members";
import type { Song } from "@/data/songs";
import { APP_ICON_PATHS } from "@/lib/app-install";
import { getRuntimeSiteUrl, getSiteName } from "@/lib/site-env";

function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getRuntimeSiteUrl()}${normalized}`;
}

function coverMimeType(coverSrc: string): string {
  return coverSrc.endsWith(".png") ? "image/png" : "image/jpeg";
}

export function syncMediaSessionMetadata(song: Song, author: FamilyMember | null): void {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;

  const album = getAlbumForSong(song);
  const artwork = [
    {
      src: absoluteUrl(song.coverSrc),
      sizes: "1024x1024",
      type: coverMimeType(song.coverSrc),
    },
    {
      src: absoluteUrl(APP_ICON_PATHS.icon512),
      sizes: "512x512",
      type: "image/png",
    },
    {
      src: absoluteUrl(APP_ICON_PATHS.appleTouch),
      sizes: "180x180",
      type: "image/png",
    },
    {
      src: absoluteUrl(APP_ICON_PATHS.icon192),
      sizes: "192x192",
      type: "image/png",
    },
  ];

  navigator.mediaSession.metadata = new MediaMetadata({
    title: song.title,
    artist: author?.name ?? "Cousin Radio Family",
    album: album?.title ?? getSiteName(),
    artwork,
  });
}

export function clearMediaSessionMetadata(): void {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
  navigator.mediaSession.metadata = null;
}

export type MediaSessionActions = {
  onPlay: () => void;
  onPause: () => void;
  onSkipNext: () => void;
  onSkipPrev: () => void;
};

export function bindMediaSessionActions(actions: MediaSessionActions): () => void {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return () => {};

  const { onPlay, onPause, onSkipNext, onSkipPrev } = actions;

  try {
    navigator.mediaSession.setActionHandler("play", onPlay);
    navigator.mediaSession.setActionHandler("pause", onPause);
    navigator.mediaSession.setActionHandler("nexttrack", onSkipNext);
    navigator.mediaSession.setActionHandler("previoustrack", onSkipPrev);
    navigator.mediaSession.setActionHandler("seekbackward", null);
    navigator.mediaSession.setActionHandler("seekforward", null);
  } catch {
    return () => {};
  }

  return () => {
    navigator.mediaSession.setActionHandler("play", null);
    navigator.mediaSession.setActionHandler("pause", null);
    navigator.mediaSession.setActionHandler("nexttrack", null);
    navigator.mediaSession.setActionHandler("previoustrack", null);
  };
}

export function syncMediaSessionPlaybackState(isPlaying: boolean): void {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
  navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
}
