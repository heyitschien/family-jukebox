import { albums, type Album } from "@/data/albums";
import { members } from "@/data/members";
import { songs } from "@/data/songs";
import { createRefreshSeed, getDayIndex } from "@/lib/featured-rotation";

function getFeaturedAlbums(): Album[] {
  return albums.filter((album) => album.featured);
}

function rotateArray<T>(items: T[], offset: number): T[] {
  if (items.length === 0) return items;
  const normalized = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(normalized), ...items.slice(0, normalized)];
}

/** One spotlight album per family member — rotates daily through their catalog. */
export function getSpotlightAlbumPerMember(): Album[] {
  const day = getDayIndex();

  return members
    .map((member) => {
      const memberAlbums = albums.filter((album) => album.authorSlug === member.slug);
      if (memberAlbums.length === 0) return undefined;
      return memberAlbums[day % memberAlbums.length];
    })
    .filter((album): album is Album => album !== undefined);
}

/** Hero spotlight album — featured albums first, then daily rotation. */
export function getHeroFeaturedAlbum(refreshSeed = 0): Album {
  const featured = getFeaturedAlbums();
  if (featured.length > 0) {
    const index = refreshSeed % featured.length;
    return featured[index] ?? featured[0] ?? buildFallbackAlbum();
  }

  const spotlight = getSpotlightAlbumPerMember();
  if (spotlight.length === 0) return albums[0] ?? buildFallbackAlbum();
  const index = (getDayIndex() + refreshSeed) % spotlight.length;
  return spotlight[index] ?? albums[0] ?? buildFallbackAlbum();
}

/** Carousel order: featured albums pinned first, then spotlight, then the rest. */
export function getRotatedAlbumCarousel(refreshSeed = 0): Album[] {
  const featured = getFeaturedAlbums();
  const featuredSlugs = new Set(featured.map((album) => album.slug));

  const spotlight = getSpotlightAlbumPerMember().filter((album) => !featuredSlugs.has(album.slug));
  const spotlightSlugs = new Set([...featuredSlugs, ...spotlight.map((album) => album.slug)]);
  const rest = albums.filter((album) => !spotlightSlugs.has(album.slug));

  const rotatedSpotlight = rotateArray(spotlight, getDayIndex() + refreshSeed);
  const rotatedRest = rotateArray(rest, refreshSeed);
  return [...featured, ...rotatedSpotlight, ...rotatedRest];
}

export function getSpotlightAlbumAuthorNames(): string {
  return getSpotlightAlbumPerMember()
    .map((album) => members.find((m) => m.slug === album.authorSlug)?.name)
    .filter(Boolean)
    .join(", ");
}

function buildFallbackAlbum(): Album {
  const firstSong = songs[0];
  return {
    slug: "family-mix",
    title: "Family Mix",
    subtitle: "All our songs",
    authorSlug: firstSong?.authorSlug ?? "ocean",
    coverSrc: firstSong?.coverSrc ?? "/og-share.jpg",
    songSlugs: songs.map((s) => s.slug),
    dateCreated: firstSong?.dateCreated ?? "2026-06-19",
    accentColor: "#ff6fb1",
  };
}

export { createRefreshSeed };
