'use client';

import { useGameStore } from '@/store/useGameStore';

interface ClueJournalProps {
  open: boolean;
  onClose: () => void;
}

export function ClueJournal({ open, onClose }: ClueJournalProps) {
  const discoveredClues = useGameStore((state) => state.discoveredClues);
  const recordedStatements = useGameStore((state) => state.recordedStatements);
  const contradictions = useGameStore((state) => state.contradictions);
  const npcs = useGameStore((state) => state.npcs);

  if (!open) return null;

  const statementsByNpc = recordedStatements.reduce<Record<string, typeof recordedStatements>>((acc, statement) => {
    (acc[statement.npcId] ??= []).push(statement);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-700 bg-noir-900 p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-300">Diario del detective</p>
            <h2 className="text-xl font-semibold">Pistas, declaraciones y contradicciones</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-slate-600 px-2 py-1 text-xs hover:bg-noir-800"
            aria-label="Cerrar diario"
          >
            Cerrar
          </button>
        </div>

        <section className="mt-4">
          <h3 className="text-sm font-medium text-amber-200">Pistas ({discoveredClues.length})</h3>
          {discoveredClues.length === 0 ? (
            <p className="mt-1 text-sm text-slate-400">Aún no has recogido pistas físicas.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {discoveredClues.map((clue) => (
                <li key={clue.id} className="rounded border border-slate-700 bg-noir-950 p-2 text-sm">
                  <p className="font-medium text-slate-100">{clue.title}</p>
                  <p className="text-xs text-slate-400">{clue.description}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-4">
          <h3 className="text-sm font-medium text-amber-200">Declaraciones</h3>
          {recordedStatements.length === 0 ? (
            <p className="mt-1 text-sm text-slate-400">Aún no has registrado declaraciones de los testigos.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {Object.entries(statementsByNpc).map(([npcId, statements]) => {
                const npc = npcs.find((n) => n.id === npcId);
                return (
                  <li key={npcId} className="rounded border border-slate-700 bg-noir-950 p-2 text-sm">
                    <p className="font-medium text-slate-100">{npc?.name ?? npcId}</p>
                    <ul className="mt-1 space-y-1 text-xs text-slate-300">
                      {statements.map((statement) => (
                        <li key={statement.id}>
                          <span className="text-slate-400">[{statement.topic}]</span> {statement.value}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="mt-4">
          <h3 className="text-sm font-medium text-rose-300">Contradicciones ({contradictions.length})</h3>
          {contradictions.length === 0 ? (
            <p className="mt-1 text-sm text-slate-400">No hay contradicciones detectadas todavía.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {contradictions.map((record) => {
                const clue = discoveredClues.find((c) => c.id === record.clueId);
                const statement = recordedStatements.find((s) => s.id === record.statementId);
                const npc = npcs.find((n) => n.id === record.npcId);
                return (
                  <li
                    key={record.id}
                    className="rounded border border-rose-500/30 bg-rose-500/5 p-2 text-sm text-slate-200"
                  >
                    <p className="font-medium text-rose-200">{npc?.name ?? record.npcId}</p>
                    <p className="text-xs text-slate-300">
                      <span className="text-amber-200">Pista:</span> {clue?.title ?? record.clueId} —{' '}
                      <span className="text-amber-200">Declaración:</span> {statement?.value ?? record.statementId}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
