import { beforeEach, describe, expect, it } from 'vitest';
import { useGameStore } from './useGameStore';
import { CASE_001_CULPRIT } from '@/game/content/case001';
import { type NpcStatement } from '@/types/game';

const resetStore = () => {
  useGameStore.persist.clearStorage();
  useGameStore.setState({
    currentLocationId: 'bar_interior',
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
  });
};

const buildStatement = (overrides: Partial<NpcStatement> = {}): NpcStatement => ({
  id: 'lucia_home_2230',
  npcId: CASE_001_CULPRIT,
  topic: 'arrival_time',
  value: 'Lucía dijo llegar a las 22:30',
  recordedAt: 1,
  sourceReply: '¿A qué hora llegaste a casa?',
  ...overrides,
});

const enterAccusationPhase = () => {
  const { dismissBriefing, addClue, recordStatement, linkClueToStatement } = useGameStore.getState();
  dismissBriefing();
  recordStatement(buildStatement());
  addClue({ id: 'clue_note', title: 'Nota rasgada', description: '23:40 salida trasera' });
  addClue({ id: 'clue_receipt', title: 'Ticket del Metro', description: 'metro' });
  addClue({ id: 'clue_glass', title: 'Vaso con huellas', description: 'huellas' });
  linkClueToStatement('clue_note', 'lucia_home_2230');
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
    const { addClue, completeQuest, applyFeedback, dismissBriefing, recordStatement } = useGameStore.getState();
    addClue({ id: 'clue_persist', title: 'persisted', description: '' });
    completeQuest('q9');
    applyFeedback({ isUnderstandable: true, xpAwarded: 6 }, 'investigation');
    dismissBriefing();
    recordStatement(buildStatement({ id: 'persisted_statement' }));

    const storageRaw = localStorage.getItem('madrid-noir-v1');
    expect(storageRaw).toBeTruthy();
    const parsed = JSON.parse(storageRaw!) as { state: Record<string, unknown> };
    expect(parsed.state.investigationXp).toBe(6);
    expect(parsed.state).not.toHaveProperty('selectedNpc');
    expect(parsed.state).not.toHaveProperty('latestFeedback');
    expect(parsed.state.discoveredClues).toEqual([{ id: 'clue_persist', title: 'persisted', description: '' }]);
    expect(parsed.state.casePhase).toBe('investigation');
    expect(parsed.state.briefingSeen).toBe(true);
    expect(parsed.state).toHaveProperty('recordedStatements');
    expect(parsed.state).toHaveProperty('contradictions');
  });

  it('dismissBriefing transitions briefing → investigation and is idempotent', () => {
    const { dismissBriefing } = useGameStore.getState();
    expect(useGameStore.getState().casePhase).toBe('briefing');
    dismissBriefing();
    expect(useGameStore.getState().casePhase).toBe('investigation');
    expect(useGameStore.getState().briefingSeen).toBe(true);
    dismissBriefing();
    expect(useGameStore.getState().casePhase).toBe('investigation');
  });

  it('deduplicates recorded statements by id', () => {
    const { recordStatement } = useGameStore.getState();
    recordStatement(buildStatement());
    recordStatement(buildStatement({ value: 'replaced — should be ignored' }));
    const state = useGameStore.getState();
    expect(state.recordedStatements).toHaveLength(1);
    expect(state.recordedStatements[0]?.value).toBe('Lucía dijo llegar a las 22:30');
  });

  it('addClue does not auto-derive contradictions', () => {
    const { dismissBriefing, recordStatement, addClue } = useGameStore.getState();
    dismissBriefing();
    recordStatement(buildStatement());
    addClue({ id: 'clue_note', title: 'Nota rasgada', description: '23:40 salida trasera' });
    expect(useGameStore.getState().contradictions).toHaveLength(0);
  });

  it('recordStatement does not auto-derive contradictions', () => {
    const { dismissBriefing, recordStatement, addClue } = useGameStore.getState();
    dismissBriefing();
    addClue({ id: 'clue_note', title: 'Nota rasgada', description: '23:40 salida trasera' });
    recordStatement(buildStatement());
    expect(useGameStore.getState().contradictions).toHaveLength(0);
  });

  it('linkClueToStatement registers a valid contradiction and awards XP', () => {
    const { dismissBriefing, recordStatement, addClue, linkClueToStatement } = useGameStore.getState();
    dismissBriefing();
    recordStatement(buildStatement());
    addClue({ id: 'clue_note', title: 'Nota rasgada', description: '23:40 salida trasera' });
    const result = linkClueToStatement('clue_note', 'lucia_home_2230');
    expect(result).toEqual({ ok: true });
    const state = useGameStore.getState();
    expect(state.contradictions).toHaveLength(1);
    expect(state.contradictions[0]?.clueId).toBe('clue_note');
    expect(state.contradictions[0]?.statementId).toBe('lucia_home_2230');
    expect(state.investigationXp).toBeGreaterThan(0);
  });

  it('linkClueToStatement returns ok:false on a wrong pairing without mutating contradictions', () => {
    const { dismissBriefing, recordStatement, addClue, linkClueToStatement } = useGameStore.getState();
    dismissBriefing();
    recordStatement(
      buildStatement({ id: 'lucia_alone_home', topic: 'company', value: 'Lucía afirmó estar sola en casa' }),
    );
    addClue({ id: 'clue_note', title: 'Nota rasgada', description: '23:40 salida trasera' });
    const result = linkClueToStatement('clue_note', 'lucia_alone_home');
    expect(result).toEqual({ ok: false });
    expect(useGameStore.getState().contradictions).toHaveLength(0);
    expect(useGameStore.getState().latestFeedback?.isUnderstandable).toBe(false);
  });

  it('linkClueToStatement is idempotent when called twice with the same pair', () => {
    const { dismissBriefing, recordStatement, addClue, linkClueToStatement } = useGameStore.getState();
    dismissBriefing();
    recordStatement(buildStatement());
    addClue({ id: 'clue_note', title: 'Nota rasgada', description: '23:40 salida trasera' });
    linkClueToStatement('clue_note', 'lucia_home_2230');
    linkClueToStatement('clue_note', 'lucia_home_2230');
    expect(useGameStore.getState().contradictions).toHaveLength(1);
  });

  it('linkClueToStatement requires the clue and statement to exist in state', () => {
    const { dismissBriefing, linkClueToStatement } = useGameStore.getState();
    dismissBriefing();
    const result = linkClueToStatement('clue_note', 'lucia_home_2230');
    expect(result).toEqual({ ok: false });
    expect(useGameStore.getState().contradictions).toHaveLength(0);
  });

  it('investigation → accusation only fires once the player links a contradiction manually', () => {
    const { dismissBriefing, recordStatement, addClue, linkClueToStatement } = useGameStore.getState();
    dismissBriefing();
    recordStatement(buildStatement());
    addClue({ id: 'clue_note', title: 'Nota rasgada', description: '23:40 salida trasera' });
    addClue({ id: 'clue_receipt', title: 'Ticket', description: '' });
    addClue({ id: 'clue_glass', title: 'Vaso', description: '' });
    expect(useGameStore.getState().casePhase).toBe('investigation');
    linkClueToStatement('clue_note', 'lucia_home_2230');
    expect(useGameStore.getState().casePhase).toBe('accusation');
  });

  it('does not auto-promote during briefing phase', () => {
    const { addClue, recordStatement, linkClueToStatement } = useGameStore.getState();
    recordStatement(buildStatement());
    addClue({ id: 'clue_note', title: 'Nota rasgada', description: '23:40 salida trasera' });
    addClue({ id: 'clue_receipt', title: 'Ticket', description: '' });
    addClue({ id: 'clue_glass', title: 'Vaso', description: '' });
    linkClueToStatement('clue_note', 'lucia_home_2230');
    expect(useGameStore.getState().casePhase).toBe('briefing');
  });

  it('accuse with culprit + supporting contradiction → solved + investigation XP', () => {
    enterAccusationPhase();
    const supporting = useGameStore.getState().contradictions.map((c) => c.id);
    const xpBefore = useGameStore.getState().investigationXp;
    useGameStore.getState().accuse(CASE_001_CULPRIT, supporting);
    const state = useGameStore.getState();
    expect(state.casePhase).toBe('resolved');
    expect(state.caseResolution).toBe('solved');
    expect(state.accusedNpcId).toBe(CASE_001_CULPRIT);
    expect(state.investigationXp).toBe(xpBefore + 25);
  });

  it('accuse with wrong NPC → failed, phase resolved', () => {
    enterAccusationPhase();
    const supporting = useGameStore.getState().contradictions.map((c) => c.id);
    const xpBefore = useGameStore.getState().investigationXp;
    useGameStore.getState().accuse('npc_diego_torres', supporting);
    const state = useGameStore.getState();
    expect(state.casePhase).toBe('resolved');
    expect(state.caseResolution).toBe('failed');
    expect(state.accusedNpcId).toBe('npc_diego_torres');
    expect(state.investigationXp).toBe(xpBefore + 5);
  });

  it('accuse with no supporting contradictions → failed', () => {
    enterAccusationPhase();
    useGameStore.getState().accuse(CASE_001_CULPRIT, []);
    const state = useGameStore.getState();
    expect(state.caseResolution).toBe('failed');
  });

  it('accuse is a no-op outside accusation phase', () => {
    useGameStore.getState().dismissBriefing();
    useGameStore.getState().accuse(CASE_001_CULPRIT, ['fake_id']);
    expect(useGameStore.getState().casePhase).toBe('investigation');
    expect(useGameStore.getState().caseResolution).toBeNull();
  });

  it('locks the second location until all bar quests are complete', () => {
    const { setLocation, completeQuest } = useGameStore.getState();
    setLocation('lucia_apartment');
    expect(useGameStore.getState().currentLocationId).toBe('bar_interior');

    completeQuest('q1');
    completeQuest('q2');
    setLocation('lucia_apartment');
    expect(useGameStore.getState().currentLocationId).toBe('bar_interior');

    completeQuest('q3');
    setLocation('lucia_apartment');
    expect(useGameStore.getState().currentLocationId).toBe('lucia_apartment');
  });

  it('emits a congratulations system line when the next location unlocks', () => {
    const { completeQuest } = useGameStore.getState();
    completeQuest('q1');
    completeQuest('q2');
    expect(useGameStore.getState().dialogueHistory.some((line) => line.text.includes('¡Enhorabuena!'))).toBe(false);

    completeQuest('q3');
    const history = useGameStore.getState().dialogueHistory;
    const congrats = history.filter((line) => line.text.includes('¡Enhorabuena!'));
    expect(congrats).toHaveLength(1);
    expect(congrats[0]?.speaker).toBe('system');
    expect(congrats[0]?.text).toContain('Apartamento de Lucía');
    expect(useGameStore.getState().latestFeedback?.explanation).toContain('¡Enhorabuena!');
  });

  it('does not re-emit the congrats message when an already-unlocking quest is repeated', () => {
    const { completeQuest } = useGameStore.getState();
    completeQuest('q1');
    completeQuest('q2');
    completeQuest('q3');
    completeQuest('q3');
    const congrats = useGameStore.getState().dialogueHistory.filter((line) => line.text.includes('¡Enhorabuena!'));
    expect(congrats).toHaveLength(1);
  });

  it('locks the third location until both apartment quests are complete', () => {
    const { setLocation, completeQuest } = useGameStore.getState();
    completeQuest('q1');
    completeQuest('q2');
    completeQuest('q3');
    setLocation('argumosa_kiosk');
    expect(useGameStore.getState().currentLocationId).toBe('bar_interior');

    completeQuest('q4');
    setLocation('argumosa_kiosk');
    expect(useGameStore.getState().currentLocationId).toBe('bar_interior');

    completeQuest('q5');
    setLocation('argumosa_kiosk');
    expect(useGameStore.getState().currentLocationId).toBe('argumosa_kiosk');
  });

  it('emits a congratulations system line when Argumosa unlocks', () => {
    const { completeQuest, setLocation } = useGameStore.getState();
    completeQuest('q1');
    completeQuest('q2');
    completeQuest('q3');
    setLocation('lucia_apartment');
    completeQuest('q4');
    expect(useGameStore.getState().dialogueHistory.some((line) => line.text.includes('Argumosa'))).toBe(false);

    completeQuest('q5');
    const argumosaCongrats = useGameStore
      .getState()
      .dialogueHistory.filter((line) => line.text.includes('¡Enhorabuena!') && line.text.includes('Argumosa'));
    expect(argumosaCongrats).toHaveLength(1);
    expect(argumosaCongrats[0]?.speaker).toBe('system');
  });

  it('swaps the NPC roster to Mercedes + Inspectora at Argumosa', () => {
    const { setLocation, completeQuest } = useGameStore.getState();
    completeQuest('q1');
    completeQuest('q2');
    completeQuest('q3');
    completeQuest('q4');
    completeQuest('q5');
    setLocation('argumosa_kiosk');
    const npcIds = useGameStore.getState().npcs.map((n) => n.id);
    expect(npcIds).toEqual(['npc_mercedes_quintero', 'npc_inspectora_ruiz']);
  });
});
