import { create } from 'zustand';
import { Clue, DialogueFeedback, DialogueMessage, NpcProfile } from '@/types/game';

interface GameState {
  currentCaseId: string;
  selectedNpc: NpcProfile | null;
  dialogueHistory: DialogueMessage[];
  discoveredClues: Clue[];
  vocabularyXp: number;
  grammarXp: number;
  investigationXp: number;
  latestFeedback: DialogueFeedback | null;
  startNpcDialogue: (npc: NpcProfile) => void;
  addPlayerLine: (text: string) => void;
  addNpcLine: (text: string) => void;
  addClue: (clue: Clue) => void;
  applyFeedback: (feedback: DialogueFeedback, xpType: 'vocabulary' | 'grammar' | 'investigation') => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentCaseId: 'case_001',
  selectedNpc: null,
  dialogueHistory: [],
  discoveredClues: [],
  vocabularyXp: 0,
  grammarXp: 0,
  investigationXp: 0,
  latestFeedback: null,
  startNpcDialogue: (npc) =>
    set({
      selectedNpc: npc,
      dialogueHistory: [{ speaker: 'npc', text: npc.openingLine, timestamp: Date.now() }],
    }),
  addPlayerLine: (text) =>
    set((state) => ({
      dialogueHistory: [...state.dialogueHistory, { speaker: 'player', text, timestamp: Date.now() }],
    })),
  addNpcLine: (text) =>
    set((state) => ({
      dialogueHistory: [...state.dialogueHistory, { speaker: 'npc', text, timestamp: Date.now() }],
    })),
  addClue: (clue) =>
    set((state) => {
      if (state.discoveredClues.find((existing) => existing.id === clue.id)) {
        return state;
      }
      return { discoveredClues: [...state.discoveredClues, clue] };
    }),
  applyFeedback: (feedback, xpType) => {
    const state = get();
    const update = {
      latestFeedback: feedback,
      vocabularyXp: state.vocabularyXp,
      grammarXp: state.grammarXp,
      investigationXp: state.investigationXp,
    };
    if (xpType === 'vocabulary') update.vocabularyXp += feedback.xpAwarded;
    if (xpType === 'grammar') update.grammarXp += feedback.xpAwarded;
    if (xpType === 'investigation') update.investigationXp += feedback.xpAwarded;
    set(update);
  },
}));
