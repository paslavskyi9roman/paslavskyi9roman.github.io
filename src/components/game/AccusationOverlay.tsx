'use client';

import { useState } from 'react';
import { Masthead } from '@/components/newsprint/Masthead';
import { NewsprintPhoto } from '@/components/newsprint/NewsprintPhoto';
import { Stamp } from '@/components/newsprint/Stamp';
import { getCaseDefinition } from '@/game/content/cases';
import { useGameStore } from '@/store/useGameStore';

interface AccusationOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function AccusationOverlay({ open, onClose }: AccusationOverlayProps) {
  const currentCaseId = useGameStore((state) => state.currentCaseId);
  const npcs = useGameStore((state) => state.npcs);
  const contradictions = useGameStore((state) => state.contradictions);
  const recordedStatements = useGameStore((state) => state.recordedStatements);
  const discoveredClues = useGameStore((state) => state.discoveredClues);
  const casePhase = useGameStore((state) => state.casePhase);
  const caseResolution = useGameStore((state) => state.caseResolution);
  const accusedNpcId = useGameStore((state) => state.accusedNpcId);
  const accuse = useGameStore((state) => state.accuse);

  const [selectedNpcId, setSelectedNpcId] = useState<string | null>(null);
  const [selectedContradictionIds, setSelectedContradictionIds] = useState<Set<string>>(new Set());

  if (!open) return null;

  const caseDef = getCaseDefinition(currentCaseId);
  const isResolved = casePhase === 'resolved';
  const accusableNpcs = npcs.filter((n) => n.id !== 'npc_inspectora_ruiz');
  const accusedNpc = npcs.find((n) => n.id === accusedNpcId);

  const toggleContradiction = (id: string) => {
    setSelectedContradictionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const submit = () => {
    if (!selectedNpcId) return;
    accuse(selectedNpcId, [...selectedContradictionIds]);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="accusation-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 12, 8, 0.9)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        className="paper"
        style={{
          maxWidth: 820,
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: 0,
          border: '2px solid var(--ink)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ padding: '0 32px' }}>
          <Masthead small subtitle="Edición Extraordinaria · El Veredicto" subtitleEn="Special Edition · The Verdict" />
        </div>

        {isResolved ? (
          <div style={{ padding: '8px 32px 32px', textAlign: 'center' }}>
            <span className="kicker">Edición de medianoche</span>
            <h1 id="accusation-title" className="headline" style={{ fontSize: 64, lineHeight: 0.95, marginTop: 6 }}>
              {caseResolution === 'solved' ? (
                <>
                  CASO <em style={{ fontStyle: 'italic', color: 'var(--red-deep)' }}>RESUELTO</em>
                </>
              ) : (
                <>
                  ACUSACIÓN <em style={{ fontStyle: 'italic', color: 'var(--red-deep)' }}>FALLIDA</em>
                </>
              )}
            </h1>
            <hr className="rule-fancy" style={{ margin: '14px auto', width: '60%' }} />
            <p className="body-serif" style={{ maxWidth: 520, margin: '12px auto', fontSize: 15 }}>
              {caseResolution === 'solved' ? (
                <>
                  Acusaste a <strong>{accusedNpc?.name ?? accusedNpcId}</strong> con pruebas físicas que rompen su
                  coartada. Madrid duerme un poco mejor esta noche.{' '}
                  <span className="handwritten" style={{ fontSize: 22 }}>
                    {' '}
                    +{caseDef.accusation.solvedXp} XP
                  </span>
                </>
              ) : (
                <>
                  Acusaste a <strong>{accusedNpc?.name ?? accusedNpcId}</strong>, pero las pruebas no sostienen la
                  acusación. El verdadero culpable sigue suelto.
                </>
              )}
            </p>
            <Stamp rotate={-6} color={caseResolution === 'solved' ? 'red' : 'blue'} className="stamp-classified">
              {caseResolution === 'solved' ? 'Caso cerrado' : 'Reabierto'}
            </Stamp>
            <div style={{ marginTop: 24 }}>
              <button onClick={onClose} className="btn-news">
                Volver al expediente
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '8px 32px 28px' }}>
            <span className="kicker">Acusación formal · Fiscalía de Madrid</span>
            <h2 id="accusation-title" className="headline" style={{ fontSize: 36, marginTop: 4 }}>
              ¿A quién señala?
            </h2>
            <hr className="rule-thick" style={{ margin: '10px 0 18px' }} />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}
            >
              {accusableNpcs.map((npc) => {
                const portrait = caseDef.bilingualNpcs[npc.id]?.portrait ?? `/assets/characters/${npc.id}.png`;
                const selected = selectedNpcId === npc.id;
                return (
                  <button
                    key={npc.id}
                    onClick={() => setSelectedNpcId(npc.id)}
                    style={{
                      display: 'flex',
                      gap: 12,
                      padding: 10,
                      alignItems: 'center',
                      border: selected ? '3px solid var(--red)' : '2px solid var(--ink)',
                      background: selected ? 'rgba(164, 24, 24, 0.08)' : 'var(--paper)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 70,
                        flexShrink: 0,
                        position: 'relative',
                      }}
                    >
                      <NewsprintPhoto src={portrait} alt={npc.name} height={70} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--display)',
                          fontSize: 18,
                          fontWeight: 800,
                        }}
                      >
                        {npc.name}
                      </div>
                      <div className="byline">{npc.role}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 20 }}>
              <span className="kicker" style={{ color: 'var(--red)' }}>
                ⚡ Pruebas para sostener la acusación
              </span>
              <hr className="rule" style={{ marginTop: 4 }} />
              {contradictions.length === 0 ? (
                <p className="body-serif" style={{ fontStyle: 'italic', marginTop: 8 }}>
                  No hay contradicciones registradas. La fiscalía rechazará la acusación.
                </p>
              ) : (
                contradictions.map((c) => {
                  const clue = discoveredClues.find((x) => x.id === c.clueId);
                  const stmt = recordedStatements.find((x) => x.id === c.statementId);
                  const checked = selectedContradictionIds.has(c.id);
                  return (
                    <label
                      key={c.id}
                      style={{
                        display: 'flex',
                        gap: 10,
                        padding: 10,
                        border: '1px solid var(--ink)',
                        background: checked ? 'rgba(164, 24, 24, 0.06)' : 'var(--paper)',
                        marginTop: 8,
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleContradiction(c.id)}
                        style={{ marginTop: 4 }}
                      />
                      <div className="body-serif" style={{ fontSize: 13 }}>
                        <strong>{clue?.title ?? c.clueId}</strong> contradice <em>{stmt?.value ?? c.statementId}</em>
                      </div>
                    </label>
                  );
                })
              )}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
                marginTop: 22,
              }}
            >
              <button onClick={onClose} className="btn-ghost">
                Cancelar
              </button>
              <button
                onClick={submit}
                disabled={!selectedNpcId}
                className="btn-red"
                style={{ opacity: !selectedNpcId ? 0.5 : 1 }}
              >
                Formular acusación
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
