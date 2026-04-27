# Madrid Noir (MVP Foundation)

Madrid Noir is a browser-based 2D detective RPG where Spanish is the core gameplay mechanic: investigate scenes, interrogate suspects, and gain language + investigation XP.

## Stack

- Next.js (App Router)
- React + TypeScript (strict)
- Zustand (local game state)
- Supabase JS client (auth/data-ready setup)
- Tailwind CSS + custom newsprint design system (1950s Spanish front page)

## Routes

- `/` — landing page
- `/game` — playable MVP scene
- `/dashboard` — local progress placeholder
- `/login` — auth placeholder
- `/api/dialogue-feedback` — server endpoint for dialogue evaluation

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env vars:
   ```bash
   cp .env.example .env.local
   ```
3. Run development server:
   ```bash
   npm run dev
   ```

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL` (optional for MVP)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional for MVP)
- `AI_API_KEY` (optional; when absent, API returns deterministic mock feedback)

> Supabase is optional for this MVP. If env vars are missing, app runs in offline mode and logs a warning.

## MVP currently works

- Newsprint-styled landing page (Diario de la Noche front page) with hover-translate Spanish phrases.
- `/game` renders the Lavapiés bar interior as a halftone newspaper photograph with:
  - clickable red clue dots overlaid on the scene
  - three-column newspaper layout (HUD · scene + interrogation · case file)
  - NPC tabs (Lucía, Diego, Inspectora Ruiz) with Spanish quick replies
  - free-form Spanish input that posts to `/api/dialogue-feedback`
- Briefing telegram, clue journal evidence board, and verdict edition modals.
- Deterministic feedback + XP award flow.
- Zustand store tracks:
  - vocabulary XP
  - grammar XP
  - investigation XP
  - current case ID
  - discovered clues
  - dialogue history
  - recorded statements + auto-detected contradictions

## Mocked / placeholder behavior

- AI provider integration is server-side placeholder when `AI_API_KEY` exists.
- Supabase auth/session persistence is not wired yet.
- Database draft schema is in `supabase/schema.sql` with RLS placeholders.

## Next implementation steps

1. Replace deterministic feedback with a real OpenAI-compatible provider on the server.
2. Add Supabase Auth on `/login` and persist save/progress data.
3. Expand investigation interactions (movement, hotspot triggers, clue journal).
4. Add multi-NPC contradiction logic and case resolution states.
5. Add content tooling for Spanish difficulty progression.
