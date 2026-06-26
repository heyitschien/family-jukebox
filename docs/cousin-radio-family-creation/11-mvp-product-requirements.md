# 11 — MVP Product Requirements

## MVP Name

Cousin Radio Create

## MVP Goal

Let Chien and invited family users create a structured song draft from a simple guided flow, then save it into Cousin Radio as a private or family-only song.

## MVP Promise

```text
Speak a memory. Turn it into a song draft for someone you love.
```

## MVP User Types

### Chien / Admin

Can add songs, edit metadata, preview cards, and publish.

### Invited Family Creator

Can create a song draft and share within their family space.

### Family Listener

Can listen to approved songs shared with them.

## MVP Routes

```text
/create
/create/occasion
/create/record
/create/review-brief
/create/draft/[id]
/admin
/admin/new-song
/admin/songs
```

## MVP Flow

```text
Tap Create Family Song
↓
Choose occasion
↓
Record or type memory
↓
Generate transcript
↓
Generate song brief
↓
User reviews brief
↓
Generate lyrics and metadata
↓
Save draft
↓
Admin or family owner publishes privately
```

## Required MVP Features

### Create Button

A visible CTA on the app:

```text
Create Family Song
```

### Occasion Picker

Options:

```text
Birthday
Thank You
Anniversary
Friendship
Mom / Dad
Grandma / Grandpa
Kids
Food / Garden / Home
Custom
```

### Input

Support at least one of:

- typed memory
- voice note recording

Ideal MVP supports both, but typed input is acceptable for earliest implementation.

### Song Brief

Generate and display:

- recipient name
- relationship
- occasion
- themes
- tone
- language
- privacy recommendation

### Lyrics Draft

Generate lyrics from approved brief.

### Draft Preview

Show:

- title
- artist or family name
- lyrics
- story note
- tags
- visibility
- placeholder cover
- placeholder play button

### Save Draft

Save draft in structured format.

### Publish Privately

Admin can publish to existing Cousin Radio feed or family collection.

## Non-Goals

Do not include in MVP:

- public self-service publishing
- payments
- open registration
- unlimited generation
- fully automated music generation
- legal terms automation
- social feed mechanics

## Acceptance Criteria

The MVP is successful when:

1. A user can create a song draft without knowing prompting.
2. The draft captures the emotional story accurately.
3. The lyrics feel specific to the person and occasion.
4. The song remains private by default.
5. Admin can preview and publish without touching raw code.
6. Existing Cousin Radio pages continue to work.

## Test Cases

### Birthday Song

Input:

```text
I want a birthday song for my mom Linda. She loves gardening and Vietnamese food. She always cared for us.
```

Expected:

- occasion: birthday
- recipient: Linda
- relationship: mom
- themes: gardening, food, caregiving, gratitude
- privacy: family-only

### Friendship Song

Input:

```text
Make a song for my friend Max. He listens deeply and supports me. Make it warm and 2010s pop inspired.
```

Expected:

- occasion: friendship
- recipient: Max
- themes: listening, support, friendship
- style: warm pop, no direct artist copying

### Garden Song

Input:

```text
Make a fun family song about vegetables, sunshine, soil, and grocery trips.
```

Expected:

- occasion: food/garden/home
- themes: vegetables, sunlight, family joy
- tone: playful

## MVP Quality Bar

- Mobile-first
- Beautiful and warm
- No confusing technical language
- Clear privacy labels
- No public publishing surprises
- Drafts never get lost
- Generation failures are recoverable
