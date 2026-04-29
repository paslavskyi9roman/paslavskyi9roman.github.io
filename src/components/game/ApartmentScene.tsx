'use client';

import { useState } from 'react';
import { SceneCanvas } from '@/components/game/SceneCanvas';
import { SceneLightbox } from '@/components/game/SceneLightbox';
import type { SceneClue } from '@/game/content/case001-bilingual';
import { APARTMENT_SCENE_CLUES } from '@/game/content/case001-apartment-bilingual';
import { APARTMENT_ROUTE_QUEST_REQUIRED_CLUES } from '@/game/content/case001-apartment';
import { LOCATIONS } from '@/game/content/locations';
import { useGameStore } from '@/store/useGameStore';
import { playSfx } from '@/lib/sfx';
import { isSceneClueAvailable } from '@/game/discovery';

const LOCATION = LOCATIONS.lucia_apartment;

export function ApartmentScene() {
  const discoveredClues = useGameStore((state) => state.discoveredClues);
  const recordedStatements = useGameStore((state) => state.recordedStatements);
  const addClue = useGameStore((state) => state.addClue);
  const completeQuest = useGameStore((state) => state.completeQuest);
  const applyFeedback = useGameStore((state) => state.applyFeedback);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const apartmentCluesFound = discoveredClues.filter((c) => APARTMENT_SCENE_CLUES.some((sc) => sc.id === c.id)).length;
  const availableClues = APARTMENT_SCENE_CLUES.filter((clue) =>
    isSceneClueAvailable(clue, { discoveredClues, recordedStatements }),
  );

  const findClue = (clue: SceneClue) => {
    if (discoveredClues.some((c) => c.id === clue.id)) return;
    addClue({ id: clue.id, title: clue.title, description: clue.description });
    playSfx('record');
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

      <SceneCanvas
        background={LOCATION.background}
        alt="Apartamento de Lucía"
        ariaLabel="Lienzo del juego Madrid Noir — Apartamento de Lucía Vargas"
        clues={availableClues}
        discoveredClues={discoveredClues}
        onCommitClue={findClue}
        variant="inline"
        handwritten="registrar →"
        expandable
        onExpandClick={() => setLightboxOpen(true)}
      />
      <p className="caption" style={{ marginTop: 0 }}>
        {LOCATION.caption.es}
      </p>
      <p className="byline" style={{ marginTop: 4, fontSize: 10, color: 'var(--ink-faded)' }}>
        Indicios localizados: {apartmentCluesFound}/{APARTMENT_SCENE_CLUES.length}
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
          alt="Apartamento de Lucía, vista ampliada"
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
