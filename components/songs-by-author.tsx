import { SongCard } from "@/components/song-card";
import { getMemberBySlug } from "@/data/members";
import type { Song } from "@/data/songs";

type SongsByAuthorProps = {
  songs: Song[];
};

export function SongsByAuthor({ songs }: SongsByAuthorProps) {
  const authorSlugs = [...new Set(songs.map((song) => song.authorSlug))];

  const grouped = authorSlugs
    .map((authorSlug) => {
      const member = getMemberBySlug(authorSlug);
      const authorSongs = songs.filter((song) => song.authorSlug === authorSlug);
      return { member, authorSongs };
    })
    .filter((group) => group.member && group.authorSongs.length > 0)
    .sort((a, b) => (a.member!.age ?? 0) - (b.member!.age ?? 0));

  return (
    <div className="space-y-10">
      {grouped.map(({ member, authorSongs }) => (
        <section key={member!.slug} className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                {member!.emoji} {member!.name} · age {member!.age}
              </p>
              <h3 className="text-xl font-bold text-amber-950">
                {authorSongs.length} {authorSongs.length === 1 ? "song" : "songs"}
              </h3>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {authorSongs.map((song) => (
              <SongCard key={song.slug} song={song} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
