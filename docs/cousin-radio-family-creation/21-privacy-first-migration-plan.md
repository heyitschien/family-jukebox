# 21 — Privacy-First Migration Plan

This document defines the near-term migration from the current public Cousin Radio site toward a private-first family platform.

## Current Situation

Cousin Radio is currently public at:

```text
cousinradio.com
```

In practice, only friends and family know about it. But technically, the content is public on the internet.

As Cousin Radio grows into a family creation platform, this should change.

## Recommended Direction

```text
Public landing page.
Private family content.
Optional public radio.
```

This keeps the product trustworthy while still allowing Cousin Radio to have a public brand and public selected songs.

## Privacy Principle

```text
Private by default. Public by choice.
```

Every song, album, family page, and memory artifact should eventually have a clear visibility state.

## Phase 0 — Decision Capture

Status: documentation.

Capture the product decision:

- Cousin Radio has private family creation as the core.
- Public Cousin Radio exists only for selected shared songs.
- No song should be public by accident.

## Phase 1 — Content Inventory

Goal:

Create an inventory of existing songs, albums, pages, and assets.

For each item, decide:

```text
family_only
invite_link
public
archive
```

Questions:

- Is this song intended for public Cousin Radio?
- Is this only for family and close friends?
- Does this include a child, private family detail, or personal story?
- Would the family be comfortable with this being discovered by a stranger?

If unsure, mark it private.

## Phase 2 — Add Visibility Metadata

Goal:

Add visibility metadata to the song catalog.

Example:

```ts
visibility: 'family_only' | 'invite_link' | 'public' | 'archived'
```

Default:

```ts
visibility: 'family_only'
```

Public songs must be explicit.

## Phase 3 — Public Landing Page

Goal:

Keep cousinradio.com public as a simple brand and invitation page.

The public homepage should explain:

```text
Cousin Radio helps families create private songs, albums, and memories for the people they love.
Some families choose to share selected songs publicly. Most songs stay private inside the family.
```

Public homepage can include:

- product mission
- public featured songs only
- explanation of private family spaces
- request/invite CTA
- family-safe brand story

## Phase 4 — Protect Family Jukebox Content

Goal:

Require authentication or access gating for private content.

Protected areas may include:

- family song catalog
- member pages
- private albums
- private song detail pages
- private audio assets if possible

Initial implementation options:

### Option A — Simple Access Gate

Use a temporary shared family passcode or invite gate.

Pros:

- fastest
- avoids full auth complexity
- good for immediate privacy improvement

Cons:

- less secure than full authentication
- harder to manage users
- not ideal for long-term SaaS

### Option B — Proper Auth

Use Clerk or Supabase Auth.

Pros:

- scalable
- supports family accounts
- better user management
- future-ready

Cons:

- more implementation work
- requires account UX decisions

Recommendation:

```text
If speed matters tonight, build a simple access gate first.
If building for long-term product foundation, implement proper auth.
```

## Phase 5 — Public Radio Route

Goal:

Create a public route that only shows songs marked public.

Possible route:

```text
/radio
```

or:

```text
/public
```

Rules:

- show only `visibility: 'public'`
- never show private drafts
- never show family-only content
- include public-facing artist/family credits only when approved

## Phase 6 — Family Space Model

Goal:

Move toward real family spaces.

Core concepts:

```text
Family
FamilyMember
Album
Song
Invite
Role
Visibility
```

Roles:

```text
owner
admin
member
viewer
```

## Phase 7 — Asset Protection

Goal:

Eventually ensure private audio and image assets are not directly public in `/public`.

Long-term direction:

- move generated assets to object storage
- use signed URLs for private content
- keep public assets public only when visibility is public

Important:

```text
Protecting pages is not enough if private audio files remain publicly accessible by URL.
```

## Phase 8 — Public Release Review

Before any family song becomes public, require a review checklist:

- Does the family consent?
- Are names approved?
- Are child details appropriate?
- Is the song intended for public sharing?
- Is there any private family information?
- Does the music provider allow public hosting and sharing?

## Immediate Implementation Issue Recommendation

Create a P0 implementation issue:

```text
P0: Make Cousin Radio private-first with public landing page and protected family jukebox
```

Acceptance criteria:

- public homepage remains accessible
- family jukebox content is gated
- public song list only includes explicit public songs
- song visibility metadata exists
- copy clearly states private-first policy
- no accidental public family content

## Final Migration Principle

```text
Do the simplest thing that prevents accidental public exposure now.
Build the scalable family account system next.
```

Cousin Radio can grow publicly only if it is trusted privately first.
