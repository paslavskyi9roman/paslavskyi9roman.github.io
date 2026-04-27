# Clue Journal By-Location Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the Diario del Detective modal (`ClueJournal.tsx`) from three flat columns into a vertical stack of per-location collapsible sections, mirroring the misiones pattern in `DetectiveNotebook.tsx`.

**Architecture:** Single-file change. Add two derived `clueId → LocationId` and `npcId → LocationId` maps at module scope, plus a new `currentLocationId` selector. Replace the modal's three-column body with a per-location `<details>` stack containing nested Pistas / Declaraciones / Contradicciones subsections. A new global counter strip preserves the at-a-glance totals that the column kickers provide today.

**Tech Stack:** Next.js 16 App Router, React, TypeScript, Zustand, inline styles (no Tailwind in this component). Vitest unit tests, Playwright e2e (neither covers this component today; verification is by typecheck + lint + dev server smoke test).

**Spec:** `docs/superpowers/specs/2026-04-27-clue-journal-by-location-design.md`

---

## File Structure

- **Modify:** `src/components/game/ClueJournal.tsx` — only file touched.
- **No new files.** No store changes. No content/data changes.

The component already collects helpers at module scope (`ALL_SCENE_CLUES`, `STATEMENT_VALUE_EN`); we add `CLUE_LOCATION` and `NPC_LOCATION` next to them.

## Verification approach

There are no unit tests for `ClueJournal` today and the spec explicitly does not add any (location lookup maps are the only pure logic and would be testing TypeScript object spreads). Verification is:

1. `npm run typecheck` — must pass.
2. `npm run lint` — must pass.
3. `npm run dev` — open the game, advance to a state with at least two locations' worth of evidence, open the Diario, eyeball: current location open, others collapsed at reduced opacity, counter strip totals correct, persona-de-interés card under apartment when `apt_clue_grey_coat` is present.

If the engineer cannot reach a multi-location game state quickly, they may temporarily seed `localStorage` under the `madrid-noir-v1` key (`STORAGE_VERSION = 2`) — but typecheck + lint are the hard gates.

---

## Task 1: Add location lookup maps and selector

**Files:**

- Modify: `src/components/game/ClueJournal.tsx`

This task adds derived data only — no UI change. The component still renders the old three-column layout afterwards. Splitting the data plumbing from the render rewrite keeps the diff readable.

- [ ] **Step 1: Add `LocationId` import and the two new lookup maps**

At the top of `ClueJournal.tsx`, add the `LocationId` import alongside the existing imports:

```ts
import type { LocationId } from '@/game/content/locations';
import { LOCATIONS, LOCATION_ORDER } from '@/game/content/locations';
```

(`LOCATIONS` and `LOCATION_ORDER` are not imported today — add them. They live in `src/game/content/locations.ts`.)

Then, immediately after the existing `STATEMENT_VALUE_EN` IIFE block (around line 37 in the current file), add:

```ts
const CLUE_LOCATION: Record<string, LocationId> = {
  ...Object.fromEntries(CASE_001_SCENE_CLUES.map((c) => [c.id, 'bar_interior' as LocationId])),
  ...Object.fromEntries(APARTMENT_SCENE_CLUES.map((c) => [c.id, 'lucia_apartment' as LocationId])),
  ...Object.fromEntries(ARGUMOSA_SCENE_CLUES.map((c) => [c.id, 'argumosa_kiosk' as LocationId])),
};

const NPC_LOCATION: Record<string, LocationId> = {
  ...Object.fromEntries(Object.keys(NPC_OUTCOMES).map((id) => [id, 'bar_interior' as LocationId])),
  ...Object.fromEntries(Object.keys(APARTMENT_NPC_OUTCOMES).map((id) => [id, 'lucia_apartment' as LocationId])),
  ...Object.fromEntries(Object.keys(ARGUMOSA_NPC_OUTCOMES).map((id) => [id, 'argumosa_kiosk' as LocationId])),
};
```

- [ ] **Step 2: Add the `currentLocationId` selector**

In the `ClueJournal` function body, alongside the existing `useGameStore` selector calls, add:

```ts
const currentLocationId = useGameStore((state) => state.currentLocationId);
```

The store already exposes `currentLocationId: LocationId` (verified in `src/store/useGameStore.ts:39`). No store changes needed.

- [ ] **Step 3: Run typecheck and lint**

```bash
npm run typecheck
npm run lint
```

Expected: both pass with no new errors. (`currentLocationId` is unused at this point, but TS strict's `noUnusedLocals` does not flag local consts inside React components — only top-level. If lint _does_ flag it via `@typescript-eslint/no-unused-vars`, suppress with a `// eslint-disable-next-line` comment scoped to that line, marked TODO-remove-in-task-2.)

- [ ] **Step 4: Commit**

```bash
git add src/components/game/ClueJournal.tsx
git commit -m "refactor(clue-journal): add location lookup maps and currentLocationId selector"
```

---

## Task 2: Replace render body with per-location stack

**Files:**

- Modify: `src/components/game/ClueJournal.tsx`

This is the user-visible change.

- [ ] **Step 1: Replace the existing per-NPC reduce with per-location grouping**

Find the existing block (around the current line 54):

```ts
const statementsByNpc = recordedStatements.reduce<Record<string, typeof recordedStatements>>((acc, statement) => {
  (acc[statement.npcId] ??= []).push(statement);
  return acc;
}, {});

const sceneClueLookup = new Map(ALL_SCENE_CLUES.map((clue) => [clue.id, clue]));
```

Replace it with:

```ts
const sceneClueLookup = new Map(ALL_SCENE_CLUES.map((clue) => [clue.id, clue]));

const cluesByLocation = discoveredClues.reduce<Record<string, typeof discoveredClues>>((acc, clue) => {
  const locId = CLUE_LOCATION[clue.id];
  if (!locId) return acc;
  (acc[locId] ??= []).push(clue);
  return acc;
}, {});

const statementsByNpc = recordedStatements.reduce<Record<string, typeof recordedStatements>>((acc, statement) => {
  (acc[statement.npcId] ??= []).push(statement);
  return acc;
}, {});

const statementsByLocation = recordedStatements.reduce<Record<string, typeof recordedStatements>>((acc, statement) => {
  const locId = NPC_LOCATION[statement.npcId];
  if (!locId) return acc;
  (acc[locId] ??= []).push(statement);
  return acc;
}, {});

const contradictionsByLocation = contradictions.reduce<Record<string, typeof contradictions>>((acc, c) => {
  const locId = NPC_LOCATION[c.npcId];
  if (!locId) return acc;
  (acc[locId] ??= []).push(c);
  return acc;
}, {});
```

We keep `statementsByNpc` because the Declaraciones subsection still groups by NPC inside each location.

- [ ] **Step 2: Add the global counter strip JSX**

In the modal body, between the existing header `<div>` (which ends with the `Cerrar` button block) and the existing `<div style={{ padding: 22, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 22 }}>` body, insert:

```tsx
<div
  style={{
    display: 'flex',
    gap: 16,
    padding: '8px 22px',
    borderBottom: '1px solid var(--ink)',
    fontFamily: 'var(--sans)',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  }}
>
  <span>
    <Es es="Pistas" en="Clues" /> {discoveredClues.length}/{totalSceneClues}
  </span>
  <span aria-hidden>·</span>
  <span>
    <Es es="Declaraciones" en="Statements" /> {recordedStatements.length}
  </span>
  <span aria-hidden>·</span>
  <span style={{ color: 'var(--red-deep)' }}>
    ⚡ <Es es="Contradicciones" en="Contradictions" /> {contradictions.length}
  </span>
</div>
```

- [ ] **Step 3: Replace the three-column body with the per-location stack**

Delete the entire block that starts with:

```tsx
<div
  style={{
    padding: 22,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 22,
  }}
>
  <section>
    <span className="kicker">
      <Es es="Pistas Físicas" en="Physical Evidence" /> · {discoveredClues.length}/{totalSceneClues}
    </span>
    ...
  </section>
  <section> ... Declaraciones ... </section>
  <section> ... Contradicciones ... </section>
</div>
```

…and replace it with the per-location stack:

```tsx
<div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
  {LOCATION_ORDER.map((locId) => {
    const locClues = cluesByLocation[locId] ?? [];
    const locStatements = statementsByLocation[locId] ?? [];
    const locContradictions = contradictionsByLocation[locId] ?? [];
    if (locClues.length === 0 && locStatements.length === 0 && locContradictions.length === 0) {
      return null;
    }
    const isCurrent = locId === currentLocationId;
    const loc = LOCATIONS[locId];
    const summary = (
      <span
        style={{
          fontFamily: 'var(--sans)',
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        <Es es={loc.name.es} en={loc.name.en} />
        {' · '}
        {locClues.length} <Es es="pistas" en="clues" />
        {' · '}
        {locStatements.length} <Es es="decl." en="stmts" />
        {locContradictions.length > 0 && (
          <>
            {' · '}
            <span style={{ color: 'var(--red-deep)' }}>{locContradictions.length} ⚡</span>
          </>
        )}
      </span>
    );

    const body = (
      <div style={{ padding: '12px 0 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Pistas Físicas */}
        <section>
          <span className="kicker">
            <Es es="Pistas Físicas" en="Physical Evidence" />
          </span>
          <hr className="rule" style={{ marginTop: 4 }} />
          {locClues.length === 0 ? (
            <p className="body-serif" style={{ fontStyle: 'italic', color: 'var(--ink-faded)' }}>
              <Es es="Aún sin pruebas físicas." en="No physical evidence yet." />
            </p>
          ) : (
            locClues.map((clue) => {
              const scene = sceneClueLookup.get(clue.id);
              return (
                <div
                  key={clue.id}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid var(--ink)',
                    background: 'var(--paper)',
                    marginTop: 10,
                    position: 'relative',
                  }}
                >
                  <Stamp
                    rotate={-4}
                    style={{ position: 'absolute', top: -10, right: -8, fontSize: 9, padding: '3px 8px' }}
                  >
                    <Es es="Prueba" en="Evidence" />
                  </Stamp>
                  <div style={{ fontFamily: 'var(--display)', fontSize: 15, fontWeight: 800 }}>
                    {scene ? <Es es={clue.title} en={scene.titleEn} /> : clue.title}
                  </div>
                  <p className="body-serif" style={{ fontSize: 12, marginTop: 4 }}>
                    {scene ? <Es es={clue.description} en={scene.descriptionEn} /> : clue.description}
                  </p>
                </div>
              );
            })
          )}
          {locId === 'lucia_apartment' && discoveredClues.some((c) => c.id === 'apt_clue_grey_coat') && (
            <div
              style={{
                marginTop: 14,
                padding: '10px 12px',
                border: '1px dashed var(--ink)',
                background: 'var(--paper-shadow)',
                position: 'relative',
              }}
            >
              <Stamp
                rotate={-3}
                color="red"
                style={{ position: 'absolute', top: -10, right: -8, fontSize: 9, padding: '3px 8px' }}
              >
                <Es es="Persona de interés" en="Person of interest" />
              </Stamp>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/characters/npc_hotel_atocha_man.png"
                  alt="Sospechoso sin identificar"
                  width={56}
                  height={72}
                  style={{ objectFit: 'cover', filter: 'sepia(0.4) contrast(1.2)' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--display)', fontSize: 14, fontWeight: 800 }}>
                    <Es es="Identidad desconocida" en="Unknown identity" />
                  </div>
                  <p className="body-serif" style={{ fontSize: 12, marginTop: 4 }}>
                    <Es
                      es="Hombre del abrigo gris · Hotel Atocha. Anillo de sello, manos cuidadas."
                      en="The man in the grey coat · Hotel Atocha. Signet ring, well-kept hands."
                    />
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Declaraciones */}
        <section>
          <span className="kicker">
            <Es es="Declaraciones" en="Statements" />
          </span>
          <hr className="rule" style={{ marginTop: 4 }} />
          {locStatements.length === 0 ? (
            <p className="body-serif" style={{ fontStyle: 'italic', color: 'var(--ink-faded)' }}>
              <Es es="Aún sin declaraciones registradas." en="No statements recorded yet." />
            </p>
          ) : (
            (() => {
              const grouped = locStatements.reduce<Record<string, typeof locStatements>>((acc, s) => {
                (acc[s.npcId] ??= []).push(s);
                return acc;
              }, {});
              return Object.entries(grouped).map(([npcId, list]) => {
                const npc = npcs.find((n) => n.id === npcId);
                const portrait = CASE_001_BILINGUAL_NPCS[npcId]?.portrait ?? `/assets/characters/${npcId}.png`;
                return (
                  <div
                    key={npcId}
                    style={{
                      marginTop: 10,
                      padding: 10,
                      border: '1px solid var(--ink)',
                      background: 'var(--paper)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={portrait}
                        alt={npc?.name ?? npcId}
                        width={28}
                        height={36}
                        style={{ objectFit: 'cover', filter: 'sepia(0.4) contrast(1.2)' }}
                      />
                      <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 14 }}>
                        {npc?.name ?? npcId}
                      </div>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0' }}>
                      {list.map((s) => (
                        <li
                          key={s.id}
                          className="body-serif"
                          style={{ fontSize: 12, padding: '4px 0', borderBottom: '1px dotted var(--ink-faded)' }}
                        >
                          <span className="byline" style={{ fontSize: 9 }}>
                            [{s.topic}]
                          </span>{' '}
                          {STATEMENT_VALUE_EN[s.id] ? <Es es={s.value} en={STATEMENT_VALUE_EN[s.id]!} /> : s.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              });
            })()
          )}
        </section>

        {/* Contradicciones */}
        <section>
          <span className="kicker" style={{ color: 'var(--red)' }}>
            ⚡ <Es es="Contradicciones" en="Contradictions" />
          </span>
          <hr className="rule-thick" style={{ marginTop: 4, borderTopColor: 'var(--red)' }} />
          {locContradictions.length === 0 ? (
            <p className="body-serif" style={{ fontStyle: 'italic', color: 'var(--ink-faded)' }}>
              <Es es="Sin grietas detectadas. Aún." en="No cracks detected. Yet." />
            </p>
          ) : (
            locContradictions.map((c) => {
              const clue = discoveredClues.find((x) => x.id === c.clueId);
              const clueScene = sceneClueLookup.get(c.clueId);
              const stmt = recordedStatements.find((x) => x.id === c.statementId);
              const stmtEn = STATEMENT_VALUE_EN[c.statementId];
              const npc = npcs.find((x) => x.id === c.npcId);
              return (
                <div
                  key={c.id}
                  style={{
                    marginTop: 10,
                    padding: 12,
                    border: '2px solid var(--red)',
                    background: 'rgba(164, 24, 24, 0.05)',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{ fontFamily: 'var(--display)', fontSize: 14, fontWeight: 800, color: 'var(--red-deep)' }}
                  >
                    <Es es="vs." en="vs." /> {npc?.name ?? c.npcId}
                  </div>
                  <div className="body-serif" style={{ fontSize: 12, marginTop: 6 }}>
                    <strong>
                      <Es es="Pista:" en="Clue:" />
                    </strong>{' '}
                    {clue && clueScene ? <Es es={clue.title} en={clueScene.titleEn} /> : (clue?.title ?? c.clueId)}
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      margin: '6px 0',
                      fontFamily: 'var(--display)',
                      fontSize: 18,
                      fontStyle: 'italic',
                      color: 'var(--red-deep)',
                    }}
                  >
                    ↯
                  </div>
                  <div className="body-serif" style={{ fontSize: 12 }}>
                    <strong>
                      <Es es="Declaración:" en="Statement:" />
                    </strong>{' '}
                    {stmt && stmtEn ? <Es es={stmt.value} en={stmtEn} /> : (stmt?.value ?? c.statementId)}
                  </div>
                </div>
              );
            })
          )}
        </section>
      </div>
    );

    if (isCurrent) {
      return (
        <div key={locId} style={{ borderTop: '2px solid var(--ink)', paddingTop: 10 }}>
          <div style={{ padding: '4px 0' }}>{summary}</div>
          {body}
        </div>
      );
    }
    return (
      <details key={locId} style={{ borderTop: '1px solid var(--ink)', paddingTop: 8, opacity: 0.55 }}>
        <summary style={{ cursor: 'pointer', padding: '4px 0', listStyle: 'revert' }}>{summary}</summary>
        {body}
      </details>
    );
  })}
  {discoveredClues.length === 0 && recordedStatements.length === 0 && contradictions.length === 0 && (
    <p className="body-serif" style={{ fontStyle: 'italic', color: 'var(--ink-faded)', padding: 8 }}>
      <Es es="El cuaderno aún está en blanco." en="The notebook is still blank." />
    </p>
  )}
</div>
```

This mirrors the `DetectiveNotebook.tsx:128-141` pattern — current location uses a plain `<div>` (always-visible), other locations use `<details>` at 0.55 opacity. The Hotel Atocha persona-de-interés card moves inside the `lucia_apartment` Pistas subsection per spec §5.

- [ ] **Step 4: Verify no orphaned `statementsByNpc`**

Search the file for `statementsByNpc`:

```bash
grep -n statementsByNpc src/components/game/ClueJournal.tsx
```

It's only used in the (now-deleted) old Declaraciones column. The new code groups inline inside the location section. Remove the `statementsByNpc` declaration from the Step 1 block. Final state of the grouping block:

```ts
const sceneClueLookup = new Map(ALL_SCENE_CLUES.map((clue) => [clue.id, clue]));

const cluesByLocation = discoveredClues.reduce<Record<string, typeof discoveredClues>>((acc, clue) => {
  const locId = CLUE_LOCATION[clue.id];
  if (!locId) return acc;
  (acc[locId] ??= []).push(clue);
  return acc;
}, {});

const statementsByLocation = recordedStatements.reduce<Record<string, typeof recordedStatements>>((acc, statement) => {
  const locId = NPC_LOCATION[statement.npcId];
  if (!locId) return acc;
  (acc[locId] ??= []).push(statement);
  return acc;
}, {});

const contradictionsByLocation = contradictions.reduce<Record<string, typeof contradictions>>((acc, c) => {
  const locId = NPC_LOCATION[c.npcId];
  if (!locId) return acc;
  (acc[locId] ??= []).push(c);
  return acc;
}, {});
```

- [ ] **Step 5: Run typecheck and lint**

```bash
npm run typecheck
npm run lint
```

Expected: both pass. If `noUnusedLocals` flags `totalSceneClues`, confirm it's still used by the counter strip (it should be — `Pistas {discoveredClues.length}/{totalSceneClues}`).

- [ ] **Step 6: Visual smoke test**

Start the dev server:

```bash
npm run dev
```

In the browser at `http://localhost:3000`:

1. Play through enough of the game to reach `lucia_apartment` and discover at least one clue there. (Or seed `localStorage` directly under key `madrid-noir-v1` if faster — the engineer should `JSON.parse` the existing value, add entries, and reload.)
2. Open the Diario del Detective.
3. Verify:
   - Counter strip below the header shows `Pistas X/4 · Declaraciones Y · ⚡ Z`.
   - The current location section is open, with no `<details>` chevron, at full opacity.
   - Past locations appear as `<details>` rows at 0.55 opacity, collapsed by default, expand on click.
   - Future locations (no items yet) are not rendered.
   - If `apt_clue_grey_coat` is in the discovered clues, the persona-de-interés card appears under the apartment Pistas subsection (not under any other location).
   - Bilingual `Es` reveal on hover/tap still works on summaries and contents.

If anything looks off, fix inline and re-verify before committing.

- [ ] **Step 7: Commit**

```bash
git add src/components/game/ClueJournal.tsx
git commit -m "feat(clue-journal): group evidence by location with collapsible sections"
```

---

## Self-review

**Spec coverage:**

- §1 Structure (per-location `<details>` stack, current open, others collapsed at 0.55, omit empty): Task 2 Step 3.
- §2 Inside each location (vertical stack of three subsections, "Aún sin..." placeholders): Task 2 Step 3.
- §3 Global counter strip: Task 2 Step 2.
- §4 Location lookup maps: Task 1 Step 1.
- §5 Persona-de-interés in apartment section: Task 2 Step 3, conditional `locId === 'lucia_apartment' && discoveredClues.some(...)`.
- §6 Empty-state behavior: Task 2 Step 3, "El cuaderno aún está en blanco." catch-all + per-section "Aún sin..." italic.
- §7 What stays unchanged: modal chrome, card components, store selectors, `STATEMENT_VALUE_EN` — all untouched.

**Placeholder scan:** No TBD/TODO/"add error handling"/"similar to". Every code block is complete.

**Type consistency:** `LocationId` imported once and used as the value type for both maps and the cast. `currentLocationId` selector matches the store's typed field. Group helper return types use `typeof discoveredClues` / `typeof recordedStatements` / `typeof contradictions` — same idiom as the existing `statementsByNpc` reducer.

**One soft spot worth flagging during execution:** `<summary>` elements inside a flex/uppercase context can render the disclosure triangle awkwardly. The plan uses `listStyle: 'revert'` to keep the native triangle. If it looks wrong on macOS Safari, the existing notebook code uses the default with no override and looks fine — fall back to deleting the `listStyle` line.
