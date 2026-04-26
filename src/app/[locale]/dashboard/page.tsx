'use client';

import { useGameStore } from '@/store/useGameStore';

export default function DashboardPage() {
  const { vocabularyXp, grammarXp, investigationXp, discoveredClues, currentCaseId } = useGameStore();

  return (
    <section className="panel p-6">
      <h1 className="text-2xl font-semibold">Panel</h1>
      <p className="mt-2 text-slate-300">Caso: {currentCaseId}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md bg-noir-800 p-3">XP de vocabulario: {vocabularyXp}</div>
        <div className="rounded-md bg-noir-800 p-3">XP de gramática: {grammarXp}</div>
        <div className="rounded-md bg-noir-800 p-3">XP de investigación: {investigationXp}</div>
      </div>
      <h2 className="mt-6 text-lg font-medium">Pistas descubiertas</h2>
      <ul className="mt-2 list-disc pl-5 text-slate-300">
        {discoveredClues.length ? (
          discoveredClues.map((clue) => <li key={clue.id}>{clue.title}</li>)
        ) : (
          <li>Aún no hay pistas descubiertas.</li>
        )}
      </ul>
    </section>
  );
}
