# Cousin Radio brand system

Family Jukebox ships as **Cousin Radio** — a dark, family-first music archive that feels like a small private radio station.

## Brand promise

- **Name:** Cousin Radio (`CR` short mark)
- **Tagline:** Little Anthems
- **Signature:** Little songs. Big connections.
- **Tone:** Dark premium app energy, family warmth, pink → lilac → ocean gradients, music/player symbols.

## Design principles — all-inclusive family culture

Cousin Radio is a **love-preserving, all-inclusive** family creative space. Visual and product choices should feel like celebration — never exclusion.

| Principle | In the product |
| --- | --- |
| **Everyone belongs** | Every cousin with music gets hero rotation, growing series visibility, and fair shelf space. |
| **Love & celebration** | Spotlight birthdays, new releases, and portraits — not rankings or favorites-only cliques. |
| **Latest without forgetting** | Newest growing album leads; older series stay on the growing shelf. |
| **Warm invitation** | Share cards, play buttons, and copy should feel like opening the kitchen table — not a cold app. |
| **Preserve meaning** | Story, dedication, and lyrics matter as much as the beat. |

Full north star: `docs/COUSIN-RADIO-DIRECTION.md` §3. Code constants: `BRAND_DESIGN_PRINCIPLES` in `lib/brand.ts`.

**Do not:** hide quieter cousins, over-index on one artist, or ship UI that feels anonymous or competitive.

## Palette tokens

Canonical CSS variables live in `app/globals.css`:

| Token | Role |
| --- | --- |
| `--cr-pink` | Primary accent |
| `--cr-rose` | Soft accent |
| `--cr-lilac` / `--cr-violet` | Mid gradient stops |
| `--cr-ocean` | Cool accent |
| `--cr-ink` | Deepest background |
| `--cr-muted-lavender` | Secondary text (not plain gray) |
| `--cr-gradient` | Pink → lilac → ocean (135deg) |
| `--cr-gradient-soft` | Translucent surfaces |
| `--cr-ring-gradient` | Radio arc rings |

Legacy `--family-*` aliases map to `--cr-*` for backward compatibility.

TypeScript constants: `lib/brand.ts` (`BRAND_COLORS`, `BRAND_CONCEPTS`, logo paths).

## Gradient use rules

**Do use gradient for:**

- Play buttons (`.bg-family-accent` / `.bg-cr-gradient`)
- Progress bars (`.family-progress` / `.cr-progress`)
- Taglines and accent words (`.text-cr-gradient`)
- Active carousel dots (`.cr-dot-active`)
- Selected pills, CTAs, focus rings

**Do not:**

- Sprinkle random neon colors outside the palette
- Use harsh gray for body copy — prefer `--jb-muted` / lavender
- Clutter the UI with icons or emoji
- Break player, search, or age selector behavior for aesthetics

## Icon vocabulary

Four concepts (see `BRAND_CONCEPTS`):

1. **Family First** — togetherness
2. **Radio Signal** — broadcast arcs
3. **Music & Joy** — notes / soundtrack
4. **Play Together** — play triangle

Use via `BrandAccentIcon` in context — family page, songs page, sidebar, player subtitle. Do not cluster icons in the home hero.

| Icon | Typical placement |
| --- | --- |
| `users` | Family page, sidebar, album spotlight line |
| `radio` | Mini-player now-playing line |
| `music` | Songs browse header |
| `play` | Play buttons (existing) |
| `heart` | Favorites page, player, song rows |

## Logo assets

Current production files:

- `/public/brand/logo.png` — square
- `/public/brand/logo-44.png` — UI mark
- `/public/brand/logo-128.png` — medium

Future paths (auto-fallback in `BrandWordmark`):

- `cousin-radio-logo.svg` / `.png`
- `cousin-radio-icon.svg` / `.png`
- `cousin-radio-favicon.svg`

Until final assets ship, `CRMark` and text wordmarks are fallbacks.

## Code map

| Area | Location |
| --- | --- |
| Constants | `lib/brand.ts` |
| Theme tokens | `app/globals.css` |
| Wordmark / mark / gradient text | `components/brand/*` |
| Sidebar badge | `components/brand-badge.tsx` |
| Home hero | `components/album-carousel-3d.tsx` |
| Topbar CR mark | `components/topbar.tsx` |
| Play button gradient | `components/play-icon-button.tsx` |
| Mini player progress | `components/mini-player.tsx` |

## Staging

`html[data-env="staging"]` keeps warm amber overrides so preview deploys are visually distinct from production. Do not ship staging colors as the production brand.
