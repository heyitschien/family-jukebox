import { members, type FamilyMember } from "@/data/members";
import { songs, type Song } from "@/data/songs";
import { getDayIndex } from "@/lib/featured-rotation";

type AlbumTone = {
  accent: string;
  glow: string;
};

export type Album = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  member: FamilyMember;
  memberSlug: string;
  coverSrc?: string;
  songs: Song[];
  tags: string[];
  trackCount: number;
  accent: string;
  glow: string;
};

const albumCopy: Record<string, { title: string; subtitle: string; description: string }> = {
  marceline: {
    title: "Dash Mode",
    subtitle: "Tiny feet, huge replay energy",
    description:
      "Marceline's album turns silly movement and toddler-speed games into instant play songs.",
  },
  eliana: {
    title: "Pink Glasses Radio",
    subtitle: "Colorful pop from her point of view",
    description:
      "Eliana's album collects bright, playful songs that see every family moment through rose-colored lenses.",
  },
  solene: {
    title: "Painted Trail Stories",
    subtitle: "Art, foxes, gardens, and worlds",
    description:
      "Solene's album feels like a storybook gallery: colorful trails, secret gardens, and animal adventures.",
  },
  ocean: {
    title: "Adventure Gravity",
    subtitle: "Big journeys and science-fiction fun",
    description:
      "Ocean's album moves from mountain roads to spacey what-if anthems with a big imagination center.",
  },
  "tio-chien": {
    title: "Crayon Pixel Lab",
    subtitle: "Creative experiments from music day",
    description:
      "Tio Chien's album is the studio lab for prompts, pixels, crayons, and family-music experiments.",
  },
};

const albumTones: AlbumTone[] = [
  { accent: "#ff6fb1", glow: "rgba(255, 111, 177, 0.36)" },
  { accent: "#6cb7ff", glow: "rgba(108, 183, 255, 0.34)" },
  { accent: "#c4b5fd", glow: "rgba(196, 181, 253, 0.34)" },
  { accent: "#ffcf6d", glow: "rgba(255, 207, 109, 0.28)" },
  { accent: "#72f0c1", glow: "rgba(114, 240, 193, 0.25)" },
];

function uniqueTags(albumSongs: Song[]): string[] {
  const tagSet = new Set<string>();
  for (const song of albumSongs) {
    for (const tag of song.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}

function rotateArray<T>(items: T[], offset: number): T[] {
  if (items.length === 0) return items;
  const normalized = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(normalized), ...items.slice(0, normalized)];
}

export function getFamilyAlbums(): Album[] {
  return members.map((member, index) => {
    const albumSongs = songs.filter((song) => song.authorSlug === member.slug);
    const copy = albumCopy[member.slug] ?? {
      title: `${member.name}'s Album`,
      subtitle: `${member.name}'s family songs`,
      description: member.description,
    };
    const tone = albumTones[index % albumTones.length] ?? albumTones[0];

    return {
      slug: member.slug,
      title: copy.title,
      subtitle: copy.subtitle,
      description: copy.description,
      member,
      memberSlug: member.slug,
      coverSrc: albumSongs[0]?.coverSrc,
      songs: albumSongs,
      tags: uniqueTags(albumSongs),
      trackCount: albumSongs.length,
      accent: tone.accent,
      glow: tone.glow,
    };
  });
}

export function getAlbumByMemberSlug(memberSlug: string): Album | undefined {
  return getFamilyAlbums().find((album) => album.memberSlug === memberSlug);
}

export function getRotatedFamilyAlbums(refreshSeed = 0): Album[] {
  return rotateArray(getFamilyAlbums(), getDayIndex() + refreshSeed);
}
