import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { members } from "../data/members";
import { songs } from "../data/songs";
import {
  createRefreshSeed,
  getFairRotationQueue,
  getHeroFeaturedSong,
  getRotatedFeaturedShelf,
  getSpotlightSongPerMember,
} from "../lib/featured-rotation";

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
