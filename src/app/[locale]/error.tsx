'use client';

import { useEffect } from 'react';
import { Stamp } from '@/components/newsprint/Stamp';

export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Madrid Noir] Route error:', error);
  }, [error]);

  return (
    <div className="paper" style={{ minHeight: '100vh', padding: '60px 60px 40px' }}>
      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: 24,
          border: '2px solid var(--ink)',
          background: 'var(--paper-shadow)',
          position: 'relative',
        }}
      >
        <Stamp rotate={6} color="blue" style={{ position: 'absolute', top: -12, right: 14 }}>
          Incidente
        </Stamp>
        <span className="kicker">Error inesperado · Edición urgente</span>
        <h1 className="headline" style={{ fontSize: 42, marginTop: 6 }}>
          La investigación se ha detenido.
        </h1>
        <hr className="rule-fancy" style={{ margin: '14px 0' }} />
        <p className="body-serif">
          Algo se ha torcido en la oficina del detective. Intenta de nuevo o vuelve al caso anterior.
        </p>
        {error.digest && (
          <p className="byline" style={{ marginTop: 6 }}>
            Ref · {error.digest}
          </p>
        )}
        <div style={{ marginTop: 18 }}>
          <button type="button" onClick={reset} className="btn-news">
            Reintentar
          </button>
        </div>
      </div>
    </div>
  );
}
