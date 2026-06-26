# 13 — Launch Readiness Checklists

This document defines readiness gates for each stage of Cousin Radio’s growth.

## Stage 1 — Admin Publishing Readiness

Goal: Chien can add and manage songs without manual repo editing.

Checklist:

- Admin route exists.
- Song form exists.
- Song schema exists.
- Album schema exists.
- Required fields are validated.
- Draft status exists.
- Privacy status exists.
- Preview card exists.
- Existing public site still works.
- No secrets are committed.
- Build passes.

Go decision:

```text
Ready when a new song can be saved as a draft and previewed from the admin UI.
```

## Stage 2 — Voice-to-Brief Readiness

Goal: a person can speak or type a memory and receive a structured song brief.

Checklist:

- Create button exists.
- Occasion picker exists.
- Typed input exists.
- Voice recording exists or is intentionally deferred.
- Transcript or text input is saved.
- Story extraction works.
- Song brief is editable.
- User must approve brief before generation.
- Draft remains private by default.

Go decision:

```text
Ready when an invited user can create an accurate song brief from natural language.
```

## Stage 3 — Lyrics Draft Readiness

Goal: approved briefs can become lyrics drafts.

Checklist:

- Lyrics generation works.
- Lyrics are saved to draft.
- User can edit lyrics.
- Style choices avoid direct artist imitation.
- Moderation check runs on lyrics.
- Regeneration limits exist.
- Errors are recoverable.

Go decision:

```text
Ready when lyrics feel personal and specific, not generic.
```

## Stage 4 — Manual Music Publishing Readiness

Goal: generated or manually produced songs can be added cleanly.

Checklist:

- Audio asset path or upload flow exists.
- Cover asset path or upload flow exists.
- Song can be previewed with audio.
- Song can be published privately.
- Song can be assigned to album.
- Song can be archived.
- Privacy label is visible.

Go decision:

```text
Ready when Chien can publish a finished song without touching raw content files.
```

## Stage 5 — Invited Family Beta Readiness

Goal: selected families can safely create private songs.

Checklist:

- Auth exists.
- Family spaces exist.
- Family roles exist.
- Family-only visibility works.
- Invite links work and can be disabled.
- Drafts are private by default.
- Family owner controls exist.
- Basic reporting or support contact exists.
- Cost limits exist.

Go decision:

```text
Ready when 10 invited families can use the product without seeing each other's private content.
```

## Stage 6 — Automated Music Generation Readiness

Goal: the system can generate full song assets automatically.

Checklist:

- Provider rights reviewed.
- Provider costs understood.
- API keys are server-side only.
- Generation jobs run in background.
- Job retries exist.
- Cost tracking exists.
- User sees generation status.
- Failed jobs do not lose drafts.
- Generated audio is stored reliably.
- Terms and privacy language are updated.

Go decision:

```text
Ready when automated generation is legally clear, cost-controlled, and reliable.
```

## Stage 7 — Public Radio Readiness

Goal: families may intentionally publish uplifting songs publicly.

Checklist:

- Public publishing requires explicit confirmation.
- Moderation runs before public discovery.
- Human review process exists.
- Report button exists.
- Takedown flow exists.
- Unpublish works quickly.
- Public pages avoid exposing private details.
- Public songs are clearly marked public.
- Terms and privacy policy are reviewed.

Go decision:

```text
Ready when public sharing is safe, intentional, moderated, and reversible.
```

## Stage 8 — Monetization Readiness

Goal: Cousin Radio can support generation costs sustainably.

Checklist:

- Cost per finished song is estimated.
- Free limits are defined.
- Paid plan or credits are defined.
- Refund policy exists.
- Payment provider is integrated securely.
- Usage limits are enforced.
- Billing copy is simple.
- No surprise charges.

Go decision:

```text
Ready when the product can grow without uncontrolled AI costs.
```

## Final Principle

Do not move to the next launch stage because the technology is exciting.

Move only when the family experience is safe, clear, beautiful, and trustworthy.
