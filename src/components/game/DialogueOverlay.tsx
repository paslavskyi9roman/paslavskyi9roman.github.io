'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { DialogueFeedback, DialogueMessage } from '@/types/game';

const NPC = {
  id: 'npc_lucia_vargas',
  name: 'Lucía Vargas',
  openingLine: 'No vi nada esa noche. Estaba en casa.',
};

const RESPONSES = ['¿Estabas sola?', '¿A qué hora llegaste a casa?', 'No entiendo.'] as const;

const localNpcReplies: Record<(typeof RESPONSES)[number], { reply: string; feedback: DialogueFeedback; xpType: 'investigation' | 'grammar' | 'vocabulary' }> = {
  '¿Estabas sola?': {
    reply: 'Sí... sola. Mi compañera de piso estaba de viaje.',
    feedback: { isUnderstandable: true, xpAwarded: 8, explanation: 'Buena pregunta para verificar coartadas.' },
    xpType: 'investigation',
  },
  '¿A qué hora llegaste a casa?': {
    reply: 'Sobre las diez y media... creo.',
    feedback: { isUnderstandable: true, xpAwarded: 10, explanation: 'Excelente enfoque temporal para detectar contradicciones.' },
    xpType: 'investigation',
  },
  'No entiendo.': {
    reply: 'Quiero decir que no salí de casa en toda la noche.',
    feedback: {
      isUnderstandable: true,
      xpAwarded: 4,
      suggestedCorrection: 'No lo entiendo.',
      explanation: 'Añadir "lo" suena más natural en este contexto.',
    },
    xpType: 'grammar',
  },
};

export function DialogueOverlay() {
  const { currentCaseId, dialogueHistory, selectedNpc, startNpcDialogue, addPlayerLine, addNpcLine, addClue, applyFeedback } = useGameStore();
  const [freeText, setFreeText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedNpc) {
      startNpcDialogue(NPC);
    }
  }, [selectedNpc, startNpcDialogue]);

  useEffect(() => {
    const onClue = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string; title: string; description: string }>;
      addClue(customEvent.detail);
      addNpcLine('¿Encontraste algo? Ese papel no significa nada.');
      applyFeedback(
        { isUnderstandable: true, xpAwarded: 12, explanation: 'Encontraste una pista clave en la escena.' },
        'investigation',
      );
    };

    window.addEventListener('madrid-noir:clue-found', onClue);
    return () => window.removeEventListener('madrid-noir:clue-found', onClue);
  }, [addClue, addNpcLine, applyFeedback]);

  const helper = useMemo(
    () => 'Support hint (EN/UK): Ask precise timeline questions to reveal contradictions. / Підказка: уточнюй час, щоб знайти суперечності.',
    [],
  );

  const handleQuickReply = (text: (typeof RESPONSES)[number]) => {
    addPlayerLine(text);
    const outcome = localNpcReplies[text];
    addNpcLine(outcome.reply);
    applyFeedback(outcome.feedback, outcome.xpType);
  };

  const submitFreeText = async (event: FormEvent) => {
    event.preventDefault();
    if (!freeText.trim()) return;

    const userText = freeText.trim();
    addPlayerLine(userText);
    setFreeText('');
    setLoading(true);

    try {
      const payload: { userText: string; npcId: string; caseId: string; dialogueContext: DialogueMessage[] } = {
        userText,
        npcId: NPC.id,
        caseId: currentCaseId,
        dialogueContext: dialogueHistory,
      };

      const response = await fetch('/api/dialogue-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { npcReply: string; feedback: DialogueFeedback };
      addNpcLine(data.npcReply);
      applyFeedback(data.feedback, 'vocabulary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="pointer-events-auto absolute bottom-0 left-0 right-0 m-3 rounded-xl border border-slate-700 bg-noir-900/95 p-4">
      <p className="text-xs uppercase tracking-widest text-amber-300">Interrogation</p>
      <h2 className="text-lg font-semibold">{NPC.name}</h2>
      <p className="mt-1 text-sm text-slate-300">{helper}</p>
      <div className="mt-3 max-h-40 space-y-2 overflow-y-auto pr-1 text-sm">
        {dialogueHistory.map((line, idx) => (
          <p key={`${line.timestamp}-${idx}`}>
            <span className={line.speaker === 'player' ? 'text-sky-300' : 'text-rose-300'}>{line.speaker === 'player' ? 'Tú' : 'Lucía'}:</span>{' '}
            {line.text}
          </p>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {RESPONSES.map((option) => (
          <button key={option} onClick={() => handleQuickReply(option)} className="rounded-md border border-slate-600 px-3 py-1 text-sm hover:bg-noir-800">
            {option}
          </button>
        ))}
      </div>

      <form onSubmit={submitFreeText} className="mt-3 flex gap-2">
        <input
          value={freeText}
          onChange={(event) => setFreeText(event.target.value)}
          placeholder="Escribe tu respuesta en español..."
          className="w-full rounded-md border border-slate-600 bg-noir-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button disabled={loading} className="rounded-md bg-amber-400 px-4 py-2 text-sm font-medium text-noir-950 disabled:opacity-60">
          {loading ? '...' : 'Enviar'}
        </button>
      </form>
    </aside>
  );
}
