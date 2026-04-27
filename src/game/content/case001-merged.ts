/**
 * Merged outcomes & bilingual replies across all locations of case 001.
 * Quick-reply text is unique per location, so a flat per-NPC merge is safe:
 * the InterrogationPanel can resolve outcomes regardless of where the
 * detective is currently questioning the witness.
 */

import { NPC_OUTCOMES } from '@/game/content/case001';
import { CASE_001_BILINGUAL_NPCS, CASE_001_BILINGUAL_REPLIES } from '@/game/content/case001-bilingual';
import { APARTMENT_BILINGUAL_NPCS, APARTMENT_BILINGUAL_REPLIES } from '@/game/content/case001-apartment-bilingual';
import { APARTMENT_NPC_OUTCOMES } from '@/game/content/case001-apartment';
import type { LocationId } from '@/game/content/locations';

type Outcomes = typeof NPC_OUTCOMES;

const mergeOutcomes = (...maps: Outcomes[]): Outcomes => {
  const out: Outcomes = {};
  for (const map of maps) {
    for (const [npcId, replies] of Object.entries(map)) {
      out[npcId] = { ...(out[npcId] ?? {}), ...replies };
    }
  }
  return out;
};

export const ALL_NPC_OUTCOMES: Outcomes = mergeOutcomes(NPC_OUTCOMES, APARTMENT_NPC_OUTCOMES);

export const ALL_BILINGUAL_REPLIES: typeof CASE_001_BILINGUAL_REPLIES = (() => {
  const out: typeof CASE_001_BILINGUAL_REPLIES = {};
  for (const [npcId, replies] of Object.entries(CASE_001_BILINGUAL_REPLIES)) {
    out[npcId] = { ...replies };
  }
  for (const [npcId, replies] of Object.entries(APARTMENT_BILINGUAL_REPLIES)) {
    out[npcId] = { ...(out[npcId] ?? {}), ...replies };
  }
  return out;
})();

/**
 * Bilingual NPC lookup that respects the active location. The apartment
 * provides override opening lines and tagline copy for the same NPC ids.
 */
export const getBilingualNpc = (npcId: string, locationId: LocationId) => {
  const base = CASE_001_BILINGUAL_NPCS[npcId];
  if (!base) return undefined;
  if (locationId === 'lucia_apartment') {
    const override = APARTMENT_BILINGUAL_NPCS[npcId];
    if (override) return { ...base, ...override };
  }
  return base;
};

/**
 * Identifies whether a given statement was produced from an apartment-only
 * quick reply. Used by the InterrogationPanel to award the apartment quest
 * (q5) when the suspect contradicts herself there.
 */
export const APARTMENT_STATEMENT_IDS = new Set<string>(
  Object.values(APARTMENT_NPC_OUTCOMES)
    .flatMap((replies) => Object.values(replies))
    .map((r) => r.statement?.id)
    .filter((id): id is string => Boolean(id)),
);
