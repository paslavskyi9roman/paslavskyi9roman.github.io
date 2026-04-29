import { describe, expect, it } from 'vitest';
import { isSceneClueAvailable } from './discovery';
import type { SceneClue } from '@/game/content/case001-bilingual';
import type { Clue, NpcStatement } from '@/types/game';

const baseClue: SceneClue = {
  id: 'test_clue',
  title: 'Test',
  titleEn: 'Test',
  description: '',
  descriptionEn: '',
  examinePrompt: '',
  examinePromptEn: '',
  x: 0,
  y: 0,
};

const buildClue = (overrides: Partial<SceneClue> = {}): SceneClue => ({ ...baseClue, ...overrides });

const buildStatement = (id: string): NpcStatement => ({
  id,
  npcId: 'npc_test',
  topic: 'topic',
  value: 'value',
  recordedAt: 1,
  sourceReply: 'source',
});

const buildDiscovered = (id: string): Clue => ({ id, title: 't', description: 'd' });

describe('isSceneClueAvailable', () => {
  it('returns true when no preconditions are declared', () => {
    expect(isSceneClueAvailable(baseClue, { discoveredClues: [], recordedStatements: [] })).toBe(true);
  });

  it('hides a clue when a required prior clue has not been discovered', () => {
    const clue = buildClue({ requires: { clueIds: ['a'] } });
    expect(isSceneClueAvailable(clue, { discoveredClues: [], recordedStatements: [] })).toBe(false);
  });

  it('reveals a clue once all required prior clues are present', () => {
    const clue = buildClue({ requires: { clueIds: ['a', 'b'] } });
    expect(
      isSceneClueAvailable(clue, {
        discoveredClues: [buildDiscovered('a'), buildDiscovered('b')],
        recordedStatements: [],
      }),
    ).toBe(true);
  });

  it('hides a clue when only some required clues are present', () => {
    const clue = buildClue({ requires: { clueIds: ['a', 'b'] } });
    expect(
      isSceneClueAvailable(clue, {
        discoveredClues: [buildDiscovered('a')],
        recordedStatements: [],
      }),
    ).toBe(false);
  });

  it('hides a clue when a required statement has not been recorded', () => {
    const clue = buildClue({ requires: { statementIds: ['s1'] } });
    expect(isSceneClueAvailable(clue, { discoveredClues: [], recordedStatements: [] })).toBe(false);
  });

  it('reveals a clue once the required statement has been recorded', () => {
    const clue = buildClue({ requires: { statementIds: ['s1'] } });
    expect(isSceneClueAvailable(clue, { discoveredClues: [], recordedStatements: [buildStatement('s1')] })).toBe(true);
  });

  it('requires both clue and statement preconditions when both are listed', () => {
    const clue = buildClue({ requires: { clueIds: ['a'], statementIds: ['s1'] } });
    expect(isSceneClueAvailable(clue, { discoveredClues: [buildDiscovered('a')], recordedStatements: [] })).toBe(false);
    expect(isSceneClueAvailable(clue, { discoveredClues: [], recordedStatements: [buildStatement('s1')] })).toBe(false);
    expect(
      isSceneClueAvailable(clue, {
        discoveredClues: [buildDiscovered('a')],
        recordedStatements: [buildStatement('s1')],
      }),
    ).toBe(true);
  });
});
