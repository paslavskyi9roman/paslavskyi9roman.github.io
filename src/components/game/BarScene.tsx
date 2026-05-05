'use client';

import { useMemo, useState } from 'react';
import { SceneCanvas } from '@/components/game/SceneCanvas';
import { SceneLightbox } from '@/components/game/SceneLightbox';
import { CASE_001_SCENE_CLUES, type SceneClue } from '@/game/content/case001-bilingual';
import { useGameStore } from '@/store/useGameStore';
import { playSfx } from '@/lib/sfx';
import { isSceneClueAvailable } from '@/game/discovery';

export function BarScene() {
  const discoveredClues = useGameStore((state) => state.discoveredClues);
  const recordedStatements = useGameStore((state) => state.recordedStatements);
  const discoverSceneClue = useGameStore((state) => state.discoverSceneClue);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const discoveredClueIds = useMemo(() => new Set(discoveredClues.map((clue) => clue.id)), [discoveredClues]);
  const recordedStatementIds = useMemo(
    () => new Set(recordedStatements.map((statement) => statement.id)),
    [recordedStatements],
  );
  const availableClues = useMemo(
    () =>
      CASE_001_SCENE_CLUES.filter((clue) =>
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
        <span className="kicker">La Escena</span>
        <span className="byline">Taberna La Sirena · Calle del Olivar 14</span>
      </div>

      <SceneCanvas
        background="/assets/scenes/bg_bar_interior.png"
        alt="Bar interior"
        ariaLabel="Lienzo del juego Madrid Noir — Taberna La Sirena interior"
        clues={availableClues}
        discoveredClues={discoveredClues}
        onCommitClue={findClue}
        variant="inline"
        handwritten="examinar →"
        expandable
        onExpandClick={() => setLightboxOpen(true)}
      />
      <p className="caption" style={{ marginTop: 0 }}>
        FIG. 1 — Interior de la taberna, hacia las 23:48. Fotografía oficial de la jefatura.
      </p>

      <SceneLightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title="La Escena · Vista ampliada"
        byline="Taberna La Sirena · Calle del Olivar 14"
        caption="FIG. 1 — Interior de la taberna, hacia las 23:48. Fotografía oficial de la jefatura."
      >
        <SceneCanvas
          background="/assets/scenes/bg_bar_interior.png"
          alt="Bar interior, vista ampliada"
          ariaLabel="Vista ampliada — Taberna La Sirena interior"
          clues={availableClues}
          discoveredClues={discoveredClues}
          onCommitClue={findClue}
          variant="lightbox"
        />
      </SceneLightbox>
    </div>
  );
}
