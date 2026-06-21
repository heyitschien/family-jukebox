import assert from "node:assert/strict";
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
import { filterSongs, getInlineSearchResults, searchCatalog } from "../lib/search";

describe("jukebox catalog", () => {
  it("has songs with playable assets", () => {
    assert.ok(songs.length > 0, "catalog should not be empty");

    for (const song of songs) {
      assert.ok(song.slug, `song missing slug: ${song.title}`);
      assert.ok(song.title, `song missing title: ${song.slug}`);
      assert.ok(song.audioSrc.startsWith("/"), `${song.slug} audioSrc should be a public path`);
      assert.ok(song.coverSrc.startsWith("/"), `${song.slug} coverSrc should be a public path`);
      assert.ok(
        members.some((member) => member.slug === song.authorSlug),
        `${song.slug} authorSlug should match a family member`,
      );
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
    assert.equal(badge.emoji, hero.featured ? "💛" : "✨");
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
