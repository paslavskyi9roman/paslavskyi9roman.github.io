import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  type CasePhase,
  type CaseResolution,
  type Clue,
  type ContradictionRecord,
  type DialogueFeedback,
  type DialogueMessage,
  type Lesson,
  type NpcProfile,
  type NpcStatement,
  type Quest,
} from '@/types/game';
import {
  CASE_001_CLUE_CONTRADICTIONS,
  CASE_001_CULPRIT,
  CASE_001_LESSONS,
  CASE_001_NPCS,
  CASE_001_QUESTS,
} from '@/game/content/case001';
import {
  APARTMENT_CLUE_CONTRADICTIONS,
  APARTMENT_NPC_PROFILES,
  APARTMENT_QUESTS,
} from '@/game/content/case001-apartment';
import { DEFAULT_LOCATION_ID, type LocationId } from '@/game/content/locations';

interface GameState {
  currentCaseId: string;
  currentLocationId: LocationId;
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
  casePhase: CasePhase;
  caseResolution: CaseResolution;
  accusedNpcId: string | null;
  recordedStatements: NpcStatement[];
  contradictions: ContradictionRecord[];
  briefingSeen: boolean;
  /** Per-NPC list of quick-reply texts the player has already used. */
  usedQuickReplies: Record<string, string[]>;
  startNpcDialogue: (npc: NpcProfile) => void;
  selectNpcById: (npcId: string) => void;
  setLocation: (locationId: LocationId) => void;
  addPlayerLine: (text: string) => void;
  addNpcLine: (text: string, npc?: Pick<NpcProfile, 'id' | 'name'>) => void;
  addSystemLine: (text: string) => void;
  addClue: (clue: Clue) => void;
  completeQuest: (questId: string) => void;
  applyFeedback: (feedback: DialogueFeedback, xpType: 'vocabulary' | 'grammar' | 'investigation') => void;
  recordStatement: (statement: Omit<NpcStatement, 'recordedAt'>) => void;
  recordUsedReply: (npcId: string, replyText: string) => void;
  dismissBriefing: () => void;
  accuse: (npcId: string, supportingContradictionIds: string[]) => void;
}

const STORAGE_KEY = 'madrid-noir-v1';
const STORAGE_VERSION = 4;

const ACCUSATION_SOLVED_XP = 25;
const ACCUSATION_FAILED_XP = 5;
const REQUIRED_CLUES_FOR_ACCUSATION = 3;

const ALL_QUESTS: Quest[] = [...CASE_001_QUESTS, ...APARTMENT_QUESTS];

const ALL_CLUE_CONTRADICTIONS: Record<string, string[]> = {
  ...CASE_001_CLUE_CONTRADICTIONS,
  ...APARTMENT_CLUE_CONTRADICTIONS,
};

/**
 * Per-location NPC roster: Diego only attends his bar, the inspector and the
 * suspect appear at both. The opening lines and quick replies come from the
 * location-specific overrides when they exist.
 */
const LOCATION_NPC_IDS: Record<LocationId, string[]> = {
  bar_interior: ['npc_lucia_vargas', 'npc_diego_torres', 'npc_inspectora_ruiz'],
  lucia_apartment: ['npc_lucia_vargas', 'npc_inspectora_ruiz'],
};

const buildNpcsForLocation = (locationId: LocationId): NpcProfile[] => {
  const ids = LOCATION_NPC_IDS[locationId];
  return ids
    .map((id) => CASE_001_NPCS.find((n) => n.id === id))
    .filter((n): n is NpcProfile => Boolean(n))
    .map((base) => {
      if (locationId === 'lucia_apartment') {
        const override = APARTMENT_NPC_PROFILES[base.id];
        if (override) {
          return { ...base, openingLine: override.openingLine, quickReplies: override.quickReplies };
        }
      }
      return base;
    });
};

type ContradictionLookup = Record<string, string[] | undefined>;

const buildContradictionUpdates = (
  state: GameState,
  lookup: ContradictionLookup = ALL_CLUE_CONTRADICTIONS,
): { contradictions: ContradictionRecord[]; newRecords: ContradictionRecord[] } => {
  const existingPairs = new Set(state.contradictions.map((c) => c.id));
  const newRecords: ContradictionRecord[] = [];
  const now = Date.now();
  for (const clue of state.discoveredClues) {
    const targets = lookup[clue.id];
    if (!targets) continue;
    for (const statement of state.recordedStatements) {
      if (!targets.includes(statement.id)) continue;
      const id = `${clue.id}__${statement.id}`;
      if (existingPairs.has(id)) continue;
      existingPairs.add(id);
      newRecords.push({
        id,
        clueId: clue.id,
        statementId: statement.id,
        npcId: statement.npcId,
        detectedAt: now,
      });
    }
  }
  return {
    contradictions: newRecords.length > 0 ? [...state.contradictions, ...newRecords] : state.contradictions,
    newRecords,
  };
};

const buildPhaseAfter = (state: GameState, contradictions: ContradictionRecord[]): CasePhase => {
  if (state.casePhase !== 'investigation') return state.casePhase;
  if (state.discoveredClues.length >= REQUIRED_CLUES_FOR_ACCUSATION && contradictions.length >= 1) {
    return 'accusation';
  }
  return state.casePhase;
};

const appendContradictionLines = (
  history: DialogueMessage[],
  newRecords: ContradictionRecord[],
  state: GameState,
): DialogueMessage[] => {
  if (newRecords.length === 0) return history;
  const now = Date.now();
  const lines: DialogueMessage[] = newRecords.map((record) => {
    const clue = state.discoveredClues.find((c) => c.id === record.clueId);
    const statement = state.recordedStatements.find((s) => s.id === record.statementId);
    const npc = state.npcs.find((n) => n.id === record.npcId);
    const clueLabel = clue?.title ?? record.clueId;
    const statementLabel = statement?.value ?? record.statementId;
    const npcLabel = npc?.name ?? 'sospechoso';
    return {
      speaker: 'system',
      text: `Contradicción detectada: "${clueLabel}" choca con la declaración de ${npcLabel} — ${statementLabel}.`,
      timestamp: now,
    };
  });
  return [...history, ...lines];
};

const initialNpcs = buildNpcsForLocation(DEFAULT_LOCATION_ID);

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentCaseId: 'case_001',
      currentLocationId: DEFAULT_LOCATION_ID,
      npcs: initialNpcs,
      quests: ALL_QUESTS,
      lessons: CASE_001_LESSONS,
      selectedNpc: initialNpcs[0] ?? null,
      completedQuestIds: [],
      dialogueHistory: [],
      discoveredClues: [],
      vocabularyXp: 0,
      grammarXp: 0,
      investigationXp: 0,
      latestFeedback: null,
      casePhase: 'briefing',
      caseResolution: null,
      accusedNpcId: null,
      recordedStatements: [],
      contradictions: [],
      briefingSeen: false,
      usedQuickReplies: {},
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
      setLocation: (locationId) => {
        const current = get().currentLocationId;
        if (current === locationId) return;
        const npcs = buildNpcsForLocation(locationId);
        const previousSelectedId = get().selectedNpc?.id;
        const nextSelected = npcs.find((n) => n.id === previousSelectedId) ?? npcs[0] ?? null;
        set({
          currentLocationId: locationId,
          npcs,
          selectedNpc: nextSelected,
          dialogueHistory: nextSelected
            ? [
                {
                  speaker: 'npc',
                  text: nextSelected.openingLine,
                  timestamp: Date.now(),
                  npcId: nextSelected.id,
                  npcName: nextSelected.name,
                },
              ]
            : [],
        });
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
          const nextState: GameState = { ...state, discoveredClues: [...state.discoveredClues, clue] };
          const { contradictions, newRecords } = buildContradictionUpdates(nextState);
          const dialogueHistory = appendContradictionLines(nextState.dialogueHistory, newRecords, nextState);
          const casePhase = buildPhaseAfter({ ...nextState, contradictions }, contradictions);
          return {
            discoveredClues: nextState.discoveredClues,
            contradictions,
            dialogueHistory,
            casePhase,
          };
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
      recordUsedReply: (npcId, replyText) =>
        set((state) => {
          const existing = state.usedQuickReplies[npcId] ?? [];
          if (existing.includes(replyText)) return state;
          return {
            usedQuickReplies: {
              ...state.usedQuickReplies,
              [npcId]: [...existing, replyText],
            },
          };
        }),
      recordStatement: (statement) =>
        set((state) => {
          if (state.recordedStatements.find((existing) => existing.id === statement.id)) {
            return state;
          }
          const stampedStatement: NpcStatement = { ...statement, recordedAt: Date.now() };
          const nextState: GameState = {
            ...state,
            recordedStatements: [...state.recordedStatements, stampedStatement],
          };
          const { contradictions, newRecords } = buildContradictionUpdates(nextState);
          const dialogueHistory = appendContradictionLines(nextState.dialogueHistory, newRecords, nextState);
          const casePhase = buildPhaseAfter({ ...nextState, contradictions }, contradictions);
          return {
            recordedStatements: nextState.recordedStatements,
            contradictions,
            dialogueHistory,
            casePhase,
          };
        }),
      dismissBriefing: () =>
        set((state) => {
          if (state.briefingSeen && state.casePhase !== 'briefing') return state;
          return {
            briefingSeen: true,
            casePhase: state.casePhase === 'briefing' ? 'investigation' : state.casePhase,
          };
        }),
      accuse: (npcId, supportingContradictionIds) =>
        set((state) => {
          if (state.casePhase !== 'accusation') return state;
          const validIds = supportingContradictionIds.filter((id) =>
            state.contradictions.some((record) => record.id === id),
          );
          const supportedByEvidence = validIds.length > 0;
          const correctSuspect = npcId === CASE_001_CULPRIT;
          const solved = correctSuspect && supportedByEvidence;
          const xp = solved ? ACCUSATION_SOLVED_XP : ACCUSATION_FAILED_XP;
          const accusedNpc = state.npcs.find((n) => n.id === npcId);
          const summary = solved
            ? `Caso resuelto: acusaste a ${accusedNpc?.name ?? npcId} con pruebas sólidas. +${xp} XP de investigación.`
            : !correctSuspect
              ? `Acusación fallida: ${accusedNpc?.name ?? npcId} no es la persona culpable. +${xp} XP de consolación.`
              : `Acusación fallida: faltan pruebas concretas para sostener la acusación. +${xp} XP de consolación.`;
          return {
            casePhase: 'resolved',
            caseResolution: solved ? 'solved' : 'failed',
            accusedNpcId: npcId,
            investigationXp: state.investigationXp + xp,
            latestFeedback: {
              isUnderstandable: true,
              xpAwarded: xp,
              explanation: summary,
            },
            dialogueHistory: [...state.dialogueHistory, { speaker: 'system', text: summary, timestamp: Date.now() }],
          };
        }),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentCaseId: state.currentCaseId,
        currentLocationId: state.currentLocationId,
        completedQuestIds: state.completedQuestIds,
        dialogueHistory: state.dialogueHistory,
        discoveredClues: state.discoveredClues,
        vocabularyXp: state.vocabularyXp,
        grammarXp: state.grammarXp,
        investigationXp: state.investigationXp,
        casePhase: state.casePhase,
        caseResolution: state.caseResolution,
        accusedNpcId: state.accusedNpcId,
        recordedStatements: state.recordedStatements,
        contradictions: state.contradictions,
        briefingSeen: state.briefingSeen,
        usedQuickReplies: state.usedQuickReplies,
      }),
      migrate: (persistedState, version) => {
        const base = (persistedState ?? {}) as Partial<GameState>;
        let next: Partial<GameState> = base;
        if (version < 2) {
          next = {
            ...next,
            casePhase: 'briefing',
            caseResolution: null,
            accusedNpcId: null,
            recordedStatements: [],
            contradictions: [],
            briefingSeen: false,
          };
        }
        if (version < 3) {
          next = {
            ...next,
            currentLocationId: DEFAULT_LOCATION_ID,
          };
        }
        if (version < 4) {
          next = {
            ...next,
            usedQuickReplies: {},
          };
        }
        return next;
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const npcs = buildNpcsForLocation(state.currentLocationId ?? DEFAULT_LOCATION_ID);
        state.npcs = npcs;
        state.quests = ALL_QUESTS;
        state.selectedNpc = npcs[0] ?? null;
      },
    },
  ),
);
