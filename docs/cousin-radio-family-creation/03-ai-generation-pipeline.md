# 03 — AI Generation Pipeline

## Goal

Turn a simple spoken family story into a finished song package.

Finished song package:

```text
Audio file
Lyrics
Title
Artist / family name
Album
Cover image
Story note
Tags
Privacy setting
Share link
```

## High-Level Pipeline

```text
Voice recording
↓
Transcription
↓
Story extraction
↓
Song brief generation
↓
User review
↓
Lyric generation
↓
Music generation
↓
Cover art generation
↓
Safety + quality checks
↓
Draft preview
↓
Publish
```

## Step 1 — Voice Recording

Input:

```text
A spoken memory, request, or occasion.
```

Example:

```text
I want to make a birthday song for my mom. Her name is Linda. She loves gardening, roses, Vietnamese food, and she always took care of us. Make it joyful, warm, and a little bilingual.
```

Output:

```text
Audio recording file
Recording duration
User id
Family id
Occasion selected by user
```

## Step 2 — Transcription

Use a speech-to-text model.

Output:

```json
{
  "transcript": "I want to make a birthday song for my mom...",
  "language": "en",
  "confidence": 0.97
}
```

## Step 3 — Story Extraction

Extract structured meaning from the transcript.

Output:

```json
{
  "recipient_name": "Linda",
  "relationship": "mom",
  "occasion": "birthday",
  "themes": ["gardening", "roses", "Vietnamese food", "caregiving", "gratitude"],
  "tone": ["joyful", "warm", "celebratory"],
  "language_style": ["English", "light Vietnamese phrases"],
  "sensitive_details": [],
  "privacy_recommendation": "family_only"
}
```

## Step 4 — Song Brief

Create a human-readable confirmation before generating expensive assets.

Example:

```text
We will create a joyful birthday song for Linda, celebrating her love of gardening, roses, Vietnamese food, and the way she cared for the family. The song will be warm, family-safe, and lightly bilingual.
```

The user can edit:

- recipient name,
- occasion,
- tone,
- language,
- style,
- privacy.

## Step 5 — Lyrics

Generate lyrics from the approved brief.

Recommended constraints:

- no copyrighted song imitation,
- no naming famous artists as style targets in generated output,
- no hateful or explicit content,
- keep family-safe by default,
- avoid exposing private details unless approved.

Output:

```json
{
  "title": "Linda's Garden Birthday",
  "lyrics": "...",
  "language": "en-vi",
  "sections": ["verse", "pre_chorus", "chorus", "bridge"],
  "tags": ["birthday", "mom", "garden", "family", "gratitude"]
}
```

## Step 6 — Music Generation

Potential models to evaluate when build begins:

- Google music generation APIs, if available and commercially usable.
- Other licensed music generation providers with clear hosting and streaming rights.
- In-house or open-source music generation later only if quality and rights are acceptable.

Important requirement:

> Do not integrate a music model until the platform rights are clearly understood.

Questions to answer before integration:

1. Can generated songs be publicly streamed?
2. Can users share the outputs?
3. Can the platform charge for generation or hosting?
4. Who owns the generated audio?
5. Can outputs be used commercially?
6. Are there restrictions on artist-style prompting?
7. Are there watermarking or disclosure requirements?

## Step 7 — Cover Art Generation

Cover art can be generated after lyrics and metadata are ready.

Inputs:

```json
{
  "title": "Linda's Garden Birthday",
  "themes": ["roses", "garden", "warm birthday celebration", "family table"],
  "style": "soft joyful family album cover",
  "privacy": "family_only"
}
```

Output:

```text
cover.png
cover_prompt.txt
model_provider
generation_timestamp
```

## Step 8 — Safety + Quality Checks

Run checks on:

- transcript,
- extracted story,
- lyrics,
- title,
- tags,
- cover prompt,
- cover image,
- audio metadata.

Flags:

```text
private personal data
child safety concern
explicit content
hate or harassment
copyright concern
political persuasion
medical/legal/financial claims
public-sharing concern
```

## Step 9 — Draft Preview

Show:

- cover,
- title,
- lyrics,
- play button,
- story note,
- privacy state,
- edit / regenerate / save buttons.

## Step 10 — Publish

Possible states:

```text
draft
needs_review
approved
published_private
published_family
published_public
rejected
archived
```

## Job Queue Design

Use a background job system for generation tasks.

Jobs:

```text
transcribe_voice_note
extract_story
generate_lyrics
generate_music
generate_cover_art
moderate_song_package
publish_song
```

Each job should track:

```json
{
  "status": "queued | running | succeeded | failed | needs_review",
  "attempts": 0,
  "provider": "model/provider name",
  "cost_estimate": 0,
  "started_at": "timestamp",
  "finished_at": "timestamp",
  "error_message": null
}
```

## MVP Strategy

Do not automate everything at once.

First automate:

1. voice recording,
2. transcription,
3. story extraction,
4. lyric generation,
5. draft metadata.

Keep music generation and final publish behind manual approval until the quality and legal foundation is clear.
