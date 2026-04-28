'use client';

import { Es } from '@/components/newsprint/Es';
import { Stamp } from '@/components/newsprint/Stamp';
import {
  CASE_001_BILINGUAL_NPCS,
  CASE_001_BILINGUAL_REPLIES,
  CASE_001_SCENE_CLUES,
} from '@/game/content/case001-bilingual';
import { APARTMENT_BILINGUAL_REPLIES, APARTMENT_SCENE_CLUES } from '@/game/content/case001-apartment-bilingual';
import { ARGUMOSA_BILINGUAL_REPLIES, ARGUMOSA_SCENE_CLUES } from '@/game/content/case001-argumosa-bilingual';
import { NPC_OUTCOMES } from '@/game/content/case001';
import { APARTMENT_NPC_OUTCOMES } from '@/game/content/case001-apartment';
import { ARGUMOSA_NPC_OUTCOMES } from '@/game/content/case001-argumosa';
import { useGameStore } from '@/store/useGameStore';
import type { LocationId } from '@/game/content/locations';
import { LOCATIONS, LOCATION_ORDER } from '@/game/content/locations';

const ALL_SCENE_CLUES = [...CASE_001_SCENE_CLUES, ...APARTMENT_SCENE_CLUES, ...ARGUMOSA_SCENE_CLUES];

const STATEMENT_VALUE_EN: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  const sources: Array<[typeof NPC_OUTCOMES, typeof CASE_001_BILINGUAL_REPLIES]> = [
    [NPC_OUTCOMES, CASE_001_BILINGUAL_REPLIES],
    [APARTMENT_NPC_OUTCOMES, APARTMENT_BILINGUAL_REPLIES],
    [ARGUMOSA_NPC_OUTCOMES, ARGUMOSA_BILINGUAL_REPLIES],
  ];
  for (const [outcomes, bilingual] of sources) {
    for (const [npcId, replies] of Object.entries(outcomes)) {
      for (const [question, outcome] of Object.entries(replies)) {
        const en = bilingual[npcId]?.[question]?.statementValueEn;
        if (outcome.statement && en) {
          map[outcome.statement.id] = en;
        }
      }
    }
  }
  return map;
})();

const CLUE_LOCATION: Record<string, LocationId> = {
  ...Object.fromEntries(CASE_001_SCENE_CLUES.map((c) => [c.id, 'bar_interior' as LocationId])),
  ...Object.fromEntries(APARTMENT_SCENE_CLUES.map((c) => [c.id, 'lucia_apartment' as LocationId])),
  ...Object.fromEntries(ARGUMOSA_SCENE_CLUES.map((c) => [c.id, 'argumosa_kiosk' as LocationId])),
};

const NPC_LOCATION: Record<string, LocationId> = {
  ...Object.fromEntries(Object.keys(NPC_OUTCOMES).map((id) => [id, 'bar_interior' as LocationId])),
  ...Object.fromEntries(Object.keys(APARTMENT_NPC_OUTCOMES).map((id) => [id, 'lucia_apartment' as LocationId])),
  ...Object.fromEntries(Object.keys(ARGUMOSA_NPC_OUTCOMES).map((id) => [id, 'argumosa_kiosk' as LocationId])),
};

interface ClueJournalProps {
  open: boolean;
  onClose: () => void;
}

export function ClueJournal({ open, onClose }: ClueJournalProps) {
  const discoveredClues = useGameStore((state) => state.discoveredClues);
  const recordedStatements = useGameStore((state) => state.recordedStatements);
  const contradictions = useGameStore((state) => state.contradictions);
  const npcs = useGameStore((state) => state.npcs);
  const currentLocationId = useGameStore((state) => state.currentLocationId);

  if (!open) return null;

  const totalSceneClues = ALL_SCENE_CLUES.length;

  const sceneClueLookup = new Map(ALL_SCENE_CLUES.map((clue) => [clue.id, clue]));

  const cluesByLocation = discoveredClues.reduce<Record<string, typeof discoveredClues>>((acc, clue) => {
    const locId = CLUE_LOCATION[clue.id];
    if (!locId) return acc;
    (acc[locId] ??= []).push(clue);
    return acc;
  }, {});

  const statementsByLocation = recordedStatements.reduce<Record<string, typeof recordedStatements>>(
    (acc, statement) => {
      const locId = NPC_LOCATION[statement.npcId];
      if (!locId) return acc;
      (acc[locId] ??= []).push(statement);
      return acc;
    },
    {},
  );

  const contradictionsByLocation = contradictions.reduce<Record<string, typeof contradictions>>((acc, c) => {
    const locId = NPC_LOCATION[c.npcId];
    if (!locId) return acc;
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
          {LOCATION_ORDER.map((locId) => {
            const locClues = cluesByLocation[locId] ?? [];
            const locStatements = statementsByLocation[locId] ?? [];
            const locContradictions = contradictionsByLocation[locId] ?? [];
            if (locClues.length === 0 && locStatements.length === 0 && locContradictions.length === 0) {
              return null;
            }
            const isCurrent = locId === currentLocationId;
            const loc = LOCATIONS[locId];
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
                                  {STATEMENT_VALUE_EN[s.id] ? (
                                    <Es es={s.value} en={STATEMENT_VALUE_EN[s.id]!} />
                                  ) : (
                                    s.value
                                  )}
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
                      const stmtEn = STATEMENT_VALUE_EN[c.statementId];
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
