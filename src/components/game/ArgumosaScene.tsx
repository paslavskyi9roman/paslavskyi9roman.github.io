'use client';

import { useState } from 'react';
import { SceneCanvas } from '@/components/game/SceneCanvas';
import { SceneLightbox } from '@/components/game/SceneLightbox';
import type { SceneClue } from '@/game/content/case001-bilingual';
import { ARGUMOSA_SCENE_CLUES } from '@/game/content/case001-argumosa-bilingual';
import { ARGUMOSA_ROUTE_QUEST_REQUIRED_CLUES } from '@/game/content/case001-argumosa';
import { LOCATIONS } from '@/game/content/locations';
import { useGameStore } from '@/store/useGameStore';
import { playSfx } from '@/lib/sfx';
import { isSceneClueAvailable } from '@/game/discovery';

const LOCATION = LOCATIONS.argumosa_kiosk;

export function ArgumosaScene() {
  const discoveredClues = useGameStore((state) => state.discoveredClues);
  const recordedStatements = useGameStore((state) => state.recordedStatements);
  const addClue = useGameStore((state) => state.addClue);
  const completeQuest = useGameStore((state) => state.completeQuest);
  const applyFeedback = useGameStore((state) => state.applyFeedback);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const argumosaCluesFound = discoveredClues.filter((c) => ARGUMOSA_SCENE_CLUES.some((sc) => sc.id === c.id)).length;
  const availableClues = ARGUMOSA_SCENE_CLUES.filter((clue) =>
    isSceneClueAvailable(clue, { discoveredClues, recordedStatements }),
  );

  const findClue = (clue: SceneClue) => {
    if (discoveredClues.some((c) => c.id === clue.id)) return;
    addClue({ id: clue.id, title: clue.title, description: clue.description });
    playSfx('record');
    const stateAfter = useGameStore.getState();
    const argumosaFoundAfter = stateAfter.discoveredClues.filter((c) =>
      ARGUMOSA_SCENE_CLUES.some((sc) => sc.id === c.id),
    ).length;
    if (argumosaFoundAfter >= ARGUMOSA_ROUTE_QUEST_REQUIRED_CLUES) {
      completeQuest('q6');
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

      <SceneCanvas
        background={LOCATION.background}
        alt="Kiosko de Argumosa"
        ariaLabel="Lienzo del juego Madrid Noir — Kiosko de Argumosa"
        clues={availableClues}
        discoveredClues={discoveredClues}
        onCommitClue={findClue}
        variant="inline"
        handwritten="rastrear →"
        expandable
        onExpandClick={() => setLightboxOpen(true)}
      />
      <p className="caption" style={{ marginTop: 0 }}>
        {LOCATION.caption.es}
      </p>
      <p className="byline" style={{ marginTop: 4, fontSize: 10, color: 'var(--ink-faded)' }}>
        Indicios localizados: {argumosaCluesFound}/{ARGUMOSA_SCENE_CLUES.length}
      </p>

      <SceneLightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={`${LOCATION.kicker.es} · Vista ampliada`}
        byline={LOCATION.byline.es}
        caption={LOCATION.caption.es}
      >
        <SceneCanvas
          background={LOCATION.background}
          alt="Kiosko de Argumosa, vista ampliada"
          ariaLabel={`Vista ampliada — ${LOCATION.name.es}`}
          clues={availableClues}
          discoveredClues={discoveredClues}
          onCommitClue={findClue}
          variant="lightbox"
        />
      </SceneLightbox>
    </div>
  );
}
