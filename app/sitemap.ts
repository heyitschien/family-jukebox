import type { MetadataRoute } from "next";

import { albums } from "@/data/albums";
import { members } from "@/data/members";
import { songs } from "@/data/songs";
import { SITE_URL } from "@/lib/site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/songs", "/albums", "/favorites", "/family", "/search"] as const;

  return [
    ...staticRoutes.map((path) => ({
      url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.8,
    })),
    ...songs.map((song) => ({
      url: `${SITE_URL}/songs/${song.slug}`,
      lastModified: new Date(song.dateCreated),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...albums.map((album) => ({
      url: `${SITE_URL}/albums/${album.slug}`,
      lastModified: new Date(album.dateCreated),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...members.map((member) => ({
      url: `${SITE_URL}/members/${member.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
