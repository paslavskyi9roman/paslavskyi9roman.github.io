'use client';

import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import { InvestigationScene } from '@/game/scenes/InvestigationScene';

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 960,
      height: 540,
      parent: containerRef.current,
      backgroundColor: '#000000',
      scene: [InvestigationScene],
    });

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={containerRef} className="h-[540px] w-full" aria-label="Lienzo del juego Madrid Noir" />;
}
