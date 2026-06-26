# 10 — Moderation SOP

This document defines the moderation process for Cousin Radio content.

## Moderation Goal

Keep Cousin Radio warm, family-safe, private-respecting, and uplifting without making the product feel cold or bureaucratic.

## What Gets Checked

Moderation should check:

- voice transcript
- song brief
- lyrics
- title
- artist or family display name
- tags
- story note
- cover prompt
- cover image
- audio metadata
- public share page

## Moderation Stages

### Stage 1 — Draft Creation

Run automatic checks on transcript and story extraction.

Possible outcomes:

```text
passed
needs_user_edit
needs_human_review
blocked
```

### Stage 2 — Generation

Run automatic checks on lyrics and cover prompt before expensive generation.

### Stage 3 — Family Publishing

For private or family-only publishing, use automatic checks and clear user controls.

### Stage 4 — Public Publishing

For public publishing, require stronger review.

Recommended rule:

```text
Public songs must pass moderation before public discovery.
```

## Content Categories to Block or Review

Block or review content that includes:

- hateful or harassing language
- explicit sexual content
- exploitation or abuse
- threats or targeted cruelty
- private information not needed for the song
- copyrighted lyrics or direct copying
- direct imitation of a specific artist
- impersonation concerns
- spam or scams
- unsafe instructions
- extremely sensitive family conflict presented for public sharing

## Family-Safe Allowed Content

Allowed content includes:

- birthday celebrations
- family stories
- friendship songs
- gratitude
- gentle humor
- food and garden songs
- wedding or anniversary songs
- children’s playful songs when properly private
- faith and prayer when respectful
- remembrance songs when handled gently

## Human Review Triggers

Send to human review when:

- the user wants public publishing
- the content involves a child and public visibility
- the system is unsure
- a person is named in a sensitive story
- there is a copyright or imitation concern
- a report is submitted
- the content is emotionally intense but not clearly disallowed

## Review Outcomes

```text
Approve
Approve Private Only
Request Edits
Reject
Escalate
```

## Reviewer Notes Template

```text
Song ID:
Family ID:
Requested visibility:
Issue type:
Decision:
Required edits:
Reviewer notes:
Date:
```

## Report Flow

Public song report flow:

```text
User taps Report
↓
Select reason
↓
Song remains live or is temporarily hidden depending on severity
↓
Human review
↓
Decision logged
↓
Creator notified if needed
```

## Takedown Flow

If someone says a song about them should not be public:

1. Temporarily remove from public discovery.
2. Review the request.
3. Contact owner if needed.
4. Keep private copy only if appropriate.
5. Delete if required by policy or law.

## Tone of Moderation

Cousin Radio should not sound punitive when users make normal mistakes.

Use language like:

```text
This song may include details that should stay private. Please edit before sharing publicly.
```

Not:

```text
Violation detected.
```

## Launch Readiness Checklist

Before public radio:

- Automatic checks exist.
- Human review process exists.
- Report button exists.
- Unpublish flow exists.
- Reviewer decisions are logged.
- Public songs can be hidden quickly.
- Privacy labels are clear.
