# 27 — Family Radio Home Preservation Spec

This document defines how to preserve the current Cousin Radio listening experience while expanding into private multi-family accounts.

## Core Decision

The current Cousin Radio music player experience is not a temporary prototype.

It is the heart of the product.

The next milestone should build around it, not replace it.

## Why This Matters

The current experience already feels:

- personal
- premium
- musical
- emotional
- family-centered
- joyful to use

That feeling is the proof of the product.

Families should not sign in and land inside a cold management dashboard.

They should land inside their private radio station.

## Product Frame

```text
Public landing page = front door
Private family radio home = heart
Credits and invites = service engine
```

## Preserve These Elements

The private family home should preserve:

- search bar
- album carousel
- now spinning badge
- large Cousin Radio / family radio title area
- premium dark background
- album-art-first design
- persistent player
- bottom navigation
- warm family copy
- playful/premium glow
- music-first emotional feel

## Add These Elements Gently

Add the new family-service layer without overwhelming the player:

- private badge
- family name
- credits remaining
- Create Family Song CTA
- Invite Family CTA for owners
- member attribution on songs
- family-only visibility state

## Recommended Logged-In Header

Instead of a generic dashboard title, use:

```text
Private · Nguyen Family Radio
```

or:

```text
Nguyen Family Radio · Private
```

Supporting copy:

```text
Songs for the people we love.
```

Credit copy:

```text
You have 3 song credits.
```

CTA:

```text
Create Family Song
```

## Recommended Private Home Layout

Mobile-first layout:

```text
Search

Private · Family Radio
Credits remaining
Create Family Song

Carousel
Now Spinning
Player

Recent Family Songs
Family Albums
Made by Family
Invite Family
```

Desktop layout:

```text
Topbar / search
Hero carousel + private family summary
Now Spinning / player
Family albums
Recent songs
Create and invite actions
```

## Navigation Model

Current bottom nav can stay close to the existing model.

Recommended mobile nav for the private family space:

```text
Home
Songs
Create
Family
```

If changing nav is too disruptive, keep:

```text
Home
Songs
Favs
Family
```

and place Create Family Song prominently in the home and family screens.

## Multi-Family Adaptation

Each family gets the same beautiful radio interface.

The difference is data isolation.

```text
/family/{familySlug}
```

or if each user belongs to one family at first:

```text
/family
```

The UI should feel personalized by:

- family name
- family members
- family songs
- family albums
- family memories
- family credits

## Data Requirements

Every displayed item must be scoped by family.

```ts
familyId: string
visibility: 'private_draft' | 'family_only' | 'invite_link' | 'public' | 'archived'
createdByUserId: string
```

Private screens must filter by:

- current user
- active membership
- familyId
- visibility permissions

## Public Landing vs Private Radio

The polished landing page mock should not replace the private player experience.

It should sit above it as a public explanation layer.

Public landing says:

```text
Every family deserves its own radio station.
```

Private home says:

```text
This is our family radio station.
```

Both should share the same visual DNA:

- dark premium background
- gradient buttons
- album carousel
- family warmth
- pink/purple glow
- music-first design

## UX Rule

Do not make creation feel like filling out a tax form.

Creation should feel like:

```text
I want to make a song for someone I love.
```

Listening should feel like:

```text
I am inside my family radio station.
```

## First Implementation Slice

1. Extract current home/player experience into reusable components where needed.
2. Add private family labels and credit CTA to the existing home.
3. Scope songs/albums by family when data model is ready.
4. Keep player behavior stable.
5. Add Create Family Song CTA without breaking the listening flow.

## Acceptance Criteria

- current music player beauty is preserved
- user lands in a music-first family radio home after sign-in
- private family identity is clear
- credits remaining are visible but not disruptive
- Create Family Song is prominent
- family members can still simply listen and enjoy
- mobile player remains polished
- bottom nav remains usable
- public landing page and private home feel connected but distinct

## Final Principle

Democratize the beautiful Cousin Radio listening experience.

Every family should be able to have:

```text
a private radio station
beautiful song presentation
a polished player
family albums
shared memories
a way to create more songs together
```

The beauty is not decoration.

The beauty is part of the value.
