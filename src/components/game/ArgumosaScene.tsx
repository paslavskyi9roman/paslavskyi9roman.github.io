'use client';

import { useMemo, useState } from 'react';
import { SceneCanvas } from '@/components/game/SceneCanvas';
import { SceneLightbox } from '@/components/game/SceneLightbox';
import type { SceneClue } from '@/game/content/case001-bilingual';
import { ARGUMOSA_SCENE_CLUES } from '@/game/content/case001-argumosa-bilingual';
import { LOCATIONS } from '@/game/content/locations';
import { useGameStore } from '@/store/useGameStore';
import { playSfx } from '@/lib/sfx';
import { isSceneClueAvailable } from '@/game/discovery';

const LOCATION = LOCATIONS.argumosa_kiosk;

export function ArgumosaScene() {
  const discoveredClues = useGameStore((state) => state.discoveredClues);
  const recordedStatements = useGameStore((state) => state.recordedStatements);
  const discoverSceneClue = useGameStore((state) => state.discoverSceneClue);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const argumosaSceneClueIds = useMemo(() => new Set(ARGUMOSA_SCENE_CLUES.map((clue) => clue.id)), []);
  const discoveredClueIds = useMemo(() => new Set(discoveredClues.map((clue) => clue.id)), [discoveredClues]);
  const recordedStatementIds = useMemo(
    () => new Set(recordedStatements.map((statement) => statement.id)),
    [recordedStatements],
  );
  const argumosaCluesFound = useMemo(
    () => discoveredClues.filter((clue) => argumosaSceneClueIds.has(clue.id)).length,
    [argumosaSceneClueIds, discoveredClues],
  );
  const availableClues = useMemo(
    () =>
      ARGUMOSA_SCENE_CLUES.filter((clue) =>
        isSceneClueAvailable(clue, { discoveredClues, recordedStatements, discoveredClueIds, recordedStatementIds }),
      ),
    [discoveredClueIds, discoveredClues, recordedStatementIds, recordedStatements],
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
