'use client';

import { Es } from '@/components/newsprint/Es';
import type { SceneClue } from '@/game/content/case001-bilingual';

interface ExaminePopoverProps {
  clue: SceneClue;
  onClose: () => void;
  onCommit: () => void;
}

export function ExaminePopover({ clue, onClose, onCommit }: ExaminePopoverProps) {
  const placeAbove = clue.y >= 50;
  const horizontalShift = clue.x < 22 ? -10 : clue.x > 78 ? -90 : -50;
  const verticalShift = placeAbove ? 'calc(-100% - 14px)' : '14px';

  return (
    <div
      role="dialog"
      aria-label="Examinar pista"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        left: `${clue.x}%`,
        top: `${clue.y}%`,
        transform: `translate(${horizontalShift}%, ${verticalShift})`,
        zIndex: 5,
        width: 'min(280px, 80vw)',
        background: 'var(--paper)',
        border: '2px solid var(--ink)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.45)',
        padding: '10px 12px',
        fontFamily: 'var(--body)',
        animation: 'fadeIn 0.18s ease-out both',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
        <span className="kicker">
          <Es es="Examinar" en="Examine" />
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar examen"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--sans)',
            fontWeight: 800,
            fontSize: 16,
            color: 'var(--ink-faded)',
            padding: 0,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
      <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 14, marginTop: 4 }}>
        <Es es={clue.title} en={clue.titleEn} />
      </div>
      <p className="body-serif" style={{ fontSize: 12, marginTop: 6 }}>
        <Es es={clue.examinePrompt} en={clue.examinePromptEn} />
      </p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
        <button type="button" onClick={onClose} className="btn-ghost" style={{ padding: '6px 10px', fontSize: 10 }}>
          <Es es="Cerrar" en="Close" />
        </button>
        <button type="button" onClick={onCommit} className="btn-news" style={{ padding: '6px 10px', fontSize: 10 }}>
          <Es es="Anotar en el cuaderno" en="Note in the journal" />
        </button>
      </div>
    </div>
  );
}
