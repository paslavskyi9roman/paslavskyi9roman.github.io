'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Masthead } from '@/components/newsprint/Masthead';
import { AccusationOverlay } from '@/components/game/AccusationOverlay';
import { BriefingModal } from '@/components/game/BriefingModal';
import { CaseScene } from '@/components/game/CaseScene';
import { CaseFile } from '@/components/game/CaseFile';
import { ClueJournal } from '@/components/game/ClueJournal';
import { DetectiveNotebook } from '@/components/game/DetectiveNotebook';
import { InterrogationPanel } from '@/components/game/InterrogationPanel';
import { LocationTabs } from '@/components/game/LocationTabs';
import { useGameStore } from '@/store/useGameStore';
import { playSfx } from '@/lib/sfx';
import { CASES, getCaseDefinition } from '@/game/content/cases';

export default function GamePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const searchParams = useSearchParams();
  const [journalOpen, setJournalOpen] = useState(false);
  const [accusationOpen, setAccusationOpen] = useState(false);
  const currentCaseId = useGameStore((state) => state.currentCaseId);
  const selectCase = useGameStore((state) => state.selectCase);
  const casePhase = useGameStore((state) => state.casePhase);
  const contradictionsCount = useGameStore((state) => state.contradictions.length);
  const cluesCount = useGameStore((state) => state.discoveredClues.length);
  const statementsCount = useGameStore((state) => state.recordedStatements.length);
  const caseDef = getCaseDefinition(currentCaseId);

  useEffect(() => {
    const requestedCaseId = searchParams.get('case');
    if (requestedCaseId && CASES[requestedCaseId] && requestedCaseId !== currentCaseId) {
      selectCase(requestedCaseId);
    }
  }, [currentCaseId, searchParams, selectCase]);

  const accusationEnabled = casePhase === 'accusation' || casePhase === 'resolved';

  const accusationHint =
    accusationEnabled || casePhase === 'briefing'
      ? null
      : cluesCount < 3
        ? `Reúne al menos 3 pistas (${cluesCount}/3).`
        : statementsCount === 0
          ? 'Registra declaraciones interrogando a los sospechosos.'
          : contradictionsCount === 0
            ? 'Abre el Diario y vincula una pista con una declaración para destapar una contradicción.'
            : null;

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
          <span className="kicker">Expediente Nº {caseDef.number}</span>
          <h2 className="headline" style={{ fontSize: 38, marginTop: 2 }}>
            {caseDef.title.es}
          </h2>
          <p className="byline" style={{ marginTop: 2 }}>
            Por el Detective · {caseDef.date}
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <button
            type="button"
            onClick={() => {
              playSfx('journal-open');
              setJournalOpen(true);
            }}
            className="btn-ghost"
          >
            Diario{' '}
            {contradictionsCount > 0 && (
              <span style={{ color: 'var(--red)', marginLeft: 6 }}>⚡{contradictionsCount}</span>
            )}
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <button
              type="button"
              onClick={() => setAccusationOpen(true)}
              disabled={!accusationEnabled}
              title={accusationHint ?? undefined}
              className="btn-red"
              style={{
                opacity: !accusationEnabled ? 0.5 : 1,
                cursor: !accusationEnabled ? 'not-allowed' : 'pointer',
              }}
            >
              {casePhase === 'resolved' ? 'Ver veredicto' : 'Acusar formalmente'}
            </button>
            {accusationHint && (
              <span
                className="byline"
                style={{
                  fontSize: 10,
                  fontStyle: 'italic',
                  color: 'var(--ink-faded)',
                  maxWidth: 260,
                  textAlign: 'right',
                }}
              >
                {accusationHint}
              </span>
            )}
          </div>
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
          <LocationTabs />
          <CaseScene />
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
