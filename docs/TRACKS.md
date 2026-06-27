# Cousin Radio — GitHub Tracks & Doc Index

**Repo:** [heyitschien/family-jukebox](https://github.com/heyitschien/family-jukebox)  
**Live:** [cousinradio.com](https://cousinradio.com)  
**Last aligned:** 2026-06-27  
**Issue board:** [Open issues](https://github.com/heyitschien/family-jukebox/issues)

This file maps **GitHub issues → specs/docs → current status** so agents and builders stay aligned without hunting.

---

## Start here

| Doc | Purpose |
| --- | --- |
| [COUSIN-RADIO-DIRECTION.md](./COUSIN-RADIO-DIRECTION.md) | North star — mission, design principles, creative pipeline |
| [PROJECT-RECORD.md](./PROJECT-RECORD.md) | Code-validated architecture, catalog snapshot, work history |
| [cousin-radio-family-creation/README.md](./cousin-radio-family-creation/README.md) | Private-first platform vision + full doc set |
| [ADDING_SONGS.md](./ADDING_SONGS.md) | Ship a song today (`npm run song:ship`) |
| [CI-CD.md](./CI-CD.md) | Deploy flow — push to `main` → Vercel production |

---

## P0 — Private-first platform

| # | Track | Doc(s) | Notes |
| --- | --- | --- | --- |
| [88](https://github.com/heyitschien/family-jukebox/issues/88) | **Milestone: Private Family Creation Circle** | [25-family-invite-song-credits-milestone.md](./cousin-radio-family-creation/25-family-invite-song-credits-milestone.md) | Umbrella milestone — 3 credits per member, private library |
| [79](https://github.com/heyitschien/family-jukebox/issues/79) | P0: Make Cousin Radio private-first | [20-private-first-public-radio-model.md](./cousin-radio-family-creation/20-private-first-public-radio-model.md), [21-privacy-first-migration-plan.md](./cousin-radio-family-creation/21-privacy-first-migration-plan.md) | Public landing + protected family content |
| [80](https://github.com/heyitschien/family-jukebox/issues/80) | P0: Mobile-first UI makeover | [22-mobile-first-ui-makeover-spec.md](./cousin-radio-family-creation/22-mobile-first-ui-makeover-spec.md), [23-ui-component-implementation-map.md](./cousin-radio-family-creation/23-ui-component-implementation-map.md), [mockups/](./mockups/) | Approved mobile-first landing direction |
| [96](https://github.com/heyitschien/family-jukebox/issues/96) | Preserve current player as family radio home | [27-family-radio-home-preservation-spec.md](./cousin-radio-family-creation/27-family-radio-home-preservation-spec.md) | Build around player, don't replace it |

### Creation circle breakdown (under #88)

| # | Track | Doc(s) |
| --- | --- | --- |
| [89](https://github.com/heyitschien/family-jukebox/issues/89) | Private family access gate | [21-privacy-first-migration-plan.md](./cousin-radio-family-creation/21-privacy-first-migration-plan.md) |
| [90](https://github.com/heyitschien/family-jukebox/issues/90) | Family invite + membership | [25-family-invite-song-credits-milestone.md](./cousin-radio-family-creation/25-family-invite-song-credits-milestone.md) |
| [91](https://github.com/heyitschien/family-jukebox/issues/91) | 3 starter song credits per member | [25-family-invite-song-credits-milestone.md](./cousin-radio-family-creation/25-family-invite-song-credits-milestone.md) |
| [92](https://github.com/heyitschien/family-jukebox/issues/92) | Private create song flow | [03-ai-generation-pipeline.md](./cousin-radio-family-creation/03-ai-generation-pipeline.md), [11-mvp-product-requirements.md](./cousin-radio-family-creation/11-mvp-product-requirements.md) |
| [93](https://github.com/heyitschien/family-jukebox/issues/93) | Owner controls for members + credits | [04-data-model.md](./cousin-radio-family-creation/04-data-model.md) |
| [97](https://github.com/heyitschien/family-jukebox/issues/97) | Define song credit model | [14-business-model.md](./cousin-radio-family-creation/14-business-model.md), [26-natural-growth-financial-model-and-experience-architecture.md](./cousin-radio-family-creation/26-natural-growth-financial-model-and-experience-architecture.md) |
| [99](https://github.com/heyitschien/family-jukebox/issues/99) | Review launch plan | [28-pricing-and-launch-plan.md](./cousin-radio-family-creation/28-pricing-and-launch-plan.md) |

### Create flow prototype (draft UI — under #71)

| # | Track | Doc(s) |
| --- | --- | --- |
| [71](https://github.com/heyitschien/family-jukebox/issues/71) | P0 Tonight: Create Family Song draft flow | [07-cursor-build-prompt.md](./cousin-radio-family-creation/07-cursor-build-prompt.md) |
| [72](https://github.com/heyitschien/family-jukebox/issues/72) | Song creation types + draft schema | [04-data-model.md](./cousin-radio-family-creation/04-data-model.md) |
| [73](https://github.com/heyitschien/family-jukebox/issues/73) | Build `/create` page | [23-ui-component-implementation-map.md](./cousin-radio-family-creation/23-ui-component-implementation-map.md) |
| [74](https://github.com/heyitschien/family-jukebox/issues/74) | Reusable song draft preview card | [23-ui-component-implementation-map.md](./cousin-radio-family-creation/23-ui-component-implementation-map.md) |
| [75](https://github.com/heyitschien/family-jukebox/issues/75) | Privacy-first copy + guardrails | [09-privacy-consent-playbook.md](./cousin-radio-family-creation/09-privacy-consent-playbook.md) |
| [76](https://github.com/heyitschien/family-jukebox/issues/76) | Homepage / nav CTA to Create | [22-mobile-first-ui-makeover-spec.md](./cousin-radio-family-creation/22-mobile-first-ui-makeover-spec.md) |
| [77](https://github.com/heyitschien/family-jukebox/issues/77) | Smoke coverage for `/create` | [CI-CD.md](./CI-CD.md) |

### UI makeover breakdown (under #80)

| # | Track | Doc(s) |
| --- | --- | --- |
| [81](https://github.com/heyitschien/family-jukebox/issues/81) | Mobile-first landing sections | [22-mobile-first-ui-makeover-spec.md](./cousin-radio-family-creation/22-mobile-first-ui-makeover-spec.md) |
| [82](https://github.com/heyitschien/family-jukebox/issues/82) | Visibility filtering (public vs family) | [20-private-first-public-radio-model.md](./cousin-radio-family-creation/20-private-first-public-radio-model.md) |
| [85](https://github.com/heyitschien/family-jukebox/issues/85) | Origin story on About page | [24-origin-story-morning-walks.md](./cousin-radio-family-creation/24-origin-story-morning-walks.md), [origin-stories/](./origin-stories/) |

---

## P1 — Product polish (shipped in code, issues may still be open)

| # | Track | Doc(s) | Code status |
| --- | --- | --- | --- |
| [51](https://github.com/heyitschien/family-jukebox/issues/51) | HomeFeed discovery planner | [strategy/cousin-radio-living-family-culture-system.md](./strategy/cousin-radio-living-family-culture-system.md) | ✅ `lib/home-feed.ts` |
| [56](https://github.com/heyitschien/family-jukebox/issues/56) | Hero copy refresh | [COUSIN-RADIO-DIRECTION.md](./COUSIN-RADIO-DIRECTION.md) | ✅ hero copy in components |
| [57](https://github.com/heyitschien/family-jukebox/issues/57) | Age-aware album sourcing | [COUSIN-RADIO-DIRECTION.md §3](./COUSIN-RADIO-DIRECTION.md) | ✅ `lib/audience.ts`, smoke tests |

---

## Content & release tracks

| # | Track | Doc(s) |
| --- | --- | --- |
| [43](https://github.com/heyitschien/family-jukebox/issues/43) | Production album release order | [garden-radio-release.md](./garden-radio-release.md), [printing-intelligence-on-sand-kpop-album.md](./printing-intelligence-on-sand-kpop-album.md) |
| [35](https://github.com/heyitschien/family-jukebox/issues/35) | Family Study Hall / Chill Study Music Mode | Study Lo-Fi albums in `data/albums.ts` |
| [36](https://github.com/heyitschien/family-jukebox/issues/36) | Mobile Gemini song release pipeline | [SONG-PIPELINE-SPEC.md](./SONG-PIPELINE-SPEC.md) |

---

## UX & player tracks

| # | Track | Doc(s) |
| --- | --- | --- |
| [15](https://github.com/heyitschien/family-jukebox/issues/15) | Now-playing navigation + album context | [MOBILE-PLAYER-UX-SPEC.md](./MOBILE-PLAYER-UX-SPEC.md) |
| [31](https://github.com/heyitschien/family-jukebox/issues/31) | State awareness + coherence pass | [AMBIENT-VISUAL-SYNC-SPEC.md](./AMBIENT-VISUAL-SYNC-SPEC.md) |
| [20](https://github.com/heyitschien/family-jukebox/issues/20) | Brand gradient refresh | [BRAND-SYSTEM.md](./BRAND-SYSTEM.md) |
| [62](https://github.com/heyitschien/family-jukebox/issues/62) | Bug report + feature request buttons | — |

---

## Strategy & ops

| # | Track | Doc(s) |
| --- | --- | --- |
| [19](https://github.com/heyitschien/family-jukebox/issues/19) | Product direction: family archive | [COUSIN-RADIO-DIRECTION.md](./COUSIN-RADIO-DIRECTION.md) |
| [44](https://github.com/heyitschien/family-jukebox/issues/44) | Creative flywheel executive doc | [strategy/cousin-radio-living-family-culture-system.md](./strategy/cousin-radio-living-family-culture-system.md) |
| [16](https://github.com/heyitschien/family-jukebox/issues/16) | Family presentation + launch videos | [presentations/](./presentations/), [videos/](./videos/) |
| [95](https://github.com/heyitschien/family-jukebox/issues/95) | Linear ↔ GitHub sync | — |

---

## Technical specs (no issue yet — link when opened)

| Spec | Purpose |
| --- | --- |
| [ALBUMS-SPEC.md](./ALBUMS-SPEC.md) | Growing series + discography rules |
| [MUSIC-INTELLIGENCE-SPEC.md](./MUSIC-INTELLIGENCE-SPEC.md) | Cousin Radio, smart shuffle, queues |
| [AMBIENT-VISUAL-SYNC-SPEC.md](./AMBIENT-VISUAL-SYNC-SPEC.md) | UI follows playback (proposed) |
| [COPYRIGHT-AND-OWNERSHIP.md](./COPYRIGHT-AND-OWNERSHIP.md) | Registry + fingerprints |
| [SECURITY-POSTURE.md](./SECURITY-POSTURE.md) | Production security log |

---

## Agent workflow

1. Read **direction** → [COUSIN-RADIO-DIRECTION.md](./COUSIN-RADIO-DIRECTION.md)
2. Pick a **track** from the table above (or [open issues](https://github.com/heyitschien/family-jukebox/issues))
3. Read linked **spec(s)** before coding
4. Ship songs via [ADDING_SONGS.md](./ADDING_SONGS.md) — not ad-hoc asset drops
5. Run `npm run ci` before PR
6. Update this file or [PROJECT-RECORD.md](./PROJECT-RECORD.md) when a track lands
