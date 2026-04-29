'use client';

import { useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Es } from '@/components/newsprint/Es';
import { playSfx } from '@/lib/sfx';

interface SceneLightboxProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  byline?: ReactNode;
  caption?: ReactNode;
  children: ReactNode;
}

export function SceneLightbox({ open, onClose, title, byline, caption, children }: SceneLightboxProps) {
  const close = useCallback(() => {
    playSfx('lightbox-close');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    playSfx('lightbox-open');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      onClick={close}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 12, 8, 0.92)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        className="paper"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(95vw, 1500px)',
          maxHeight: '95vh',
          padding: '14px 18px 18px',
          border: '2px solid var(--ink)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div
          style={{
            borderTop: '3px solid var(--ink)',
            borderBottom: '1px solid var(--ink)',
            padding: '6px 0 4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 12,
          }}
        >
          <span id="lightbox-title" className="kicker">
            {title}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {byline && <span className="byline">{byline}</span>}
            <button
              type="button"
              onClick={close}
              className="btn-ghost"
              style={{ padding: '4px 12px', fontSize: 11 }}
              aria-label="Cerrar la fotografía ampliada"
            >
              <Es es="Cerrar" en="Close" />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </div>

        {caption && (
          <p className="caption" style={{ marginTop: 0 }}>
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
