# 07 — Cursor Build Prompt

Use this prompt when we are ready to ask Cursor or an implementation agent to begin building the first stage.

---

You are working in the `heyitschien/family-jukebox` repository for Cousin Radio.

Product mission:

> Cousin Radio helps people create songs for the people they love and save them into private or shared family albums.

Current site already has a beautiful Cousin Radio experience. Do not break the existing homepage, songs page, family page, styling, or existing content pipeline.

## Goal for This Build

Build Stage 1: an internal song intake and draft publishing foundation.

This is not yet the full AI generation product. We are preparing the product so Chien can add songs through a clean admin workflow instead of manually touching content files every time.

## Required Features

Create an admin song intake flow with:

- song title
- artist / family display name
- album
- occasion
- tags
- lyrics
- story note
- privacy setting
- audio file path or upload placeholder
- cover image path or upload placeholder
- draft / publish status

## Important UX

The admin form should feel like Cousin Radio:

- dark warm gradient
- glowing accent details
- large friendly buttons
- mobile-first layout
- simple language
- no clutter

Primary CTA:

```text
Save Song Draft
```

Secondary CTA:

```text
Preview Song Card
```

## Suggested Routes

```text
/admin
/admin/new-song
/admin/songs
/admin/songs/[id]
```

If auth is not configured yet, protect admin routes with a temporary environment variable or clear local-only guard. Do not expose private admin tools casually on the public site.

## Data Approach

Before adding a full database, inspect the current content structure. Reuse or extend the existing song metadata model if possible.

If the app currently reads static JSON or TS data files, add a clean abstraction layer such as:

```text
lib/songs.ts
lib/albums.ts
lib/content-schema.ts
```

Add TypeScript types for:

```text
Song
Album
SongStatus
SongVisibility
Occasion
```

## Status Model

Support these early states:

```text
draft
published_private
published_family
published_public
archived
```

## Privacy Model

Support:

```text
private
family_only
invite_link
public
```

Default to `private`.

## Validation

Add validation for required fields:

- title
- artistDisplayName
- album or collection
- status
- visibility

Do not allow public publishing without an explicit user action.

## Preview

Add a reusable song preview card that shows:

- cover
- title
- artist
- album
- occasion
- tags
- visibility
- play button placeholder

## Non-Goals for This Stage

Do not build these yet:

- AI music generation
- payments
- user accounts
- public upload by strangers
- full moderation queue
- production file storage

## Quality Bar

- Existing pages still work.
- Mobile design looks polished.
- Types are clean.
- No secrets committed.
- Build passes.
- Add README notes explaining how the admin flow works.

## Future Context

Later stages will add:

- voice recording
- transcription
- story extraction
- lyric generation
- music generation provider integration
- cover art generation
- private family spaces
- public uplifting radio

For now, build the foundation carefully and beautifully.
