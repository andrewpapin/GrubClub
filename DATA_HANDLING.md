# Data Handling

A short note on what Gravy collects, where it lives, and how to delete it.
Tracked as an Epic 1 backlog item (`BACKLOG.md`) — written for transparency
ahead of any wider distribution, not as a formal legal document. A polished
privacy policy/ToS page is a separate, contingent item (`BACKLOG.md` Epic 6).

## What's collected

Gravy has no user accounts, no sign-up flow, and collects nothing beyond
what's needed to run the app for the kids in one household:

- **Child name** — free text, parent-entered, per profile. The only field
  that could identify a real person.
- **Parent PIN and recovery answer** — never stored or transmitted in
  plaintext. Only a per-installation salted SHA-256 hash of each
  (`src/state/hash.ts`) is saved; failed PIN attempts are also rate-limited
  with an exponential-backoff lockout (`src/state/pinLockout.ts`).
- **Recovery question** — parent-chosen prompt text (e.g. "Pet's name?"),
  not identifying on its own.
- **Gameplay/progress data** — points, streaks, badges, goals, rewards,
  day-by-day logs, game stats. Behavioral, not personal.
- **Appearance preferences** — theme, avatar icon, avatar colors.

There's no email, birthdate, address, photo, or any other PII field in the
data model (`src/state/types.ts`), and no analytics, telemetry, crash
reporting, or third-party tracking script anywhere in the app.

## Where it lives

- **The device, always.** Everything above is saved to `localStorage` under
  the key `gravy_v1` (`src/state/defaultState.ts`). If a household never
  turns on cloud sync, none of this data ever leaves the device.
- **Supabase, optionally.** If a household enables sync, the same data — the
  *whole* household (every kid's profile, not just one) — is upserted into a
  single `households` row keyed by a 6-character household code (`code TEXT
  PRIMARY KEY`, `state JSONB`). There's no account tied to that row; anyone
  who has (or guesses, within the rate limit) the code can join it.
- **Rate-limit bookkeeping.** Looking up a household by code is throttled
  server-side; the limiter stores a bucket derived from the request's source
  IP in `household_lookup_attempts`, separately from the household data
  itself.

## How to delete it

- **Local data:** Parent Dashboard → Settings → Danger Zone → "Reset
  Everything" clears all progress on the active profile (points, badges,
  history, counters) and disconnects the device from sync. It intentionally
  leaves the parent PIN, recovery answer, child's name, theme, and avatar set
  — those are identity/account settings, not progress, and resetting a kid's
  points shouldn't lock the parent out or rename the kid. Clearing the
  browser's site data for the app removes the `gravy_v1` entry entirely.
- **Synced data:** Parent Dashboard → Settings → Sync → "Leave household"
  stops *this device* from syncing and forgets the code locally.

## Known limitations

- **Leaving/resetting doesn't delete the server-side row.** Both actions
  above only affect the local device — the Supabase `households` row for
  that code keeps existing (and keeps syncing to any other device still
  using that code) until it's overwritten or removed directly in Supabase.
  There's no in-app "delete this household everywhere" action yet.
- **`household_lookup_attempts` has no retention/cleanup** — rate-limit
  buckets are never expired, so the table grows unbounded. Low severity (small,
  low-cardinality, not user content) but worth a cleanup pass eventually.

Both limitations are tracked as follow-up items in `BACKLOG.md` Epic 1.
