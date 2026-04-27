'use client';

import { Stamp } from '@/components/newsprint/Stamp';
import { CASE_001_BILINGUAL_NPCS, CASE_001_SCENE_CLUES } from '@/game/content/case001-bilingual';
import { useGameStore } from '@/store/useGameStore';

interface ClueJournalProps {
  open: boolean;
  onClose: () => void;
}

export function ClueJournal({ open, onClose }: ClueJournalProps) {
  const discoveredClues = useGameStore((state) => state.discoveredClues);
  const recordedStatements = useGameStore((state) => state.recordedStatements);
  const contradictions = useGameStore((state) => state.contradictions);
  const npcs = useGameStore((state) => state.npcs);

  if (!open) return null;

  const totalSceneClues = CASE_001_SCENE_CLUES.length;

  const statementsByNpc = recordedStatements.reduce<Record<string, typeof recordedStatements>>((acc, statement) => {
    (acc[statement.npcId] ??= []).push(statement);
    return acc;
  }, {});

  const sceneClueLookup = new Map(CASE_001_SCENE_CLUES.map((clue) => [clue.id, clue]));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="journal-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 12, 8, 0.85)',
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
          maxWidth: 980,
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: 0,
          border: '2px solid var(--ink)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 22px',
            borderBottom: '3px solid var(--ink)',
            background: 'var(--paper-shadow)',
          }}
        >
          <div>
            <span className="kicker">Diario del Detective · Sección Segunda</span>
            <h2 id="journal-title" className="headline" style={{ fontSize: 28, marginTop: 2 }}>
              Pruebas, Declaraciones y Contradicciones
            </h2>
          </div>
          <button onClick={onClose} className="btn-ghost" aria-label="Cerrar diario">
            Cerrar
          </button>
        </div>

        <div
          style={{
            padding: 22,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 22,
          }}
        >
          <section>
            <span className="kicker">
              Pistas Físicas · {discoveredClues.length}/{totalSceneClues}
            </span>
            <hr className="rule" style={{ marginTop: 4 }} />
            {discoveredClues.length === 0 ? (
              <p className="body-serif" style={{ fontStyle: 'italic', color: 'var(--ink-faded)' }}>
                Aún sin pruebas físicas.
              </p>
            ) : (
              discoveredClues.map((clue) => {
                const scene = sceneClueLookup.get(clue.id);
                return (
                  <div
                    key={clue.id}
                    style={{
                      padding: '10px 12px',
                      border: '1px solid var(--ink)',
                      background: 'var(--paper)',
                      marginTop: 10,
                      position: 'relative',
                    }}
                  >
                    <Stamp
                      rotate={-4}
                      style={{
                        position: 'absolute',
                        top: -10,
                        right: -8,
                        fontSize: 9,
                        padding: '3px 8px',
                      }}
                    >
                      Prueba
                    </Stamp>
                    <div
                      style={{
                        fontFamily: 'var(--display)',
                        fontSize: 15,
                        fontWeight: 800,
                      }}
                    >
                      {clue.title}
                    </div>
                    <p className="body-serif" style={{ fontSize: 12, marginTop: 4 }}>
                      {clue.description}
                    </p>
                    {scene && (
                      <div className="byline" style={{ fontSize: 9, marginTop: 6 }}>
                        {scene.titleEn} · {scene.descriptionEn}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </section>

          <section>
            <span className="kicker">Declaraciones</span>
            <hr className="rule" style={{ marginTop: 4 }} />
            {recordedStatements.length === 0 ? (
              <p className="body-serif" style={{ fontStyle: 'italic', color: 'var(--ink-faded)' }}>
                Aún sin declaraciones registradas.
              </p>
            ) : (
              Object.entries(statementsByNpc).map(([npcId, list]) => {
                const npc = npcs.find((n) => n.id === npcId);
                const portrait = CASE_001_BILINGUAL_NPCS[npcId]?.portrait ?? `/assets/characters/${npcId}.png`;
                return (
                  <div
                    key={npcId}
                    style={{
                      marginTop: 10,
                      padding: 10,
                      border: '1px solid var(--ink)',
                      background: 'var(--paper)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={portrait}
                        alt={npc?.name ?? npcId}
                        width={28}
                        height={36}
                        style={{ objectFit: 'cover', filter: 'sepia(0.4) contrast(1.2)' }}
                      />
                      <div
                        style={{
                          fontFamily: 'var(--display)',
                          fontWeight: 800,
                          fontSize: 14,
                        }}
                      >
                        {npc?.name ?? npcId}
                      </div>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0' }}>
                      {list.map((s) => (
                        <li
                          key={s.id}
                          className="body-serif"
                          style={{
                            fontSize: 12,
                            padding: '4px 0',
                            borderBottom: '1px dotted var(--ink-faded)',
                          }}
                        >
                          <span className="byline" style={{ fontSize: 9 }}>
                            [{s.topic}]
                          </span>{' '}
                          {s.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })
            )}
          </section>

          <section>
            <span className="kicker" style={{ color: 'var(--red)' }}>
              ⚡ Contradicciones · {contradictions.length}
            </span>
            <hr className="rule-thick" style={{ marginTop: 4, borderTopColor: 'var(--red)' }} />
            {contradictions.length === 0 ? (
              <p className="body-serif" style={{ fontStyle: 'italic', color: 'var(--ink-faded)' }}>
                Sin grietas detectadas. Aún.
              </p>
            ) : (
              contradictions.map((c) => {
                const clue = discoveredClues.find((x) => x.id === c.clueId);
                const stmt = recordedStatements.find((x) => x.id === c.statementId);
                const npc = npcs.find((x) => x.id === c.npcId);
                return (
                  <div
                    key={c.id}
                    style={{
                      marginTop: 10,
                      padding: 12,
                      border: '2px solid var(--red)',
                      background: 'rgba(164, 24, 24, 0.05)',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--display)',
                        fontSize: 14,
                        fontWeight: 800,
                        color: 'var(--red-deep)',
                      }}
                    >
                      vs. {npc?.name ?? c.npcId}
                    </div>
                    <div className="body-serif" style={{ fontSize: 12, marginTop: 6 }}>
                      <strong>Pista:</strong> {clue?.title ?? c.clueId}
                    </div>
                    <div
                      style={{
                        textAlign: 'center',
                        margin: '6px 0',
                        fontFamily: 'var(--display)',
                        fontSize: 18,
                        fontStyle: 'italic',
                        color: 'var(--red-deep)',
                      }}
                    >
                      ↯
                    </div>
                    <div className="body-serif" style={{ fontSize: 12 }}>
                      <strong>Declaración:</strong> {stmt?.value ?? c.statementId}
                    </div>
                  </div>
                );
              })
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
