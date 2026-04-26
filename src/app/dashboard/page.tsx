'use client';

import { useGameStore } from '@/store/useGameStore';

export default function DashboardPage() {
  const { vocabularyXp, grammarXp, investigationXp, discoveredClues, currentCaseId } = useGameStore();

  return (
    <section className="panel p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-slate-300">Case: {currentCaseId}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md bg-noir-800 p-3">Vocabulary XP: {vocabularyXp}</div>
        <div className="rounded-md bg-noir-800 p-3">Grammar XP: {grammarXp}</div>
        <div className="rounded-md bg-noir-800 p-3">Investigation XP: {investigationXp}</div>
      </div>
      <h2 className="mt-6 text-lg font-medium">Discovered clues</h2>
      <ul className="mt-2 list-disc pl-5 text-slate-300">
        {discoveredClues.length ? (
          discoveredClues.map((clue) => <li key={clue.id}>{clue.title}</li>)
        ) : (
          <li>No clues discovered yet.</li>
        )}
      </ul>
    </section>
  );
}
