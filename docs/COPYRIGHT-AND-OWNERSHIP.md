# Copyright & family ownership — Cousin Radio

**Not legal advice.** This document records how the family tracks, owns, and shares music made for [cousinradio.com](https://cousinradio.com). Have a lawyer review before commercial licensing or disputes.

**Machine-readable registry:** `data/copyright-registry.ts` (SHA-256 fingerprints + IDs)  
**Agent / pipeline rules:** `docs/ADDING_SONGS.md` + `npm run copyright:verify` in CI

---

## What we are building

**Cousin Radio** is a **family legacy catalog** — songs produced by the family using **Google Gemini**, inspired by and often **about** named family members (Marceline, Eliana, Solene, Ocean, Evelyn, Sam & Josh, Tio Chien, etc.).

| Layer | Who / what |
|-------|------------|
| **Catalog owner** | **Cousin Radio Family Collection** — the family’s shared archive |
| **Family producer** | **Chien Family Production** — production umbrella |
| **Curator / producer** | **Tio Chien (HeyITSChien)** — prompts, direction, release on cousinradio.com |
| **Primary artist** | The family member listed as `authorSlug` on each song |
| **Featured subjects** | Family members the song celebrates (`subjectMemberSlugs` in registry) |
| **AI tool** | **Google Gemini** — audio from family-written prompts (see Google’s terms at creation time) |

---

## Family rights (our intent)

### 1. Primary artist (`authorSlug`)

The cousin or family member credited on the song has **personal legacy rights** in the family sense:

- Named on the song page and member profile  
- Recognized as the **primary artist** for that track in the jukebox  
- Included in family celebrations, spotlights, and album groupings  

### 2. Featured subjects (`subjectMemberSlugs`)

Anyone the song is **about** (birthday songs, Father’s Day, multi-cousin stories) is listed explicitly in the copyright registry. They share:

- **Moral recognition** — name attached to the work in the family catalog  
- **Family use** — listening, sharing within the family, appearing in memories/stories on the site  
- **Legacy preservation** — the work stays in the family collection as part of their story  

Overrides for multi-member songs live in `lib/copyright-constants.ts` → `SUBJECT_MEMBER_OVERRIDES`.

### 3. Family collective

**Cousin Radio Family Collection** holds the **catalog** — the master list, files, hashes, and cousinradio.com distribution. The family decides together on:

- Adding new songs  
- Public streaming on cousinradio.com  
- Future licensing (only with explicit family agreement + legal counsel)  

### 4. Public vs family license (tracked in registry)

| Field | Meaning |
|-------|---------|
| `publicLicense: all-rights-reserved` | No automatic rights for strangers to copy, sell, or redistribute outside cousinradio.com |
| `familyLicense: cousin-radio-family-perpetual` | Family members may listen, share links, and preserve within the family legacy forever |

---

## AI / Gemini disclosure

Every registered song includes:

- `productionTool: google-gemini`  
- Notes that audio was **family-directed** via prompts  
- Reminder that **Google Gemini / AI Studio terms** apply to the generation step  

The family treats these as **family originals** in intent and branding, while being transparent that AI assisted production.

---

## Technical tracking (integrity pipeline)

Each song gets a **Copyright Registry** entry:

| Field | Purpose |
|-------|---------|
| `registryId` | Stable ID, e.g. `CR-2026-tap-on-the-glass` |
| `audioSha256` | Fingerprint of the shipped MP3 — detects swaps or corruption |
| `coverSha256` | Fingerprint of cover art |
| `registeredAt` | When hashes were last computed in repo |
| `subjectMemberSlugs` | Who the song is about |

### Commands

```bash
# After adding a song to data/songs.ts + assets:
npm run copyright:register -- --slug your-song-slug

# Rebuild all fingerprints (rare):
npm run copyright:register -- --all

# CI / pre-push check:
npm run copyright:verify
```

### New song pipeline (required)

1. `./scripts/add-song.sh …` — assets + lyrics  
2. Add entry in `data/songs.ts`  
3. **`npm run copyright:register -- --slug <slug>`**  
4. `npm run ci` (includes `copyright:verify`)  
5. Commit **`data/copyright-registry.ts`** with the song  

**CI fails** if any catalog song is missing from the registry or if hashes do not match files.

---

## Current catalog (summary)

All **15** songs in `data/songs.ts` are registered in `data/copyright-registry.ts` with unique `CR-2026-*` IDs and SHA-256 fingerprints.

See the registry file for the full list, hashes, and subject members per track.

---

## For other agents & contributors

- **Do not** add songs without a copyright registry entry.  
- **Do not** edit `audioSha256` / `coverSha256` by hand — run `copyright:register`.  
- **Do not** change `subjectMemberSlugs` without family intent — update `SUBJECT_MEMBER_OVERRIDES` or the registry entry together.  
- **Do** run `npm run copyright:verify` before pushing.  
- **Do** read `docs/DOMAINS-AND-ENVIRONMENTS.md` for deploy domains (cousinradio.com / staging).

---

## Future legal steps (when ready)

- [ ] Family agreement signed (simple charter or LLC operating agreement)  
- [ ] Lawyer review of AI-assisted works + Gemini terms  
- [ ] PRO / copyright registration (e.g. U.S. Copyright Office) using registry IDs + hashes as evidence  
- [ ] Commercial sync licensing policy if songs leave the family site  

Until then, this repo registry + cousinradio.com publication is our **source of truth** for what existed, when, and who it belongs to in the family.
