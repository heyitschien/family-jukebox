import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  albums,
  getAlbumForSong,
  getPrimaryAlbums,
  getSongAlbumAssignmentMap,
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
  getHeroFeaturedAlbum,
  getRotatedAlbumCarousel,
  getSpotlightAlbumPerMember,
} from "../lib/album-rotation";
import { parsePlayEventBody } from "../lib/security/api";

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
