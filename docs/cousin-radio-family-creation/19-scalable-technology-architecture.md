# 19 — Scalable Technology Architecture

This document defines the recommended technology direction for scaling Cousin Radio from a family jukebox into a secure, cost-aware, multi-family song creation platform.

## Product Architecture Philosophy

```text
Simple for families.
Sophisticated behind the scenes.
```

A family member should experience:

```text
Speak or type a memory
↓
Preview song draft
↓
Save to family album
↓
Share with family
```

Behind the scenes, Cousin Radio can run a full AI and publishing pipeline.

## Recommended Core Stack

### Frontend and App Hosting

Recommended:

```text
Next.js
TypeScript
Tailwind CSS
Vercel
```

Reasoning:

- already aligned with the current app
- strong developer velocity
- excellent mobile-first web experience
- great deployment flow
- good fit for a family-facing SaaS product

Decision:

```text
Keep the current Next.js / TypeScript / Tailwind / Vercel direction.
```

## Authentication

Recommended early choice:

```text
Clerk
```

Alternative:

```text
Supabase Auth
```

Why Clerk may be best early:

- polished sign-in experience
- social logins and magic links
- strong user management
- easier family invitation flows
- secure defaults
- fast implementation

Why Supabase Auth may be attractive later:

- integrated with Supabase database and Row Level Security
- fewer vendors
- good fit if Supabase becomes the main backend platform

Decision:

```text
Start with whichever option reduces implementation friction. Favor Clerk for polished auth UX, or Supabase Auth for tighter database integration.
```

## Database

Recommended:

```text
Supabase Postgres
```

Why:

- family data is relational
- Postgres is mature
- Row Level Security is essential for family privacy
- works well for users, families, albums, songs, invites, permissions, jobs, and assets
- cost-effective for early growth

Core tables:

```text
users
families
family_members
albums
songs
assets
voice_notes
generation_jobs
share_links
moderation_reviews
```

Important design rule:

```text
Every private query must be permission-aware.
```

Questions every request must answer:

```text
Can this user see this family?
Can this user see this album?
Can this user hear this song?
Can this user publish this song?
```

## File Storage

Recommended:

```text
Cloudflare R2
```

Alternative:

```text
Supabase Storage
Amazon S3
Google Cloud Storage
```

Why R2 is attractive:

- S3-compatible
- strong fit for generated audio and cover assets
- cost-effective storage
- favorable bandwidth economics compared with many traditional object storage setups

Asset types:

```text
audio tracks
cover images
voice notes
lyrics text
generation JSON
share images
```

Design rule:

```text
Store assets outside the repo once families begin generating content.
```

The repo can hold seed/demo content, but user-generated family assets should live in object storage.

## AI Text and Story Layer

Use AI for:

- transcript cleanup
- story extraction
- occasion detection
- song brief generation
- lyric generation
- metadata generation
- safety review
- multilingual support

Recommended provider family:

```text
Gemini models through Gemini API or Vertex AI
```

Reasoning:

- strong multilingual ability
- good structured output patterns
- Google ecosystem alignment with Lyria and Imagen options
- suitable for story-to-song workflows

Implementation rule:

```text
Use model abstraction from day one.
```

Example:

```ts
interface TextProvider {
  extractStory(input: StoryInput): Promise<SongBrief>
  generateLyrics(brief: SongBrief): Promise<LyricsDraft>
  moderateText(input: TextModerationInput): Promise<ModerationResult>
}
```

This keeps Cousin Radio flexible if model quality, pricing, or provider terms change.

## Music Generation Layer

Music generation is the highest-risk and fastest-changing part of the system.

Recommended architecture:

```text
Do not tightly couple the app to one music provider.
```

Create a provider abstraction:

```ts
interface MusicProvider {
  createJob(input: MusicGenerationInput): Promise<MusicGenerationJob>
  getJobStatus(jobId: string): Promise<MusicGenerationStatus>
  downloadAssets(jobId: string): Promise<GeneratedMusicAssets>
}
```

Potential provider category:

```text
Google Lyria through Gemini / Vertex AI / developer APIs, if available and licensing allows the intended use.
```

Important caution:

```text
Do not enable public or paid music generation until provider rights, commercial terms, hosting rights, sharing rights, watermarking, and takedown implications are reviewed.
```

Music provider requirements:

- API access
- clear commercial terms
- clear hosting and sharing rights
- support for family-safe content
- cost tracking
- job status / async generation
- asset export
- no requirement to imitate specific artists
- watermarking or AI disclosure support if required

## Cover Art Layer

Recommended provider category:

```text
Imagen or Gemini image generation, if licensing and cost fit.
```

Why:

- strong fit with Google AI ecosystem
- suitable for warm, family-safe album cover generation
- can produce consistent family album visuals

Cover art design direction:

```text
warm
human
album-like
family-safe
not overly synthetic
not text-heavy
```

## Background Jobs

Recommended:

```text
Inngest
```

Alternatives:

```text
QStash
Upstash Redis + workers
Trigger.dev
Cloud Tasks
```

Why background jobs matter:

- AI generation can take time
- music generation may be async
- failed jobs need retries
- users need progress status
- HTTP requests should not wait for full song generation

Pipeline:

```text
record voice note or submit text
↓
transcribe
↓
extract story
↓
moderate story
↓
generate brief
↓
user approves brief
↓
generate lyrics
↓
generate music
↓
generate cover
↓
store assets
↓
moderate full package
↓
publish draft or family song
```

Each job should track:

```text
status
attempts
provider
model
estimated cost
actual cost if available
error message
started_at
finished_at
```

## Realtime Updates

Recommended:

```text
Supabase Realtime
```

Use for:

```text
Generating transcript...
Creating song brief...
Writing lyrics...
Making music...
Creating cover...
Ready to preview.
```

Realtime updates make the product feel alive and trustworthy.

## Moderation and Safety Layer

Moderation should run on:

- transcript
- story brief
- lyrics
- cover prompt
- cover image
- song metadata
- public share page

Public songs should require:

```text
AI review + human review when needed
```

Private family songs can use automatic checks and clear user controls, but public discovery must be more strict.

## Security Model

The most important security layer is family-level access control.

Required controls:

- authentication on private areas
- family membership checks
- role-based permissions
- Row Level Security in database
- signed URLs for private assets
- revocable invite links
- server-side provider keys only
- audit logs for publish/unpublish actions
- no public access to private family assets

Privacy states:

```text
private_draft
family_only
invite_link
public
archived
deleted
```

Default:

```text
private_draft
```

## Cost Control Model

AI generation can become expensive. Build cost tracking from the beginning.

Track cost per:

- transcription
- story extraction
- lyric draft
- music generation
- cover generation
- moderation pass
- storage
- bandwidth

Controls:

- monthly generation limits
- per-family quotas
- retry limits
- draft preview before expensive generation
- credits or paid plan later
- admin dashboard for generation costs

Do not launch unlimited generation.

## Suggested System Diagram

```text
Next.js App on Vercel
↓
Auth: Clerk or Supabase Auth
↓
Supabase Postgres with Row Level Security
↓
Cloudflare R2 for audio, images, and voice notes
↓
Inngest background jobs
↓
AI provider abstraction layer
   ├─ Text/story provider
   ├─ Music provider
   ├─ Image provider
   └─ Moderation provider
↓
Realtime status updates
↓
Private family albums and optional public radio
```

## Migration Strategy

### Phase 1 — Current Static App

Keep existing app and assets working.

### Phase 2 — Typed Content Layer

Add schemas for songs, albums, visibility, status, and assets.

### Phase 3 — Admin Publishing

Let Chien add and preview songs without manual repo edits.

### Phase 4 — Database Drafts

Store drafts and metadata in database.

### Phase 5 — Asset Storage

Move generated assets to object storage.

### Phase 6 — Background AI Pipeline

Add transcription, story extraction, lyrics, music, and cover generation as jobs.

### Phase 7 — Private Family Spaces

Add auth, family membership, roles, private albums, and invite links.

### Phase 8 — Public Radio

Add public discovery only after moderation, provider rights, and privacy controls are ready.

## Key Technology Decisions

Recommended now:

```text
Keep Next.js / TypeScript / Tailwind / Vercel.
Add Supabase Postgres for relational family data.
Add R2 or equivalent object storage for generated assets.
Use a background job system for AI generation.
Use provider abstractions for text, music, image, and moderation.
Default every family song to private.
```

Do not decide permanently yet:

```text
Final music generation provider
Final payment model
Final public radio moderation process
Final enterprise-scale infrastructure
```

## Final Architecture Principle

The real moat is not the model provider.

The real moat is trust:

```text
Families trust Cousin Radio with their memories, voices, songs, jokes, and love.
```

Choose technology that protects that trust.
