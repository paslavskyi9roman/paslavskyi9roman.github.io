import type { SceneClue } from '@/game/content/case001-bilingual';
import type { Clue, NpcStatement } from '@/types/game';

interface AvailabilityContext {
  discoveredClues: ReadonlyArray<Clue>;
  recordedStatements: ReadonlyArray<NpcStatement>;
  discoveredClueIds?: ReadonlySet<string>;
  recordedStatementIds?: ReadonlySet<string>;
}

export const isSceneClueAvailable = (
  clue: SceneClue,
  { discoveredClues, recordedStatements, discoveredClueIds, recordedStatementIds }: AvailabilityContext,
): boolean => {
  if (!clue.requires) return true;
  const { clueIds, statementIds } = clue.requires;
  const clueIdSet = discoveredClueIds ?? new Set(discoveredClues.map((discoveredClue) => discoveredClue.id));
  const statementIdSet = recordedStatementIds ?? new Set(recordedStatements.map((statement) => statement.id));
  if (clueIds && clueIds.length > 0) {
    if (!clueIds.every((id) => clueIdSet.has(id))) {
      return false;
    }
  }
  if (statementIds && statementIds.length > 0) {
    if (!statementIds.every((id) => statementIdSet.has(id))) {
      return false;
    }
  }
  return true;
};
