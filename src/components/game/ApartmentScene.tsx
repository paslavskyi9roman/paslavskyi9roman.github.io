'use client';

import { NewsprintPhoto } from '@/components/newsprint/NewsprintPhoto';
import type { SceneClue } from '@/game/content/case001-bilingual';
import { APARTMENT_SCENE_CLUES } from '@/game/content/case001-apartment-bilingual';
import { APARTMENT_ROUTE_QUEST_REQUIRED_CLUES } from '@/game/content/case001-apartment';
import { LOCATIONS } from '@/game/content/locations';
import { useGameStore } from '@/store/useGameStore';

const LOCATION = LOCATIONS.lucia_apartment;

export function ApartmentScene() {
  const discoveredClues = useGameStore((state) => state.discoveredClues);
  const addClue = useGameStore((state) => state.addClue);
  const completeQuest = useGameStore((state) => state.completeQuest);
  const applyFeedback = useGameStore((state) => state.applyFeedback);

  const apartmentCluesFound = discoveredClues.filter((c) => APARTMENT_SCENE_CLUES.some((sc) => sc.id === c.id)).length;

  const findClue = (clue: SceneClue) => {
    if (discoveredClues.some((c) => c.id === clue.id)) return;
    addClue({ id: clue.id, title: clue.title, description: clue.description });
    const apartmentFoundAfter = useGameStore
      .getState()
      .discoveredClues.filter((c) => APARTMENT_SCENE_CLUES.some((sc) => sc.id === c.id)).length;
    if (apartmentFoundAfter >= APARTMENT_ROUTE_QUEST_REQUIRED_CLUES) {
      completeQuest('q4');
    }
    applyFeedback(
      {
        isUnderstandable: true,
        xpAwarded: 13,
        explanation: 'Pista del apartamento archivada — anota su posición exacta en el plano.',
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
        <span className="kicker">{LOCATION.kicker.es}</span>
        <span className="byline">{LOCATION.byline.es}</span>
      </div>

      <div
        role="img"
        aria-label="Lienzo del juego Madrid Noir — Apartamento de Lucía Vargas"
        style={{ position: 'relative' }}
      >
        <NewsprintPhoto src={LOCATION.background} alt="Apartamento de Lucía" height={340} />
        {APARTMENT_SCENE_CLUES.map((clue, i) => {
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
          registrar →
        </span>
      </div>
      <p className="caption" style={{ marginTop: 0 }}>
        {LOCATION.caption.es}
      </p>
      <p className="byline" style={{ marginTop: 4, fontSize: 10, color: 'var(--ink-faded)' }}>
        Indicios localizados: {apartmentCluesFound}/{APARTMENT_SCENE_CLUES.length}
      </p>
    </div>
  );
}
