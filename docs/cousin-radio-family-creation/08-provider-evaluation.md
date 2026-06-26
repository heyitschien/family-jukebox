# 08 — AI Provider Evaluation Checklist

This document defines how Cousin Radio should evaluate AI providers for transcription, lyrics, music, cover art, moderation, and hosting workflows.

Do not choose a provider only because the demo is beautiful. Choose providers whose rights, reliability, cost, and safety posture fit a family platform.

## Provider Categories

Cousin Radio may eventually need providers for:

- Speech-to-text transcription
- Story extraction and lyrics
- Music generation
- Cover image generation
- Image moderation
- Text moderation
- Audio storage
- Background job execution

## Evaluation Table

For every provider, create a row with:

```text
Provider name
Model or product name
Use case
Pricing model
Commercial usage allowed?
Public hosting allowed?
Private sharing allowed?
Output ownership terms
Training/data retention terms
Safety tools available?
Rate limits
Latency
API maturity
Export formats
Known restrictions
Decision
Notes
Date reviewed
Reviewer
```

## Must-Answer Legal Questions

Before a provider is used in production:

1. Can Cousin Radio host generated outputs?
2. Can families share generated outputs through private links?
3. Can families publish outputs publicly?
4. Can Cousin Radio charge users for generation or hosting?
5. Who owns or controls generated outputs?
6. Does the provider claim rights over user prompts or generated outputs?
7. Are user inputs used for model training?
8. Are generated outputs used for model training?
9. Can the platform delete user data from the provider?
10. Are there restrictions on music style prompts?
11. Are there restrictions on voice, likeness, or artist imitation?
12. Are there watermarking or disclosure requirements?

## Music Provider Special Questions

Music generation has the highest risk. Ask:

- Is the output safe to stream publicly?
- Are outputs royalty-free for platform use?
- Are there limits on commercial use?
- Can users download generated songs?
- Can users repost generated songs elsewhere?
- Are generated songs exclusive or non-exclusive?
- Is there any copyright indemnity?
- What happens if the output resembles existing music?
- Are vocal outputs supported?
- Can the model generate multilingual lyrics?
- Can the model create family-safe content consistently?

## Cost Questions

For every provider, estimate:

```text
Cost per transcription
Cost per lyric draft
Cost per music generation
Cost per cover image
Cost per moderation pass
Storage cost per song
Bandwidth cost per listen
Average total cost per finished song
```

Do not launch open generation without a cost ceiling.

## Reliability Questions

- What is average latency?
- What is worst-case latency?
- Does the provider support async jobs?
- Does the provider provide webhooks?
- Can failed jobs be retried safely?
- Are outputs deterministic enough for previews?
- What formats are returned?
- Are there content filters that may unexpectedly block family content?

## Product Fit Questions

The provider should support Cousin Radio’s emotional tone:

- warm
- family-safe
- uplifting
- multilingual
- personal
- not celebrity-imitation driven
- not shock-content driven

## Decision States

Use these decision labels:

```text
researching
approved_for_experiment
approved_for_private_beta
approved_for_public_launch
rejected
revisit_later
```

## Provider Approval Rule

A provider can be used for internal experiments if quality is good.

A provider can be used for invited private beta only if privacy, cost, and basic rights are clear.

A provider can be used for public launch only if hosting, public sharing, commercial usage, takedown, and data handling are clear.

## Recommended First Approach

Start with providers that support:

- clear API access
- clear commercial terms
- reliable asset export
- strong safety settings
- usage tracking
- deletion controls

Do not build the product around a provider whose terms are unclear.
