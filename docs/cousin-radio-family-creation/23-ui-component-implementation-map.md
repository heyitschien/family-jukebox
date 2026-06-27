# 23 — UI Component Implementation Map

This document translates the mobile-first UI makeover into implementation tasks and component boundaries.

It should be used by the coding agent after reading:

- `22-mobile-first-ui-makeover-spec.md`
- `20-private-first-public-radio-model.md`
- `21-privacy-first-migration-plan.md`
- `19-scalable-technology-architecture.md`

## Existing App Context

The current app already has:

- Next.js App Router
- TypeScript
- Tailwind
- shadcn/ui primitives
- data-driven song catalog
- data-driven album catalog
- family/member pages
- 3D album carousel
- global audio player
- mobile bottom navigation
- inline search
- production and staging domains

Do not rebuild from scratch.

Refactor incrementally.

## Target Layout Components

### PublicLandingPage

Purpose:

Owns the public homepage composition.

Suggested sections:

```tsx
<PublicLandingPage>
  <PublicHeader />
  <LandingHero />
  <HowItWorks />
  <FeaturedPublicRadio />
  <FamilySpacePreview />
  <MissionBand />
  <FinalCreateCTA />
  <PublicFooter />
</PublicLandingPage>
```

## Header Components

### PublicHeader

Responsibilities:

- render logo
- render desktop nav
- render sign-in CTA
- render Create Family Song CTA
- render hamburger menu on mobile

Props:

```ts
type PublicHeaderProps = {
  isSignedIn?: boolean
}
```

Behavior:

- mobile hamburger opens `MobileMenu`
- Create Family Song routes depending on auth state
- Sign In visible if signed out

### MobileMenu

Responsibilities:

- slide-out or full-screen mobile menu
- list public navigation
- show sign-in
- show Create Family Song CTA
- show privacy message

Menu items:

```text
Home
Explore Public Radio
How It Works
Families
Pricing
Sign In
Create Family Song
```

Privacy block:

```text
Your family's songs start private.
You choose what to share.
```

## Hero Components

### LandingHero

Responsibilities:

- headline
- subcopy
- primary CTA
- secondary CTA
- privacy trust line
- hero album carousel

Headline:

```text
Every Family Deserves Its Own Radio Station
```

Primary CTA:

```text
Create Family Song
```

Secondary CTA:

```text
Explore Public Radio
```

### HeroAlbumCarousel

Responsibilities:

- visual centerpiece
- reuse or adapt existing 3D carousel if possible
- show public sample albums only on public landing

Rules:

- center card has large play button
- side cards partially visible
- mobile width must not overflow badly
- carousel should remain touch-friendly

Data:

Use public-visible albums only once visibility metadata exists.

Before metadata exists, use a curated public sample list.

## Explanation Components

### HowItWorks

Responsibilities:

Render three cards:

```text
Tell a story
Create a song
Share with family
```

Desktop:

- 3-column layout

Mobile:

- stacked cards

### HowItWorksCard

Props:

```ts
type HowItWorksCardProps = {
  step: 1 | 2 | 3
  title: string
  description: string
  icon?: React.ReactNode
}
```

## Public Radio Components

### FeaturedPublicRadio

Responsibilities:

- show public songs/playlists only
- include View All link
- include compact player integration if available

Props:

```ts
type FeaturedPublicRadioProps = {
  songs: Song[]
}
```

Rules:

- filter visibility to `public`
- do not show family-only content
- if no public songs exist, show a beautiful empty state

### PublicRadioCard

Content:

- cover art
- title
- family/artist credit if approved
- play button

## Family Space Components

### FamilySpacePreview

Responsibilities:

Render different states based on authentication.

Signed out:

- show private family space teaser
- no real private song names
- CTA to sign in

Signed in:

- show family name
- private badge
- stats
- recent memories
- Go to My Space CTA

Props:

```ts
type FamilySpacePreviewProps = {
  isSignedIn: boolean
  family?: FamilySummary
}
```

### FamilySpaceCard

Content:

- family avatar or collage
- family name
- private badge
- song count
- album count
- member count
- recent memories

## Mission Components

### MissionBand

Responsibilities:

Render the emotional mission section.

Headline:

```text
Songs for the People We Love
```

Body:

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

- heart icon
- campfire/family image or gradient art

### FinalCreateCTA

Responsibilities:

Render final gradient call-to-action band.

Headline:

```text
Create Your Family Radio Station
```

CTA:

```text
Create Family Song
```

Mobile:

- full-width stacked card

Desktop:

- horizontal banner

## Private Create Components

### CreateFamilySongPage

Future route:

```text
/family/create
```

Can also temporarily live at:

```text
/create
```

Responsibilities:

- collect story/memory
- choose occasion
- preview private draft
- explain privacy

### CreateSongForm

Fields:

- occasion
- recipient name
- relationship
- story text
- tone
- language preference
- privacy setting

Default:

```ts
visibility: 'private_draft'
```

### SongDraftPreview

Responsibilities:

- show proposed title
- story brief
- themes
- tone
- private draft badge
- placeholder album cover
- next step copy

## Data Helpers

### Visibility Filtering

Add helper functions:

```ts
getPublicSongs()
getFamilySongs(familyId, userId)
getVisibleSongsForViewer(viewer)
```

### Type Additions

Song and album types should include:

```ts
visibility: 'private_draft' | 'family_only' | 'invite_link' | 'public' | 'archived'
```

Optional future fields:

```ts
familyId?: string
publicCredit?: string
isFeaturedPublic?: boolean
shareConsentAt?: string
```

## Styling Tokens

Define or reuse tokens for:

```text
background
surface
surface-hover
border-soft
pink-accent
purple-accent
blue-accent
coral-accent
text-primary
text-secondary
text-muted
privacy-green or privacy-pink
```

Avoid hardcoding many one-off colors if token classes already exist.

## Responsive Rules

### Mobile

- single-column layout
- hero text before carousel
- CTAs full-width or near full-width
- carousel cards fit viewport
- public radio cards horizontal scroll
- bottom nav remains reachable
- final CTA has safe area spacing

### Tablet

- 2-column where useful
- carousel can regain depth
- family space and public radio can stack or sit side-by-side depending width

### Desktop

- hero split layout
- 3-column how-it-works cards
- public radio and family space two-column grid
- mission band horizontal

## Accessibility Requirements

- buttons have accessible labels
- play controls have labels
- contrast remains readable on dark background
- focus states visible
- images have meaningful alt text
- hamburger menu can close via button and escape key
- bottom nav has labels

## Testing Requirements

Add or update smoke tests for:

- homepage loads
- Create Family Song CTA exists
- privacy copy exists
- public radio section exists
- mobile menu can be identified in markup where practical
- `/radio` route if implemented
- private routes do not expose content when access-gated

Run:

```bash
npm run lint
npm run smoke
npm run build
```

## Suggested Implementation Order

1. Extract or create public landing page sections.
2. Add mobile-first header/menu.
3. Add trust copy and CTA hierarchy.
4. Add public radio section using current public sample data.
5. Add family space preview.
6. Add final mission and CTA sections.
7. Add visibility metadata and filtering.
8. Gate private content.
9. Create real `/radio` route.
10. Create `/family/create` flow.

## Do Not Do Yet

- do not implement payments
- do not add full AI generation API in this makeover
- do not migrate all assets to object storage yet
- do not expose private family content publicly
- do not break existing player behavior

## Definition of Done

The UI makeover is successful when:

- the site feels mobile-first
- the public homepage tells the two-layer Cousin Radio story
- family content is visually and architecturally private-first
- public radio feels optional and joyful
- creation is the strongest action
- existing listening experience remains smooth
