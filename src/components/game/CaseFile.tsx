'use client';

import { Es } from '@/components/newsprint/Es';
import { NewsprintPhoto } from '@/components/newsprint/NewsprintPhoto';
import { Stamp } from '@/components/newsprint/Stamp';
import { CASE_001_VICTIM } from '@/game/content/case001-bilingual';
import { useGameStore } from '@/store/useGameStore';

const xpTypeLabel: Record<'vocabulary' | 'grammar' | 'investigation', string> = {
  vocabulary: 'VOCABULARIO',
  grammar: 'GRAMÁTICA',
  investigation: 'INVESTIGACIÓN',
};

export function CaseFile() {
  const latestFeedback = useGameStore((s) => s.latestFeedback);
  const lessons = useGameStore((s) => s.lessons);
  const casePhase = useGameStore((s) => s.casePhase);

  return (
    <aside>
      <div
        style={{
          borderTop: '3px solid var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '6px 0 4px',
          marginBottom: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <span className="kicker">La Víctima</span>
        <Stamp rotate={-4} style={{ fontSize: 10, padding: '3px 8px' }}>
          Confidencial
        </Stamp>
      </div>

      <NewsprintPhoto
        src="/assets/characters/detective.png"
        alt="Detective archivo"
        height={140}
        caption="DET. CRESPO · Brigada Nocturna"
      />

      <div
        style={{
          marginTop: 12,
          padding: 10,
          border: '1px solid var(--ink)',
          background: 'var(--paper-shadow)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--display)',
            fontSize: 18,
            fontWeight: 800,
            lineHeight: 1.05,
          }}
        >
          {CASE_001_VICTIM.name}
        </div>
        <div className="byline" style={{ marginTop: 2 }}>
          {CASE_001_VICTIM.role.es}
        </div>
        <p className="body-serif" style={{ marginTop: 6, fontSize: 12 }}>
          <Es es={CASE_001_VICTIM.fate.es} en={CASE_001_VICTIM.fate.en} />
        </p>
        <div
          style={{
            marginTop: 6,
            fontFamily: 'var(--mono)',
            fontSize: 11,
            color: 'var(--ink-soft)',
          }}
        >
          Hora estimada: <strong>{CASE_001_VICTIM.time}</strong>
        </div>
      </div>

      {latestFeedback && (
        <div
          style={{
            marginTop: 14,
            position: 'relative',
            padding: '10px 12px',
            border: '2px solid var(--red)',
            background: 'rgba(164, 24, 24, 0.04)',
          }}
        >
          <div className="kicker">Análisis de la frase</div>
          <p className="body-serif" style={{ fontSize: 12, marginTop: 4 }}>
            {latestFeedback.explanation ??
              (latestFeedback.isUnderstandable ? 'Frase comprensible.' : 'Reformula tu frase.')}
          </p>
          {latestFeedback.suggestedCorrection && (
            <p className="body-serif" style={{ fontSize: 12, marginTop: 4, fontStyle: 'italic' }}>
              Sugerencia: <strong>{latestFeedback.suggestedCorrection}</strong>
            </p>
          )}
          <div
            style={{
              marginTop: 6,
              fontFamily: 'var(--sans)',
              fontSize: 10,
              letterSpacing: '0.18em',
              color: 'var(--red-deep)',
            }}
          >
            +{latestFeedback.xpAwarded} XP
          </div>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <hr className="rule" />
        <span className="kicker">Cápsulas de Lección</span>
        <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0' }}>
          {lessons.map((l) => (
            <li
              key={l.id}
              style={{
                padding: '8px 0',
                borderBottom: '1px dotted var(--ink-faded)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--display)',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {l.title}
                <span className="byline" style={{ marginLeft: 6, fontSize: 9, opacity: 0.7 }}>
                  · {xpTypeLabel[l.xpType]}
                </span>
              </div>
              <p className="body-serif" style={{ fontSize: 12, marginTop: 2 }}>
                {l.tip}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        {casePhase === 'accusation' && <Stamp rotate={-6}>Listo para acusar</Stamp>}
        {casePhase === 'resolved' && (
          <Stamp rotate={3} color="blue">
            Caso cerrado
          </Stamp>
        )}
      </div>
    </aside>
  );
}
