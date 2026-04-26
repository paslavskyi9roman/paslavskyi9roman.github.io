'use client';

import { useGameStore } from '@/store/useGameStore';

export function ProgressPanel() {
  const { vocabularyXp, grammarXp, investigationXp, discoveredClues, latestFeedback } = useGameStore();

  return (
    <aside className="panel p-4">
      <h2 className="text-lg font-semibold">Progress</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <p className="rounded bg-noir-800 p-2 text-sm">Vocabulary XP: {vocabularyXp}</p>
        <p className="rounded bg-noir-800 p-2 text-sm">Grammar XP: {grammarXp}</p>
        <p className="rounded bg-noir-800 p-2 text-sm">Investigation XP: {investigationXp}</p>
      </div>
      <p className="mt-3 text-sm text-slate-300">Clues found: {discoveredClues.length}</p>
      {latestFeedback && (
        <div className="mt-3 rounded border border-slate-700 p-3 text-sm">
          <p>Understandable: {latestFeedback.isUnderstandable ? 'Yes' : 'Not yet'}</p>
          {latestFeedback.suggestedCorrection && <p>Suggestion: {latestFeedback.suggestedCorrection}</p>}
          {latestFeedback.explanation && <p className="text-slate-300">{latestFeedback.explanation}</p>}
        </div>
      )}
    </aside>
  );
}
