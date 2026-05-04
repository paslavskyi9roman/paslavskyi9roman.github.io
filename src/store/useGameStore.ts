import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_CASE_ID, getCaseDefinition, type CaseDefinition } from '@/game/content/cases';
import {
  type CasePhase,
  type CaseResolution,
  type Clue,
  type ContradictionRecord,
  type DialogueFeedback,
  type DialogueMessage,
  type Lesson,
  type LocationId,
  type NpcProfile,
  type NpcStatement,
  type Quest,
} from '@/types/game';

interface CaseProgress {
  currentLocationId: LocationId;
  selectedNpcId: string | null;
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
  usedQuickReplies: Record<string, string[]>;
}

interface GameState extends CaseProgress {
  currentCaseId: string;
  progressByCase: Record<string, CaseProgress>;
  npcs: NpcProfile[];
  quests: Quest[];
  lessons: Lesson[];
  selectedNpc: NpcProfile | null;
  selectCase: (caseId: string) => void;
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
  linkClueToStatement: (clueId: string, statementId: string) => { ok: boolean };
  accuse: (npcId: string, supportingContradictionIds: string[]) => void;
}

const STORAGE_KEY = 'madrid-noir-v1';
const STORAGE_VERSION = 6;

const CONTRADICTION_LINK_XP = 8;

const buildNpcsForLocation = (caseDef: CaseDefinition, locationId: LocationId): NpcProfile[] => {
  const ids = caseDef.locationNpcIds[locationId] ?? [];
  return ids
    .map((id) => caseDef.npcs.find((n) => n.id === id))
    .filter((n): n is NpcProfile => Boolean(n))
    .map((base) => ({ ...base, ...(caseDef.locationNpcOverrides?.[locationId]?.[base.id] ?? {}) }));
};

const createInitialProgress = (caseDef: CaseDefinition): CaseProgress => {
  const initialNpcs = buildNpcsForLocation(caseDef, caseDef.defaultLocationId);
  return {
    currentLocationId: caseDef.defaultLocationId,
    selectedNpcId: initialNpcs[0]?.id ?? null,
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
  };
};

const isLocationUnlocked = (caseDef: CaseDefinition, locationId: LocationId, completedQuestIds: string[]): boolean => {
  const required = caseDef.locationRequiredQuests[locationId] ?? [];
  return required.every((questId) => completedQuestIds.includes(questId));
};

const materialize = (caseId: string, progress: CaseProgress) => {
  const caseDef = getCaseDefinition(caseId);
  const npcs = buildNpcsForLocation(caseDef, progress.currentLocationId);
  const selectedNpc = npcs.find((npc) => npc.id === progress.selectedNpcId) ?? npcs[0] ?? null;
  return {
    ...progress,
    selectedNpcId: selectedNpc?.id ?? null,
    npcs,
    quests: caseDef.quests,
    lessons: caseDef.lessons,
    selectedNpc,
  };
};

const buildPhaseAfter = (caseDef: CaseDefinition, progress: CaseProgress, contradictions: ContradictionRecord[]) => {
  if (progress.casePhase !== 'investigation') return progress.casePhase;
  if (progress.discoveredClues.length >= caseDef.requiredCluesForAccusation && contradictions.length >= 1) {
    return 'accusation';
  }
  return progress.casePhase;
};

const appendContradictionLines = (
  caseDef: CaseDefinition,
  progress: CaseProgress,
  newRecords: ContradictionRecord[],
): DialogueMessage[] => {
  if (newRecords.length === 0) return progress.dialogueHistory;
  const now = Date.now();
  const npcs = buildNpcsForLocation(caseDef, progress.currentLocationId);
  const lines: DialogueMessage[] = newRecords.map((record) => {
    const clue = progress.discoveredClues.find((c) => c.id === record.clueId);
    const statement = progress.recordedStatements.find((s) => s.id === record.statementId);
    const npc = npcs.find((n) => n.id === record.npcId) ?? caseDef.npcs.find((n) => n.id === record.npcId);
    return {
      speaker: 'system',
      text: `Contradicción detectada: "${clue?.title ?? record.clueId}" choca con la declaración de ${
        npc?.name ?? 'sospechoso'
      } — ${statement?.value ?? record.statementId}.`,
      timestamp: now,
    };
  });
  return [...progress.dialogueHistory, ...lines];
};

const applyQuestCompletion = (caseDef: CaseDefinition, progress: CaseProgress, questId: string): CaseProgress => {
  if (progress.completedQuestIds.includes(questId)) return progress;
  const completedQuestIds = [...progress.completedQuestIds, questId];
  const newlyUnlocked = caseDef.locationOrder.filter((locId) => {
    if (locId === progress.currentLocationId) return false;
    const required = caseDef.locationRequiredQuests[locId] ?? [];
    if (required.length === 0) return false;
    const wasUnlocked = required.every((q) => progress.completedQuestIds.includes(q));
    const nowUnlocked = required.every((q) => completedQuestIds.includes(q));
    return !wasUnlocked && nowUnlocked;
  });

  if (newlyUnlocked.length === 0) {
    return { ...progress, completedQuestIds };
  }

  const now = Date.now();
  const previousLocationName = caseDef.locations[progress.currentLocationId]?.name.es ?? 'la ubicación actual';
  const lines: DialogueMessage[] = newlyUnlocked.map((locId) => ({
    speaker: 'system',
    text: `¡Enhorabuena! Has completado la investigación en ${previousLocationName}. Procede a la siguiente ubicación: ${
      caseDef.locations[locId]?.name.es ?? locId
    }.`,
    timestamp: now,
  }));
  const nextLocationName = caseDef.locations[newlyUnlocked[0]!]?.name.es ?? newlyUnlocked[0]!;

  return {
    ...progress,
    completedQuestIds,
    dialogueHistory: [...progress.dialogueHistory, ...lines],
    latestFeedback: {
      isUnderstandable: true,
      xpAwarded: 0,
      explanation: `¡Enhorabuena! Has completado ${previousLocationName}. Procede a ${nextLocationName}.`,
    },
  };
};

const applyClueQuestRules = (caseDef: CaseDefinition, progress: CaseProgress): CaseProgress => {
  let next = progress;
  for (const rule of caseDef.clueQuestRules) {
    if (rule.locationId !== progress.currentLocationId) continue;
    const locationClues = caseDef.sceneCluesByLocation[rule.locationId] ?? [];
    const foundIds = new Set(next.discoveredClues.map((clue) => clue.id));
    const minMet =
      typeof rule.minClues === 'number' &&
      locationClues.filter((clue) => foundIds.has(clue.id)).length >= rule.minClues;
    const setMet = Boolean(rule.clueIds?.every((id) => foundIds.has(id)));
    if (minMet || setMet) {
      next = applyQuestCompletion(caseDef, next, rule.questId);
    }
  }
  return next;
};

const applyDialogueQuestRules = (
  caseDef: CaseDefinition,
  progress: CaseProgress,
  npcId: string,
  replyText: string,
  statementId?: string,
): CaseProgress => {
  let next = progress;
  for (const rule of caseDef.dialogueQuestRules) {
    if (rule.locationId && rule.locationId !== progress.currentLocationId) continue;
    if (rule.npcId && rule.npcId !== npcId) continue;
    if (rule.replyText && rule.replyText !== replyText) continue;
    if (rule.statementId && rule.statementId !== statementId) continue;
    if (
      rule.requiredClueIds &&
      !rule.requiredClueIds.every((id) => progress.discoveredClues.some((c) => c.id === id))
    ) {
      continue;
    }
    next = applyQuestCompletion(caseDef, next, rule.questId);
  }
  return next;
};

const applyContradictionQuestRules = (
  caseDef: CaseDefinition,
  progress: CaseProgress,
  record: ContradictionRecord,
): CaseProgress => {
  let next = progress;
  for (const rule of caseDef.contradictionQuestRules) {
    if (rule.locationId && rule.locationId !== progress.currentLocationId) continue;
    if (rule.clueIds && !rule.clueIds.includes(record.clueId)) continue;
    if (rule.statementIds && !rule.statementIds.includes(record.statementId)) continue;
    next = applyQuestCompletion(caseDef, next, rule.questId);
  }
  return next;
};

const getProgress = (state: GameState, caseId = state.currentCaseId): CaseProgress => {
  const caseDef = getCaseDefinition(caseId);
  return state.progressByCase[caseId] ?? createInitialProgress(caseDef);
};

const setActiveProgress = (set: (partial: Partial<GameState>) => void, state: GameState, progress: CaseProgress) => {
  const currentCaseId = state.currentCaseId;
  set({
    progressByCase: { ...state.progressByCase, [currentCaseId]: progress },
    ...materialize(currentCaseId, progress),
  });
};

const defaultCase = getCaseDefinition(DEFAULT_CASE_ID);
const defaultProgress = createInitialProgress(defaultCase);

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentCaseId: DEFAULT_CASE_ID,
      progressByCase: { [DEFAULT_CASE_ID]: defaultProgress },
      ...materialize(DEFAULT_CASE_ID, defaultProgress),
      selectCase: (caseId) => {
        const caseDef = getCaseDefinition(caseId);
        const safeCaseId = caseDef.id;
        const state = get();
        const progress = state.progressByCase[safeCaseId] ?? createInitialProgress(caseDef);
        set({
          currentCaseId: safeCaseId,
          progressByCase: { ...state.progressByCase, [safeCaseId]: progress },
          ...materialize(safeCaseId, progress),
        });
      },
      startNpcDialogue: (npc) => {
        const state = get();
        const progress = getProgress(state);
        const next: CaseProgress = {
          ...progress,
          selectedNpcId: npc.id,
          dialogueHistory: [
            { speaker: 'npc', text: npc.openingLine, timestamp: Date.now(), npcId: npc.id, npcName: npc.name },
          ],
        };
        setActiveProgress(set, state, next);
      },
      selectNpcById: (npcId) => {
        const npc = get().npcs.find((profile) => profile.id === npcId);
        if (!npc) return;
        get().startNpcDialogue(npc);
      },
      setLocation: (locationId) => {
        const state = get();
        const caseDef = getCaseDefinition(state.currentCaseId);
        const progress = getProgress(state);
        if (progress.currentLocationId === locationId) return;
        if (!isLocationUnlocked(caseDef, locationId, progress.completedQuestIds)) return;
        const npcs = buildNpcsForLocation(caseDef, locationId);
        const nextSelected = npcs.find((n) => n.id === progress.selectedNpcId) ?? npcs[0] ?? null;
        const next: CaseProgress = {
          ...progress,
          currentLocationId: locationId,
          selectedNpcId: nextSelected?.id ?? null,
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
        };
        setActiveProgress(set, state, next);
      },
      addPlayerLine: (text) => {
        const state = get();
        const progress = getProgress(state);
        setActiveProgress(set, state, {
          ...progress,
          dialogueHistory: [...progress.dialogueHistory, { speaker: 'player', text, timestamp: Date.now() }],
        });
      },
      addNpcLine: (text, npc) => {
        const state = get();
        const progress = getProgress(state);
        setActiveProgress(set, state, {
          ...progress,
          dialogueHistory: [
            ...progress.dialogueHistory,
            { speaker: 'npc', text, timestamp: Date.now(), npcId: npc?.id, npcName: npc?.name },
          ],
        });
      },
      addSystemLine: (text) => {
        const state = get();
        const progress = getProgress(state);
        setActiveProgress(set, state, {
          ...progress,
          dialogueHistory: [...progress.dialogueHistory, { speaker: 'system', text, timestamp: Date.now() }],
        });
      },
      addClue: (clue) => {
        const state = get();
        const caseDef = getCaseDefinition(state.currentCaseId);
        const progress = getProgress(state);
        if (progress.discoveredClues.some((existing) => existing.id === clue.id)) return;
        const withClue = { ...progress, discoveredClues: [...progress.discoveredClues, clue] };
        setActiveProgress(set, state, applyClueQuestRules(caseDef, withClue));
      },
      completeQuest: (questId) => {
        const state = get();
        const caseDef = getCaseDefinition(state.currentCaseId);
        setActiveProgress(set, state, applyQuestCompletion(caseDef, getProgress(state), questId));
      },
      applyFeedback: (feedback, xpType) => {
        const state = get();
        const progress = getProgress(state);
        setActiveProgress(set, state, {
          ...progress,
          latestFeedback: feedback,
          vocabularyXp: progress.vocabularyXp + (xpType === 'vocabulary' ? feedback.xpAwarded : 0),
          grammarXp: progress.grammarXp + (xpType === 'grammar' ? feedback.xpAwarded : 0),
          investigationXp: progress.investigationXp + (xpType === 'investigation' ? feedback.xpAwarded : 0),
        });
      },
      recordUsedReply: (npcId, replyText) => {
        const state = get();
        const caseDef = getCaseDefinition(state.currentCaseId);
        const progress = getProgress(state);
        const existing = progress.usedQuickReplies[npcId] ?? [];
        if (existing.includes(replyText)) return;
        const withReply: CaseProgress = {
          ...progress,
          usedQuickReplies: { ...progress.usedQuickReplies, [npcId]: [...existing, replyText] },
        };
        setActiveProgress(set, state, applyDialogueQuestRules(caseDef, withReply, npcId, replyText));
      },
      recordStatement: (statement) => {
        const state = get();
        const progress = getProgress(state);
        if (progress.recordedStatements.some((existing) => existing.id === statement.id)) return;
        setActiveProgress(set, state, {
          ...progress,
          recordedStatements: [...progress.recordedStatements, { ...statement, recordedAt: Date.now() }],
        });
      },
      dismissBriefing: () => {
        const state = get();
        const progress = getProgress(state);
        if (progress.briefingSeen && progress.casePhase !== 'briefing') return;
        setActiveProgress(set, state, {
          ...progress,
          briefingSeen: true,
          casePhase: progress.casePhase === 'briefing' ? 'investigation' : progress.casePhase,
        });
      },
      linkClueToStatement: (clueId, statementId) => {
        const state = get();
        const caseDef = getCaseDefinition(state.currentCaseId);
        const progress = getProgress(state);
        const clue = progress.discoveredClues.find((c) => c.id === clueId);
        const statement = progress.recordedStatements.find((s) => s.id === statementId);
        if (!clue || !statement) {
          setActiveProgress(set, state, {
            ...progress,
            latestFeedback: {
              isUnderstandable: false,
              xpAwarded: 0,
              explanation: 'Necesitas tener tanto la pista como la declaración antes de poder vincularlas.',
            },
          });
          return { ok: false };
        }

        const recordId = `${clueId}__${statementId}`;
        if (progress.contradictions.some((existing) => existing.id === recordId)) return { ok: true };

        const isMatch = caseDef.clueContradictions[clueId]?.includes(statementId) ?? false;
        if (!isMatch) {
          setActiveProgress(set, state, {
            ...progress,
            latestFeedback: {
              isUnderstandable: false,
              xpAwarded: 0,
              explanation: `No encuentro contradicción entre «${clue.title}» y la declaración seleccionada.`,
            },
            dialogueHistory: [
              ...progress.dialogueHistory,
              {
                speaker: 'system',
                text: `Vínculo descartado: «${clue.title}» y la declaración «${statement.value}» no se contradicen.`,
                timestamp: Date.now(),
              },
            ],
          });
          return { ok: false };
        }

        const newRecord: ContradictionRecord = {
          id: recordId,
          clueId,
          statementId,
          npcId: statement.npcId,
          detectedAt: Date.now(),
        };
        const nextContradictions = [...progress.contradictions, newRecord];
        let next: CaseProgress = {
          ...progress,
          contradictions: nextContradictions,
          dialogueHistory: appendContradictionLines(caseDef, progress, [newRecord]),
          casePhase: buildPhaseAfter(caseDef, { ...progress, contradictions: nextContradictions }, nextContradictions),
          investigationXp: progress.investigationXp + CONTRADICTION_LINK_XP,
          latestFeedback: {
            isUnderstandable: true,
            xpAwarded: CONTRADICTION_LINK_XP,
            explanation: `Contradicción registrada: «${clue.title}» frente a «${statement.value}».`,
          },
        };
        next = applyContradictionQuestRules(caseDef, next, newRecord);
        setActiveProgress(set, state, next);
        return { ok: true };
      },
      accuse: (npcId, supportingContradictionIds) => {
        const state = get();
        const caseDef = getCaseDefinition(state.currentCaseId);
        const progress = getProgress(state);
        if (progress.casePhase !== 'accusation') return;
        const validIds = supportingContradictionIds.filter((id) =>
          progress.contradictions.some((record) => record.id === id),
        );
        const supportedByEvidence = validIds.length > 0;
        const requiredCluesMet =
          !caseDef.accusation.requiredClueIds ||
          caseDef.accusation.requiredClueIds.every((id) => progress.discoveredClues.some((clue) => clue.id === id));
        const correctSuspect = npcId === caseDef.culprit;
        const solved = correctSuspect && supportedByEvidence && requiredCluesMet;
        const xp = solved ? caseDef.accusation.solvedXp : caseDef.accusation.failedXp;
        const accusedNpc = caseDef.npcs.find((n) => n.id === npcId);
        const summary = solved
          ? `Caso resuelto: acusaste a ${accusedNpc?.name ?? npcId} con pruebas sólidas. +${xp} XP de investigación.`
          : !correctSuspect
            ? `Acusación fallida: ${accusedNpc?.name ?? npcId} no es la persona culpable. +${xp} XP de consolación.`
            : !requiredCluesMet
              ? `Acusación fallida: faltan pruebas clave para sostener la acusación. +${xp} XP de consolación.`
              : `Acusación fallida: faltan pruebas concretas para sostener la acusación. +${xp} XP de consolación.`;
        let next: CaseProgress = {
          ...progress,
          casePhase: 'resolved',
          caseResolution: solved ? 'solved' : 'failed',
          accusedNpcId: npcId,
          investigationXp: progress.investigationXp + xp,
          latestFeedback: { isUnderstandable: true, xpAwarded: xp, explanation: summary },
          dialogueHistory: [...progress.dialogueHistory, { speaker: 'system', text: summary, timestamp: Date.now() }],
        };
        if (solved && caseDef.accusation.finalQuestId) {
          next = applyQuestCompletion(caseDef, next, caseDef.accusation.finalQuestId);
        }
        setActiveProgress(set, state, next);
      },
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentCaseId: state.currentCaseId,
        progressByCase: state.progressByCase,
      }),
      migrate: (persistedState, version) => {
        const base = (persistedState ?? {}) as Partial<GameState>;
        if (version >= 6 && base.progressByCase) return base;
        const legacyCaseId = base.currentCaseId ?? DEFAULT_CASE_ID;
        const legacyCaseDef = getCaseDefinition(legacyCaseId);
        const legacyProgress: CaseProgress = {
          ...createInitialProgress(legacyCaseDef),
          currentLocationId: base.currentLocationId ?? legacyCaseDef.defaultLocationId,
          selectedNpcId: null,
          completedQuestIds: base.completedQuestIds ?? [],
          dialogueHistory: base.dialogueHistory ?? [],
          discoveredClues: base.discoveredClues ?? [],
          vocabularyXp: base.vocabularyXp ?? 0,
          grammarXp: base.grammarXp ?? 0,
          investigationXp: base.investigationXp ?? 0,
          latestFeedback: null,
          casePhase: base.casePhase ?? 'briefing',
          caseResolution: base.caseResolution ?? null,
          accusedNpcId: base.accusedNpcId ?? null,
          recordedStatements: base.recordedStatements ?? [],
          contradictions: base.contradictions ?? [],
          briefingSeen: base.briefingSeen ?? false,
          usedQuickReplies: base.usedQuickReplies ?? {},
        };
        return {
          currentCaseId: legacyCaseDef.id,
          progressByCase: { [legacyCaseDef.id]: legacyProgress },
        };
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const caseDef = getCaseDefinition(state.currentCaseId);
        const progress = state.progressByCase?.[caseDef.id] ?? createInitialProgress(caseDef);
        const safeLocation = isLocationUnlocked(caseDef, progress.currentLocationId, progress.completedQuestIds)
          ? progress.currentLocationId
          : caseDef.defaultLocationId;
        const safeProgress = { ...progress, currentLocationId: safeLocation };
        state.currentCaseId = caseDef.id;
        state.progressByCase = { ...(state.progressByCase ?? {}), [caseDef.id]: safeProgress };
        Object.assign(state, materialize(caseDef.id, safeProgress));
      },
    },
  ),
);
