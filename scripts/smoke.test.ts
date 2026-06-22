import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import {
  albums,
  getAlbumBySlug,
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
  getAlbumSongsByRecency,
  getAlbumSpotlightSong,
  getAlbumSpotlightSongIndex,
  getHeroFeaturedAlbum,
  getRotatedAlbumCarousel,
  getSpotlightAlbumPerMember,
  isTodayHeroAlbum,
} from "../lib/album-rotation";
import { getCarouselRingLayout } from "../lib/carousel-layout";
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
  toggleRadioMode,
} from "../lib/player-queue";
import {
  buildIntelligentQueue,
  rankSimilarSongs,
  scoreSongAffinity,
} from "../lib/music-intelligence";
import { buildRadioContinuation, shouldContinueRadio } from "../lib/cousin-radio";
import { buildSmartShuffledQueue } from "../lib/smart-shuffle";
import {
  EMPTY_SESSION_SNAPSHOT,
  recordSessionPlay,
  wasRecentlyPlayed,
} from "../lib/session-listening";
import { filterSongs, getInlineSearchResults, searchCatalog } from "../lib/search";
import {
  audiences,
  curateSongsForAudience,
  curateSongsForListener,
  isSongVisibleForAudience,
  scoreSongForListener,
  isValidListenerAge,
} from "../lib/audience";
import {
  parseFamilyAudienceSnapshot,
  parseListenerAgeSnapshot,
  readFamilyAudienceFromRaw,
  readListenerAgeFromRaw,
  serializeFamilyAudience,
  serializeListenerAge,
  type FamilyAudienceSnapshotCache,
} from "../lib/audience-storage";
import {
  parseFavoriteSlugs,
  readFavoriteSlugsFromRaw,
  serializeFavoriteSlugs,
} from "../lib/favorites-storage";
import { verifyCopyrightRegistry } from "../lib/copyright-registry";
import {
  buildAlbumShareDescription,
  buildCoverShareImage,
  buildShareMetadata,
  buildSongShareDescription,
  formatPageTitle,
  resolveShareImageUrl,
  SITE_NAME,
  SITE_URL,
} from "../lib/site-metadata";
import { APP_ICON_BACKGROUND, buildWebManifest } from "../lib/app-icon";
import { getSongAuthor, getSongBySlug } from "../data/songs";
import { getAlbumAuthor, getAlbumBySlug } from "../data/albums";
import { getMemberBySlug } from "../data/members";

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

    const tap = songs.find((song) => song.slug === "tap-on-the-glass");
    assert.ok(tap, "tap-on-the-glass should exist");
    assert.equal(getAlbumForSong(tap).slug, "miracle-in-the-sand-album");
  });

  it("keeps Sam & Josh as the artists for Legacy in the Lane", () => {
    const legacy = songs.find((song) => song.slug === "legacy-in-the-lane");
    assert.ok(legacy, "legacy-in-the-lane should exist");
    assert.equal(legacy.authorSlug, "sam-and-josh");
    assert.match(legacy.coverSrc, /^\/assets\/sam-and-josh\//);
    assert.match(legacy.audioSrc, /^\/assets\/sam-and-josh\//);
    assert.notEqual(legacy.authorSlug, "tio-chien");

    const samAndJosh = getMemberBySlug("sam-and-josh");
    assert.ok(samAndJosh, "sam-and-josh member should exist");
    assert.equal(samAndJosh.name, "Sam & Josh");

    const album = getAlbumBySlug("legacy-in-the-lane-album");
    assert.ok(album, "legacy album should exist");
    assert.equal(album.authorSlug, "sam-and-josh");
    assert.deepEqual(album.songSlugs, ["legacy-in-the-lane"]);
    assert.equal(getAlbumAuthor(album)?.slug, "sam-and-josh");
  });

  it("keeps Tap on the Glass under Tio Chien's Printing Intelligence on Sand series", () => {
    const tap = songs.find((song) => song.slug === "tap-on-the-glass");
    assert.ok(tap, "tap-on-the-glass should exist");
    assert.equal(tap.authorSlug, "tio-chien");
    assertPublicAssetExists(tap.coverSrc, "tap-on-the-glass cover");
    assertPublicAssetExists(tap.audioSrc, "tap-on-the-glass audio");

    const series = getAlbumBySlug("miracle-in-the-sand-album");
    assert.ok(series, "Printing Intelligence on Sand album should exist");
    assert.equal(series.title, "Printing Intelligence on Sand");
    assert.deepEqual(series.songSlugs, ["miracle-in-the-sand", "tap-on-the-glass"]);
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

  it("sorts album tracks newest-first for cover rotation", () => {
    const evelyn = getAlbumBySlug("gold-in-the-tile-album");
    assert.ok(evelyn, "evelyn album should exist");
    const recency = getAlbumSongsByRecency(evelyn);
    assert.equal(recency.length, 3);
    assert.equal(recency[0]?.slug, "silver-pan-morning", "latest single should lead rotation");
  });

  it("rotates spotlight tracks within multi-song albums", () => {
    const evelyn = getAlbumBySlug("gold-in-the-tile-album");
    assert.ok(evelyn);
    const indexA = getAlbumSpotlightSongIndex(evelyn, 0);
    const indexB = getAlbumSpotlightSongIndex(evelyn, 1);
    const recency = getAlbumSongsByRecency(evelyn);
    assert.ok(indexA >= 0 && indexA < recency.length);
    assert.ok(indexB >= 0 && indexB < recency.length);
    assert.ok(getAlbumSpotlightSong(evelyn, 0));
  });

  it("includes every artist with songs in the carousel without a hard cap", () => {
    const carousel = getRotatedAlbumCarousel(99);
    const membersWithSongs = members.filter((member) =>
      songs.some((song) => song.authorSlug === member.slug),
    );
    assert.equal(carousel.length, membersWithSongs.length);
    assert.ok(carousel.length >= 7, "family carousel should scale with roster size");
  });
});

describe("carousel layout", () => {
  it("keeps cover size readable as artist count grows", () => {
    const small = getCarouselRingLayout(5);
    const medium = getCarouselRingLayout(7);
    const large = getCarouselRingLayout(12);

    assert.ok(small.coverSize >= medium.coverSize);
    assert.ok(medium.coverSize >= large.coverSize);
    assert.ok(large.coverSize >= 128, "large family rings should not shrink below legibility");
    assert.ok(large.radius >= medium.radius);
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

  it("toggles radio mode", () => {
    assert.equal(toggleRadioMode("off"), "on");
    assert.equal(toggleRadioMode("on"), "off");
  });
});

describe("music intelligence", () => {
  it("scores recently played songs lower than fresh tracks", () => {
    const seed = songs[0];
    const other = songs.find((song) => song.slug !== seed.slug);
    assert.ok(other, "catalog needs at least two songs");

    const freshScore = scoreSongAffinity(seed, other, { session: EMPTY_SESSION_SNAPSHOT });
    const tiredScore = scoreSongAffinity(seed, other, {
      session: {
        recentSlugs: [other.slug, seed.slug],
        playCounts: { [other.slug]: 3 },
      },
    });

    assert.ok(freshScore > tiredScore, "fresh tracks should outrank recently played");
  });

  it("builds intelligent queues with the seed first", () => {
    const seed = songs[0];
    const queue = buildIntelligentQueue(seed, { limit: 5 });
    assert.equal(queue[0]?.slug, seed.slug);
    assert.ok(queue.length >= 2);
    assert.equal(new Set(queue.map((song) => song.slug)).size, queue.length);
  });

  it("ranks similar songs by tag overlap", () => {
    const seed = songs[0];
    const ranked = rankSimilarSongs(seed, 4);
    for (const song of ranked) {
      assert.notEqual(song.slug, seed.slug);
    }
  });
});

describe("smart shuffle", () => {
  it("avoids back-to-back same artist when alternatives exist", () => {
    const byAuthor = new Map<string, typeof songs>();
    for (const song of songs) {
      const list = byAuthor.get(song.authorSlug) ?? [];
      list.push(song);
      byAuthor.set(song.authorSlug, list);
    }

    if (byAuthor.size < 2 || songs.length < 4) return;

    const shuffled = buildSmartShuffledQueue(songs, 0);
    for (let i = 1; i < shuffled.length; i += 1) {
      const prev = shuffled[i - 1];
      const current = shuffled[i];
      if (!prev || !current) continue;

      const remainingAuthors = new Set(
        shuffled.slice(i).map((song) => song.authorSlug),
      );
      remainingAuthors.add(prev.authorSlug);

      if (remainingAuthors.size > 1) {
        assert.notEqual(
          prev.authorSlug,
          current.authorSlug,
          `adjacent same-artist at index ${i} when alternatives existed`,
        );
      }
    }
  });

  it("pins the start song first", () => {
    const shuffled = buildSmartShuffledQueue(songs, 2);
    assert.equal(shuffled[0]?.slug, songs[2]?.slug);
  });
});

describe("age-based audience curation", () => {
  it("scores adult songs higher for grown-up listeners", () => {
    const legacy = songs.find((song) => song.slug === "legacy-in-the-lane");
    const dash = songs.find((song) => song.slug === "dash-and-go");
    assert.ok(legacy, "legacy song should exist");
    assert.ok(dash, "dash-and-go should exist");

    const adultLegacy = scoreSongForListener(legacy, 35);
    const adultDash = scoreSongForListener(dash, 35);
    assert.ok(adultLegacy > adultDash, "adults should prefer grown-up tracks over toddler songs");
  });

  it("scores kid songs higher for young listeners", () => {
    const dash = songs.find((song) => song.slug === "dash-and-go");
    const legacy = songs.find((song) => song.slug === "legacy-in-the-lane");
    assert.ok(dash && legacy);

    const kidDash = scoreSongForListener(dash, 3);
    const kidLegacy = scoreSongForListener(legacy, 3);
    assert.ok(kidDash > kidLegacy, "young listeners should prefer kid-authored songs");
  });

  it("curates without dropping songs from the catalog", () => {
    const curated = curateSongsForListener(songs, 35);
    assert.equal(curated.length, songs.length);
    assert.deepEqual(new Set(curated.map((song) => song.slug)), new Set(songs.map((song) => song.slug)));
  });

  it("boosts age-matched results in search ranking", () => {
    const adultResults = searchCatalog("", { listenerAge: 35 }).filter((result) => result.kind === "song");
    const first = adultResults[0];
    assert.ok(first && first.kind === "song");
    const author = getSongAuthor(first.song);
    assert.ok(author && author.age >= 10, "top search pick for adults should lean mature");
  });

  it("defines the four family audience profiles", () => {
    assert.deepEqual(
      audiences.map((audience) => audience.id),
      ["kids", "big-kids", "teens", "grownups"],
    );
  });

  it("filters kids recommendations and search results", () => {
    const dash = songs.find((song) => song.slug === "dash-and-go");
    const legacy = songs.find((song) => song.slug === "legacy-in-the-lane");
    assert.ok(dash && legacy);

    assert.equal(isSongVisibleForAudience(dash, "kids"), true);
    assert.equal(isSongVisibleForAudience(legacy, "kids"), false);

    const kidSongs = curateSongsForAudience(songs, "kids");
    assert.ok(kidSongs.some((song) => song.slug === dash.slug), "kids should see toddler-friendly songs");
    assert.equal(kidSongs.some((song) => song.slug === legacy.slug), false);

    const kidResults = searchCatalog("", { audienceId: "kids" }).filter((result) => result.kind === "song");
    assert.equal(
      kidResults.some((result) => result.kind === "song" && result.song.slug === legacy.slug),
      false,
    );

    const grownupResults = searchCatalog("", { audienceId: "grownups" }).filter((result) => result.kind === "song");
    assert.ok(
      grownupResults.some((result) => result.kind === "song" && result.song.slug === legacy.slug),
      "grown-ups should see the full catalog",
    );
  });

  it("persists family audience ids using the familyAudience storage format", () => {
    const { serialized, snapshot } = serializeFamilyAudience("big-kids");
    assert.equal(serialized, "big-kids");
    assert.equal(snapshot.audienceId, "big-kids");
    const parsed = parseFamilyAudienceSnapshot(serialized);
    assert.equal(parsed?.audienceId, "big-kids");
    assert.equal(typeof parsed?.updatedAt, "string");

    const cache = { current: null as FamilyAudienceSnapshotCache };
    const first = readFamilyAudienceFromRaw(serialized, cache);
    const second = readFamilyAudienceFromRaw(serialized, cache);
    assert.equal(first, second, "family audience snapshot must stay referentially stable");
  });

  it("validates listener ages and persists snapshots", () => {
    assert.equal(isValidListenerAge(35), true);
    assert.equal(isValidListenerAge(0), false);
    assert.equal(isValidListenerAge(121), false);

    const { serialized, snapshot } = serializeListenerAge(35);
    assert.equal(snapshot.age, 35);
    assert.deepEqual(parseListenerAgeSnapshot(serialized), snapshot);

    const cache = { current: null as import("../lib/audience-storage").ListenerAgeSnapshotCache };
    const first = readListenerAgeFromRaw(serialized, cache);
    const second = readListenerAgeFromRaw(serialized, cache);
    assert.equal(first, second, "listener age snapshot must stay referentially stable");
  });
});

describe("cousin radio", () => {
  it("builds a non-empty continuation from a seed song", () => {
    const seed = songs[0];
    const continuation = buildRadioContinuation(seed, { session: EMPTY_SESSION_SNAPSHOT });
    assert.ok(continuation.length > 0, "radio should always suggest next tracks");
    assert.ok(
      continuation.every((song) => song.slug !== seed.slug),
      "continuation should not repeat the seed",
    );
  });

  it("excludes recently played songs from radio batches", () => {
    const seed = songs[0];
    const recent = songs[1];
    assert.ok(recent, "need second song");

    const continuation = buildRadioContinuation(seed, {
      session: {
        recentSlugs: [recent.slug],
        playCounts: { [recent.slug]: 1 },
      },
    });

    assert.ok(!continuation.some((song) => song.slug === recent.slug));
  });

  it("continues radio only when mode is on and repeat is off", () => {
    assert.equal(shouldContinueRadio("on", "off", false), true);
    assert.equal(shouldContinueRadio("off", "off", false), false);
    assert.equal(shouldContinueRadio("on", "all", false), false);
    assert.equal(shouldContinueRadio("on", "off", true), false);
  });
});

describe("session listening", () => {
  it("tracks recency in memory helpers", () => {
    const session = {
      recentSlugs: ["a", "b", "c"],
      playCounts: { a: 2 },
    };
    assert.equal(wasRecentlyPlayed("a", 3, session), true);
    assert.equal(wasRecentlyPlayed("c", 2, session), false);

    const updated = recordSessionPlay("d");
    assert.equal(updated.recentSlugs[0], "d");
    assert.equal(updated.playCounts.d, 1);
  });
});

describe("copyright registry", () => {
  it("tracks every catalog song with valid SHA-256 fingerprints", () => {
    const issues = verifyCopyrightRegistry();
    assert.equal(
      issues.length,
      0,
      issues.map((issue) => `${issue.songSlug}: ${issue.message}`).join("\n"),
    );
  });
});

describe("favorites storage (regression: React error #185)", () => {
  it("returns the same snapshot reference when localStorage raw value is unchanged", () => {
    const cache = { current: null as import("../lib/favorites-storage").FavoriteSnapshotCache };
    const raw = '["gravity-shift","legacy-in-the-lane"]';

    const first = readFavoriteSlugsFromRaw(raw, cache);
    const second = readFavoriteSlugsFromRaw(raw, cache);

    assert.equal(first, second, "getSnapshot must stay referentially stable");
    assert.deepEqual([...first], ["gravity-shift", "legacy-in-the-lane"]);
  });

  it("returns a new snapshot only when raw localStorage changes", () => {
    const cache = { current: null as import("../lib/favorites-storage").FavoriteSnapshotCache };

    const before = readFavoriteSlugsFromRaw('["gravity-shift"]', cache);
    const after = readFavoriteSlugsFromRaw('["gravity-shift","tap-on-the-glass"]', cache);

    assert.notEqual(before, after);
    assert.deepEqual([...after], ["gravity-shift", "tap-on-the-glass"]);
  });

  it("normalizes and serializes favorites consistently", () => {
    const { serialized, snapshot } = serializeFavoriteSlugs([
      " gravity-shift ",
      "gravity-shift",
      "",
      "tap-on-the-glass",
    ]);

    assert.deepEqual([...snapshot], ["gravity-shift", "tap-on-the-glass"]);
    assert.deepEqual(parseFavoriteSlugs(serialized), ["gravity-shift", "tap-on-the-glass"]);
  });
});

describe("link preview metadata", () => {
  it("defaults SITE_URL to cousinradio.com for crawlers", () => {
    assert.equal(SITE_URL, "https://cousinradio.com");
    assert.equal(SITE_NAME, "Cousin Radio");
  });

  it("formats page titles with the site name", () => {
    assert.equal(formatPageTitle("Legacy in the Lane"), "Legacy in the Lane · Cousin Radio");
  });

  it("resolves cover art to absolute URLs for iMessage crawlers", () => {
    assert.equal(
      resolveShareImageUrl("/assets/ocean/gravity-shift.jpg"),
      `${SITE_URL}/assets/ocean/gravity-shift.jpg`,
    );
  });

  it("uses the generated opengraph image for default previews", () => {
    const metadata = buildShareMetadata();
    assert.equal(metadata.openGraph?.images?.[0]?.url, `${SITE_URL}/opengraph-image`);
    assert.equal(metadata.openGraph?.url, SITE_URL);
    assert.equal(metadata.openGraph?.siteName, "Cousin Radio");
    assert.equal(metadata.openGraph?.locale, "en_US");
  });

  it("sets per-song og:image and description for legacy in the lane", () => {
    const song = getSongBySlug("legacy-in-the-lane");
    assert.ok(song, "legacy song should exist in catalog");

    const author = getSongAuthor(song);
    const metadata = buildShareMetadata({
      title: formatPageTitle(song.title),
      description: buildSongShareDescription(song, author),
      path: `/songs/${song.slug}`,
      image: buildCoverShareImage(song.title, song.coverSrc),
    });

    assert.equal(metadata.openGraph?.title, "Legacy in the Lane · Cousin Radio");
    assert.match(String(metadata.description), /Father's Day/i);
    assert.equal(
      metadata.openGraph?.images?.[0]?.url,
      `${SITE_URL}/assets/sam-and-josh/legacy-in-the-lane.png`,
    );
    assert.equal(metadata.openGraph?.url, `${SITE_URL}/songs/legacy-in-the-lane`);
    assert.equal(
      metadata.twitter?.images?.[0]?.url,
      `${SITE_URL}/assets/sam-and-josh/legacy-in-the-lane.png`,
    );
  });

  it("sets per-album og:image and description", () => {
    const album = getAlbumBySlug("legacy-in-the-lane-album");
    assert.ok(album, "legacy album should exist in catalog");

    const author = getAlbumAuthor(album);
    const metadata = buildShareMetadata({
      title: formatPageTitle(album.title),
      description: buildAlbumShareDescription(album, author),
      path: `/albums/${album.slug}`,
      image: buildCoverShareImage(album.title, album.coverSrc),
    });

    assert.match(String(metadata.description), /Father's Day/i);
    assert.equal(
      metadata.openGraph?.images?.[0]?.url,
      `${SITE_URL}/assets/sam-and-josh/legacy-in-the-lane.png`,
    );
    assert.equal(metadata.openGraph?.url, `${SITE_URL}/albums/legacy-in-the-lane-album`);
  });

  it("sets family page metadata with canonical cousinradio.com path", () => {
    const metadata = buildShareMetadata({
      title: formatPageTitle("Family artists"),
      description: "Meet the cousins who make the music.",
      path: "/family",
    });

    assert.equal(metadata.openGraph?.url, `${SITE_URL}/family`);
    assert.equal(metadata.openGraph?.title, "Family artists · Cousin Radio");
  });
});

describe("web app manifest", () => {
  it("publishes install-sized square icons for saved web apps", () => {
    const manifest = buildWebManifest();

    assert.equal(manifest.name, "Cousin Radio");
    assert.equal(manifest.short_name, "Cousin Radio");
    assert.equal(manifest.display, "standalone");
    assert.equal(manifest.background_color, APP_ICON_BACKGROUND);
    assert.equal(manifest.theme_color, APP_ICON_BACKGROUND);
    assert.deepEqual(manifest.icons, [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ]);
  });
});
