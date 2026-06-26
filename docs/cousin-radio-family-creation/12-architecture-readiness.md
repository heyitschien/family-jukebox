# 12 — Architecture Readiness

This document defines the technical foundation Cousin Radio needs before expanding from a family jukebox into a family song creation platform.

## Architecture Principle

Do not replace the working site all at once.

Evolve from the current static or repo-based system into a dynamic system in layers.

```text
Current app
↓
Typed content schema
↓
Admin draft workflow
↓
Database-backed drafts
↓
Asset storage
↓
Background generation jobs
↓
Family spaces
↓
Public radio
```

## Required Layers

### 1. Content Schema Layer

Create a clean TypeScript schema for:

- songs
- albums
- artists or family names
- tags
- occasions
- privacy states
- publishing states

This makes the current content easier to validate and prepares for database migration.

### 2. Admin Layer

Create internal admin pages to:

- add song metadata
- upload or reference audio
- upload or reference cover image
- edit lyrics
- preview song card
- save draft
- publish

### 3. Storage Layer

Short-term:

- keep using existing static assets if stable

Medium-term:

- move generated assets to cloud storage

Asset types:

```text
audio
cover image
voice note
lyrics text
generation JSON
```

### 4. Database Layer

Recommended objects:

- User
- Family
- FamilyMember
- Album
- Song
- VoiceNote
- GenerationJob
- Asset
- ShareLink
- ModerationReview

### 5. Job Queue Layer

Generation tasks should run outside the page request.

Jobs:

```text
transcribe
extract story
generate lyrics
generate music
generate cover
moderate
publish
```

Each job needs:

- status
- attempts
- provider
- cost estimate
- error message
- timestamps

### 6. Auth and Permissions Layer

Roles:

```text
admin
family owner
family member
guest listener
```

Every song action must check permissions.

### 7. Sharing Layer

Support:

- private draft
- family only
- invite link
- public

Invite links must be revocable.

### 8. Moderation Layer

Moderation must be part of publishing, not an afterthought.

Moderate before public discovery.

## Suggested Stack

Use the existing app stack where possible.

Potential additions when needed:

```text
Database: Supabase Postgres or similar
Auth: Supabase Auth, Clerk, or similar
Storage: Supabase Storage, Cloudflare R2, or S3
Queue: Inngest, QStash, Upstash, or similar
Hosting: Vercel
```

Do not add all infrastructure before the product needs it.

## Migration Strategy

### Phase A — Static Typed Content

Keep the current content model but add schemas and validation.

### Phase B — Admin Drafts

Admin creates drafts. Drafts can still export to the current content format.

### Phase C — Database Drafts

Store drafts in a database. Existing public songs can still come from static files.

### Phase D — Dynamic Family Spaces

Private family spaces require database-backed permissions.

### Phase E — Full Dynamic Publishing

The app reads published songs from the database and asset storage.

## Readiness Checklist

Before invited beta:

- Song schema exists.
- Draft status exists.
- Privacy status exists.
- Admin flow exists.
- Existing app still works.
- Asset paths are validated.
- Drafts cannot accidentally become public.

Before automated generation:

- Job queue exists.
- Provider config is server-side only.
- Costs are tracked.
- Failed jobs can retry.
- Generated assets are stored reliably.

Before public radio:

- Public moderation exists.
- Public publish confirmation exists.
- Takedown flow exists.
- Report button exists.
- Public/private separation is tested.
