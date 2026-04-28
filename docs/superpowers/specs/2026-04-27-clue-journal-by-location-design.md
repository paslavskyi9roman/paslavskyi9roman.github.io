# Diario del Detective — Group by location with collapsible sections

**Date:** 2026-04-27
**Component:** `src/components/game/ClueJournal.tsx`
**Status:** Approved (design)

## Problem

The Diario del Detective modal (`ClueJournal`) renders three flat columns —
Pistas Físicas, Declaraciones, Contradicciones — each of which grows
unbounded as the player progresses. By Acto III the modal scrolls and the
columns lose their thematic coherence: a clue from the bar sits next to a
clue from Argumosa with nothing connecting them.

The Cuaderno del Detective (`DetectiveNotebook`) already solved an
analogous problem for misiones using `<details>` elements with the current
location auto-expanded and past locations collapsed at reduced opacity. We
will apply the same pattern to the Diario, but as a structural change:
location becomes the top-level grouping, not the evidence type.

## Goals

- Stop the modal from growing unbounded.
- Make each location's clues, statements, and contradictions read as a unit
  ("the case file for La Sirena").
- Preserve at-a-glance global counts (4/4 pistas, etc.) that the column
  kickers currently provide.
- No data file or store changes.

## Non-goals

- Re-theming or restyling the existing card components (Pista cards,
  statement cards, contradiction cards) — they are reused unchanged.
- Adding location metadata to scene clue or NPC content files — location is
  derived from which array the item lives in.
- Changing how contradictions are detected, recorded, or scored.

## Design

### 1. New top-level structure

Replace the three-column grid (`gridTemplateColumns: '1fr 1fr 1fr'`) inside
the modal body with a vertical stack of per-location sections rendered in
`LOCATION_ORDER` (`bar_interior`, `lucia_apartment`, `argumosa_kiosk`).

Each location is a `<details>` element:

- `open` if `locationId === currentLocationId` from the store.
- Collapsed otherwise, with `opacity: 0.55` to match the
  `DetectiveNotebook` pattern.
- A location section is **omitted entirely** if it has no clues, no
  statements, and no contradictions yet — avoids showing dead headers for
  locations the player has not visited.

The `<summary>` line shows:

```
TABERNA LA SIRENA · 3 pistas · 5 declaraciones · 2 ⚡
```

Uses the same uppercase letterspaced sans label style as the notebook
location summaries. The `⚡` glyph and red color reuse the existing
contradiction styling.

### 2. Inside each location section

A vertical stack of three subsections. We deliberately do **not** nest a
3-column grid inside each location — the modal is 980px max and the cards
need that width for legibility.

1. **Pistas Físicas** — current clue card UI (border, Stamp, bilingual
   title and description). Filtered to clues whose `id` maps to this
   location.
2. **Declaraciones** — current NPC-grouped card UI (portrait, name, bullet
   list). Filtered to NPCs whose `id` maps to this location.
3. **Contradicciones** — current red `vs.` card UI. Filtered to
   contradictions whose `npcId` maps to this location.

Each subsection uses the existing kicker label and rule (`<hr className="rule">`
or `rule-thick` for contradictions). If a subsection is empty, show the
existing "Aún sin..." italic placeholder so the section's structure is
consistent.

### 3. Global counter strip

Directly under the modal header (above the location stack), a single thin
strip preserves the global counts that today's column kickers provide:

```
Pistas 3/4 · Declaraciones 5 · ⚡ 2
```

Uses the existing `byline` / `kicker` typography. This is the only place
totals appear; per-location summaries show only that location's tallies.

### 4. Location lookup maps

Two derived maps, built once at module scope (mirrors how
`STATEMENT_VALUE_EN` is built today):

```ts
const CLUE_LOCATION: Record<string, LocationId> = {
  ...Object.fromEntries(CASE_001_SCENE_CLUES.map((c) => [c.id, 'bar_interior'])),
  ...Object.fromEntries(APARTMENT_SCENE_CLUES.map((c) => [c.id, 'lucia_apartment'])),
  ...Object.fromEntries(ARGUMOSA_SCENE_CLUES.map((c) => [c.id, 'argumosa_kiosk'])),
};

const NPC_LOCATION: Record<string, LocationId> = {
  ...Object.fromEntries(Object.keys(NPC_OUTCOMES).map((id) => [id, 'bar_interior'])),
  ...Object.fromEntries(Object.keys(APARTMENT_NPC_OUTCOMES).map((id) => [id, 'lucia_apartment'])),
  ...Object.fromEntries(Object.keys(ARGUMOSA_NPC_OUTCOMES).map((id) => [id, 'argumosa_kiosk'])),
};
```

These live alongside `STATEMENT_VALUE_EN` in `ClueJournal.tsx`. No new
files, no changes to `case001*.ts` content modules.

A clue or NPC missing from these maps (defensive) is hidden from the
location view and logged once via `console.warn` in dev. We do not invent
a fallback location.

### 5. Hotel Atocha "Persona de interés" card

The "Identidad desconocida / hombre del abrigo gris" card appears today
under Pistas when `apt_clue_grey_coat` has been discovered. It moves
inside the **`lucia_apartment`** location section, rendered after that
section's clue cards, since `apt_clue_grey_coat` is what triggers it. We
do not create a fourth pseudo-location for the Hotel Atocha thread.

### 6. Empty-state behavior

- All three subsections empty across all locations → keep the modal
  structure; the location stack renders nothing; the global counter strip
  shows zeros. No special "you have nothing yet" copy needed beyond what
  already exists in subsection placeholders. (In practice the modal isn't
  reachable until the player has at least one clue, so this is theoretical.)
- A location section is shown only if it has at least one item somewhere
  across the three subsections (see §1).

### 7. What stays unchanged

- Modal chrome: `role="dialog"`, `aria-modal`, masthead, Cerrar button,
  92vh max height with overflow scroll.
- Card components and styling (Stamp, red border, bilingual `Es` reveal).
- The `STATEMENT_VALUE_EN` map and its construction.
- `useGameStore` selectors used today — same five (`discoveredClues`,
  `recordedStatements`, `contradictions`, `npcs`, plus the new read of
  `currentLocationId`).
- All `case001*.ts` content modules and bilingual maps.

## Component sketch

Pseudocode for clarity, not the final code:

```tsx
const counts = {
  clues: discoveredClues.length,
  totalSceneClues: ALL_SCENE_CLUES.length,
  statements: recordedStatements.length,
  contradictions: contradictions.length,
};

const cluesByLocation = groupBy(discoveredClues, (c) => CLUE_LOCATION[c.id]);
const statementsByLocation = groupBy(recordedStatements, (s) => NPC_LOCATION[s.npcId]);
const contradictionsByLocation = groupBy(contradictions, (c) => NPC_LOCATION[c.npcId]);

return (
  <Modal>
    <Header />
    <CounterStrip {...counts} />
    {LOCATION_ORDER.map((locId) => {
      const locClues = cluesByLocation[locId] ?? [];
      const locStatements = statementsByLocation[locId] ?? [];
      const locContradictions = contradictionsByLocation[locId] ?? [];
      if (!locClues.length && !locStatements.length && !locContradictions.length) return null;
      const isCurrent = locId === currentLocationId;
      return (
        <details key={locId} open={isCurrent} style={{ opacity: isCurrent ? 1 : 0.55 }}>
          <summary>{locationSummaryLine(locId, locClues, locStatements, locContradictions)}</summary>
          <CluesSubsection clues={locClues} locationId={locId} />
          <StatementsSubsection statements={locStatements} />
          <ContradictionsSubsection contradictions={locContradictions} />
        </details>
      );
    })}
  </Modal>
);
```

## Testing

Existing unit tests under `src/store/` continue to pass without changes
since the store is untouched. For the component itself, no tests exist
today; this design does not add new ones. If the component grows large
enough to warrant testing later (e.g. when adding more locations), the
location lookup maps are pure and easily testable in isolation.

## Risks and considerations

- **Lost cross-location scan.** Today the contradictions column shows all
  ⚡ in one place, useful for the "do I have enough to accuse?" check. The
  global counter strip preserves the count; the player loses the ability
  to read all contradictions in a single glance. Acceptable trade — by the
  time the player has many contradictions they're likely focused on the
  current scene anyway, and the AccusationOverlay is the place that
  presents them all together.
- **Vertical scroll within a single open location.** The 92vh modal +
  overflow scroll already handles this. Collapsing past locations means
  scroll is shorter than today, not longer.
- **Persona de interés placement.** Putting it under `lucia_apartment` is
  a judgement call. If the Hotel Atocha thread later becomes its own
  location, this card moves there — a one-line edit.
