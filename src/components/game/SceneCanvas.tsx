'use client';

import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { NewsprintPhoto } from '@/components/newsprint/NewsprintPhoto';
import { ExaminePopover } from '@/components/game/ExaminePopover';
import type { SceneClue } from '@/game/content/case001-bilingual';
import type { Clue } from '@/types/game';
import { playSfx } from '@/lib/sfx';

interface SceneCanvasProps {
  background: string;
  alt: string;
  ariaLabel: string;
  clues: ReadonlyArray<SceneClue>;
  discoveredClues: ReadonlyArray<Clue>;
  onCommitClue: (clue: SceneClue) => void;
  variant: 'inline' | 'lightbox';
  handwritten?: ReactNode;
  expandable?: boolean;
  onExpandClick?: () => void;
}

const NATURAL_ASPECT_RATIO = '1672 / 941';
const INLINE_HEIGHT = 340;

export function SceneCanvas({
  background,
  alt,
  ariaLabel,
  clues,
  discoveredClues,
  onCommitClue,
  variant,
  handwritten,
  expandable = false,
  onExpandClick,
}: SceneCanvasProps) {
  const [activeClue, setActiveClue] = useState<SceneClue | null>(null);

  const wrapperStyle: CSSProperties =
    variant === 'inline'
      ? { position: 'relative' }
      : { position: 'relative', width: '100%', aspectRatio: NATURAL_ASPECT_RATIO };

  const photoHeight = variant === 'inline' ? INLINE_HEIGHT : undefined;
  const photoStyle: CSSProperties | undefined = variant === 'lightbox' ? { height: '100%' } : undefined;

  const handleHotspotClick = (clue: SceneClue) => {
    if (discoveredClues.some((c) => c.id === clue.id)) return;
    playSfx('examine');
    setActiveClue(clue);
  };

  const handleCommit = () => {
    if (!activeClue) return;
    onCommitClue(activeClue);
    setActiveClue(null);
  };

  return (
    <div role="img" aria-label={ariaLabel} style={wrapperStyle}>
      <NewsprintPhoto
        src={background}
        alt={alt}
        height={photoHeight}
        style={photoStyle}
        objectFit={variant === 'lightbox' ? 'contain' : 'cover'}
        expandable={expandable}
        onExpandClick={onExpandClick}
      />
      {clues.map((clue, i) => {
        const found = discoveredClues.some((c) => c.id === clue.id);
        return (
          <button
            key={clue.id}
            type="button"
            onClick={() => handleHotspotClick(clue)}
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

      {handwritten && (
        <span
          className="handwritten"
          style={{
            position: 'absolute',
            top: 8,
            left: 12,
            fontSize: 22,
            color: 'var(--red-deep)',
            textShadow: '0 0 0 currentColor',
            zIndex: 3,
          }}
        >
          {handwritten}
        </span>
      )}

      {activeClue && <ExaminePopover clue={activeClue} onClose={() => setActiveClue(null)} onCommit={handleCommit} />}
    </div>
  );
}
