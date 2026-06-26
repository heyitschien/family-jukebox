# 14 — Business Model and Cost Model Notes

This document keeps the business model grounded while protecting the spirit of Cousin Radio.

## Business Principle

Cousin Radio should make money by helping families create and preserve meaningful songs, not by manipulating attention.

## Potential Models

### 1. Free + Credits

Users get a small number of free drafts. More generations require credits.

Good for:

- occasional birthday songs
- casual users
- low commitment

Risk:

- users may not understand credits if pricing is confusing

### 2. Family Plus Subscription

A family pays monthly or yearly for more songs, private albums, storage, and sharing features.

Good for:

- families creating many songs
- private family archive
- predictable revenue

Risk:

- subscription must feel worth it even when no birthday is happening that month

### 3. Pay Per Finished Song

A user pays for one finished song package.

Good for:

- birthdays
- anniversaries
- gifts
- one-off emotional use cases

Risk:

- payment before quality may create disappointment

### 4. Hybrid

Free drafts, paid finished songs, optional Family Plus.

Likely best long-term model.

## Cost Components

Each finished song may include:

```text
transcription cost
language model cost
music generation cost
cover image cost
moderation cost
storage cost
bandwidth cost
support cost
payment processing cost
```

## Cost Tracking Requirements

Track at job level:

```text
provider
model
input size
output size
estimated cost
actual cost if available
family id
song id
timestamp
```

## Pricing Design Rules

- Keep pricing simple.
- Make free usage limited but generous enough to feel magical.
- Do not allow unlimited costly generation without controls.
- Let users preview a brief before expensive generation.
- Set monthly generation limits.
- Make failed generations retry fairly.
- Do not surprise users with charges.

## Possible Early Pricing Experiments

These are not final prices. They are placeholders for thinking.

```text
Free: a few song drafts per month
Song Credit: one finished song package
Family Plus: more drafts, albums, storage, and private sharing
```

## What People May Pay For

People may pay for:

- finished audio
- better cover art
- private family albums
- long-term storage
- download package
- beautiful share page
- special occasion templates
- multilingual versions
- printed QR code card later

## What Should Stay Free or Low-Friction

- Listening to a song shared with you
- Receiving a birthday song
- Basic private preview
- Understanding what Cousin Radio is

## Business Risks

### High AI Cost

Mitigation:

- generation limits
- job cost tracking
- credits
- draft before generation

### Low Repeat Usage

Mitigation:

- family albums
- occasion reminders later
- seasonal prompts
- private archive value

### Quality Variance

Mitigation:

- brief review
- edit controls
- curated templates
- regenerate limits

### Legal Uncertainty

Mitigation:

- provider evaluation
- legal review
- private beta first
- public launch later

## Best First Business Goal

Do not optimize for revenue immediately.

First goal:

```text
Can 10 families create songs that feel meaningful enough to share?
```

Second goal:

```text
Will those families create a second song later?
```

Third goal:

```text
What are they willing to pay to preserve and share this beautifully?
```

## Brand Protection

Cousin Radio should never feel like a cheap AI content factory.

It should feel like a warm family studio.
