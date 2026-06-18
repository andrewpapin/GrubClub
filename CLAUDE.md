# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Type-check (tsc -b) then bundle to ./dist
npm run lint      # Run ESLint
npm run preview   # Serve ./dist locally
```

There is **no automated test framework wired up** (no `npm test` script, no Playwright config). All
feature testing is manual via the browser. `verify_grubclub.mjs` (repo root) is a one-off Playwright
script from a past manual QA pass — it drives a real `npm run dev` server at `localhost:5173` and takes
screenshots to `/tmp`. It's not run in CI or via any npm script and isn't kept in sync with the app, so
treat it as a reference/example rather than a maintained suite.

## Non-source files to ignore

- `grub-club.html` (repo root) is the **original pre-React prototype** (a single self-contained HTML
  file using old "chore" terminology and a different visual theme). It predates the `54c790b Convert
  Grub Club single-page HTML app to a React + Vite project` commit, is not referenced by `index.html`,
  Vite config, or any build step, and is not kept up to date. Don't edit it expecting it to affect the
  live app — the real app is entirely under `src/`.

## Architecture Overview

GrubClub is a gamified chores + nutrition + rewards PWA for kids built with React 19, TypeScript, and Vite. It is a client-side-only SPA — no server, no API. Data persists to `localStorage` with optional cloud sync via Supabase.

### Two User Surfaces

- **Kid view** (`src/components/`) — home screen (stats, week strip, food tray, daily/other goals, or a
  read-only day summary when a past date is selected), rewards store, badges screen, and a calendar
  overlay. Bottom nav (`BottomNav.tsx`) only has **Home / Badges / Settings** — Store is *not* in the
  bottom nav; it's opened via a gift icon next to the points pill in `TopBar.tsx`. The gear icon goes to
  a PIN gate (`PinScreen.tsx`), not directly to the dashboard.
- **Parent dashboard** (`src/components/parent/`) — reached after the PIN gate (default PIN: `1234`);
  tabs are Approvals, Goals, Store, Badges, Settings (`ParentDashboard.tsx`).

### Global State

All state flows through a single React Context defined in `src/state/GrubClubContext.tsx`. Components consume it via `useGrubClub()`. The context owns:

- The `GrubClubState` object (see `src/state/types.ts` for full shape)
- Auto-save to `localStorage` on every state change
- Supabase sync (`src/state/sync.ts`) — households share a 6-char code; entire state is stored as a JSON blob per code
- Toast notifications with optional undo actions
- Celebration/confetti triggers
- Badge-earned detection on each action

**Mutation convention:** every state-mutating action in `GrubClubContext.tsx` follows the same shape —
`setState((prev) => { const next = clone(prev); /* mutate next */ return next; })` (deep-clone via
`JSON.parse(JSON.stringify())`, never mutate `prev` directly). Several actions (`logFood`, `removeGoal`,
`removeReward`) snapshot `prev` before mutating and wire a toast's `Undo` action to restore that
snapshot. Follow this pattern for new mutations rather than mutating state in place.

### Key State Concepts

- **Goals** — chores assigned to the child (formerly called "chores"; `migrateLegacyState()` in
  `defaultState.ts` renames old keys on load). Goals can be `isDaily` (default, reset at day rollover) or
  one-off/persistent (`isDaily: false`, shown in `OtherGoals.tsx`, survive rollover until manually
  completed). A goal can require multiple completions via `target` (default 1); `todayGoalCounts` tracks
  progress per goal id until it hits `target`, at which point the goal id is added to `todayGoals`.
- **Food tray** — capped at **one log per food group per day**; tapping a logged food tile again removes
  it (toggle-to-undo), it does not stack (see `logFood`/`removeFood` in `GrubClubContext.tsx`).
- **Day rollover** — handled by `applyDayRollover()` in `src/state/defaultState.ts`; archives today's food counts and completed *daily* goals into `dayLogs[dateStr]` (non-daily goal completions are left alone), updates streak (increments if last active was yesterday, resets if a day was skipped), clears daily food/goal progress. Re-checked on every state change at load and on tab `visibilitychange`.
- **Counters** — `src/state/types.ts` `Counters` object aggregates lifetime stats (total foods by type, total goals, full-tray days, combo days, max points in a day, etc.) used for badge progress
- **Pending rewards** — kids request rewards; they sit in `pendingRewards` until a parent approves/declines

### Badge System

55 unlockable badges defined in `src/data/badges.ts` across 6 groups (Food, Chores, Points, Streaks,
Store, Combos), evaluated in `src/state/badges.ts`. Badges are triggered by:
- First-time events (`first_food`, `first_chore`, `first_reward`)
- Cumulative counter thresholds (`fruit:N`, `veggie:N`, `pts:N`, `streak:N`, `chore_count:N`, etc. — see the comment block at the top of `badges.ts` for the full trigger vocabulary)

`findNewlyEarnedBadges()` is called after each state-mutating action. Parents can customize badge name/emoji/visibility via `badgeConfig` in state. Badge-unlock toasts are sometimes deferred (`delayMs`) so they don't stack on top of a celebration overlay (e.g. the "Full Tray" celebration) triggered by the same action.

### Persistence & Sync

- Primary: `localStorage` key `grubclub_v2` (set by `STORAGE_KEY` in `src/state/defaultState.ts` — *not*
  `grubclub_state`, despite that being a more obvious guess). Related keys: `grubclub_household_code` and
  `grubclub_sync_skipped` (whether the user dismissed `SyncGateModal`), both managed in
  `GrubClubContext.tsx`.
- Optional cloud: Supabase `households` table — `{ code TEXT PK, state JSONB, updated_at, created_at }`.
  The Supabase URL and publishable/anon key are hardcoded as constants in `src/lib/supabaseClient.ts`
  (there's no `.env` file or `import.meta.env` usage in this repo) — that's expected for an anon key, not
  a bug to "fix" by moving it to env vars.
- Household codes use an unambiguous character set (no `0/O`, `1/I/l`)
- Real-time sync via Supabase `postgres_changes` subscription; conflict resolution is last-write-wins
- Remote/loaded state always passes through `migrateLegacyState()` before being applied, so old-shape data (local or from another device) is normalized on every entry point.

### Styling

No CSS modules, no Tailwind, no styled-components — one global stylesheet, `src/index.css` (~1500
lines), with hand-rolled utility/component classes (`btn`, `btn-primary`, `btn-ghost`, `btn-sm`, `screen`/`screen.active`, `scroll-area`, `parent-tab`, etc.) referenced directly via `className`. Icons come from `@fortawesome/free-solid-svg-icons` via `<FontAwesomeIcon icon={faX} />`. Match existing class names/patterns rather than introducing a new styling approach.

### Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages on push to `main`. The Vite `base` is `/GrubClub/`.
