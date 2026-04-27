import { create } from 'zustand';
import { Clue, DialogueFeedback, DialogueMessage, Lesson, NpcProfile, Quest } from '@/types/game';
import { CASE_001_LESSONS, CASE_001_NPCS, CASE_001_QUESTS } from '@/game/content/case001';

interface GameState {
  currentCaseId: string;
  npcs: NpcProfile[];
  quests: Quest[];
  lessons: Lesson[];
  selectedNpc: NpcProfile | null;
  completedQuestIds: string[];
  dialogueHistory: DialogueMessage[];
  discoveredClues: Clue[];
  vocabularyXp: number;
  grammarXp: number;
  investigationXp: number;
  latestFeedback: DialogueFeedback | null;
  startNpcDialogue: (npc: NpcProfile) => void;
  selectNpcById: (npcId: string) => void;
  addPlayerLine: (text: string) => void;
  addNpcLine: (text: string) => void;
  addSystemLine: (text: string) => void;
  addClue: (clue: Clue) => void;
  completeQuest: (questId: string) => void;
  applyFeedback: (feedback: DialogueFeedback, xpType: 'vocabulary' | 'grammar' | 'investigation') => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentCaseId: 'case_001',
  npcs: CASE_001_NPCS,
  quests: CASE_001_QUESTS,
  lessons: CASE_001_LESSONS,
  selectedNpc: CASE_001_NPCS[0],
  completedQuestIds: [],
  dialogueHistory: [],
  discoveredClues: [],
  vocabularyXp: 0,
  grammarXp: 0,
  investigationXp: 0,
  latestFeedback: null,
  startNpcDialogue: (npc) =>
    set({
      selectedNpc: npc,
      dialogueHistory: [{ speaker: 'npc', text: npc.openingLine, timestamp: Date.now(), npcId: npc.id, npcName: npc.name }],
    }),
  selectNpcById: (npcId) => {
    const npc = get().npcs.find((profile) => profile.id === npcId);
    if (!npc) return;
    get().startNpcDialogue(npc);
  },
  addPlayerLine: (text) =>
    set((state) => ({
      dialogueHistory: [...state.dialogueHistory, { speaker: 'player', text, timestamp: Date.now() }],
    })),
  addNpcLine: (text, npc) =>
    set((state) => ({
      dialogueHistory: [...state.dialogueHistory, { speaker: 'npc', text, timestamp: Date.now(), npcId: npc?.id, npcName: npc?.name }],
    })),
  addSystemLine: (text) =>
    set((state) => ({
      dialogueHistory: [...state.dialogueHistory, { speaker: 'system', text, timestamp: Date.now() }],
    })),
  addClue: (clue) =>
    set((state) => {
      if (state.discoveredClues.find((existing) => existing.id === clue.id)) {
        return state;
      }
      return { discoveredClues: [...state.discoveredClues, clue] };
    }),
  completeQuest: (questId) =>
    set((state) => {
      if (state.completedQuestIds.includes(questId)) return state;
      return { completedQuestIds: [...state.completedQuestIds, questId] };
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
