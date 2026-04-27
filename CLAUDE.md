# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Madrid Noir is a Next.js 16 (App Router) browser game where the player learns Spanish by interrogating suspects in a 1953 Madrid murder case. The whole front end is themed as a 1950s Spanish newsprint front page (`Diario de la Noche`).

## Commands

- `npm run dev` — Next dev server on :3000
- `npm run build` / `npm start` — production build / serve
- `npm run lint` — ESLint (Next + TS configs, with project-specific rules; see below)
- `npm run typecheck` — `tsc --noEmit` (strict, `noUnusedLocals`, `noUncheckedIndexedAccess` are on)
- `npm run format` / `format:check` — Prettier (single quotes, semi, 120 cols, trailing commas all)
- `npm test` / `npm run test:watch` — Vitest unit tests (jsdom)
- `npm run test:coverage` — Vitest with v8 coverage
- `npm run test:e2e` — Playwright e2e (boots `npm run dev` locally; `npm start` in CI)
- Run a single unit test: `npx vitest run src/store/useGameStore.test.ts` (or `-t "name"` to filter by name)
- Run a single e2e test: `npx playwright test e2e/smoke.spec.ts -g "name"`

A husky `pre-commit` hook runs `lint-staged` (prettier + `eslint --fix` on `.ts/.tsx`). CI (`.github/workflows/ci.yml`) runs format:check → lint → typecheck → unit (with coverage) → build → e2e. Keep them all green before opening PRs.

## Path alias and imports

- `@/*` resolves to `src/*` (in both `tsconfig.json` and `vitest.config.ts`).
- ESLint forbids importing `@/lib/supabase/client` from server code. The allowlist (`src/lib/supabase/client.ts` itself, `src/components/**`, `src/app/**/*.tsx`) is the only place the browser Supabase client may be imported. Server code uses `@/lib/supabase/server.ts` instead.
- Server-only modules import `'server-only'` at the top. Vitest aliases that package to `src/test/server-only-stub.ts` so server modules can be unit-tested without tripping the RSC guard — keep that alias intact when adding new test infra.

## Architecture

### Routing and i18n

- All user-facing pages live under `src/app/[locale]/...` where `locale ∈ {es, en}` (`src/i18n/config.ts`; default is `es`).
- `src/proxy.ts` is the Next.js 16 middleware (note: file is named `proxy.ts`, not `middleware.ts`). It redirects any non-localized, non-asset, non-API path to `/${defaultLocale}${path}`. When adding new top-level routes, either add them under `[locale]` or extend the `proxy.ts` skip list.
- 404s are produced by `src/app/not-found.tsx` at the root (promoted out of `[locale]` so Next returns a real 404 status — see commit `2676aff`).

### Game state — Zustand store (`src/store/useGameStore.ts`)

This is the heart of the game and the single source of truth for client-side progress. Important invariants:

- Persisted to `localStorage` under key `madrid-noir-v1` with `STORAGE_VERSION = 2`. The `partialize` allowlist controls what's persisted; the `migrate` function handles older versions. **If you add a new persisted field, bump `STORAGE_VERSION` and extend `migrate`.**
- Case lifecycle is a state machine: `briefing → investigation → accusation → resolved`. Transitions are gated:
  - `dismissBriefing` only moves `briefing → investigation`.
  - `addClue` / `recordStatement` move `investigation → accusation` once `discoveredClues.length >= 3` AND at least one contradiction exists.
  - `accuse` only fires from `accusation`; it sets `caseResolution` to `solved` (correct culprit + at least one valid supporting contradiction) or `failed`.
- Contradictions are derived, not authored ad-hoc. The lookup `CASE_001_CLUE_CONTRADICTIONS` (in `src/game/content/case001.ts`) maps `clueId → statementId[]`. `buildContradictionUpdates` runs on every `addClue`/`recordStatement`, and any new pair appends a system line to the dialogue history. When adding new clues or statements, wire the contradiction relationship through this lookup rather than coding it into a component.

### Dialogue feedback API (`src/app/api/dialogue-feedback/route.ts`)

Player-typed Spanish is graded server-side. The pipeline:

1. Validate with `DialogueRequestSchema` (Zod, in `src/lib/dialogue/schema.ts`) — bounds the size of `dialogueContext` and `userText`.
2. Rate limit via `dialogueRateLimit` (`src/lib/rate-limit.ts`) — Upstash Ratelimit (sliding window, 20/60s). **If `UPSTASH_REDIS_REST_URL`/`_TOKEN` are missing it logs a warning and fails open** (every call passes). Production deploys must have those set.
3. If `AI_API_KEY` is unset, return `deterministicFeedback(userText)` (keyword-matched mock).
4. Otherwise call `evaluateDialogueWithAnthropic` (`src/lib/dialogue/anthropic.ts`) using `claude-haiku-4-5-20251001` by default (override via `AI_MODEL`). The system prompt forces strict JSON; the response is JSON-extracted then validated against `DialogueResponseSchema`. **Any failure falls back to the deterministic mock** so the UI never breaks.

When changing the prompt or response shape, update `DialogueResponseSchema` and the Anthropic system prompt together — they must agree.

### Content

Case content (NPCs, quests, lessons, contradictions, culprit) is hard-coded in `src/game/content/case001.ts` with bilingual UI copy in `case001-bilingual.ts`. The store imports the case content directly; there's no content loader yet.

### Newsprint design system

Visual primitives live in `src/components/newsprint/` (`Masthead`, `NewsprintPhoto`, `Stamp`, `DialogueLine`, `Es` for inline ES/EN translation tooltips, etc.). Game UI panels (`BarScene`, `InterrogationPanel`, `DetectiveNotebook`, `CaseFile`, `ClueJournal`, `BriefingModal`, `AccusationOverlay`) live in `src/components/game/`. Tailwind 4 is configured via `@tailwindcss/postcss`; CSS variables like `--ink`, `--paper`, `--red-deep`, `--display` define the newsprint palette and typography (loaded from Google Fonts in the root layout).

### Logging

`src/lib/logger.ts` exports a pino logger that pretty-prints in dev and redacts auth/cookie/`AI_API_KEY`/password/token paths. Use it (not `console`) on the server.

## Environment

Optional in dev (the app degrades to "offline mock" mode), required in prod:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — without these, both Supabase clients return `null` and log a warning.
- `AI_API_KEY` (and optional `AI_MODEL`) — without this, the dialogue API uses deterministic mock feedback.
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — without these, rate limiting is disabled (fails open).
- `DEV_ALLOWED_ORIGINS` — comma-separated allowlist for `next dev` cross-origin requests (set when proxying from another host).
- `LOG_LEVEL`, `NEXT_PUBLIC_SITE_URL` — self-explanatory.
