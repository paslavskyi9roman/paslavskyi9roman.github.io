'use client';

import Image from 'next/image';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { type DialogueMessage } from '@/types/game';
import { DialogueResponseSchema } from '@/lib/dialogue/schema';
import { CASE_001_ROUTE_QUEST_REQUIRED_CLUES, NPC_OUTCOMES } from '@/game/content/case001';

export function DialogueOverlay() {
  const {
    currentCaseId,
    dialogueHistory,
    selectedNpc,
    npcs,
    selectNpcById,
    addPlayerLine,
    addNpcLine,
    addSystemLine,
    addClue,
    completeQuest,
    applyFeedback,
  } = useGameStore();
  const [freeText, setFreeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedNpc && npcs[0]) {
      selectNpcById(npcs[0].id);
    }
  }, [npcs, selectedNpc, selectNpcById]);

  useEffect(() => {
    const onClue = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string; title: string; description: string }>;

      const { discoveredClues } = useGameStore.getState();
      const clueAlreadyDiscovered = discoveredClues.some((clue) => clue.id === customEvent.detail.id);
      if (clueAlreadyDiscovered) {
        return;
      }

      addClue(customEvent.detail);
      const nextDiscoveredCount = useGameStore.getState().discoveredClues.length;
      addNpcLine('¿Encontraste algo? Esa pista cambia la línea temporal.');
      if (nextDiscoveredCount >= CASE_001_ROUTE_QUEST_REQUIRED_CLUES) {
        completeQuest('q2');
      }
      applyFeedback(
        { isUnderstandable: true, xpAwarded: 12, explanation: 'Encontraste una pista clave en la escena.' },
        'investigation',
      );
    };
    const onNpcSelected = (event: Event) => {
      const customEvent = event as CustomEvent<{ npcId: string }>;
      selectNpcById(customEvent.detail.npcId);
    };

    window.addEventListener('madrid-noir:clue-found', onClue);
    window.addEventListener('madrid-noir:npc-selected', onNpcSelected);
    return () => {
      window.removeEventListener('madrid-noir:clue-found', onClue);
      window.removeEventListener('madrid-noir:npc-selected', onNpcSelected);
    };
  }, [addClue, addNpcLine, applyFeedback, completeQuest, selectNpcById, selectedNpc]);

  const helper = useMemo(
    () =>
      'Nota bilingüe intencional (ES/EN): pregunta por horarios concretos para revelar contradicciones. / Intentional bilingual hint (ES/EN): ask precise timeline questions to reveal contradictions.',
    [],
  );

  const handleQuickReply = (text: string) => {
    if (!selectedNpc) return;
    addPlayerLine(text);
    const outcome = NPC_OUTCOMES[selectedNpc.id]?.[text];
    if (!outcome) return;
    addNpcLine(outcome.reply, { id: selectedNpc.id, name: selectedNpc.name });
    applyFeedback(outcome.feedback, outcome.xpType);
    if (selectedNpc.id === 'npc_lucia_vargas' && text === '¿A qué hora llegaste a casa?') {
      completeQuest('q1');
    }
    if (selectedNpc.id === 'npc_diego_torres' && text === '¿Quién pagó la última ronda?') {
      completeQuest('q3');
    }
  };

  const submitFreeText = async (event: FormEvent) => {
    event.preventDefault();
    if (!freeText.trim()) return;

    const userText = freeText.trim();
    addPlayerLine(userText);
    setFreeText('');
    setSubmitError(null);
    setLoading(true);

    try {
      const payload: { userText: string; npcId: string; caseId: string; dialogueContext: DialogueMessage[] } = {
        userText,
        npcId: selectedNpc?.id ?? 'npc_lucia_vargas',
        caseId: currentCaseId,
        dialogueContext: dialogueHistory,
      };

      const response = await fetch('/api/dialogue-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Dialogue feedback service returned a non-success status.');
      }

      const data = (await response.json()) as unknown;
      const validated = DialogueResponseSchema.safeParse(data);
      if (!validated.success) {
        throw new Error('Dialogue feedback payload is malformed.');
      }

      addNpcLine(validated.data.npcReply, selectedNpc ? { id: selectedNpc.id, name: selectedNpc.name } : undefined);
      applyFeedback(validated.data.feedback, 'vocabulary');
    } catch {
      addSystemLine('Sistema: Servicio temporalmente no disponible. Inténtalo de nuevo en unos segundos.');
      setSubmitError('No se pudo procesar tu mensaje. Verifica tu conexión y vuelve a intentar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="pointer-events-auto absolute bottom-0 left-0 right-0 m-3 rounded-xl border border-slate-700 bg-noir-900/95 p-4">
      <div className="flex gap-4">
        {selectedNpc && (
          <div className="relative h-44 w-32 shrink-0 overflow-hidden rounded-md border border-amber-400/30 shadow-lg shadow-black/40 md:h-56 md:w-40">
            <Image
              src={`/assets/characters/${selectedNpc.id}.png`}
              alt={selectedNpc.name}
              fill
              sizes="(min-width: 768px) 160px, 128px"
              className="object-cover object-top"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-widest text-amber-300">Interrogatorio</p>
          <h2 className="text-lg font-semibold">{selectedNpc?.name ?? 'Selecciona un NPC'}</h2>
          <p className="mt-1 text-sm text-slate-300">{helper}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {npcs.map((npc) => (
              <button
                key={npc.id}
                onClick={() => selectNpcById(npc.id)}
                className={`rounded-md border px-2 py-1 text-xs ${selectedNpc?.id === npc.id ? 'border-amber-300 bg-amber-200/10' : 'border-slate-600'}`}
              >
                {npc.name}
              </button>
            ))}
          </div>
          <div className="mt-3 max-h-40 space-y-2 overflow-y-auto pr-1 text-sm">
            {dialogueHistory.map((line, idx) => (
              <p key={`${line.timestamp}-${idx}`}>
                <span
                  className={
                    line.speaker === 'player'
                      ? 'text-sky-300'
                      : line.speaker === 'system'
                        ? 'text-amber-300'
                        : 'text-rose-300'
                  }
                >
                  {line.speaker === 'player' ? 'Tú' : line.speaker === 'system' ? 'Sistema' : (line.npcName ?? 'NPC')}:
                </span>{' '}
                {line.text}
              </p>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {(selectedNpc?.quickReplies ?? []).map((option) => (
              <button
                key={option}
                onClick={() => handleQuickReply(option)}
                className="rounded-md border border-slate-600 px-3 py-1 text-sm hover:bg-noir-800"
              >
                {option}
              </button>
            ))}
          </div>

          <form onSubmit={submitFreeText} className="mt-3 flex gap-2">
            <input
              value={freeText}
              onChange={(event) => {
                setFreeText(event.target.value);
                if (submitError) setSubmitError(null);
              }}
              placeholder="Escribe tu respuesta en español..."
              className="w-full rounded-md border border-slate-600 bg-noir-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              disabled={loading}
              className="rounded-md bg-amber-400 px-4 py-2 text-sm font-medium text-noir-950 disabled:opacity-60"
            >
              {loading ? '...' : 'Enviar'}
            </button>
          </form>
          {submitError && <p className="mt-2 text-xs text-amber-300">{submitError}</p>}
        </div>
      </div>
    </aside>
  );
}
