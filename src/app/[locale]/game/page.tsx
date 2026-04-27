'use client';

import { useState } from 'react';
import { AccusationOverlay } from '@/components/game/AccusationOverlay';
import { BriefingModal } from '@/components/game/BriefingModal';
import { ClueJournal } from '@/components/game/ClueJournal';
import { DialogueOverlay } from '@/components/game/DialogueOverlay';
import { GameCanvas } from '@/components/game/GameCanvas';
import { ProgressPanel } from '@/components/game/ProgressPanel';
import { useGameStore } from '@/store/useGameStore';

export default function GamePage() {
  const [journalOpen, setJournalOpen] = useState(false);
  const [accusationOpen, setAccusationOpen] = useState(false);
  const casePhase = useGameStore((state) => state.casePhase);
  const contradictionsCount = useGameStore((state) => state.contradictions.length);

  const accusationEnabled = casePhase === 'accusation' || casePhase === 'resolved';

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Caso 001: Noche en Lavapiés — Investigación ampliada</h1>
          <p className="text-sm text-slate-300">
            3 NPC, 3 misiones, múltiples pistas y cápsulas de lección para escalar el caso horizontalmente.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setJournalOpen(true)}
            className="rounded-md border border-slate-600 px-3 py-1.5 text-sm hover:bg-noir-800"
          >
            Diario {contradictionsCount > 0 ? `(${contradictionsCount} ⚡)` : ''}
          </button>
          <button
            onClick={() => setAccusationOpen(true)}
            disabled={!accusationEnabled}
            className="rounded-md bg-amber-400 px-3 py-1.5 text-sm font-medium text-noir-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {casePhase === 'resolved' ? 'Ver veredicto' : 'Acusar'}
          </button>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-black">
        <GameCanvas />
        <DialogueOverlay />
      </div>
      <ProgressPanel />
      <BriefingModal />
      <ClueJournal open={journalOpen} onClose={() => setJournalOpen(false)} />
      <AccusationOverlay open={accusationOpen} onClose={() => setAccusationOpen(false)} />
    </section>
  );
}
