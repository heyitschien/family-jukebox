import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import {
  albums,
  getAlbumForSong,
  getBrowseAlbumSections,
  getPrimaryAlbums,
  getSongAlbumAssignmentMap,
  getSupplementarySeriesAlbums,
  getUnassignedSongSlugs,
} from "../data/albums";
import { members } from "../data/members";
import { songs } from "../data/songs";
import {
  createRefreshSeed,
  getFairRotationQueue,
  getHeroFeaturedSong,
  getRotatedFeaturedShelf,
  getSpotlightSongPerMember,
} from "../lib/featured-rotation";
import {
  getAlbumHeroBadge,
  getHeroFeaturedAlbum,
  getRotatedAlbumCarousel,
  getSpotlightAlbumPerMember,
  isTodayHeroAlbum,
} from "../lib/album-rotation";
import { parsePlayEventBody } from "../lib/security/api";
import {
  getActiveCelebrations,
  getCelebrationAlbumSlugs,
  getCelebrationSongSlugs,
  getFathersDayDate,
} from "../lib/celebrations";
import {
  buildShuffledQueue,
  cycleRepeatMode,
  resolveQueueForPlayback,
  resolveTrackAdvance,
} from "../lib/player-queue";
import { filterSongs, getInlineSearchResults, searchCatalog } from "../lib/search";
import {
  buildAlbumShareDescription,
  buildCoverShareImage,
  buildShareMetadata,
  buildSongShareDescription,
  resolveShareImageUrl,
  SITE_URL,
} from "../lib/site-metadata";
import { getSongAuthor, getSongBySlug } from "../data/songs";
import { getAlbumAuthor, getAlbumBySlug } from "../data/albums";

const PUBLIC_ROOT = path.join(process.cwd(), "public");

function assertPublicAssetExists(publicPath: string, label: string): void {
  const relativePath = publicPath.replace(/^\//, "");
  const absolutePath = path.join(PUBLIC_ROOT, relativePath);
  assert.ok(existsSync(absolutePath), `${label} missing on disk: ${publicPath}`);
}

describe("jukebox catalog", () => {
  it("has songs with playable assets", () => {
    assert.ok(songs.length > 0, "catalog should not be empty");

    for (const song of songs) {
      assert.ok(song.slug, `song missing slug: ${song.title}`);
      assert.ok(song.title, `song missing title: ${song.slug}`);
      assert.ok(song.audioSrc.startsWith("/"), `${song.slug} audioSrc should be a public path`);
      assert.ok(song.coverSrc.startsWith("/"), `${song.slug} coverSrc should be a public path`);
      assertPublicAssetExists(song.audioSrc, `${song.slug} audio`);
      assertPublicAssetExists(song.coverSrc, `${song.slug} cover`);
      assert.ok(
        members.some((member) => member.slug === song.authorSlug),
        `${song.slug} authorSlug should match a family member`,
      );
    }
  });

  it("ships cover art for celebration singles", () => {
    for (const slug of ["three-candles-for-marceline", "legacy-in-the-lane"] as const) {
      const song = songs.find((entry) => entry.slug === slug);
      assert.ok(song, `${slug} should exist in catalog`);
      assertPublicAssetExists(song.coverSrc, `${slug} cover`);
      assertPublicAssetExists(song.audioSrc, `${slug} audio`);
    }
  });
});

describe("album catalog", () => {
  it("assigns each song to at most one album", () => {
    const assignment = getSongAlbumAssignmentMap();
    assert.equal(getUnassignedSongSlugs().length, 0, "every song should belong to an album");

    for (const album of albums) {
      for (const slug of album.songSlugs) {
        assert.equal(
          assignment.get(slug),
          album.slug,
          `${slug} should only map to ${album.slug}`,
        );
      }
    }
  });

  it("exposes one primary album per active artist for the carousel", () => {
    const primary = getPrimaryAlbums();
    const membersWithSongs = members.filter((member) =>
      songs.some((song) => song.authorSlug === member.slug),
    );

    assert.equal(
      primary.length,
      membersWithSongs.length,
      "carousel should have one primary album per artist with songs",
    );

    const slugs = primary.map((album) => album.slug);
    assert.equal(new Set(slugs).size, slugs.length, "carousel albums should not duplicate");
  });

  it("keeps carousel length stable and duplicate-free", () => {
    const carousel = getRotatedAlbumCarousel(42);
    const slugs = carousel.map((album) => album.slug);
    assert.equal(new Set(slugs).size, slugs.length, "carousel should not repeat albums");
    assert.equal(carousel.length, getPrimaryAlbums().length);
  });

  it("prefers series albums when resolving a song parent album", () => {
    const miracle = songs.find((song) => song.slug === "miracle-in-the-sand");
    assert.ok(miracle, "miracle-in-the-sand should exist");
    assert.equal(getAlbumForSong(miracle).slug, "miracle-in-the-sand-album");
  });

  it("groups browse sections with series before discography", () => {
    const sections = getBrowseAlbumSections();
    assert.ok(sections.length >= 2, "browse should split series and discography");
    assert.equal(sections[0]?.id, "series");
    assert.equal(sections[1]?.id, "discography");
  });

  it("surfaces non-carousel series albums for home shelf", () => {
    const supplementary = getSupplementarySeriesAlbums();
    assert.ok(
      supplementary.some((album) => album.slug === "miracle-in-the-sand-album"),
      "Miracle in the Sand should appear when studio album is carousel primary",
    );
  });
});

describe("album rotation", () => {
  it("returns a hero album from the primary catalog", () => {
    const hero = getHeroFeaturedAlbum(7);
    const primarySlugs = new Set(getPrimaryAlbums().map((album) => album.slug));
    assert.ok(primarySlugs.has(hero.slug), "hero album should be a primary album");
  });

  it("aligns spotlight albums with primary carousel picks", () => {
    assert.deepEqual(
      getSpotlightAlbumPerMember().map((album) => album.slug),
      getPrimaryAlbums().map((album) => album.slug),
    );
  });

  it("returns consistent hero badges", () => {
    const hero = getHeroFeaturedAlbum(3);
    const badge = getAlbumHeroBadge(hero, hero);
    const celebrationSlugs = getCelebrationAlbumSlugs();
    if (celebrationSlugs.includes(hero.slug)) {
      assert.ok(["🎂", "👔"].includes(badge.emoji));
    } else {
      assert.equal(badge.emoji, hero.featured ? "💛" : "✨");
    }
    assert.ok(isTodayHeroAlbum(hero, 3));
  });
});

describe("featured rotation", () => {
  it("returns stable spotlight picks for a fixed seed", () => {
    const seed = 42;
    const hero = getHeroFeaturedSong(seed);
    const shelf = getRotatedFeaturedShelf(seed);
    const queue = getFairRotationQueue(seed);

    assert.ok(hero.slug, "hero featured song should have a slug");
    assert.equal(shelf.length, songs.length, "shelf should include every song once");
    assert.equal(queue.length, songs.length, "family queue should include every song once");
    assert.ok(
      shelf.some((song) => song.slug === hero.slug),
      "hero featured song should appear on the shelf",
    );
  });

  it("covers every member in the daily spotlight when possible", () => {
    const spotlight = getSpotlightSongPerMember();
    const membersWithSongs = members.filter((member) =>
      songs.some((song) => song.authorSlug === member.slug),
    );

    assert.equal(
      spotlight.length,
      membersWithSongs.length,
      "spotlight should include one song per active artist",
    );
  });

  it("creates bounded refresh seeds", () => {
    const seed = createRefreshSeed();
    assert.ok(seed >= 0 && seed < 10_000, "refresh seed should stay in expected range");
  });
});

describe("search catalog", () => {
  it("ranks exact song title matches highly", () => {
    const results = searchCatalog("chien");
    assert.ok(results.length > 0);
    assert.ok(
      results.some(
        (result) =>
          result.kind === "member" &&
          result.member.slug === "tio-chien",
      ),
      "member name search should surface Tio Chien",
    );
  });

  it("filters songs by member slug", () => {
    const evelynSongs = filterSongs("", { memberSlug: "evelyn" });
    assert.ok(evelynSongs.every((song) => song.authorSlug === "evelyn"));
    assert.equal(evelynSongs.length, 3);
  });

  it("limits inline groups for dropdown UX", () => {
    const grouped = getInlineSearchResults("e");
    assert.ok(grouped.songs.length <= 6);
    assert.ok(grouped.albums.length <= 3);
    assert.ok(grouped.members.length <= 3);
  });
});

describe("celebration highlights", () => {
  it("features Marceline birthday and Father's Day on June 21, 2026", () => {
    const date = new Date(2026, 5, 21);
    const active = getActiveCelebrations(date);
    assert.equal(active.length, 2);
    assert.deepEqual(getCelebrationSongSlugs(date), [
      "three-candles-for-marceline",
      "legacy-in-the-lane",
    ]);
    assert.ok(getCelebrationAlbumSlugs(date).includes("three-candles-for-marceline-album"));
    assert.ok(getCelebrationAlbumSlugs(date).includes("legacy-in-the-lane-album"));
  });

  it("keeps celebration releases featured for a few days after launch", () => {
    const dayAfter = new Date(2026, 5, 22);
    assert.deepEqual(getCelebrationSongSlugs(dayAfter), [
      "three-candles-for-marceline",
      "legacy-in-the-lane",
    ]);
  });

  it("computes US Father's Day as the third Sunday in June", () => {
    assert.deepEqual(getFathersDayDate(2026), { month: 6, day: 21 });
    assert.deepEqual(getFathersDayDate(2025), { month: 6, day: 15 });
  });
});

describe("play tracking validation", () => {
  it("accepts valid play payloads", () => {
    const result = parsePlayEventBody({
      songSlug: songs[0]?.slug,
      event: "start",
      source: "hero",
    });
    assert.equal(result.ok, true);
  });

  it("rejects unknown slugs and malformed events", () => {
    assert.equal(parsePlayEventBody({ songSlug: "", event: "start" }).ok, false);
    assert.equal(parsePlayEventBody({ songSlug: "nope", event: "start" }).ok, true);
    assert.equal(parsePlayEventBody({ songSlug: songs[0]?.slug, event: "hack" }).ok, false);
  });
});

describe("player queue logic", () => {
  const mockQueue = [
    { slug: "a" },
    { slug: "b" },
    { slug: "c" },
  ] as typeof songs;

  it("cycles repeat modes off -> all -> one -> off", () => {
    assert.equal(cycleRepeatMode("off"), "all");
    assert.equal(cycleRepeatMode("all"), "one");
    assert.equal(cycleRepeatMode("one"), "off");
  });

  it("auto-advances through multi-song queues", () => {
    assert.deepEqual(
      resolveTrackAdvance({
        queue: mockQueue,
        currentIndex: 0,
        repeatMode: "off",
        direction: "next",
        manual: false,
      }),
      { action: "play", index: 1 },
    );
    assert.deepEqual(
      resolveTrackAdvance({
        queue: mockQueue,
        currentIndex: 1,
        repeatMode: "off",
        direction: "next",
        manual: false,
      }),
      { action: "play", index: 2 },
    );
  });

  it("stops at end when repeat is off", () => {
    assert.deepEqual(
      resolveTrackAdvance({
        queue: mockQueue,
        currentIndex: 2,
        repeatMode: "off",
        direction: "next",
        manual: false,
      }),
      { action: "stop" },
    );
  });

  it("wraps playlist when repeat all is on", () => {
    assert.deepEqual(
      resolveTrackAdvance({
        queue: mockQueue,
        currentIndex: 2,
        repeatMode: "all",
        direction: "next",
        manual: false,
      }),
      { action: "play", index: 0 },
    );
  });

  it("loops current track when repeat one is on", () => {
    assert.deepEqual(
      resolveTrackAdvance({
        queue: mockQueue,
        currentIndex: 1,
        repeatMode: "one",
        direction: "next",
        manual: false,
      }),
      { action: "repeat", index: 1 },
    );
  });

  it("manual skip still advances when repeat one is on", () => {
    assert.deepEqual(
      resolveTrackAdvance({
        queue: mockQueue,
        currentIndex: 1,
        repeatMode: "one",
        direction: "next",
        manual: true,
      }),
      { action: "play", index: 2 },
    );
  });

  it("keeps start song first when shuffle is enabled", () => {
    const shuffled = buildShuffledQueue(mockQueue, 1);
    assert.equal(shuffled[0]?.slug, "b");
    assert.equal(new Set(shuffled.map((s) => s.slug)).size, 3);
  });

  it("starts shuffled playback at index zero", () => {
    const result = resolveQueueForPlayback(mockQueue, 2, "on");
    assert.equal(result.index, 0);
    assert.equal(result.queue[0]?.slug, "c");
    assert.equal(result.queue.length, 3);
  });
});

describe("link preview metadata", () => {
  it("resolves cover art to absolute URLs for iMessage crawlers", () => {
    assert.equal(
      resolveShareImageUrl("/assets/ocean/gravity-shift.jpg"),
      `${SITE_URL}/assets/ocean/gravity-shift.jpg`,
    );
  });

  it("sets per-song og:image and description for legacy in the lane", () => {
    const song = getSongBySlug("legacy-in-the-lane");
    assert.ok(song, "legacy song should exist in catalog");

    const author = getSongAuthor(song);
    const metadata = buildShareMetadata({
      title: `${song.title} · Family Jukebox`,
      description: buildSongShareDescription(song, author),
      path: `/songs/${song.slug}`,
      image: buildCoverShareImage(song.title, song.coverSrc),
    });

    assert.equal(metadata.openGraph?.title, "Legacy in the Lane · Family Jukebox");
    assert.match(String(metadata.description), /Father's Day/i);
    assert.equal(
      metadata.openGraph?.images?.[0]?.url,
      `${SITE_URL}/assets/tio-chien/legacy-in-the-lane.png`,
    );
    assert.equal(metadata.openGraph?.url, `${SITE_URL}/songs/legacy-in-the-lane`);
    assert.equal(
      metadata.twitter?.images?.[0]?.url,
      `${SITE_URL}/assets/tio-chien/legacy-in-the-lane.png`,
    );
  });

  it("sets per-album og:image and description", () => {
    const album = getAlbumBySlug("legacy-in-the-lane-album");
    assert.ok(album, "legacy album should exist in catalog");

    const author = getAlbumAuthor(album);
    const metadata = buildShareMetadata({
      title: `${album.title} · Family Jukebox`,
      description: buildAlbumShareDescription(album, author),
      path: `/albums/${album.slug}`,
      image: buildCoverShareImage(album.title, album.coverSrc),
    });

    assert.match(String(metadata.description), /Father's Day/i);
    assert.equal(
      metadata.openGraph?.images?.[0]?.url,
      `${SITE_URL}/assets/tio-chien/legacy-in-the-lane.png`,
    );
    assert.equal(metadata.openGraph?.url, `${SITE_URL}/albums/legacy-in-the-lane-album`);
  });
});
