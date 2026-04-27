'use client';

import { useGameStore } from '@/store/useGameStore';

export function BriefingModal() {
  const casePhase = useGameStore((state) => state.casePhase);
  const briefingSeen = useGameStore((state) => state.briefingSeen);
  const dismissBriefing = useGameStore((state) => state.dismissBriefing);
  const npcs = useGameStore((state) => state.npcs);

  if (casePhase !== 'briefing' || briefingSeen) return null;

  const ruiz = npcs.find((n) => n.id === 'npc_inspectora_ruiz');

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4">
      <div className="max-w-lg rounded-xl border border-amber-400/30 bg-noir-900 p-6 shadow-xl">
        <p className="text-xs uppercase tracking-widest text-amber-300">Informe inicial</p>
        <h2 className="mt-1 text-xl font-semibold text-amber-100">{ruiz?.name ?? 'Inspectora Ruiz'}</h2>
        <p className="mt-3 text-sm text-slate-200">
          {ruiz?.openingLine ?? 'Tienes que conectar testigos, tiempo y pruebas físicas.'}
        </p>
        <ul className="mt-4 list-disc pl-5 text-sm text-slate-300">
          <li>Habla con los tres testigos y registra sus declaraciones.</li>
          <li>Examina cada pista de la escena: tiempo, lugar y compañía.</li>
          <li>Cuando reúnas pistas que choquen con las declaraciones, podrás acusar.</li>
        </ul>
        <div className="mt-5 flex justify-end">
          <button
            onClick={dismissBriefing}
            className="rounded-md bg-amber-400 px-4 py-2 text-sm font-medium text-noir-950 hover:bg-amber-300"
          >
            Empezar la investigación
          </button>
        </div>
      </div>
    </div>
  );
}
