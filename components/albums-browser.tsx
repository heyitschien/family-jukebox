"use client";

import Link from "next/link";

import { AlbumCard } from "@/components/album-card";
import { useFamilyAudienceContext } from "@/contexts/family-audience-context";
import type { BrowseAlbumSection } from "@/data/albums";
import { curateAlbumsForAudience } from "@/lib/audience";

type AlbumsBrowserProps = {
  sections: BrowseAlbumSection[];
};

export function AlbumsBrowser({ sections }: AlbumsBrowserProps) {
  const { audience, audienceId } = useFamilyAudienceContext();
  const visibleSections = sections
    .map((section) => ({
      ...section,
      albums: curateAlbumsForAudience(section.albums, audienceId),
    }))
    .filter((section) => section.albums.length > 0);

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Family albums</h1>
        <p className="mt-2 max-w-xl text-[var(--jb-muted)]">
          {audience
            ? `Showing playlist collections for ${audience.label} (${audience.age}). Switch profiles anytime from the avatar.`
            : "Growing series gain tracks over time. Full collections hold every song from each family member."}
        </p>
      </header>

      <div className="space-y-10">
        {visibleSections.map((section) => (
          <section key={section.id}>
            <div className="mb-4">
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{section.title}</h2>
              <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">{section.subtitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {section.albums.map((album) => (
                <AlbumCard key={album.slug} album={album} size="sm" className="w-full" showKind />
              ))}
            </div>
          </section>
        ))}
      </div>

      {visibleSections.length === 0 ? (
        <p className="text-[var(--jb-muted)]">No albums for this audience yet — try another profile.</p>
      ) : null}

      <p className="mt-8 text-center">
        <Link href="/" className="text-sm font-bold text-[var(--family-pink)] hover:underline">
          ← Back to home
        </Link>
      </p>
    </>
  );
}
