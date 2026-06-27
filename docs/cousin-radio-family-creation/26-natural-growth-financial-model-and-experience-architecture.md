# 26 — Natural Growth Financial Model and Experience Architecture

This document defines the natural financial model and experience architecture for Cousin Radio as it moves from one family jukebox into a repeatable private family radio platform.

## Executive Summary

Cousin Radio should grow from the experience that already works:

```text
Open the family radio.
Search or browse.
Spin the carousel.
Tap play.
Listen to songs made for people we love.
```

The current CousinRadio.com experience is the emotional heart of the product.

Do not replace it with a generic dashboard.

Build the family service layer around it.

The natural model is:

```text
Each family gets a private radio space.
Each invited member gets 3 starter song credits.
Members create songs for people they love.
Songs save into the private family library.
More credits can be granted or purchased when needed.
```

This is financially disciplined, emotionally generous, and scalable.

## Core Product Thesis

Cousin Radio is not primarily selling AI credits.

Cousin Radio is offering families a beautiful private place to create, preserve, and listen to their own music and memories.

The credit system exists to:

- invite creation
- protect cost
- prevent unlimited generation burn
- create a natural path to paid usage
- keep the product simple

The player experience exists to:

- make the songs feel beautiful
- make the family archive feel alive
- create emotional attachment
- turn generated songs into a real radio station

## Preserve the Heart

The existing Cousin Radio listener experience should remain the foundation:

- premium dark visual design
- search bar
- album carousel
- now-spinning badge
- family-first copy
- persistent player
- bottom navigation
- beautiful album covers
- personal radio feeling

The current experience answers the most important question:

```text
What does it feel like to have your own family radio station?
```

That feeling is the product.

The business layer should not bury it.

## Front Door vs Family Home

Cousin Radio should have two primary experiences.

### 1. Public Front Door

Purpose:

- explain the product
- build trust
- invite families to create
- show selected public examples
- communicate privacy-first values

This is the landing page layer.

It should say:

```text
Every family deserves its own radio station.
```

### 2. Private Family Radio Home

Purpose:

- let the family listen
- let members create
- preserve private songs
- keep the family library safe
- make the experience feel premium and personal

This is the current player experience evolved into a private family bubble.

It should feel like:

```text
This is our family radio station.
```

## The Private Family Bubble

Each family should be isolated into its own private space.

Conceptually:

```text
Family A cannot see Family B.
Family B cannot see Family A.
Public visitors cannot see either private family library.
```

Each family space contains:

- songs
- albums
- members
- credits
- drafts
- invites
- settings
- visibility rules

Everything starts private.

## Recommended Product Model

### Free Private Family Beta

Initial model:

```text
Free family account
Invited members only
3 starter song credits per member
Private family library
Owner controls access
```

Why this works:

- low friction
- generous but contained
- lets family members experience the magic
- protects generation costs
- creates a natural upgrade path

### Credit Packs

After starter credits, families can get more credits.

Possible early model:

```text
Small pack: 5 songs
Family pack: 15 songs
Celebration pack: 30 songs
```

The names should feel warm, not transactional.

Examples:

- More Songs Pack
- Birthday Pack
- Family Celebration Pack
- Memory Pack

### Future Family Plan

Later, introduce recurring plans only after the family creation loop is proven.

Possible plan dimensions:

- monthly song credits
- larger family member count
- private storage
- premium cover styles
- family archive features
- invite-link sharing
- public radio publishing controls
- legacy archive export

Do not start with complex pricing.

Start with simple creation credits.

## Why 3 Free Songs Works

Three songs is enough to create emotional understanding.

A family member can make:

1. one song for someone they love
2. one funny family or inside-joke song
3. one memory, birthday, or gratitude song

This allows people to feel the product without causing uncontrolled costs.

The product teaches itself when someone says:

```text
I made this for you.
Press play.
```

## Natural Growth Loop

The strongest growth loop is not advertising.

It is love and sharing.

```text
A family member creates a song
↓
The recipient laughs, cries, or feels seen
↓
The family listens together
↓
Another member wants to create one
↓
They use their starter credits
↓
A selected song is shared outside the family
↓
Another family wants its own private radio station
```

This is the natural flywheel.

## Financial Upside

The financial upside comes from repeatable family spaces, not one-off novelty songs.

A family radio station can become a long-term account because families keep having:

- birthdays
- holidays
- anniversaries
- graduations
- new babies
- memorials
- inside jokes
- family trips
- faith moments
- everyday rituals

Each event can become a song.

Each song makes the archive more valuable.

The archive creates retention.

The family account becomes more meaningful over time.

## Cost Discipline

The financial model should protect the company from uncontrolled AI generation costs.

Cost controls:

- starter credits are limited
- credits consumed only on confirmed creation
- drafts can be free until generation
- generation queues can be rate-limited
- admin can grant credits manually
- public publishing requires approval
- private storage limits can be introduced later

Recommended rule:

```text
Generosity at the door.
Discipline under the hood.
```

## Experience Architecture

### Public Experience

```text
/
/radio
/how-it-works
/pricing
/sign-in
/join/[inviteToken]
```

Public experience should include:

- landing page
- public examples
- trust copy
- privacy promise
- create CTA
- sign in
- invite acceptance

### Private Family Experience

```text
/family
/family/create
/family/songs
/family/albums
/family/members
/family/credits
/family/settings
```

Private experience should include:

- family radio player
- carousel
- search
- now spinning
- persistent player
- private badge
- credits remaining
- create song CTA
- invite family CTA

### Public Radio Experience

```text
/radio
/public/song/[slug]
/public/family/[slug]
```

Public radio should show only content intentionally approved for public sharing.

## UI Integration Principle

The landing page is the wrapper.

The current music player is the heart.

The private family service layer is the engine.

```text
Landing page = why this exists
Private player = where the magic happens
Credits + invites = how it scales safely
```

Do not force family members into an admin dashboard first.

After login, take them into music.

Then make creation available.

## Private Family Home Layout

Recommended logged-in family home:

```text
[Search songs, people, tags, memories]

Private · Nguyen Family Radio
You have 3 song credits
[Create Family Song]

Carousel
Now spinning
Player
Family albums
Recent songs
Made by family
Invite family
```

This preserves the emotional player experience while adding the service layer.

## Role Architecture

Start simple.

```ts
type FamilyRole = 'owner' | 'member' | 'viewer'
```

Owner:

- invite members
- manage credits
- remove access
- manage visibility
- publish approved public songs later

Member:

- listen to family library
- create songs using credits
- save drafts
- contribute songs

Viewer:

- listen only
- no creation credits unless upgraded

## Data Architecture

The system should support multi-family isolation from the beginning.

Core entities:

- User
- Family
- FamilyMembership
- SongCreditAccount
- SongCreditTransaction
- SongDraft
- Song
- Album
- Invite

Every private content object should include:

```ts
familyId: string
visibility: 'private_draft' | 'family_only' | 'invite_link' | 'public' | 'archived'
createdByUserId: string
```

This allows the same product to scale from one family to many families.

## Credit Architecture

Track both current credit balance and historical changes.

Recommended model:

```ts
type SongCreditAccount = {
  id: string
  familyId: string
  userId: string
  creditsGranted: number
  creditsUsed: number
  creditsRemaining: number
  createdAt: string
  updatedAt: string
}
```

Recommended transaction log:

```ts
type SongCreditTransaction = {
  id: string
  familyId: string
  userId: string
  amount: number
  reason: 'starter' | 'creation' | 'admin_grant' | 'purchase' | 'refund'
  songDraftId?: string
  createdByUserId?: string
  createdAt: string
}
```

Why transactions matter:

- auditability
- refunds
- admin grants
- future purchases
- debugging generation cost

## Payment Architecture Later

Payments do not need to be part of the first milestone.

But the architecture should leave room for:

- credit packs
- family subscriptions
- one-time celebration bundles
- gift credits
- admin comp credits

Future payment fields:

```ts
paymentProvider?: 'stripe'
paymentIntentId?: string
priceId?: string
creditPackId?: string
```

Do not add Stripe before the private creation loop works.

## Privacy Architecture

Privacy is a product feature, not a footnote.

Rules:

- family library requires authenticated family membership
- non-members cannot browse private family content
- public radio only shows approved public songs
- new songs default to private draft
- family-only is the normal saved state
- public requires intentional approval

Important asset note:

If audio files and covers remain in `/public`, direct URLs may still be reachable. Page-level gating is a first step. True private media requires private object storage and signed URLs.

## Milestone Sequence

Recommended order:

1. Preserve and refactor current player experience as reusable `FamilyRadioHome`.
2. Add familyId and visibility fields to data model.
3. Add private access gate.
4. Add family membership and roles.
5. Add invite flow.
6. Add starter song credit accounts.
7. Add create song draft flow.
8. Save created drafts into private family library.
9. Add owner credit/member controls.
10. Add credit pack purchase later.

## What Not To Do Yet

Avoid:

- overbuilding subscriptions too early
- replacing the beautiful player with a dashboard
- opening public registration before privacy is solid
- unlimited song generation
- public publishing by default
- complicated enterprise permissions
- social feed mechanics

## First True Platform Moment

The platform moment happens when the experience shifts from:

```text
Chien makes and publishes songs for the family.
```

to:

```text
Every invited family member can create and contribute songs to the private family radio.
```

That is the next milestone.

## Final Product Principle

Cousin Radio should feel simple:

```text
You are invited.
You belong here.
You have 3 songs to make.
Make one for someone you love.
```

The model is loving on the surface and disciplined underneath.

That is how the product can grow naturally without losing its soul.
