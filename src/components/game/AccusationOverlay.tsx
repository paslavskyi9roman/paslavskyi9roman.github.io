'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';

interface AccusationOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function AccusationOverlay({ open, onClose }: AccusationOverlayProps) {
  const npcs = useGameStore((state) => state.npcs);
  const contradictions = useGameStore((state) => state.contradictions);
  const recordedStatements = useGameStore((state) => state.recordedStatements);
  const discoveredClues = useGameStore((state) => state.discoveredClues);
  const casePhase = useGameStore((state) => state.casePhase);
  const caseResolution = useGameStore((state) => state.caseResolution);
  const accusedNpcId = useGameStore((state) => state.accusedNpcId);
  const accuse = useGameStore((state) => state.accuse);

  const [selectedNpcId, setSelectedNpcId] = useState<string | null>(null);
  const [selectedContradictionIds, setSelectedContradictionIds] = useState<Set<string>>(new Set());

  if (!open) return null;

  const isResolved = casePhase === 'resolved';
  const accusableNpcs = npcs.filter((n) => n.id !== 'npc_inspectora_ruiz');

  const toggleContradiction = (id: string) => {
    setSelectedContradictionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const submit = () => {
    if (!selectedNpcId) return;
    accuse(selectedNpcId, [...selectedContradictionIds]);
  };

  const accusedNpc = npcs.find((n) => n.id === accusedNpcId);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-amber-400/30 bg-noir-900 p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-300">Acusación formal</p>
            <h2 className="text-xl font-semibold text-amber-100">¿Quién es el culpable?</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-slate-600 px-2 py-1 text-xs hover:bg-noir-800"
            aria-label="Cerrar acusación"
          >
            Cerrar
          </button>
        </div>

        {isResolved ? (
          <div className="mt-4 space-y-3">
            <div
              className={`rounded-lg border p-4 text-sm ${
                caseResolution === 'solved'
                  ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                  : 'border-rose-400/40 bg-rose-500/10 text-rose-200'
              }`}
            >
              <p className="text-base font-semibold">
                {caseResolution === 'solved' ? 'Caso resuelto' : 'Acusación fallida'}
              </p>
              <p className="mt-1 text-sm">
                {caseResolution === 'solved'
                  ? `Acusaste a ${accusedNpc?.name ?? accusedNpcId} con pruebas sólidas.`
                  : `Acusaste a ${accusedNpc?.name ?? accusedNpcId}, pero el caso no quedó resuelto.`}
              </p>
            </div>
            <p className="text-xs text-slate-400">Para reabrir el caso, borra el progreso local desde el navegador.</p>
          </div>
        ) : (
          <>
            <p className="mt-3 text-sm text-slate-300">
              Selecciona al sospechoso y marca al menos una contradicción que respalde la acusación.
            </p>

            <section className="mt-4">
              <h3 className="text-sm font-medium text-amber-200">Sospechoso</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {accusableNpcs.map((npc) => (
                  <button
                    key={npc.id}
                    onClick={() => setSelectedNpcId(npc.id)}
                    className={`rounded-md border px-3 py-2 text-left text-sm ${
                      selectedNpcId === npc.id
                        ? 'border-amber-300 bg-amber-200/10'
                        : 'border-slate-600 hover:bg-noir-800'
                    }`}
                  >
                    <span className="block font-medium">{npc.name}</span>
                    <span className="block text-xs text-slate-400">{npc.role}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-4">
              <h3 className="text-sm font-medium text-rose-300">Contradicciones de apoyo</h3>
              {contradictions.length === 0 ? (
                <p className="mt-1 text-sm text-slate-400">
                  No has detectado contradicciones. Vuelve a la escena y sigue investigando.
                </p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {contradictions.map((record) => {
                    const clue = discoveredClues.find((c) => c.id === record.clueId);
                    const statement = recordedStatements.find((s) => s.id === record.statementId);
                    const checked = selectedContradictionIds.has(record.id);
                    return (
                      <li key={record.id}>
                        <label className="flex cursor-pointer items-start gap-2 rounded border border-slate-700 bg-noir-950 p-2 text-sm">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleContradiction(record.id)}
                            className="mt-1"
                          />
                          <span>
                            <span className="block text-slate-100">{clue?.title ?? record.clueId}</span>
                            <span className="block text-xs text-slate-400">
                              vs {statement?.value ?? record.statementId}
                            </span>
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-noir-800"
              >
                Cancelar
              </button>
              <button
                onClick={submit}
                disabled={!selectedNpcId}
                className="rounded-md bg-amber-400 px-4 py-2 text-sm font-medium text-noir-950 hover:bg-amber-300 disabled:opacity-50"
              >
                Acusar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
