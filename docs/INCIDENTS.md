# Incidents & production errors

Log of production failures, root causes, fixes, and guardrails so the same class of bug does not ship twice.

**Rule:** Any user-visible production error gets a row here before the fix merges. Each entry must include a **prevention** step (test, CI check, or code pattern).

---

## 2026-06-22 — Site showed “This page couldn’t load” (production crash)

| | |
|---|---|
| **Symptoms** | Vercel deploy status **Ready**, but browser showed Next.js global error: *“This page couldn’t load”*. Homepage, `/songs`, and `/favorites` affected. `/family` often still worked. |
| **What fooled us** | `curl` returned HTTP 200 and HTML containing “Cousin Radio”. The server rendered fine; **JavaScript crashed during hydration / first client render**. |
| **React errors** | **#185** — maximum update depth exceeded (infinite re-render loop). Also saw **#418** during investigation (hydration HTML mismatch on homepage-only widgets). |
| **Root cause** | New **favorites** feature (`useFavoriteSongs` + heart buttons on song cards). `useSyncExternalStore` snapshot function `getStoredFavoriteSlugs()` called `parseFavoriteSlugs()` on every read and **returned a new array instance every time**, even when localStorage had not changed. React treats a new reference as “store changed” → re-render → read again → infinite loop → full app crash. |
| **Why dev felt fine** | `next dev` is more forgiving; production minifies errors and the global error boundary replaces the whole page. Bug appeared only after merging favorites + deploying production build. |
| **Fix** | 1. **Stable snapshots** — cache parsed favorites by raw localStorage string; return the same frozen array until data changes (`lib/favorites-storage.ts`). 2. **Hydration-safe empty state** — shared `EMPTY_FAVORITE_SLUGS` constant for SSR / pre-hydration. 3. **Defer localStorage UI** until after hydration via `useHydrated()`. 4. Homepage widgets that depended on dates/randomness wrapped with `dynamic(..., { ssr: false })` to avoid #418. 5. **Stable family calendar** — `lib/family-calendar.ts` uses `America/Chicago` so SSR and browsers agree on “today” and celebration windows. |
| **Commit** | `346f1ea` — *Fix production crash and restore deploy pipeline.* |
| **Prevention** | • Unit test: repeated reads with same raw JSON return **identical reference** (`smoke.test.ts` → favorites storage). • **Production smoke** (`npm run smoke:production`): starts `next start`, opens `/`, `/songs`, `/favorites`, `/family` in headless Chrome, fails on “This page couldn’t load” or `pageerror`. Runs in CI after `npm run build`. • CD workflow checks production HTML for `__next_error__` (server-side marker; production smoke catches client crashes). |

### Code pattern — external store snapshots

When using `useSyncExternalStore` (or any subscribe/getSnapshot pair):

```txt
✅ DO   Return the same object/array reference until underlying data changes.
❌ DON'T  return JSON.parse(...) or .filter(...) results directly from getSnapshot on every call.
```

See `lib/favorites-storage.ts` and `readFavoriteSlugsFromRaw()`.

### Code pattern — browser-only state (localStorage, window size, etc.)

```txt
✅ DO   Server snapshot = empty/default; apply real browser state after hydration.
✅ DO   Use getServerSnapshot in useSyncExternalStore.
❌ DON'T  read localStorage during SSR or first paint without a matching server value.
```

See `hooks/use-favorite-songs.ts`.

### Code pattern — time-sensitive UI (daily rotation, birthdays)

```txt
✅ DO   One timezone for SSR + client (FAMILY_TIME_ZONE in lib/family-calendar.ts).
✅ DO   Pass computed lists from Server Components when possible.
👀 CONSIDER  dynamic(..., { ssr: false }) for heavy client-only sections if mismatch persists.
```

---

## 2026-06-22 — Deploy pipeline stale / GitHub not auto-deploying

| | |
|---|---|
| **Symptoms** | Pushes to `main` did not trigger fresh Vercel builds; production lagged behind git by ~19h. CD workflow failed (404 on new songs). |
| **Root cause** | GitHub → Vercel webhook was empty; `.github/workflows/cd.yml` only **verified** production, it did not deploy. |
| **Fix** | Added `.github/workflows/deploy.yml` (Vercel build + deploy on push to `main`). Manual `vercel --prod` used as immediate fix. |
| **Prevention** | Repository secrets required: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`. Documented in `docs/CI-CD.md`. Optional: reconnect Vercel Git integration as backup. |

---

## How to add a new incident

1. Append a dated section above this template with symptoms, root cause, fix, and **prevention**.
2. Add or extend a test / CI step that would have caught it.
3. Link the PR or commit.
4. If the bug is a pattern mistake, add a **Code pattern** subsection.

### Checklist before merging risky UI

- [ ] `npm run ci` green (lint + smoke + build + **production smoke**)
- [ ] New `useSyncExternalStore` / localStorage / date logic has unit test or production smoke coverage
- [ ] Manually spot-check production build: `npm run build && npm run smoke:production`
- [ ] If user-visible in prod, row added to this file
