# Garden Radio — release plan

> Cousin Radio produce albums: **Fruit Frequency** + **Vegetable Grooves**  
> Source MP4s: `../family-music-asset-june-19/garden-radio/` (never committed — only MP3/JPG in git)

## Wave 1 — Fresh Cuts (shipped 2026-06-25)

| Track | Slug | Album |
| --- | --- | --- |
| Sweet Potato Soul | `sweet-potato-soul` | Vegetable Grooves |
| The Mycelial Loom | `the-mycelial-loom` | Vegetable Grooves |
| 24 Karat Crunch | `karat-crunch` | Vegetable Grooves |
| Spinach Spin | `spinach-spin` | Vegetable Grooves |
| Watermelon Wave | `watermelon-wave` | Fruit Frequency |
| Berry Brainiacs: Level Up! | `berry-brainiacs-level-up` | Fruit Frequency |

**Live after merge:**  
- https://cousinradio.com/albums/vegetable-grooves-album  
- https://cousinradio.com/albums/fruit-frequency-album  

**Family share copy:**

> Cousin Radio just grew a garden. 🌱  
> New fruit & vegetable songs — joy, family, and a little broccoli that deserves a beat.

---

## Wave 2 — scheduled drop

**Suggested date:** **Saturday 2026-06-28** (3 days after Wave 1 so Wave 1 tracks still show “New” badges through the weekend).

**How to ship:** run the one-command script from repo root:

```bash
cd family-jukebox
./scripts/ship-garden-radio-wave2.sh
```

Or ask Cursor: *“Run Garden Radio wave 2 ship script and open PR.”*

The script ships all Wave 2 tracks, runs CI, commits, pushes a feature branch, and prints PR instructions.

### Wave 2 track list

| Track | Slug | Album | Source file |
| --- | --- | --- | --- |
| Bocado de Sol | `bocado-de-sol` | Vegetable Grooves | `vegetables/Bocado_de_Sol.mp4` |
| Gather at the Gate | `gather-at-the-gate` | Vegetable Grooves | `vegetables/Gather_At_The_Gate.mp4` |
| King of the School | `king-of-the-school` | Vegetable Grooves | `vegetables/King_of_the_School.mp4` |
| Piquete de Colores | `piquete-de-colores` | Vegetable Grooves | `vegetables/Piquete_de_colores.mp4` |
| Turning Silver Dreams | `turning-silver-dreams` | Vegetable Grooves | `vegetables/Turning_Silver_Dreams.mp4` |
| Dorado Heart | `dorado-heart` | Fruit Frequency | `fruits/Dorado_Heart.mp4` |
| Gold in My Hand | `gold-in-my-hand` | Fruit Frequency | `fruits/Gold_In_My_Hand.mp4` |
| One Snap and a Bite | `one-snap-and-a-bite` | Fruit Frequency | `fruits/One_Snap_And_A_Bite.mp4` |
| Peel Back the Sun | `peel-back-the-sun` | Fruit Frequency | `fruits/Peel_Back_the_Sun.mp4` |

**Skipped:** `Peel_Back_the_Sunshine.mp4` — duplicate variant; ship only `Peel_Back_the_Sun.mp4`.

### After Wave 2

- Both albums complete (~9 tracks each).
- Update issue [#43](https://github.com/heyitschien/family-jukebox/issues/43) checklist.
- Optional: add a dedicated **Garden Radio** home row (UI follow-up).

---

## Manual single-track ship (reference)

```bash
npm run song:ship -- \
  --author tio-chien \
  --input ../family-music-asset-june-19/garden-radio/vegetables/Bocado_de_Sol.mp4 \
  --slug bocado-de-sol \
  --title "Bocado de Sol" \
  --subtitle "Track five · Garden Radio: Vegetable Grooves" \
  --story "A bite of sunlight — bilingual joy from the vegetable aisle." \
  --tags garden-radio,vegetable,kids,earth,bilingual,family-friendly,tio-chien \
  --series vegetable-grooves-album
```

See `docs/SONG-PIPELINE-SPEC.md` for the full pipeline.
