import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AlbumShelf } from "@/components/album-shelf";
import { DiscoverMembersShelf } from "@/components/discover-members-shelf";
import { MemberPlayHeader, MemberSongList } from "@/components/member-play-header";
import { SongShelf } from "@/components/song-shelf";
import { Topbar } from "@/components/topbar";
import { getAlbumsByAuthor, groupAlbumsByKind } from "@/data/albums";
import { getMemberBySlug, getRoleLabel, members } from "@/data/members";
import { getSongsByAuthor } from "@/data/songs";
import { getDiscoverAlbums, getDiscoverMembers, getDiscoverSongs } from "@/lib/music-discovery";

import { buildCoverShareImage, buildShareMetadata, formatPageTitle } from "@/lib/site-metadata";

type MemberPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return members.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({ params }: MemberPageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = getMemberBySlug(slug);
  if (!member) return { title: formatPageTitle("Member not found") };
  const heroCover = getSongsByAuthor(member.slug)[0]?.coverSrc;
  return buildShareMetadata({
    title: formatPageTitle(member.name),
    description: member.description,
    path: `/members/${member.slug}`,
    image: heroCover ? buildCoverShareImage(`${member.name} on Cousin Radio`, heroCover) : undefined,
  });
}

export default async function MemberPage({ params }: MemberPageProps) {
  const { slug } = await params;
  const member = getMemberBySlug(slug);
  if (!member) notFound();

  const memberSongs = getSongsByAuthor(member.slug);
  const { series, discography } = groupAlbumsByKind(getAlbumsByAuthor(member.slug));
  const heroCover = memberSongs[0]?.coverSrc;
  const memberAlbumSlugs = [...series, ...discography].map((album) => album.slug);
  const discoverAlbums = getDiscoverAlbums(memberAlbumSlugs);
  const discoverSongs = getDiscoverSongs(memberSongs.map((song) => song.slug));
  const discoverMembers = getDiscoverMembers(member.slug);

  return (
    <main className="min-w-0 px-3 pb-4 lg:px-0">
      <Topbar />

      <Link
        href="/family"
        className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--jb-muted)] hover:text-white"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>

      <section
        className="relative overflow-hidden rounded-[32px] border border-white/[0.08] p-6 sm:p-8"
        style={{
          backgroundImage: heroCover
            ? `linear-gradient(180deg, rgba(7,12,16,0.2) 0%, rgba(7,12,16,0.92) 70%), url(${heroCover})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundColor: "#17212c",
        }}
      >
        <div className="relative z-10 pt-24 sm:pt-32">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--jb-muted)]">
            {getRoleLabel(member.role)}
          </p>
          <h1 className="mt-2 text-5xl font-extrabold tracking-tight sm:text-7xl">{member.name}</h1>
          <p className="mt-2 text-sm font-bold text-[var(--jb-muted)]">
            {memberSongs.length} {memberSongs.length === 1 ? "song" : "songs"}
            {member.role === "girl" || member.role === "boy" ? ` · age ${member.age}` : ""}
          </p>
          <div className="mt-6">
            <MemberPlayHeader songs={memberSongs} memberName={member.name} />
          </div>
        </div>
      </section>

      {series.length > 0 ? (
        <section className="mt-6">
          <AlbumShelf
            albums={series}
            title={`${member.name}'s growing series`}
            subtitle="Themed albums — new singles join these tracklists as they release"
            showViewAll={false}
          />
        </section>
      ) : null}

      {discography.length > 0 ? (
        <section className="mt-6">
          <AlbumShelf
            albums={discography}
            title={
              series.length > 0
                ? `${member.name}'s studio collection`
                : `${member.name}'s albums`
            }
            subtitle={
              series.length > 0
                ? "Earlier songs and one-off tracks outside the active series"
                : "Play the full collection or explore track by track"
            }
            showViewAll={false}
          />
        </section>
      ) : null}

      <section className="mt-6 jb-float-panel p-4 sm:p-5">
        <h2 className="mb-4 text-xl font-bold">Popular</h2>
        {memberSongs.length > 0 ? (
          <MemberSongList songs={memberSongs} />
        ) : (
          <p className="text-[var(--jb-muted)]">No songs yet — check back after the next music day.</p>
        )}
      </section>

      <section className="mt-4 jb-float-panel p-4 sm:p-5">
        <h2 className="text-lg font-bold">About {member.name}</h2>
        <p className="mt-3 leading-relaxed text-[var(--jb-muted)]">{member.description}</p>
      </section>

      {discoverAlbums.length > 0 ? (
        <AlbumShelf
          albums={discoverAlbums}
          title="More family albums"
          subtitle="Explore another cousin's collection — tap to play or dive in"
          showViewAll
        />
      ) : null}

      {discoverSongs.length > 0 ? (
        <SongShelf
          songs={discoverSongs}
          title="Discover more songs"
          subtitle="Fresh picks from across Cousin Radio"
          viewAllHref="/songs"
          viewAllLabel="Browse songs"
          compact
        />
      ) : null}

      <DiscoverMembersShelf
        members={discoverMembers}
        title="Other family artists"
        subtitle="Hop to another profile — albums, songs, and stories waiting"
      />
    </main>
  );
}
