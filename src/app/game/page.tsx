'use client';

import { DialogueOverlay } from '@/components/game/DialogueOverlay';
import { GameCanvas } from '@/components/game/GameCanvas';
import { ProgressPanel } from '@/components/game/ProgressPanel';

export default function GamePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Case 001: Noche en Lavapiés</h1>
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-black">
        <GameCanvas />
        <DialogueOverlay />
      </div>
      <ProgressPanel />
    </section>
  );
}
