/** Describes where the active queue came from — helps listeners stay oriented. */

export type QueueContextKind =
  | "single"
  | "album"
  | "favorites"
  | "artist"
  | "shelf"
  | "queue"
  | "radio";

export type QueueContext = {
  kind: QueueContextKind;
  label: string;
  href: string;
};

export function buildAlbumQueueContext(albumSlug: string, title: string): QueueContext {
  return {
    kind: "album",
    label: title,
    href: `/albums/${albumSlug}`,
  };
}

export function buildArtistQueueContext(authorSlug: string, name: string): QueueContext {
  return {
    kind: "artist",
    label: name,
    href: `/members/${authorSlug}`,
  };
}

export const FAVORITES_QUEUE_CONTEXT: QueueContext = {
  kind: "favorites",
  label: "Your favorites",
  href: "/favorites",
};

export const NOW_PLAYING_CONTEXT: QueueContext = {
  kind: "queue",
  label: "Now playing",
  href: "/now-playing",
};

export const COUSIN_RADIO_CONTEXT: QueueContext = {
  kind: "radio",
  label: "Cousin Radio",
  href: "/",
};

export function buildShelfQueueContext(label: string): QueueContext {
  return {
    kind: "shelf",
    label,
    href: "/now-playing",
  };
}

export function buildSingleQueueContext(songTitle: string, songSlug: string): QueueContext {
  return {
    kind: "single",
    label: songTitle,
    href: `/songs/${songSlug}`,
  };
}
