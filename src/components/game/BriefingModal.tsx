'use client';

import { Es } from '@/components/newsprint/Es';
import { Stamp } from '@/components/newsprint/Stamp';
import { getCaseDefinition } from '@/game/content/cases';
import { useGameStore } from '@/store/useGameStore';

export function BriefingModal() {
  const currentCaseId = useGameStore((state) => state.currentCaseId);
  const casePhase = useGameStore((state) => state.casePhase);
  const briefingSeen = useGameStore((state) => state.briefingSeen);
  const dismissBriefing = useGameStore((state) => state.dismissBriefing);
  const caseDef = getCaseDefinition(currentCaseId);

  if (casePhase !== 'briefing' || briefingSeen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="briefing-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 12, 8, 0.85)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
      }}
    >
      <div
        className="paper"
        style={{
          maxWidth: 720,
          width: '100%',
          padding: '32px 40px',
          border: '2px solid var(--ink)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ position: 'absolute', top: 18, right: 18 }}>
          <Stamp rotate={6}>Confidencial</Stamp>
        </div>
        <span className="kicker">{caseDef.briefing.kicker}</span>
        <h1 id="briefing-title" className="headline" style={{ fontSize: 48, marginTop: 6, lineHeight: 0.95 }}>
          {caseDef.briefing.title.es}
        </h1>
        <hr className="rule-fancy" style={{ margin: '14px 0' }} />
        <div className="cols-2 body-serif dropcap" style={{ fontSize: 14 }}>
          {caseDef.briefing.paragraphs.map((paragraph) => (
            <p key={paragraph.es}>
              <Es es={paragraph.es} en={paragraph.en} />
            </p>
          ))}
        </div>

        <div
          style={{
            marginTop: 18,
            padding: 16,
            background: 'var(--paper-shadow)',
            border: '1px solid var(--ink)',
          }}
        >
          <span className="kicker">Instrucciones de la Inspectora Ruiz</span>
          <ol
            style={{
              marginTop: 8,
              paddingLeft: 22,
              fontFamily: 'var(--body)',
              fontSize: 13,
              lineHeight: 1.65,
            }}
          >
            {caseDef.briefing.instructions.map((instruction) => (
              <li key={instruction}>{instruction}</li>
            ))}
          </ol>
        </div>

        <div
          style={{
            marginTop: 22,
            display: 'flex',
            gap: 10,
            justifyContent: 'flex-end',
          }}
        >
          <button onClick={dismissBriefing} className="btn-news">
            Aceptar el caso
          </button>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 18,
            left: 28,
            fontFamily: 'var(--mono)',
            fontSize: 11,
            color: 'var(--ink-faded)',
          }}
        >
          {caseDef.briefing.signature}
        </div>
      </div>
    </div>
  );
}
