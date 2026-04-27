'use client';

import { useEffect, useRef } from 'react';

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let game: import('phaser').Game | null = null;
    let cancelled = false;

    void Promise.all([import('phaser'), import('@/game/scenes/InvestigationScene')]).then(
      ([Phaser, { InvestigationScene }]) => {
        if (cancelled || !containerRef.current) return;

        game = new Phaser.Game({
          type: Phaser.AUTO,
          width: 960,
          height: 540,
          parent: containerRef.current,
          backgroundColor: '#000000',
          scene: [InvestigationScene],
        });
      },
    );

    return () => {
      cancelled = true;
      game?.destroy(true);
    };
  }, []);

  return <div ref={containerRef} className="h-[540px] w-full" aria-label="Lienzo del juego Madrid Noir" />;
}
