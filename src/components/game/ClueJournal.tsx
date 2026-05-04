'use client';

import { useState } from 'react';
import { Es } from '@/components/newsprint/Es';
import { Stamp } from '@/components/newsprint/Stamp';
import { getAllSceneClues, getCaseDefinition, getStatementValueTranslations } from '@/game/content/cases';
import { useGameStore } from '@/store/useGameStore';
import type { LocationId } from '@/types/game';

interface ClueJournalProps {
  open: boolean;
  onClose: () => void;
}

export function ClueJournal({ open, onClose }: ClueJournalProps) {
  const currentCaseId = useGameStore((state) => state.currentCaseId);
  const discoveredClues = useGameStore((state) => state.discoveredClues);
  const recordedStatements = useGameStore((state) => state.recordedStatements);
  const contradictions = useGameStore((state) => state.contradictions);
  const npcs = useGameStore((state) => state.npcs);
  const currentLocationId = useGameStore((state) => state.currentLocationId);
  const linkClueToStatement = useGameStore((state) => state.linkClueToStatement);
  const [linkingClueId, setLinkingClueId] = useState<string | null>(null);

  if (!open) return null;

  const caseDef = getCaseDefinition(currentCaseId);
  const allSceneClues = getAllSceneClues(caseDef);
  const totalSceneClues = allSceneClues.length;
  const statementValueEn = getStatementValueTranslations(caseDef);

  const sceneClueLookup = new Map(allSceneClues.map((clue) => [clue.id, clue]));
  const clueLocation = Object.fromEntries(
    caseDef.locationOrder.flatMap((locId) => (caseDef.sceneCluesByLocation[locId] ?? []).map((c) => [c.id, locId])),
  ) as Record<string, LocationId>;
  const npcLocation = Object.fromEntries(
    caseDef.locationOrder.flatMap((locId) => (caseDef.locationNpcIds[locId] ?? []).map((npcId) => [npcId, locId])),
  ) as Record<string, LocationId>;

  const cluesByLocation = discoveredClues.reduce<Record<string, typeof discoveredClues>>((acc, clue) => {
    const locId = clueLocation[clue.id];
    if (!locId) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[ClueJournal] unmapped clue', clue.id);
      }
      return acc;
    }
    (acc[locId] ??= []).push(clue);
    return acc;
  }, {});

  const statementsByLocation = recordedStatements.reduce<Record<string, typeof recordedStatements>>(
    (acc, statement) => {
      const locId = npcLocation[statement.npcId];
      if (!locId) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[ClueJournal] unmapped NPC for statement', statement.npcId);
        }
        return acc;
      }
      (acc[locId] ??= []).push(statement);
      return acc;
    },
    {},
  );

  const contradictionsByLocation = contradictions.reduce<Record<string, typeof contradictions>>((acc, c) => {
    const locId = npcLocation[c.npcId];
    if (!locId) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[ClueJournal] unmapped NPC for contradiction', c.npcId);
      }
      return acc;
    }
    (acc[locId] ??= []).push(c);
    return acc;
  }, {});

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
            <span className="kicker">
              <Es es="Diario del Detective · Sección Segunda" en="Detective's Journal · Second Section" />
            </span>
            <h2 id="journal-title" className="headline" style={{ fontSize: 28, marginTop: 2 }}>
              <Es es="Pruebas, Declaraciones y Contradicciones" en="Evidence, Statements and Contradictions" />
            </h2>
          </div>
          <button onClick={onClose} className="btn-ghost" aria-label="Cerrar diario">
            <Es es="Cerrar" en="Close" />
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 16,
            padding: '8px 22px',
            borderBottom: '1px solid var(--ink)',
            fontFamily: 'var(--sans)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          <span>
            <Es es="Pistas" en="Clues" /> {discoveredClues.length}/{totalSceneClues}
          </span>
          <span aria-hidden>·</span>
          <span>
            <Es es="Declaraciones" en="Statements" /> {recordedStatements.length}
          </span>
          <span aria-hidden>·</span>
          <span style={{ color: 'var(--red-deep)' }}>
            ⚡ <Es es="Contradicciones" en="Contradictions" /> {contradictions.length}
          </span>
        </div>

        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {caseDef.locationOrder.map((locId) => {
            const locClues = cluesByLocation[locId] ?? [];
            const locStatements = statementsByLocation[locId] ?? [];
            const locContradictions = contradictionsByLocation[locId] ?? [];
            if (locClues.length === 0 && locStatements.length === 0 && locContradictions.length === 0) {
              return null;
            }
            const isCurrent = locId === currentLocationId;
            const loc = caseDef.locations[locId]!;
            const summary = (
              <span
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                <Es es={loc.name.es} en={loc.name.en} />
                {' · '}
                {locClues.length} <Es es="pistas" en="clues" />
                {' · '}
                {locStatements.length} <Es es="decl." en="stmts" />
                {locContradictions.length > 0 && (
                  <>
                    {' · '}
                    <span style={{ color: 'var(--red-deep)' }}>{locContradictions.length} ⚡</span>
                  </>
                )}
              </span>
            );

            const body = (
              <div style={{ padding: '12px 0 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
                {/* Pistas Físicas */}
                <section>
                  <span className="kicker">
                    <Es es="Pistas Físicas" en="Physical Evidence" />
                  </span>
                  <hr className="rule" style={{ marginTop: 4 }} />
                  {locClues.length === 0 ? (
                    <p className="body-serif" style={{ fontStyle: 'italic', color: 'var(--ink-faded)' }}>
                      <Es es="Aún sin pruebas físicas." en="No physical evidence yet." />
                    </p>
                  ) : (
                    locClues.map((clue) => {
                      const scene = sceneClueLookup.get(clue.id);
                      const linkedContradiction = contradictions.find((cx) => cx.clueId === clue.id);
                      const isLinking = linkingClueId === clue.id;
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
                            style={{ position: 'absolute', top: -10, right: -8, fontSize: 9, padding: '3px 8px' }}
                          >
                            <Es es="Prueba" en="Evidence" />
                          </Stamp>
                          <div style={{ fontFamily: 'var(--display)', fontSize: 15, fontWeight: 800 }}>
                            {scene ? <Es es={clue.title} en={scene.titleEn} /> : clue.title}
                          </div>
                          <p className="body-serif" style={{ fontSize: 12, marginTop: 4 }}>
                            {scene ? <Es es={clue.description} en={scene.descriptionEn} /> : clue.description}
                          </p>

                          <div
                            style={{
                              marginTop: 8,
                              paddingTop: 6,
                              borderTop: '1px dotted var(--ink-faded)',
                            }}
                          >
                            {linkedContradiction ? (
                              <Stamp rotate={-3} style={{ fontSize: 9, padding: '3px 8px' }}>
                                <Es es="Contradicción registrada" en="Contradiction registered" />
                              </Stamp>
                            ) : recordedStatements.length === 0 ? (
                              <span
                                className="byline"
                                style={{ fontSize: 10, color: 'var(--ink-faded)', fontStyle: 'italic' }}
                              >
                                <Es
                                  es="Aún no hay declaraciones que vincular."
                                  en="No statements yet to link against."
                                />
                              </span>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="btn-ghost"
                                  style={{ padding: '4px 8px', fontSize: 10 }}
                                  onClick={() => setLinkingClueId(isLinking ? null : clue.id)}
                                  aria-expanded={isLinking}
                                >
                                  {isLinking ? (
                                    <Es es="Cancelar vínculo" en="Cancel link" />
                                  ) : (
                                    <Es es="Vincular a una declaración…" en="Link to a statement…" />
                                  )}
                                </button>
                                {isLinking && (
                                  <ul
                                    style={{
                                      listStyle: 'none',
                                      padding: 0,
                                      margin: '8px 0 0',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: 4,
                                    }}
                                  >
                                    {recordedStatements.map((stmt) => {
                                      const npc = npcs.find((n) => n.id === stmt.npcId);
                                      return (
                                        <li key={stmt.id}>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              linkClueToStatement(clue.id, stmt.id);
                                              setLinkingClueId(null);
                                            }}
                                            style={{
                                              width: '100%',
                                              textAlign: 'left',
                                              padding: '6px 8px',
                                              border: '1px solid var(--ink-faded)',
                                              background: 'var(--paper-shadow)',
                                              cursor: 'pointer',
                                              fontFamily: 'var(--body)',
                                              fontSize: 12,
                                              lineHeight: 1.4,
                                            }}
                                          >
                                            <span className="byline" style={{ fontSize: 9 }}>
                                              [{npc?.name ?? stmt.npcId} · {stmt.topic}]
                                            </span>{' '}
                                            {stmt.value}
                                          </button>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  {locId === 'lucia_apartment' && discoveredClues.some((c) => c.id === 'apt_clue_grey_coat') && (
                    <div
                      style={{
                        marginTop: 14,
                        padding: '10px 12px',
                        border: '1px dashed var(--ink)',
                        background: 'var(--paper-shadow)',
                        position: 'relative',
                      }}
                    >
                      <Stamp
                        rotate={-3}
                        color="red"
                        style={{ position: 'absolute', top: -10, right: -8, fontSize: 9, padding: '3px 8px' }}
                      >
                        <Es es="Persona de interés" en="Person of interest" />
                      </Stamp>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/assets/characters/npc_hotel_atocha_man.png"
                          alt="Sospechoso sin identificar"
                          width={56}
                          height={72}
                          style={{ objectFit: 'cover', filter: 'sepia(0.4) contrast(1.2)' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: 'var(--display)', fontSize: 14, fontWeight: 800 }}>
                            <Es es="Identidad desconocida" en="Unknown identity" />
                          </div>
                          <p className="body-serif" style={{ fontSize: 12, marginTop: 4 }}>
                            <Es
                              es="Hombre del abrigo gris · Hotel Atocha. Anillo de sello, manos cuidadas."
                              en="The man in the grey coat · Hotel Atocha. Signet ring, well-kept hands."
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Declaraciones */}
                <section>
                  <span className="kicker">
                    <Es es="Declaraciones" en="Statements" />
                  </span>
                  <hr className="rule" style={{ marginTop: 4 }} />
                  {locStatements.length === 0 ? (
                    <p className="body-serif" style={{ fontStyle: 'italic', color: 'var(--ink-faded)' }}>
                      <Es es="Aún sin declaraciones registradas." en="No statements recorded yet." />
                    </p>
                  ) : (
                    (() => {
                      const grouped = locStatements.reduce<Record<string, typeof locStatements>>((acc, s) => {
                        (acc[s.npcId] ??= []).push(s);
                        return acc;
                      }, {});
                      return Object.entries(grouped).map(([npcId, list]) => {
                        const npc = npcs.find((n) => n.id === npcId);
                        const portrait = caseDef.bilingualNpcs[npcId]?.portrait ?? `/assets/characters/${npcId}.png`;
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={portrait}
                                alt={npc?.name ?? npcId}
                                width={28}
                                height={36}
                                style={{ objectFit: 'cover', filter: 'sepia(0.4) contrast(1.2)' }}
                              />
                              <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 14 }}>
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
                                  {statementValueEn[s.id] ? <Es es={s.value} en={statementValueEn[s.id]!} /> : s.value}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      });
                    })()
                  )}
                </section>

                {/* Contradicciones */}
                <section>
                  <span className="kicker" style={{ color: 'var(--red)' }}>
                    ⚡ <Es es="Contradicciones" en="Contradictions" />
                  </span>
                  <hr className="rule-thick" style={{ marginTop: 4, borderTopColor: 'var(--red)' }} />
                  {locContradictions.length === 0 ? (
                    <p className="body-serif" style={{ fontStyle: 'italic', color: 'var(--ink-faded)' }}>
                      <Es es="Sin grietas detectadas. Aún." en="No cracks detected. Yet." />
                    </p>
                  ) : (
                    locContradictions.map((c) => {
                      const clue = discoveredClues.find((x) => x.id === c.clueId);
                      const clueScene = sceneClueLookup.get(c.clueId);
                      const stmt = recordedStatements.find((x) => x.id === c.statementId);
                      const stmtEn = statementValueEn[c.statementId];
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
                            <Es es="vs." en="vs." /> {npc?.name ?? c.npcId}
                          </div>
                          <div className="body-serif" style={{ fontSize: 12, marginTop: 6 }}>
                            <strong>
                              <Es es="Pista:" en="Clue:" />
                            </strong>{' '}
                            {clue && clueScene ? (
                              <Es es={clue.title} en={clueScene.titleEn} />
                            ) : (
                              (clue?.title ?? c.clueId)
                            )}
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
                            <strong>
                              <Es es="Declaración:" en="Statement:" />
                            </strong>{' '}
                            {stmt && stmtEn ? <Es es={stmt.value} en={stmtEn} /> : (stmt?.value ?? c.statementId)}
                          </div>
                        </div>
                      );
                    })
                  )}
                </section>
              </div>
            );

            if (isCurrent) {
              return (
                <div key={locId} style={{ borderTop: '2px solid var(--ink)', paddingTop: 10 }}>
                  <div style={{ padding: '4px 0' }}>{summary}</div>
                  {body}
                </div>
              );
            }
            return (
              <details key={locId} style={{ borderTop: '1px solid var(--ink)', paddingTop: 8, opacity: 0.55 }}>
                <summary style={{ cursor: 'pointer', padding: '4px 0', listStyle: 'revert' }}>{summary}</summary>
                {body}
              </details>
            );
          })}
          {discoveredClues.length === 0 && recordedStatements.length === 0 && contradictions.length === 0 && (
            <p className="body-serif" style={{ fontStyle: 'italic', color: 'var(--ink-faded)', padding: 8 }}>
              <Es es="El cuaderno aún está en blanco." en="The notebook is still blank." />
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
