'use client';

import { useState } from 'react';
import { SceneCanvas } from '@/components/game/SceneCanvas';
import { SceneLightbox } from '@/components/game/SceneLightbox';
import { getCaseDefinition, getSceneClues } from '@/game/content/cases';
import type { SceneClue } from '@/game/content/case001-bilingual';
import { isSceneClueAvailable } from '@/game/discovery';
import { playSfx } from '@/lib/sfx';
import { useGameStore } from '@/store/useGameStore';

export function CaseScene() {
  const currentCaseId = useGameStore((state) => state.currentCaseId);
  const currentLocationId = useGameStore((state) => state.currentLocationId);
  const discoveredClues = useGameStore((state) => state.discoveredClues);
  const recordedStatements = useGameStore((state) => state.recordedStatements);
  const addClue = useGameStore((state) => state.addClue);
  const applyFeedback = useGameStore((state) => state.applyFeedback);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const caseDef = getCaseDefinition(currentCaseId);
  const location = caseDef.locations[currentLocationId] ?? caseDef.locations[caseDef.defaultLocationId]!;
  const sceneClues = getSceneClues(caseDef, location.id);
  const availableClues = sceneClues.filter((clue) =>
    isSceneClueAvailable(clue, { discoveredClues, recordedStatements }),
  );
  const locationCluesFound = discoveredClues.filter((clue) => sceneClues.some((scene) => scene.id === clue.id)).length;

  const findClue = (clue: SceneClue) => {
    if (discoveredClues.some((c) => c.id === clue.id)) return;
    addClue({ id: clue.id, title: clue.title, description: clue.description });
    playSfx('record');
    applyFeedback(
      {
        isUnderstandable: true,
        xpAwarded: 13,
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
        <span className="kicker">{location.kicker.es}</span>
        <span className="byline">{location.byline.es}</span>
      </div>

      <SceneCanvas
        background={location.background}
        alt={location.alt.es}
        ariaLabel={`Lienzo del juego Madrid Noir — ${location.name.es}`}
        clues={availableClues}
        discoveredClues={discoveredClues}
        onCommitClue={findClue}
        variant="inline"
        handwritten={location.handwritten}
        expandable
        onExpandClick={() => setLightboxOpen(true)}
      />
      <p className="caption" style={{ marginTop: 0 }}>
        {location.caption.es}
      </p>
      <p className="byline" style={{ marginTop: 4, fontSize: 10, color: 'var(--ink-faded)' }}>
        Indicios localizados: {locationCluesFound}/{sceneClues.length}
      </p>

      <SceneLightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={`${location.kicker.es} · Vista ampliada`}
        byline={location.byline.es}
        caption={location.caption.es}
      >
        <SceneCanvas
          background={location.background}
          alt={`${location.alt.es}, vista ampliada`}
          ariaLabel={`Vista ampliada — ${location.name.es}`}
          clues={availableClues}
          discoveredClues={discoveredClues}
          onCommitClue={findClue}
          variant="lightbox"
        />
      </SceneLightbox>
    </div>
  );
}
