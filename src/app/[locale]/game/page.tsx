'use client';

import Link from 'next/link';
import { use, useState } from 'react';
import { Masthead } from '@/components/newsprint/Masthead';
import { AccusationOverlay } from '@/components/game/AccusationOverlay';
import { BarScene } from '@/components/game/BarScene';
import { BriefingModal } from '@/components/game/BriefingModal';
import { CaseFile } from '@/components/game/CaseFile';
import { ClueJournal } from '@/components/game/ClueJournal';
import { DetectiveNotebook } from '@/components/game/DetectiveNotebook';
import { InterrogationPanel } from '@/components/game/InterrogationPanel';
import { useGameStore } from '@/store/useGameStore';

export default function GamePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [journalOpen, setJournalOpen] = useState(false);
  const [accusationOpen, setAccusationOpen] = useState(false);
  const casePhase = useGameStore((state) => state.casePhase);
  const contradictionsCount = useGameStore((state) => state.contradictions.length);

  const accusationEnabled = casePhase === 'accusation' || casePhase === 'resolved';

  return (
    <div className="paper" style={{ minHeight: '100vh', padding: '0 32px 40px' }}>
      <Masthead small />

      <div
        className="flex items-end justify-between"
        style={{
          borderTop: '3px solid var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '10px 0',
          marginBottom: 14,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div>
          <span className="kicker">Expediente Nº 001 · Lavapiés</span>
          <h2 className="headline" style={{ fontSize: 38, marginTop: 2 }}>
            Una Noche en <em style={{ fontStyle: 'italic', color: 'var(--red-deep)' }}>Lavapiés</em>
          </h2>
          <p className="byline" style={{ marginTop: 2 }}>
            Por el Detective · 14·X·1953
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <button type="button" onClick={() => setJournalOpen(true)} className="btn-ghost">
            Diario{' '}
            {contradictionsCount > 0 && (
              <span style={{ color: 'var(--red)', marginLeft: 6 }}>⚡{contradictionsCount}</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setAccusationOpen(true)}
            disabled={!accusationEnabled}
            className="btn-red"
            style={{
              opacity: !accusationEnabled ? 0.5 : 1,
              cursor: !accusationEnabled ? 'not-allowed' : 'pointer',
            }}
          >
            {casePhase === 'resolved' ? 'Ver veredicto' : 'Acusar formalmente'}
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr 1fr',
          gap: 22,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <DetectiveNotebook />
        <section>
          <BarScene />
          <InterrogationPanel />
        </section>
        <CaseFile />
      </div>

      <BriefingModal />
      <ClueJournal open={journalOpen} onClose={() => setJournalOpen(false)} />
      <AccusationOverlay open={accusationOpen} onClose={() => setAccusationOpen(false)} />

      <Link
        href={`/${locale}`}
        style={{
          position: 'fixed',
          top: 12,
          left: 12,
          zIndex: 90,
          background: 'var(--ink)',
          color: 'var(--paper)',
          textDecoration: 'none',
          padding: '6px 12px',
          fontFamily: 'var(--sans)',
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        ← Portada
      </Link>
    </div>
  );
}
