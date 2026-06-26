# 04 — Data Model

## Purpose

This file defines a practical starting schema for private family spaces, song generation, albums, and public radio.

Use this as a product and engineering guide, not a final database migration.

## Core Objects

```text
User
Family
FamilyMember
Song
Album
VoiceNote
GenerationJob
Asset
ShareLink
ModerationReview
```

## User

```ts
type User = {
  id: string
  email: string
  displayName: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}
```

## Family

```ts
type Family = {
  id: string
  name: string
  slug: string
  ownerUserId: string
  description?: string
  coverImageUrl?: string
  privacyDefault: 'private' | 'family_only'
  createdAt: string
  updatedAt: string
}
```

## Family Member

```ts
type FamilyMember = {
  id: string
  familyId: string
  userId?: string
  displayName: string
  role: 'owner' | 'parent_guardian' | 'member' | 'child_profile' | 'guest_listener'
  relationshipLabel?: string
  avatarUrl?: string
  canCreateSongs: boolean
  canPublishPublic: boolean
  createdAt: string
}
```

## Album

```ts
type Album = {
  id: string
  familyId: string
  title: string
  slug: string
  description?: string
  coverAssetId?: string
  visibility: 'private' | 'family_only' | 'invite_link' | 'public'
  tags: string[]
  createdAt: string
  updatedAt: string
}
```

## Song

```ts
type Song = {
  id: string
  familyId: string
  albumId?: string
  createdByUserId: string
  title: string
  slug: string
  artistDisplayName: string
  recipientName?: string
  occasion?: 'birthday' | 'anniversary' | 'thank_you' | 'friendship' | 'grandparent' | 'baby' | 'graduation' | 'custom'
  storyNote?: string
  lyrics?: string
  language?: string
  tags: string[]
  audioAssetId?: string
  coverAssetId?: string
  status: 'draft' | 'needs_review' | 'approved' | 'published_private' | 'published_family' | 'published_public' | 'rejected' | 'archived'
  visibility: 'private' | 'family_only' | 'invite_link' | 'public'
  moderationStatus: 'not_started' | 'passed' | 'flagged' | 'needs_human_review' | 'rejected'
  createdAt: string
  updatedAt: string
  publishedAt?: string
}
```

## Voice Note

```ts
type VoiceNote = {
  id: string
  familyId: string
  userId: string
  songId?: string
  audioAssetId: string
  transcript?: string
  transcriptLanguage?: string
  durationSeconds: number
  createdAt: string
}
```

## Song Brief

A song brief can be stored directly on the song or as a separate versioned object.

```ts
type SongBrief = {
  id: string
  songId: string
  recipientName?: string
  relationship?: string
  occasion?: string
  themes: string[]
  tone: string[]
  languageStyle: string[]
  privacyRecommendation: 'private' | 'family_only' | 'invite_link' | 'public'
  rawJson: Record<string, unknown>
  createdAt: string
}
```

## Generation Job

```ts
type GenerationJob = {
  id: string
  familyId: string
  songId?: string
  type: 'transcribe_voice_note' | 'extract_story' | 'generate_lyrics' | 'generate_music' | 'generate_cover_art' | 'moderate_song_package' | 'publish_song'
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'needs_review'
  provider?: string
  model?: string
  inputAssetIds: string[]
  outputAssetIds: string[]
  costEstimateUsd?: number
  attempts: number
  errorMessage?: string
  createdAt: string
  startedAt?: string
  finishedAt?: string
}
```

## Asset

```ts
type Asset = {
  id: string
  familyId: string
  type: 'audio' | 'image' | 'text' | 'json' | 'video'
  storageUrl: string
  mimeType: string
  fileName: string
  sizeBytes?: number
  width?: number
  height?: number
  durationSeconds?: number
  provider?: string
  model?: string
  checksum?: string
  createdAt: string
}
```

## Share Link

```ts
type ShareLink = {
  id: string
  familyId: string
  songId?: string
  albumId?: string
  token: string
  visibility: 'invite_link'
  expiresAt?: string
  createdByUserId: string
  createdAt: string
}
```

## Moderation Review

```ts
type ModerationReview = {
  id: string
  familyId: string
  songId: string
  targetType: 'transcript' | 'lyrics' | 'cover_prompt' | 'cover_image' | 'audio_metadata' | 'full_package'
  status: 'passed' | 'flagged' | 'needs_human_review' | 'rejected'
  flags: string[]
  reviewer: 'ai' | 'human'
  notes?: string
  createdAt: string
}
```

## Recommended Storage

For early stages:

```text
Database: Supabase Postgres
Auth: Supabase Auth or Clerk
Assets: Supabase Storage, Cloudflare R2, or S3
Queue: Upstash Redis / QStash, Inngest, or similar
Deployment: Vercel
```

## Content File Fallback

The current repo-based content model can continue while the database is introduced.

Recommended bridge:

```text
Database stores draft + metadata
Static content exporter creates JSON files used by current app
App reads JSON files until fully dynamic backend is ready
```

This lets Cousin Radio evolve without breaking the working site.
