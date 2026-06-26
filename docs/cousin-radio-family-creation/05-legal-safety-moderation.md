# 05 — Legal, Safety, and Moderation Checklist

## Purpose

Cousin Radio’s emotional promise is beautiful, but the platform must be built carefully because it involves generated music, family memories, personal data, children, private sharing, and public publishing.

This is not legal advice. Before public launch or paid usage, review these areas with a qualified attorney.

## Biggest Legal Questions

### 1. Music Generation Rights

Before integrating any music model, confirm:

- Who owns the generated audio?
- Can users share the audio privately?
- Can users share it publicly?
- Can Cousin Radio host and stream it?
- Can Cousin Radio charge for generation, hosting, or subscriptions?
- Are commercial rights included?
- Are there restrictions on artist-style prompts?
- Are there watermarking or disclosure requirements?
- Can the model provider use user inputs for training?
- Can the model provider use generated outputs for training?

No music provider should be used for public platform generation until these answers are clear.

### 2. User Content Ownership

Terms should clarify:

- Users own or control the stories they submit.
- Users are responsible for having rights to the photos, stories, names, and voices they submit.
- Cousin Radio receives a license to host, process, stream, display, and share content according to the selected privacy setting.
- Public publishing grants Cousin Radio permission to show the content publicly.
- Users can request removal.

### 3. Personal Data and Family Privacy

Family songs may include:

- names,
- birthdays,
- family relationships,
- children’s names,
- voice recordings,
- photos,
- memories,
- locations,
- sensitive life events.

Default product posture:

```text
Private by default.
Family-only by default.
Public only by intentional opt-in.
```

### 4. Children and Family-Safe Design

If children use the product or appear in songs/photos, the platform must be extra careful.

Consider:

- parent/guardian controls,
- no public child profiles by default,
- child-safe content filters,
- public publishing restrictions for child-related content,
- clear reporting and takedown flows.

### 5. Public Moderation

Public songs should pass moderation before public discovery.

Block or review:

- hate or harassment,
- sexually explicit content,
- violence or self-harm,
- targeted abuse,
- private personal data,
- unauthorized use of someone’s likeness or voice,
- copyrighted lyrics or obvious imitation,
- political persuasion or manipulation,
- scams or spam,
- medical/legal/financial claims.

## Safety Pipeline

```text
Voice note
↓
Transcript moderation
↓
Story extraction moderation
↓
Lyrics moderation
↓
Cover prompt moderation
↓
Cover image moderation
↓
Song metadata moderation
↓
Publish gate
```

## Human Review Rules

Send to human review when:

- the song is intended for public publishing,
- the content mentions a child by name,
- the AI detects private or sensitive details,
- a user reports the song,
- copyright or impersonation concerns appear,
- the system is unsure.

## Consent and Takedown

Must-have flows:

- Report song.
- Request removal.
- Remove public listing.
- Make public song private.
- Delete draft.
- Delete account.
- Export family archive.

## Terms of Service Topics

- User content ownership.
- Platform hosting license.
- AI-generated content disclosure.
- Model provider dependencies.
- Acceptable use policy.
- Public publishing rules.
- Takedown policy.
- Child safety and guardian responsibility.
- Payment / credits / refunds if monetized.

## Privacy Policy Topics

- Account data.
- Voice recordings.
- Transcripts.
- Generated lyrics.
- Audio files.
- Cover art.
- Family membership data.
- Invite links.
- Public vs private content.
- Third-party AI providers.
- Data deletion.
- Data retention.

## Product Copy Recommendation

Use simple visible copy near creation:

```text
Your family songs are private by default. You choose who can hear them.
```

For public publish:

```text
Public songs may be heard by anyone on Cousin Radio. Only publish if everyone involved is comfortable sharing this memory publicly.
```

## Risk Principle

Cousin Radio should not grow by exploiting private family moments.

It should grow by giving families control, dignity, and beautiful tools for celebration.
