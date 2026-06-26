# 02 — Staged Roadmap

## Stage 0 — Current Manual Pipeline

Goal: keep using the current process while documenting it.

Current flow:

```text
Prompt in Gemini / music model
↓
Generate song
↓
Generate or select cover art
↓
Download assets
↓
Add files to repo
↓
Run existing pipeline
↓
Publish to Cousin Radio
```

Deliverables:

- Document current content schema.
- Document where songs, images, lyrics, and metadata live.
- Add a repeatable `content intake checklist`.
- Add clear naming rules for songs, albums, artists, and family members.

Exit criteria:

- One new song can be added manually with zero confusion.
- Another person or agent can follow the process without asking Chien every step.

---

## Stage 1 — Admin Song Intake Form

Goal: make publishing easier for Chien first.

Build an internal admin form:

```text
Song title
Artist / family name
Album
Occasion
Audio file upload
Cover image upload
Lyrics
Story note
Tags
Privacy
```

Deliverables:

- Admin-only `/admin/new-song` route.
- Metadata validation.
- File upload to storage.
- Preview card before publish.
- Save as draft.
- Publish to app content feed.

Exit criteria:

- Chien can publish a manually generated song from a web form without touching the repo directly.

---

## Stage 2 — Voice-to-Song Prototype

Goal: make the first magical flow work for invited users.

User flow:

```text
Tap Create Family Song
↓
Choose occasion
↓
Record voice note
↓
Transcribe
↓
Generate song brief
↓
Review brief
↓
Generate lyrics + music + cover
↓
Save draft
```

Deliverables:

- Voice recorder UI.
- Transcription step.
- Story extraction step.
- Song brief review screen.
- Draft song object.
- Manual approval before publishing.

Exit criteria:

- A family member can record a voice note and receive a draft song package.

---

## Stage 3 — Private Family Spaces

Goal: give each family its own safe home.

Features:

- Family profile
- Family members
- Albums
- Private songs
- Invite links
- Role permissions

Roles:

```text
Owner
Parent / Guardian
Family Member
Child Profile
Guest Listener
```

Deliverables:

- Authentication.
- Family workspace model.
- Invite-only listening.
- Song privacy controls.
- Basic family album page.

Exit criteria:

- Multiple families can use Cousin Radio without seeing each other's private content.

---

## Stage 4 — Automated Publishing Pipeline

Goal: reduce manual intervention while keeping quality and safety.

Pipeline:

```text
Draft song
↓
Safety check
↓
Metadata check
↓
Audio asset ready
↓
Cover asset ready
↓
Lyrics saved
↓
Family owner approval
↓
Publish
```

Deliverables:

- Job queue.
- Generation status UI.
- Retry failed jobs.
- Cost tracking.
- Moderation gates.
- Audit log.

Exit criteria:

- Approved songs publish automatically and reliably.

---

## Stage 5 — Public Uplifting Radio

Goal: let families optionally share songs publicly.

Features:

- Public submission review.
- Public radio categories.
- Community favorites.
- Report button.
- Takedown flow.
- Featured family stories.

Deliverables:

- Public feed.
- Moderation queue.
- Public song pages.
- Share cards.
- SEO-safe pages for public songs.

Exit criteria:

- Public songs can be discovered without compromising private family content.

---

## Stage 6 — Platform Growth

Goal: scale the creation, hosting, and sharing system.

Features:

- Credit / subscription system.
- Family Plus tier.
- Collaborative song creation.
- Multi-language support.
- Templates by occasion.
- Partner integrations.
- Creator-facing analytics.

Possible pricing:

```text
Free: limited monthly song drafts
Family Plus: more generations + private albums
Credits: pay per song generation
```

Exit criteria:

- The platform has a sustainable cost model and can support many families.

---

## Recommended Build Order

1. Admin intake form.
2. Song metadata standardization.
3. Draft/publish state model.
4. Voice recorder.
5. Transcription.
6. AI story extraction.
7. AI lyric generation.
8. Music generation integration.
9. Cover generation integration.
10. Private family spaces.
11. Public radio.

## Principle

Build the emotionally magical thing first, but keep the safety and legal foundation close behind.
