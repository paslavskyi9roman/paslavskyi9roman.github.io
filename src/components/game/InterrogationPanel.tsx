'use client';

import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { DialogueLine } from '@/components/newsprint/DialogueLine';
import { NewsprintPhoto } from '@/components/newsprint/NewsprintPhoto';
import {
  ALL_BILINGUAL_REPLIES,
  ALL_NPC_OUTCOMES,
  APARTMENT_STATEMENT_IDS,
  getBilingualNpc,
} from '@/game/content/case001-merged';
import { DialogueResponseSchema } from '@/lib/dialogue/schema';
import { useGameStore } from '@/store/useGameStore';
import type { DialogueMessage } from '@/types/game';

export function InterrogationPanel() {
  const {
    currentCaseId,
    currentLocationId,
    dialogueHistory,
    selectedNpc,
    npcs,
    usedQuickReplies,
    selectNpcById,
    addPlayerLine,
    addNpcLine,
    addSystemLine,
    applyFeedback,
    recordStatement,
    recordUsedReply,
    completeQuest,
  } = useGameStore();
  const [freeText, setFreeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedNpc && npcs[0]) {
      selectNpcById(npcs[0].id);
    }
  }, [npcs, selectedNpc, selectNpcById]);

  const usedReplies = useMemo(() => {
    if (!selectedNpc) return new Set<string>();
    return new Set(usedQuickReplies[selectedNpc.id] ?? []);
  }, [usedQuickReplies, selectedNpc]);

  const availableQuickReplies = useMemo(() => {
    if (!selectedNpc) return [] as readonly string[];
    return selectedNpc.quickReplies.filter((q) => !usedReplies.has(q));
  }, [selectedNpc, usedReplies]);

  const visibleLines = useMemo(() => {
    if (!selectedNpc) return [] as DialogueMessage[];
    return dialogueHistory.filter(
      (line) => line.speaker === 'system' || line.npcId === selectedNpc.id || line.speaker === 'player',
    );
  }, [dialogueHistory, selectedNpc]);

  const handleQuickReply = (replyText: string) => {
    if (!selectedNpc) return;
    const outcome = ALL_NPC_OUTCOMES[selectedNpc.id]?.[replyText];
    if (!outcome) return;

    const contradictionsBefore = useGameStore.getState().contradictions.length;

    addPlayerLine(replyText);
    addNpcLine(outcome.reply, { id: selectedNpc.id, name: selectedNpc.name });
    applyFeedback(outcome.feedback, outcome.xpType);
    recordUsedReply(selectedNpc.id, replyText);

    if (outcome.statement) {
      recordStatement({ ...outcome.statement, npcId: selectedNpc.id, sourceReply: replyText });
    }

    if (selectedNpc.id === 'npc_lucia_vargas' && replyText === '¿A qué hora llegaste a casa?') {
      completeQuest('q1');
    }
    if (selectedNpc.id === 'npc_diego_torres' && replyText === '¿Quién pagó la última ronda?') {
      completeQuest('q3');
    }

    // q5: an apartment-borne statement that just produced a fresh contradiction.
    if (
      currentLocationId === 'lucia_apartment' &&
      selectedNpc.id === 'npc_lucia_vargas' &&
      outcome.statement &&
      APARTMENT_STATEMENT_IDS.has(outcome.statement.id)
    ) {
      const contradictionsAfter = useGameStore.getState().contradictions.length;
      if (contradictionsAfter > contradictionsBefore) {
        completeQuest('q5');
      }
    }
  };

  const submitFreeText = async (event: FormEvent) => {
    event.preventDefault();
    if (!freeText.trim() || !selectedNpc) return;

    const userText = freeText.trim();
    addPlayerLine(userText);
    setFreeText('');
    setSubmitError(null);
    setLoading(true);

    try {
      const payload = {
        userText,
        npcId: selectedNpc.id,
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

      addNpcLine(validated.data.npcReply, { id: selectedNpc.id, name: selectedNpc.name });
      applyFeedback(validated.data.feedback, 'vocabulary');
    } catch {
      addSystemLine('Sistema: Servicio temporalmente no disponible. Inténtalo de nuevo en unos segundos.');
      setSubmitError('No se pudo procesar tu mensaje. Verifica tu conexión y vuelve a intentar.');
    } finally {
      setLoading(false);
    }
  };

  const npcBilingual = selectedNpc ? getBilingualNpc(selectedNpc.id, currentLocationId) : undefined;
  const replyTranslations = selectedNpc ? ALL_BILINGUAL_REPLIES[selectedNpc.id] : undefined;

  return (
    <div
      style={{
        marginTop: 16,
        border: '2px solid var(--ink)',
        padding: 0,
        background: 'var(--paper)',
      }}
    >
      <div
        style={{
          background: 'var(--ink)',
          color: 'var(--paper)',
          padding: '6px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--sans)',
            fontSize: 11,
            letterSpacing: '0.2em',
            fontWeight: 700,
          }}
        >
          INTERROGATORIO · TRANSCRIPCIÓN OFICIAL
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>14·X·1953 · 23:52</span>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--ink)' }}>
        {npcs.map((n) => {
          const active = selectedNpc?.id === n.id;
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => selectNpcById(n.id)}
              style={{
                flex: 1,
                padding: '8px 10px',
                background: active ? 'var(--paper)' : 'var(--paper-shadow)',
                border: 'none',
                borderRight: '1px solid var(--ink)',
                cursor: 'pointer',
                fontFamily: 'var(--sans)',
                fontSize: 11,
                letterSpacing: '0.14em',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: active ? 'var(--ink)' : 'var(--ink-faded)',
                borderBottom: active ? '3px solid var(--red)' : '3px solid transparent',
              }}
            >
              {n.name}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 0 }}>
        <div
          style={{
            borderRight: '1px solid var(--ink)',
            padding: 8,
            background: 'var(--paper-shadow)',
          }}
        >
          {selectedNpc && (
            <NewsprintPhoto
              src={npcBilingual?.portrait ?? `/assets/characters/${selectedNpc.id}.png`}
              alt={selectedNpc.name}
              height={150}
            />
          )}
          <div style={{ marginTop: 6 }}>
            <div
              style={{
                fontFamily: 'var(--display)',
                fontSize: 14,
                fontWeight: 700,
                lineHeight: 1.05,
              }}
            >
              {selectedNpc?.name}
            </div>
            <div className="byline" style={{ fontSize: 9 }}>
              {selectedNpc?.role}
            </div>
          </div>
        </div>

        <div className="no-scrollbar" style={{ padding: 12, maxHeight: 280, overflowY: 'auto' }}>
          {visibleLines.length === 0 && (
            <p className="body-serif" style={{ fontStyle: 'italic', color: 'var(--ink-faded)' }}>
              Selecciona un testigo para iniciar la transcripción.
            </p>
          )}
          {visibleLines.map((line, i) => {
            if (line.speaker === 'system') {
              return <DialogueLine key={`${line.timestamp}-${i}`} role="system" text={line.text} />;
            }
            const role = line.speaker === 'player' ? 'player' : 'npc';
            const speaker = line.speaker === 'player' ? 'Detective' : (line.npcName ?? selectedNpc?.name ?? 'Testigo');

            // Resolve English translation: NPC openings use bilingual lookup;
            // player quick-replies and NPC replies use bilingual reply table.
            let en: string | undefined;
            if (selectedNpc) {
              const replies = ALL_BILINGUAL_REPLIES[selectedNpc.id];
              if (role === 'player' && replies?.[line.text]) {
                en = replies[line.text]?.qEn;
              } else if (role === 'npc') {
                const opening = getBilingualNpc(line.npcId ?? '', currentLocationId)?.openingEn;
                const replyEntry = Object.values(replies ?? {}).find(
                  (r) => ALL_NPC_OUTCOMES[selectedNpc.id]?.[r.q]?.reply === line.text,
                );
                en = replyEntry?.aEn ?? opening;
              }
            }

            return (
              <DialogueLine key={`${line.timestamp}-${i}`} role={role} speaker={speaker} text={line.text} en={en} />
            );
          })}
        </div>
      </div>

      {selectedNpc && (
        <div
          style={{
            borderTop: '1px solid var(--ink)',
            padding: 12,
            background: 'var(--paper-shadow)',
          }}
        >
          <span className="byline">Posibles preguntas</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
            {availableQuickReplies.length === 0 && (
              <p className="byline" style={{ fontStyle: 'italic', color: 'var(--ink-faded)', margin: 0 }}>
                Has agotado las preguntas guiadas. Continúa el interrogatorio en texto libre.
              </p>
            )}
            {availableQuickReplies.map((q) => {
              const qEn = replyTranslations?.[q]?.qEn;
              return (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleQuickReply(q)}
                  title={qEn}
                  style={{
                    fontFamily: 'var(--body)',
                    fontSize: 13,
                    padding: '6px 12px',
                    border: '1px solid var(--ink)',
                    background: 'var(--paper)',
                    color: 'var(--ink)',
                    cursor: 'pointer',
                    fontStyle: 'italic',
                  }}
                >
                  «{q}»
                </button>
              );
            })}
          </div>
          <form onSubmit={submitFreeText} style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <input
              value={freeText}
              onChange={(e) => {
                setFreeText(e.target.value);
                if (submitError) setSubmitError(null);
              }}
              placeholder="Escribe tu pregunta en español…"
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid var(--ink)',
                background: 'var(--paper)',
                fontFamily: 'var(--mono)',
                fontSize: 13,
                color: 'var(--ink)',
              }}
            />
            <button type="submit" disabled={loading} className="btn-news" style={{ padding: '8px 16px' }}>
              {loading ? '…' : 'Enviar'}
            </button>
          </form>
          {submitError && (
            <p className="byline" style={{ color: 'var(--red)', marginTop: 6 }}>
              {submitError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
