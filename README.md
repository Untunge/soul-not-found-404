# Error 404: Soul Not Found

A daily game for Reddit's **Game of the Day Hackathon** (Devpost, November 11 –
December 8, 2026). Built with Devvit Web.

You are the new intern in the Department of Afterlife Affairs. Five souls
arrive every day, each with a ridiculous cause of death. Your job: sort them
into **Heaven**, **Hell**, or **Limbo** — and try to agree with the rest of the
department.

## How to play

1. Open the daily post. Five souls are waiting, the same five for every
   player that day.
2. Read each soul's file: name, age, cause of death, and one extra detail
   (their occupation, their last minor sin, or what they were carrying).
3. Read the **Memo of the Day** — a rule from Management that changes daily
   and overrides the usual routing for one category of soul
   (e.g. "All influencers are to be held in Limbo pending follower
   verification. Verification takes 400–600 years.").
4. Stamp each soul **APPROVED** (Heaven), **DENIED** (Hell), or **PENDING**
   (Limbo). Review your verdicts, then file them. Verdicts are final — the
   Department does not accept appeals.
5. Your score is how many of your verdicts match the **community consensus**
   (0–5). Community percentages are only shown after you file, so nobody can
   just copy the crowd. Following the memo earns bonus points.
6. Share your result card (emoji grid + score) in the comments and argue
   about the hard cases. Come back tomorrow: new souls, new memo, streak
   kept alive.

**Practice mode** serves unlimited random training souls. Practice verdicts
never affect your score, streak, or rank.

## Ranks and streaks

- **Streak:** consecutive days you file verdicts.
- **Points:** consensus matches + memo bonuses, accumulated over time.
- **Ranks:** Intern (0) → Clerk (5) → Supervisor (15) → Department Head
  (30) → Director of the Afterlife (50).

Logged-out visitors can browse the files and use practice mode, but verdicts
are only filed for logged-in Reddit users.

## Content policy

Every soul is fictional. All 100+ causes of death are absurd and invented:
no real people, no real tragedies, no suicide, no children, no gore or
graphic description. The tone is deadpan bureaucracy, never cruel.

## Tech

- **Client:** React 19 + Tailwind CSS 4 + Vite (Devvit Web).
  - `src/client/splash.tsx` — inline view in the feed (memo teaser, streak).
  - `src/client/game.tsx` — expanded view (sorting, review, results,
    practice).
- **Server:** Hono on Devvit's serverless runtime.
  - `GET /api/init` — today's souls, memo, streak, rank, prior submission.
  - `POST /api/submit` — file 5 verdicts (one submission per user per day).
  - `GET /api/consensus` — live community vote percentages.
- **Shared:** `src/shared/game.ts` — the content bank (deaths, names,
  details, memos), deterministic daily generator (mulberry32 seeded by UTC
  date), scoring and rank logic. The same code runs on client and server, so
  the daily batch is identical everywhere.
- **Storage:** Redis (declared in `devvit.json` permissions) — per-day vote
  aggregates, per-user submissions, streaks, and lifetime points. All keys
  are scoped per subreddit install.

## Commands

- `npm run dev` — playtest on Reddit (`devvit playtest`).
- `npm run build` — build client and server.
- `npm run test:types` — TypeScript check.
- `npm run test:unit` — unit tests for the shared game logic (10 tests).
- `npm run lint` — ESLint.
- `npm run deploy` — type-check + lint + `devvit upload`.
- `npm run login` — log the Devvit CLI into Reddit.

## Deploy notes (hackathon)

- The app must be **uploaded, not published**: after `devvit upload`, open
  `developers.reddit.com/apps/soul-not-found-404` and click **Update** under
  "My Installations", or the test subreddit keeps running the old version.
- The demo post lives in a public subreddit with fewer than 200 members.
  Create it from the subreddit menu ("Create Error 404 post") or let the
  install trigger create the first one.

## Credits

Built for Reddit's Game of the Day Hackathon by Ahmad Jalaludin AB
([Devpost](https://devpost.com/0xbhanu)). Template: the official
`reddit/devvit-template-react`.
