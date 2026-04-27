import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  type Clue,
  type DialogueFeedback,
  type DialogueMessage,
  type Lesson,
  type NpcProfile,
  type Quest,
} from '@/types/game';
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
  addNpcLine: (text: string, npc?: Pick<NpcProfile, 'id' | 'name'>) => void;
  addSystemLine: (text: string) => void;
  addClue: (clue: Clue) => void;
  completeQuest: (questId: string) => void;
  applyFeedback: (feedback: DialogueFeedback, xpType: 'vocabulary' | 'grammar' | 'investigation') => void;
}

const STORAGE_KEY = 'madrid-noir-v1';
const STORAGE_VERSION = 1;

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentCaseId: 'case_001',
      npcs: CASE_001_NPCS,
      quests: CASE_001_QUESTS,
      lessons: CASE_001_LESSONS,
      selectedNpc: CASE_001_NPCS[0] ?? null,
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
          dialogueHistory: [
            { speaker: 'npc', text: npc.openingLine, timestamp: Date.now(), npcId: npc.id, npcName: npc.name },
          ],
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
          dialogueHistory: [
            ...state.dialogueHistory,
            { speaker: 'npc', text, timestamp: Date.now(), npcId: npc?.id, npcName: npc?.name },
          ],
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
      applyFeedback: (feedback, xpType) =>
        set((state) => ({
          latestFeedback: feedback,
          vocabularyXp: state.vocabularyXp + (xpType === 'vocabulary' ? feedback.xpAwarded : 0),
          grammarXp: state.grammarXp + (xpType === 'grammar' ? feedback.xpAwarded : 0),
          investigationXp: state.investigationXp + (xpType === 'investigation' ? feedback.xpAwarded : 0),
        })),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentCaseId: state.currentCaseId,
        completedQuestIds: state.completedQuestIds,
        dialogueHistory: state.dialogueHistory,
        discoveredClues: state.discoveredClues,
        vocabularyXp: state.vocabularyXp,
        grammarXp: state.grammarXp,
        investigationXp: state.investigationXp,
      }),
      migrate: (persistedState, version) => {
        if (version < STORAGE_VERSION) {
          // Future schema migrations land here.
        }
        return persistedState as Partial<GameState>;
      },
    },
  ),
);
