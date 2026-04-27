'use client';

import { DialogueOverlay } from '@/components/game/DialogueOverlay';
import { GameCanvas } from '@/components/game/GameCanvas';
import { ProgressPanel } from '@/components/game/ProgressPanel';

export default function GamePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Caso 001: Noche en Lavapiés — Investigación ampliada</h1>
      <p className="text-sm text-slate-300">
        3 NPC, 3 misiones, múltiples pistas y cápsulas de lección para escalar el caso horizontalmente.
      </p>
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-black">
        <GameCanvas />
        <DialogueOverlay />
      </div>
      <ProgressPanel />
    </section>
  );
}
