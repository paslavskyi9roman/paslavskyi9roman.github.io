'use client';

import { useEffect, useRef } from 'react';
import type Phaser from 'phaser';

const LOGICAL_WIDTH = 960;
const LOGICAL_HEIGHT = 540;

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let game: Phaser.Game | null = null;
    let cancelled = false;

    void Promise.all([import('phaser'), import('@/game/scenes/InvestigationScene')]).then(
      ([Phaser, { InvestigationScene }]) => {
        if (cancelled || !containerRef.current) return;

        game = new Phaser.Game({
          type: Phaser.AUTO,
          parent: containerRef.current,
          backgroundColor: '#000000',
          scene: [InvestigationScene],
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: LOGICAL_WIDTH,
            height: LOGICAL_HEIGHT,
          },
        });
      },
    );

    return () => {
      cancelled = true;
      game?.destroy(true);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="mx-auto aspect-[16/9] w-full max-w-[960px]"
      role="img"
      aria-label="Lienzo del juego Madrid Noir"
    />
  );
}
