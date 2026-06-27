# 22 — Mobile-First UI Makeover Spec

This document defines the UI makeover direction for Cousin Radio as it evolves from a public family jukebox into a private-first family music and memory platform with optional public radio.

The design direction is based on the approved desktop and mobile mockups:

- desktop landing page with public hero, carousel, how-it-works, public radio, family space, mission, and CTA
- mobile-first experience with stacked sections, bottom navigation, slide-out menu, family space card, and create-song CTA

## Product Frame

Cousin Radio operates on two layers:

```text
Private Family Creation
+
Optional Public Radio
=
Cousin Radio
```

Core rule:

```text
Private creation is the foundation.
Public celebration is optional.
```

The UI should make this clear immediately.

## Primary UX Goal

A first-time visitor should understand in under 10 seconds:

1. Cousin Radio helps families create songs and memories.
2. Family content starts private.
3. Selected songs can be shared publicly when the family chooses.
4. The next action is either **Create Family Song** or **Explore Public Radio**.

## Design Principles

### Mobile First

The first-class experience is mobile.

Most family sharing happens through phones, iMessage, group chats, social links, and casual listening. Desktop should feel premium, but mobile should feel native and effortless.

### Warm, Magical, Trustworthy

The design should feel:

```text
warm
premium
playful
intimate
music-first
family-safe
privacy-aware
```

Avoid making it feel like a generic SaaS dashboard.

### Public Door, Private Home

The homepage is public. The family library is private.

Use the UI to teach:

```text
Explore what families choose to share publicly.
Sign in to access your private family space.
```

## Visual Direction

### Theme

- dark navy / near-black background
- soft gradients
- pink / coral / purple / blue accent system
- rounded glass panels
- neon glow sparingly used for emotional focus
- album art as the visual hero
- warm illustration style for family moments

### Typography

- large bold hero headline
- gradient emphasis on key phrases such as `Radio Station`
- compact, readable body text
- small uppercase labels for section markers
- avoid dense paragraphs on mobile

### Component Style

- large rounded cards
- pill buttons
- subtle borders
- glassmorphism surfaces
- soft drop shadows
- bottom-safe mobile controls
- persistent music context where possible

## Route and Information Architecture

Recommended public routes:

```text
/
/radio
/how-it-works
/pricing
/sign-in
```

Recommended private routes:

```text
/family
/family/create
/family/albums
/family/songs
/family/members
/family/archive
```

Recommended public content routes:

```text
/radio
/radio/playlists/[slug]
/public/song/[slug]
/public/family/[slug]
```

If current route structure differs, phase this in without breaking existing URLs.

## Public Landing Page Sections

### 1. Header / Top Navigation

Desktop:

- Cousin Radio logo at left
- nav links:
  - Explore Radio
  - How It Works
  - Families
  - Pricing
- Sign In button
- primary Create Family Song button

Mobile:

- logo at left
- hamburger menu at right
- slide-out menu with same links
- prominent Create Family Song button inside menu
- privacy message inside menu

Behavior:

- Create Family Song routes to `/family/create` if signed in
- if signed out, route to sign-in or creation intro with auth prompt
- Explore Radio routes to public radio
- Sign In routes to auth flow

### 2. Hero Section

Purpose:

Introduce the category and provide immediate action.

Approved headline:

```text
Every Family Deserves Its Own Radio Station
```

Subcopy:

```text
Create private songs, albums, and memories for the people you love. Share them with family—or with the world when you're ready.
```

Primary CTA:

```text
Create Family Song
```

Secondary CTA:

```text
Explore Public Radio
```

Trust copy:

```text
Your family's songs start private. You choose what to share.
```

Hero visual:

- 3D album carousel
- center album card with large play button
- side cards partially visible
- examples:
  - Chilling with Cousin
  - Sweet Potato Soul
  - Songs for Grandma
  - Garden Radio

Mobile behavior:

- text first
- CTAs second
- trust copy third
- carousel below
- cards should fit within viewport width without horizontal layout breakage

### 3. How Cousin Radio Works

Purpose:

Explain the product in three simple steps.

Cards:

1. Tell a story
2. Create a song
3. Share with family

Copy:

```text
Tell Cousin Radio about a birthday, memory, joke, friendship, or everyday moment.
```

```text
Cousin Radio helps turn your story into music, lyrics, cover art, and albums.
```

```text
Keep songs private, share by invitation, or publish selected songs to public radio.
```

Desktop:

- horizontal three-card flow
- arrows between cards

Mobile:

- vertical stacked cards
- numbered badges
- illustration on right side of each card

### 4. Featured Public Radio

Purpose:

Show selected public content and demonstrate what families can choose to share.

Important rule:

```text
Only songs with visibility = public appear here.
```

Content examples:

- Garden Radio
- Songs for Mom
- Sweet Potato Soul
- Bedtime Memories
- Birthday Anthems

Behavior:

- tapping a card opens public song or public playlist
- play button starts public audio
- View All goes to `/radio`

Mobile:

- horizontal scroll row of public cards
- compact mini player under cards

Desktop:

- grid row with integrated mini player underneath

### 5. Your Family Space Preview

Purpose:

Show the private product layer.

This section is contextual:

Signed out:

- show private family space teaser
- CTA: Sign in to your family space
- explain that family content is private

Signed in:

- show the user's family card
- recent memories
- counts for songs, albums, members
- CTA: Go to My Space

Example card:

```text
Nguyen Family
Private
124 Songs
12 Albums
7 Members
Recent Memories
- Birthday for Grandma
- Garden Radio
- Summer 2026
```

Important:

Do not show real private content to signed-out users.

### 6. Songs for the People We Love

Purpose:

Emotional mission section.

Copy direction:

```text
Birthdays.
Friendships.
Grandparents.
Gardens.
Inside jokes.
Ordinary Tuesdays.

The tiny moments become songs.
The songs become memories.
The memories become family culture.
```

Visual:

- neon heart or family symbol
- campfire / gathering image
- warm night atmosphere

Role:

This is the soul of the page. Keep it simple, emotional, and not sales-heavy.

### 7. Final CTA Band

Purpose:

Invite creation.

Headline:

```text
Create Your Family Radio Station
```

Subcopy:

```text
Start your family's music and memory journey today.
```

CTA:

```text
Create Family Song
```

Mobile:

- large gradient card
- CTA full-width

Desktop:

- horizontal gradient banner
- icon, text, button

### 8. Footer

Content:

- logo
- `Songs for the people we love.`
- About
- Help
- Privacy
- Terms
- Contact
- social icons if available

Mobile:

- stacked and compact

## Mobile App Shell

### Bottom Navigation

Recommended mobile bottom nav:

```text
Home
Songs / Radio
Favorites
Family
```

Future alternative after privacy migration:

```text
Home
Radio
Create
Family
```

Decision:

Use current nav if it avoids churn. Move toward a Create-centered nav when the creation flow becomes core.

### Slide-Out Menu

The mobile menu should include:

- Home
- Explore Public Radio
- How It Works
- Families
- Pricing
- Sign In
- Create Family Song
- privacy trust statement

Trust statement:

```text
Your family's songs start private.
You choose what to share.
```

## Private Family Space UI

### Purpose

This is the home after login.

It should feel like a private family archive, not a public social profile.

### Core Sections

- Family header
- stats: songs, albums, members
- recent memories
- private albums
- create song CTA
- invited members
- privacy settings

### Key Copy

```text
Your family's private music home.
```

```text
Create, preserve, and share songs for the people you love.
```

## Create Family Song UI

### Purpose

This is the most important product action.

Flow:

```text
Tell a story
↓
Choose occasion
↓
Preview private draft
↓
Generate / save / share later
```

Fields:

- occasion
- who is this for?
- relationship
- memory / story / joke
- desired tone
- language preference
- privacy setting

Default visibility:

```text
private_draft
```

Copy:

```text
Your draft starts private. You choose who can hear it later.
```

## Data and Visibility Requirements

Every song, album, and family artifact should support visibility.

```ts
type Visibility =
  | 'private_draft'
  | 'family_only'
  | 'invite_link'
  | 'public'
  | 'archived'
```

Rules:

- public homepage can show public content only
- private family space requires access
- family-only content requires family membership
- invite-link content requires valid token/link
- archived content is hidden from normal browsing

## Implementation Phases

### Phase 1 — UI Specification and Visual Foundation

- document approved desktop and mobile direction
- create component map
- confirm route strategy
- avoid runtime changes until scoped

### Phase 2 — Public Landing Redesign

- redesign `/` as public landing page
- keep public featured radio
- add trust copy
- add family space preview without exposing private content

### Phase 3 — Visibility Metadata

- add visibility to song and album data
- default existing family content to family-only unless intentionally public
- create filtering helpers

### Phase 4 — Access Gate

- protect private pages
- add sign-in or temporary family access gate
- ensure private content is not shown to signed-out visitors

### Phase 5 — Private Family Space

- build `/family` as logged-in family home
- recent memories
- family albums
- create CTA

### Phase 6 — Public Radio

- create `/radio` showing public songs only
- public player
- public playlists

### Phase 7 — Create Family Song

- build `/family/create`
- private draft preview
- local-first prototype before AI APIs

## Acceptance Criteria for Makeover

- mobile homepage feels intentional, not compressed desktop
- public visitor understands the product immediately
- privacy-first promise appears above the fold
- public radio and private family space are visually distinct
- no private content is shown publicly after migration
- CTAs route correctly based on auth state
- current playback experience remains stable
- existing song pages and album pages do not break during transition
- build, lint, and smoke checks pass

## Agent Notes

The current app already has strong music identity, carousel behavior, player behavior, and mobile bottom navigation.

Do not throw away what works.

The makeover should preserve:

- dark dreamy Cousin Radio aesthetic
- family warmth
- 3D album carousel
- persistent player
- mobile bottom navigation
- playful album art

The makeover should add:

- clearer public/private architecture
- stronger landing page story
- privacy trust copy
- family space preview
- creation CTA hierarchy
- public radio filtering

## Final Direction

Cousin Radio should feel like:

```text
A beautiful public front door
+
A private family music home
+
A joyful public radio window
```

The experience must make families feel:

```text
This is beautiful.
This is safe.
This is for us.
We can make something together.
```
