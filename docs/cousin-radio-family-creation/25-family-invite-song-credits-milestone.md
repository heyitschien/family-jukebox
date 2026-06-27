# 25 — Milestone: Private Family Accounts With Song Credits

This document defines the next major Cousin Radio milestone.

## Milestone Name

```text
Private Family Creation Circle
```

## Milestone Summary

Every invited family member gets a free private family account and a small starter allowance of song creation credits.

Recommended starter rule:

```text
Each family member gets 3 free song credits.
```

Family members can use those credits to create songs, contribute to the private family library, and experience the joy of making music for people they love.

The family library stays private by default.

People outside the family cannot access it unless a song is intentionally shared or published later.

## Core Vision

Cousin Radio becomes a private family music home where each member can participate.

Not only one person uploading songs.

Not only one person managing the library.

The next version should feel like:

```text
Everyone in the family has a small doorway into creation.
```

The first doorway is simple:

```text
You have 3 song credits.
Make a song for someone you love.
```

## Product Promise

```text
Your family's songs start private.
Only invited family members can access the family library.
```

## Who This Is For

Initial audience:

- Chien's family
- close relatives
- invited trusted family members
- family collaborators who understand the purpose

This is not yet a fully public consumer launch.

It is a private family beta.

## What Family Members Can Do

Each invited family member can:

1. Create an account.
2. Join the private family space.
3. See the shared family library.
4. Use up to 3 starter song credits.
5. Create a private song draft.
6. Save the song into the family library.
7. Choose who the song is for.
8. Add a short memory or dedication.
9. Listen to songs created by other family members.
10. React, favorite, or comment later if enabled.

## What Family Members Cannot Do Yet

For the first milestone, keep scope tight.

Do not add:

- paid subscriptions
- unlimited song generation
- public marketplace behavior
- open registration from strangers
- complex social feeds
- complicated permissions
- full AI music automation if not ready

The goal is not a giant platform.

The goal is the first private family creation loop.

## Starter Credit Model

### Recommended Credit Rule

```text
3 credits per invited family member
```

One credit represents one song creation attempt that reaches a saved draft or generated song package.

The credit can be consumed when the user confirms creation, not while typing the memory.

### Why 3 Credits?

Three is enough to create momentum without overwhelming the system.

A family member may create:

1. one song for someone they love
2. one funny inside-joke song
3. one memory or celebration song

This gives enough experience to understand the product.

## Credit States

Each account should track:

```ts
creditsGranted: number
creditsUsed: number
creditsRemaining: number
```

Optional future fields:

```ts
creditGrantReason: 'starter' | 'admin_bonus' | 'subscription' | 'gift'
creditExpiresAt?: string
```

## Privacy Model

### Default State

All created songs start as:

```text
private_draft
```

After saving, the normal family visibility should be:

```text
family_only
```

### Access Rule

Only authenticated users who belong to the family can access:

- family songs
- family albums
- family members
- family drafts
- family creation history

### Public Sharing

Public sharing is not part of this milestone unless explicitly enabled by an admin.

If enabled, the song must move through an intentional approval step.

Recommended states:

```text
private_draft -> family_only -> invite_link -> public
```

No song should become public automatically.

## Family Roles

Start with three roles.

```ts
type FamilyRole = 'owner' | 'member' | 'viewer'
```

### Owner

Can:

- invite members
- approve family access
- manage credits
- review songs
- manage visibility
- remove access

### Member

Can:

- create songs using credits
- listen to family library
- save private drafts
- contribute to family albums

### Viewer

Can:

- listen to shared family songs
- view approved family content
- not create songs unless upgraded to member

## Invite Flow

### Owner Flow

1. Owner opens Family Settings.
2. Owner enters email or phone.
3. Owner chooses role.
4. Owner sends invite.
5. Invite creates pending family membership.
6. Invitee accepts and creates account.
7. Invitee receives 3 starter credits.

### Invitee Flow

1. Open invite link.
2. See family welcome screen.
3. Create account or sign in.
4. Accept family invite.
5. Land in private family space.
6. See starter credits.
7. Create first family song.

## Family Space UI

The family space should show:

- family name
- private badge
- member count
- song count
- album count
- each person's credits remaining
- recent songs
- create song button
- invite family button for owner

Example:

```text
Nguyen Family
Private Family Space

Songs: 24
Albums: 6
Members: 8

You have 3 song credits.
[Create Family Song]
```

## Create Song UI

The create page should show credit status clearly.

Example:

```text
You have 3 song credits remaining.
```

After one creation:

```text
You have 2 song credits remaining.
```

If zero credits remain:

```text
You have used your starter credits.
Ask the family owner for more credits.
```

## Data Model Draft

### Family

```ts
type Family = {
  id: string
  name: string
  slug: string
  ownerUserId: string
  visibility: 'private'
  createdAt: string
}
```

### Family Membership

```ts
type FamilyMembership = {
  id: string
  familyId: string
  userId: string
  role: 'owner' | 'member' | 'viewer'
  status: 'pending' | 'active' | 'removed'
  invitedByUserId?: string
  joinedAt?: string
  createdAt: string
}
```

### Song Credit Account

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

### Song Draft

```ts
type SongDraft = {
  id: string
  familyId: string
  createdByUserId: string
  recipientName?: string
  relationship?: string
  occasion?: string
  story: string
  tone?: string
  language?: string
  visibility: 'private_draft' | 'family_only' | 'invite_link' | 'public' | 'archived'
  status: 'draft' | 'ready' | 'saved' | 'archived'
  creditConsumed: boolean
  createdAt: string
  updatedAt: string
}
```

## Suggested Routes

Public:

```text
/
/sign-in
/join/[inviteToken]
```

Private:

```text
/family
/family/create
/family/settings
/family/members
/family/credits
/family/songs
/family/albums
```

## Implementation Phases

### Phase 1 — Access Gate

- add authentication or temporary family access gate
- block family library from public access
- keep public landing page accessible

### Phase 2 — Family Membership Model

- create family entity
- create memberships
- mark current family as private
- create owner role

### Phase 3 — Invite Flow

- owner can invite family members
- invite token route
- accept invite flow
- activate membership

### Phase 4 — Credits

- grant 3 starter credits to each active member
- show credits remaining
- prevent creation when credits are zero
- consume credit after confirmed song creation

### Phase 5 — Create Flow

- create private song draft
- save to family library
- show created-by attribution
- default visibility to private draft or family only

### Phase 6 — Family Library

- show songs and albums only to active family members
- filter by familyId
- hide private family content from non-members

### Phase 7 — Admin Controls

- owner can view members
- owner can see credits
- owner can grant bonus credits manually
- owner can remove access

## Acceptance Criteria

- public visitors cannot access the private family library
- invited members can create accounts
- invited members can join the family space
- each active member receives 3 starter credits
- members can see credits remaining
- members cannot create new songs after credits run out
- created songs are private by default
- family members can see private family songs
- non-family members cannot see private family songs
- owner can invite members
- owner can manage membership and credits at a basic level

## Founder Note

This milestone matters because it shifts Cousin Radio from:

```text
one person publishing family songs
```

to:

```text
a family creating together
```

That is the first true platform moment.

The experience should feel simple:

```text
You are invited.
You belong here.
You have 3 songs to make.
Make one for someone you love.
```
