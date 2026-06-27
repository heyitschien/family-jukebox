# 20 — Private-First and Public Radio Model

This document defines a major product direction decision for Cousin Radio.

Cousin Radio should operate on two levels:

1. **Private Family Creation** — the core product and trust layer.
2. **Optional Public Cousin Radio** — selected songs families choose to share publicly.

## Product Definition

```text
Cousin Radio is a family music and memory platform where families create, preserve, and share songs for the people they love.
```

Short north star:

```text
Songs for the people we love.
```

Product direction:

```text
Cousin Radio turns love, jokes, memories, and tiny everyday moments into songs worth sharing.
```

Working shorthand:

```text
Spotify for love, joy, and celebration.
```

Use the shorthand carefully. Cousin Radio is not only a streaming platform. It is a creation, memory, and family culture platform.

## The Two-Layer Model

### Layer 1 — Private Family Creation

This is the foundation of the product and the business.

```text
Family
↓
Memory / story / joke / celebration
↓
Song creation
↓
Private family album
↓
Family sharing
```

Examples:

- birthday songs
- anniversary songs
- songs for grandparents
- songs for parents
- friendship songs
- funny family moments
- food and garden songs
- lullabies
- immigration stories
- faith and gratitude songs
- tiny everyday anthems

This layer should be:

```text
private by default
family-first
subscription-supported
trust-centered
```

Families should feel that Cousin Radio is a safe home for their private songs, memories, jokes, voices, and family culture.

### Layer 2 — Optional Public Cousin Radio

Public sharing is optional and controlled.

```text
Private Draft
↓
Family Only
↓
Invite Link
↓
Public Cousin Radio
```

Public Cousin Radio features selected songs that families intentionally choose to open up for public participation, discovery, and celebration.

Examples:

- uplifting celebration songs
- friendship songs
- garden songs
- food songs
- songs for grandparents
- songs about family joy
- public holiday playlists
- community gratitude playlists
- selected family artist features

This public layer becomes the voice of Cousin Radio, but not the foundation.

## Key Principle

```text
Private creation is the foundation.
Public celebration is optional.
```

Never reverse this.

Cousin Radio should not become a social network first.

It should become:

```text
family first
community second
```

## Family Artists

Cousin Radio can allow families to become featured contributors or artists of Cousin Radio.

This does not mean every family must become a public performer.

It means families can choose to share selected songs that express:

- love
- joy
- gratitude
- celebration
- memory
- humor
- beauty
- belonging

Possible public artist examples:

```text
The Nguyen Family Celebration Album
Grandma Maria's Garden Songs
Sweet Potato Soul
Songs for Dad
Sunday Morning Family Hymns
The Cousins Summer Album
```

Families become:

```text
story artists
memory artists
family artists
everyday artists
```

## Business Model Implication

### Private Layer Revenue

Families pay for:

- private family spaces
- song creation tools
- storage
- family albums
- invitations
- privacy controls
- memory archive features
- higher generation limits
- premium styles and album formats

This is the subscription layer.

### Public Layer Growth

Public Cousin Radio can:

- showcase what is possible
- attract new families
- create discovery
- spread joy
- support featured playlists
- build the Cousin Radio brand

Public content becomes marketing and community expression.

Private family value becomes revenue.

## Immediate Direction Change

Current state:

```text
cousinradio.com is public.
Only friends and family currently know about it, but technically the site is public.
```

Recommended next direction:

```text
Move Cousin Radio toward private-first access as soon as practical.
```

This means:

- public landing page can remain public
- family content should become protected
- private songs and albums should require login or family invite access
- public songs should be explicitly marked as public
- existing content should be reviewed and assigned visibility

## Visibility Model

Recommended visibility states:

```text
private_draft
family_only
invite_link
public
archived
```

### private_draft

Only the creator or admin can see it.

### family_only

Only logged-in members of the family space can see it.

### invite_link

Visible to people with a specific share link.

### public

Visible on public Cousin Radio pages.

### archived

Hidden from normal browsing, retained for admin/history if needed.

## Product Rule

Every song should have a visibility setting.

No song should be public by accident.

## First Privacy Implementation Direction

A practical first implementation can be simple:

1. Keep public homepage / landing page.
2. Move family jukebox content behind a login or access gate.
3. Add visibility metadata to songs.
4. Create a public playlist only for songs marked `public`.
5. Add copy explaining that Cousin Radio is private-first.

## Public Landing Page Copy

Possible homepage copy:

```text
Cousin Radio helps families create private songs, albums, and memories for the people they love.

Some families choose to share selected songs publicly. Most songs stay private inside the family.
```

## User Trust Promise

```text
Your family's songs start private. You choose what to share.
```

This should become a core product promise.

## What To Avoid

Avoid:

- making every family song public by default
- treating private songs as marketing assets
- adding social network pressure too early
- making families feel exposed
- confusing a private family album with a public artist profile

## Long-Term Shape

Cousin Radio can become:

```text
Private family radio stations
+
Optional public celebration radio
+
Family artists and featured playlists
```

The public layer should feel like a joyful window into the product, not the whole product.

## Final Product Formula

```text
Private Family Creation
+
Optional Public Radio
=
Cousin Radio
```

The private layer is the soul.

The public layer is the voice.
