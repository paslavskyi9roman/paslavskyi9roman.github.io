'use client';

import { NewsprintPhoto } from '@/components/newsprint/NewsprintPhoto';
import { CASE_001_SCENE_CLUES, type SceneClue } from '@/game/content/case001-bilingual';
import { useGameStore } from '@/store/useGameStore';
import { CASE_001_ROUTE_QUEST_REQUIRED_CLUES } from '@/game/content/case001';

export function BarScene() {
  const discoveredClues = useGameStore((state) => state.discoveredClues);
  const addClue = useGameStore((state) => state.addClue);
  const completeQuest = useGameStore((state) => state.completeQuest);
  const applyFeedback = useGameStore((state) => state.applyFeedback);

  const findClue = (clue: SceneClue) => {
    if (discoveredClues.some((c) => c.id === clue.id)) return;
    addClue({ id: clue.id, title: clue.title, description: clue.description });
    const next = useGameStore.getState().discoveredClues.length;
    if (next >= CASE_001_ROUTE_QUEST_REQUIRED_CLUES) {
      completeQuest('q2');
    }
    applyFeedback(
      {
        isUnderstandable: true,
        xpAwarded: 12,
        explanation: 'Pista archivada en el expediente.',
      },
      'investigation',
    );
  };

  return (
    <div>
      <div
        style={{
          borderTop: '3px solid var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '6px 0 4px',
          marginBottom: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <span className="kicker">La Escena</span>
        <span className="byline">Taberna La Sirena · Calle del Olivar 14</span>
      </div>

      <div
        role="img"
        aria-label="Lienzo del juego Madrid Noir — Taberna La Sirena interior"
        style={{ position: 'relative' }}
      >
        <NewsprintPhoto src="/assets/scenes/bg_bar_interior.png" alt="Bar interior" height={340} />
        {CASE_001_SCENE_CLUES.map((clue, i) => {
          const found = discoveredClues.some((c) => c.id === clue.id);
          return (
            <button
              key={clue.id}
              type="button"
              onClick={() => findClue(clue)}
              className={`clue-dot${found ? ' found' : ''}`}
              style={{
                left: `${clue.x}%`,
                top: `${clue.y}%`,
                transform: 'translate(-50%, -50%)',
                border: 'none',
              }}
              title={found ? clue.title : `Examinar (pista ${i + 1})`}
              aria-label={found ? `Pista encontrada: ${clue.title}` : `Examinar punto ${i + 1}`}
            >
              {found ? '✓' : i + 1}
            </button>
          );
        })}

        <span
          className="handwritten"
          style={{
            position: 'absolute',
            top: 8,
            left: 12,
            fontSize: 22,
            color: 'var(--red-deep)',
            textShadow: '0 0 0 currentColor',
          }}
        >
          examinar →
        </span>
      </div>
      <p className="caption" style={{ marginTop: 0 }}>
        FIG. 1 — Interior de la taberna, hacia las 23:48. Fotografía oficial de la jefatura.
      </p>
    </div>
  );
}
