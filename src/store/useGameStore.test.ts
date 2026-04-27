import { beforeEach, describe, expect, it } from 'vitest';
import { useGameStore } from './useGameStore';

const resetStore = () => {
  useGameStore.persist.clearStorage();
  useGameStore.setState({
    completedQuestIds: [],
    dialogueHistory: [],
    discoveredClues: [],
    vocabularyXp: 0,
    grammarXp: 0,
    investigationXp: 0,
    latestFeedback: null,
  });
};

describe('useGameStore', () => {
  beforeEach(() => {
    resetStore();
  });

  it('deduplicates clues by id', () => {
    const { addClue } = useGameStore.getState();
    addClue({ id: 'clue_a', title: 'A', description: 'first' });
    addClue({ id: 'clue_a', title: 'A duplicate', description: 'ignored' });
    addClue({ id: 'clue_b', title: 'B', description: 'second' });
    expect(useGameStore.getState().discoveredClues).toHaveLength(2);
    expect(useGameStore.getState().discoveredClues.map((c) => c.id)).toEqual(['clue_a', 'clue_b']);
  });

  it('does not double-complete a quest', () => {
    const { completeQuest } = useGameStore.getState();
    completeQuest('q1');
    completeQuest('q1');
    expect(useGameStore.getState().completedQuestIds).toEqual(['q1']);
  });

  it('routes XP into the requested track only', () => {
    const { applyFeedback } = useGameStore.getState();
    applyFeedback({ isUnderstandable: true, xpAwarded: 10 }, 'vocabulary');
    applyFeedback({ isUnderstandable: true, xpAwarded: 4 }, 'grammar');
    applyFeedback({ isUnderstandable: true, xpAwarded: 7 }, 'investigation');
    const state = useGameStore.getState();
    expect(state.vocabularyXp).toBe(10);
    expect(state.grammarXp).toBe(4);
    expect(state.investigationXp).toBe(7);
    expect(state.latestFeedback?.xpAwarded).toBe(7);
  });

  it('persists progress to localStorage and rehydrates partialized fields', () => {
    const { addClue, completeQuest, applyFeedback } = useGameStore.getState();
    addClue({ id: 'clue_persist', title: 'persisted', description: '' });
    completeQuest('q9');
    applyFeedback({ isUnderstandable: true, xpAwarded: 6 }, 'investigation');

    const storageRaw = localStorage.getItem('madrid-noir-v1');
    expect(storageRaw).toBeTruthy();
    const parsed = JSON.parse(storageRaw!) as { state: Record<string, unknown> };
    expect(parsed.state.investigationXp).toBe(6);
    expect(parsed.state).not.toHaveProperty('selectedNpc');
    expect(parsed.state).not.toHaveProperty('latestFeedback');
    expect(parsed.state.discoveredClues).toEqual([{ id: 'clue_persist', title: 'persisted', description: '' }]);
  });
});
