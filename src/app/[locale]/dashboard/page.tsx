'use client';

import Link from 'next/link';
import { useGameStore } from '@/store/useGameStore';

export default function DashboardPage() {
  const { vocabularyXp, grammarXp, investigationXp, discoveredClues, currentCaseId } = useGameStore();

  return (
    <div className="paper" style={{ minHeight: '100vh', padding: '24px 60px 40px' }}>
      <div
        style={{
          borderTop: '3px solid var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '8px 0',
          marginBottom: 18,
        }}
      >
        <span className="kicker">Sección Tercera · Archivo del Detective</span>
        <h1 className="headline" style={{ fontSize: 42, marginTop: 4 }}>
          Panel de progreso
        </h1>
        <p className="byline" style={{ marginTop: 4 }}>
          Caso · {currentCaseId}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            border: '1px solid var(--ink)',
            background: 'var(--paper-shadow)',
            padding: 12,
          }}
        >
          <div className="byline">XP de vocabulario</div>
          <div
            style={{
              fontFamily: 'var(--display)',
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            {vocabularyXp}
          </div>
        </div>
        <div
          style={{
            border: '1px solid var(--ink)',
            background: 'var(--paper-shadow)',
            padding: 12,
          }}
        >
          <div className="byline">XP de gramática</div>
          <div
            style={{
              fontFamily: 'var(--display)',
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            {grammarXp}
          </div>
        </div>
        <div
          style={{
            border: '1px solid var(--ink)',
            background: 'var(--paper-shadow)',
            padding: 12,
          }}
        >
          <div className="byline">XP de investigación</div>
          <div
            style={{
              fontFamily: 'var(--display)',
              fontSize: 36,
              fontWeight: 800,
              color: 'var(--red-deep)',
            }}
          >
            {investigationXp}
          </div>
        </div>
      </div>

      <h2 className="headline" style={{ fontSize: 22 }}>
        Pistas descubiertas
      </h2>
      <hr className="rule" style={{ marginTop: 4 }} />
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '12px 0 0',
          display: 'grid',
          gap: 8,
        }}
      >
        {discoveredClues.length ? (
          discoveredClues.map((clue) => (
            <li
              key={clue.id}
              className="body-serif"
              style={{
                padding: '8px 12px',
                border: '1px solid var(--ink)',
                background: 'var(--paper)',
              }}
            >
              <strong>{clue.title}</strong> — {clue.description}
            </li>
          ))
        ) : (
          <li className="body-serif" style={{ fontStyle: 'italic', color: 'var(--ink-faded)' }}>
            Aún no hay pistas descubiertas.
          </li>
        )}
      </ul>

      <div style={{ marginTop: 24 }}>
        <Link href="/" className="btn-news" style={{ textDecoration: 'none', display: 'inline-block' }}>
          ← Volver a la portada
        </Link>
      </div>
    </div>
  );
}
