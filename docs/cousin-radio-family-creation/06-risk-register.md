# 06 — Risk Register

This document tracks the major risks that must be solved before Cousin Radio becomes a self-service family song creation platform.

## Risk Severity Scale

```text
Low: manageable with normal product care
Medium: important, should be planned before launch
High: must be solved before public launch or paid launch
Critical: could block the product if not addressed
```

## 1. Music Generation Rights

Severity: Critical

Problem:

Cousin Radio may use third-party AI music models. The platform must confirm whether generated songs can be hosted, streamed, shared, monetized, and published publicly.

Required controls:

- Keep music generation provider research in writing.
- Do not enable public publishing until provider rights are clear.
- Store provider, model, prompt, timestamp, and license notes for every generated song.
- Avoid prompts that directly imitate living artists or copyrighted songs.
- Add terms that explain user rights and Cousin Radio hosting rights.

Decision gate:

```text
No public AI-generated music publishing until provider rights are reviewed.
```

## 2. Family Privacy

Severity: Critical

Problem:

Family songs may include names, birthdays, relationships, private memories, voices, images, and location clues.

Required controls:

- Private by default.
- Family-only sharing by default.
- Public publishing only through explicit opt-in.
- Clear warning before public publish.
- Easy unpublish and delete controls.
- Private invite links should be revocable.

Decision gate:

```text
No public sharing until visibility states are reliable and tested.
```

## 3. Children and Young Family Members

Severity: High

Problem:

Families may create songs about children or include child profiles, images, or voices.

Required controls:

- Parent or guardian controls.
- No public child profiles by default.
- Child-related public publishing requires extra review.
- No public display of unnecessary child details.
- Report and removal flow.

Decision gate:

```text
Child-related content remains private or family-only until child-safety controls exist.
```

## 4. Consent Between Family Members

Severity: High

Problem:

One person may create or publish a song about another person. Public sharing may make someone uncomfortable.

Required controls:

- Public publish warning.
- Recipient removal request flow.
- Clear ownership and responsibility language.
- Ability to make public content private quickly.

Decision gate:

```text
Public songs must be removable quickly if a family member objects.
```

## 5. Inappropriate Content

Severity: High

Problem:

Open creation tools can be misused.

Required controls:

- Moderation on transcript, lyrics, metadata, cover prompts, and images.
- Block hateful, harassing, explicit, exploitative, or abusive content.
- Human review for uncertain cases.
- Report button for public content.

Decision gate:

```text
Public radio requires moderation before discovery.
```

## 6. Copyright and Imitation

Severity: High

Problem:

Users may ask for famous artist imitation, copyrighted lyrics, or songs too close to existing music.

Required controls:

- Avoid direct artist-style prompting.
- Block requests to copy existing songs or lyrics.
- Store generation metadata.
- Add copyright warning in creation flow.
- Provide neutral style choices like joyful pop, acoustic family song, lullaby, danceable bilingual track.

Decision gate:

```text
Do not allow generated songs that intentionally copy existing songs.
```

## 7. Cost Overruns

Severity: Medium to High

Problem:

Music, image, and transcription generation may become expensive if usage grows.

Required controls:

- Track cost per job.
- Add monthly generation limits.
- Add retry limits.
- Cache generated assets.
- Use draft preview before expensive generation.
- Use credits or subscription only after cost model is understood.

Decision gate:

```text
No open self-service generation without monthly usage limits.
```

## 8. Quality Risk

Severity: Medium

Problem:

Generated songs may be generic, awkward, or emotionally wrong.

Required controls:

- Create a song brief review step before generation.
- Let user edit names, tone, themes, and language.
- Allow regeneration within limits.
- Add quality prompts that keep lyrics specific to the family story.

Decision gate:

```text
The user must approve the brief before final generation.
```

## 9. Platform Trust

Severity: High

Problem:

If users do not trust privacy, deletion, and sharing controls, they will not use Cousin Radio for real family memories.

Required controls:

- Simple privacy language.
- Clear visibility labels on every song.
- Delete and unpublish options.
- No surprise public sharing.
- No dark patterns.

Decision gate:

```text
Every song must visibly show its privacy state.
```

## 10. Technical Reliability

Severity: Medium

Problem:

AI generation can fail, timeout, or produce incomplete assets.

Required controls:

- Background job queue.
- Status screen.
- Retry failed jobs.
- Save intermediate drafts.
- Never lose the user's voice note or story.
- Clear error states.

Decision gate:

```text
Generation jobs must be resumable before broad beta.
```

## Recommended Risk Posture

Build in this order:

1. Private admin publishing.
2. Draft creation.
3. Voice-to-brief.
4. Manual music generation.
5. Limited invited-family beta.
6. Automated generation with cost controls.
7. Public radio only after legal, safety, and moderation are ready.
