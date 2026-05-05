'use client';

import { useMemo, useState } from 'react';
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
  const discoverSceneClue = useGameStore((state) => state.discoverSceneClue);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const caseDef = getCaseDefinition(currentCaseId);
  const location = caseDef.locations[currentLocationId] ?? caseDef.locations[caseDef.defaultLocationId]!;
  const sceneClues = getSceneClues(caseDef, location.id);
  const sceneClueIds = useMemo(() => new Set(sceneClues.map((clue) => clue.id)), [sceneClues]);
  const discoveredClueIds = useMemo(() => new Set(discoveredClues.map((clue) => clue.id)), [discoveredClues]);
  const recordedStatementIds = useMemo(
    () => new Set(recordedStatements.map((statement) => statement.id)),
    [recordedStatements],
  );
  const availableClues = useMemo(
    () =>
      sceneClues.filter((clue) =>
        isSceneClueAvailable(clue, { discoveredClues, recordedStatements, discoveredClueIds, recordedStatementIds }),
      ),
    [discoveredClueIds, discoveredClues, recordedStatementIds, recordedStatements, sceneClues],
  );
  const locationCluesFound = useMemo(
    () => discoveredClues.filter((clue) => sceneClueIds.has(clue.id)).length,
    [discoveredClues, sceneClueIds],
  );

  const findClue = (clue: SceneClue) => {
    if (discoveredClueIds.has(clue.id)) return;
    discoverSceneClue({ id: clue.id, title: clue.title, description: clue.description });
    playSfx('record');
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
