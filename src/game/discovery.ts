import type { SceneClue } from '@/game/content/case001-bilingual';
import type { Clue, NpcStatement } from '@/types/game';

interface AvailabilityContext {
  discoveredClues: ReadonlyArray<Clue>;
  recordedStatements: ReadonlyArray<NpcStatement>;
}

export const isSceneClueAvailable = (
  clue: SceneClue,
  { discoveredClues, recordedStatements }: AvailabilityContext,
): boolean => {
  if (!clue.requires) return true;
  const { clueIds, statementIds } = clue.requires;
  if (clueIds && clueIds.length > 0) {
    if (!clueIds.every((id) => discoveredClues.some((c) => c.id === id))) {
      return false;
    }
  }
  if (statementIds && statementIds.length > 0) {
    if (!statementIds.every((id) => recordedStatements.some((s) => s.id === id))) {
      return false;
    }
  }
  return true;
};
