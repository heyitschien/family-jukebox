import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { MemberPlayHeader, MemberSongList } from "@/components/member-play-header";
import { Topbar } from "@/components/topbar";
import { getMemberBySlug, getRoleLabel, members } from "@/data/members";
import { getSongsByAuthor } from "@/data/songs";

type MemberPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return members.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({ params }: MemberPageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = getMemberBySlug(slug);
  if (!member) return { title: "Member not found · Family Jukebox" };
  return { title: `${member.name} · Family Jukebox`, description: member.description };
}

export default async function MemberPage({ params }: MemberPageProps) {
  const { slug } = await params;
  const member = getMemberBySlug(slug);
  if (!member) notFound();

  const memberSongs = getSongsByAuthor(member.slug);
  const heroCover = memberSongs[0]?.coverSrc;

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
            {memberSongs.length} {memberSongs.length === 1 ? "song" : "songs"} · age {member.age}
          </p>
          <div className="mt-6">
            <MemberPlayHeader songs={memberSongs} memberName={member.name} />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-5">
        <h2 className="mb-4 text-xl font-bold">Popular</h2>
        {memberSongs.length > 0 ? (
          <MemberSongList songs={memberSongs} />
        ) : (
          <p className="text-[var(--jb-muted)]">No songs yet — check back after the next music day.</p>
        )}
      </section>

      <section className="mt-4 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-5">
        <h2 className="text-lg font-bold">About {member.name}</h2>
        <p className="mt-3 leading-relaxed text-[var(--jb-muted)]">{member.description}</p>
      </section>
    </main>
  );
}
