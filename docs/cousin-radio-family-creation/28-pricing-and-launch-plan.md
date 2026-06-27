# 28 — Pricing and Launch Plan

## Core Position

Cousin Radio should not be framed as a tool where families simply pay for AI songs.

A better frame is:

```text
Gemini can make a song.
Cousin Radio creates the private family radio station where the song belongs.
```

The value is the private family music home:

- beautiful listening experience
- family albums
- private access
- invitations
- credits for controlled creation
- memories organized over time
- mobile player and carousel experience
- long-term family archive

## What Families Will Value

Families are most likely to value:

- a polished private family radio station
- no manual download and upload pipeline
- simple creation prompts
- a place where everyone in the family can contribute
- song history by person, occasion, year, and album
- safe privacy defaults
- beautiful listening and sharing
- long-term preservation

Families are less likely to value raw AI generation alone because many people will already have direct access to Gemini or similar tools.

## Recommended Launch Sequence

### Stage 1 — Private Family Beta

Price: free.

Included:

```text
3 starter song credits per invited family member
private family radio space
family-only access
manual owner credit grants
```

Goal:

Validate emotional use before monetization.

Success criteria:

- 10 invited family members onboarded
- 20 family songs created
- at least 5 members create a song
- family members replay songs without being prompted
- recipients react positively
- no serious privacy confusion

### Stage 2 — Friends and Family Alpha

Price: free starter access.

Optional manual paid test:

```text
$5 for 5 additional songs
```

Goal:

Test whether families outside the founder household understand the value.

Success criteria:

- 5 outside families onboarded
- 50 total songs created
- 3 families ask for more credits
- 1 family asks what it costs

### Stage 3 — Credit Packs

Use credit packs before subscriptions.

Recommended early packs:

```text
5 songs:  $5
15 songs: $12
35 songs: $25
```

Use warm names:

- More Songs Pack
- Family Pack
- Celebration Pack

Do not call them tokens.

### Stage 4 — Subscription Later

Only add subscription after repeat use is proven.

Possible future plans:

```text
Family Radio Basic:  $9/month, 10 songs/month
Family Radio Plus:   $19/month, 30 songs/month
Family Legacy:       $49/month, 100 songs/month
```

Do not launch with all plans at once. Start with credits, then add one simple monthly plan when families return monthly.

## Planning Cost Model

Source assumptions to verify before launch:

- Google Gemini API pricing currently lists Lyria 3 preview music generation at roughly $0.08 per full song request.
- Google Gemini API pricing lists image output examples around $0.039 per image.
- Stripe standard domestic card pricing is listed at 2.9% + $0.30 per transaction.
- Vercel Pro is listed at $20/month plus usage.

Planning estimate per completed hosted song:

```text
music generation:     $0.08
cover image:          $0.04
text and metadata:    $0.01
storage/bandwidth:    $0.02 to $0.10
------------------------------
planning cost:        $0.15 to $0.25 per song
```

Use $0.25/song for planning.

Use $0.50/song as a stress test.

## Unit Economics Draft

Assuming $0.25 direct cost per completed song:

### 5 songs for $5

```text
revenue:          $5.00
processing est.:  $0.45
direct cost:      $1.25
rough margin:     $3.30
```

### 15 songs for $12

```text
revenue:          $12.00
processing est.:  $0.65
direct cost:      $3.75
rough margin:     $7.60
```

### 35 songs for $25

```text
revenue:          $25.00
processing est.:  $1.03
direct cost:      $8.75
rough margin:     $15.22
```

These are planning estimates, not accounting statements.

## Go-to-Market Criteria Before Charging Broadly

Do not charge broadly until:

- private family access works
- invited members can create accounts
- credits are tracked correctly
- songs default private
- private songs do not appear publicly
- the mobile player remains stable
- cost per completed song is measured
- failed generation rate is measured
- provider rights are verified
- families replay songs after the first day
- at least one outside family asks for more songs

## Natural Growth Loop

```text
one member creates a song
recipient feels loved
family listens together
another member wants to create
selected song gets shared outside
another family asks for its own station
```

Growth should come from love and sharing first, not ads.

## Final Recommendation

Start with:

```text
Free private beta
3 credits per member
manual additional credits
measure real use
then test small credit packs
```

Cousin Radio should sell the family radio station experience, not raw AI output.
