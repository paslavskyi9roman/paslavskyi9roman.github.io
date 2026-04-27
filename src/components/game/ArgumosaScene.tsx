'use client';

import { NewsprintPhoto } from '@/components/newsprint/NewsprintPhoto';
import type { SceneClue } from '@/game/content/case001-bilingual';
import { ARGUMOSA_SCENE_CLUES } from '@/game/content/case001-argumosa-bilingual';
import { ARGUMOSA_ROUTE_QUEST_REQUIRED_CLUES } from '@/game/content/case001-argumosa';
import { LOCATIONS } from '@/game/content/locations';
import { useGameStore } from '@/store/useGameStore';

const LOCATION = LOCATIONS.argumosa_kiosk;

export function ArgumosaScene() {
  const discoveredClues = useGameStore((state) => state.discoveredClues);
  const addClue = useGameStore((state) => state.addClue);
  const completeQuest = useGameStore((state) => state.completeQuest);
  const applyFeedback = useGameStore((state) => state.applyFeedback);

  const argumosaCluesFound = discoveredClues.filter((c) => ARGUMOSA_SCENE_CLUES.some((sc) => sc.id === c.id)).length;

  const findClue = (clue: SceneClue) => {
    if (discoveredClues.some((c) => c.id === clue.id)) return;
    const contradictionsBefore = useGameStore.getState().contradictions.length;
    addClue({ id: clue.id, title: clue.title, description: clue.description });
    const stateAfter = useGameStore.getState();
    const argumosaFoundAfter = stateAfter.discoveredClues.filter((c) =>
      ARGUMOSA_SCENE_CLUES.some((sc) => sc.id === c.id),
    ).length;
    if (argumosaFoundAfter >= ARGUMOSA_ROUTE_QUEST_REQUIRED_CLUES) {
      completeQuest('q6');
    }
    if (stateAfter.contradictions.length > contradictionsBefore) {
      completeQuest('q8');
    }
    applyFeedback(
      {
        isUnderstandable: true,
        xpAwarded: 13,
        explanation: 'Indicio archivado en el kiosko de Argumosa — la testigo se acerca un poco más.',
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

      <div role="img" aria-label="Lienzo del juego Madrid Noir — Kiosko de Argumosa" style={{ position: 'relative' }}>
        <NewsprintPhoto src={LOCATION.background} alt="Kiosko de Argumosa" height={340} />
        {ARGUMOSA_SCENE_CLUES.map((clue, i) => {
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
          rastrear →
        </span>
      </div>
      <p className="caption" style={{ marginTop: 0 }}>
        {LOCATION.caption.es}
      </p>
      <p className="byline" style={{ marginTop: 4, fontSize: 10, color: 'var(--ink-faded)' }}>
        Indicios localizados: {argumosaCluesFound}/{ARGUMOSA_SCENE_CLUES.length}
      </p>
    </div>
  );
}
