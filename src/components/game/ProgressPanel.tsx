'use client';

import { useGameStore } from '@/store/useGameStore';
import { CASE_001_ROUTE_QUEST_REQUIRED_CLUES } from '@/game/content/case001';

export function ProgressPanel() {
  const {
    vocabularyXp,
    grammarXp,
    investigationXp,
    discoveredClues,
    latestFeedback,
    quests,
    completedQuestIds,
    lessons,
    npcs,
    contradictions,
    recordedStatements,
    casePhase,
    caseResolution,
  } = useGameStore();
  const routeQuestProgress = Math.min(discoveredClues.length, CASE_001_ROUTE_QUEST_REQUIRED_CLUES);

  const phaseLabel: Record<typeof casePhase, string> = {
    briefing: 'Informe inicial',
    investigation: 'Investigación',
    accusation: 'Lista para acusar',
    resolved: caseResolution === 'solved' ? 'Caso resuelto' : 'Caso cerrado (fallido)',
  };

  return (
    <aside className="panel p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Progreso</h2>
        <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-2 py-0.5 text-xs text-amber-200">
          Fase: {phaseLabel[casePhase]}
        </span>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <p className="rounded bg-noir-800 p-2 text-sm">XP de vocabulario: {vocabularyXp}</p>
        <p className="rounded bg-noir-800 p-2 text-sm">XP de gramática: {grammarXp}</p>
        <p className="rounded bg-noir-800 p-2 text-sm">XP de investigación: {investigationXp}</p>
      </div>
      <p className="mt-3 text-sm text-slate-300">
        Clues found: {discoveredClues.length} ({routeQuestProgress}/{CASE_001_ROUTE_QUEST_REQUIRED_CLUES} for
        “Reconstruye la ruta”)
      </p>
      <p className="mt-1 text-sm text-slate-300">
        Declaraciones registradas: {recordedStatements.length} · Contradicciones detectadas:{' '}
        <span className={contradictions.length > 0 ? 'text-rose-300' : 'text-slate-400'}>{contradictions.length}</span>
      </p>
      <p className="mt-1 text-sm text-slate-300">NPCs unlocked: {npcs.length}</p>
      <div className="mt-3 rounded border border-slate-700 p-3">
        <p className="text-sm font-medium">Registro de misiones</p>
        <ul className="mt-2 space-y-2 text-sm text-slate-300">
          {quests.map((quest) => (
            <li key={quest.id} className="rounded bg-noir-900 px-2 py-1">
              <span className={completedQuestIds.includes(quest.id) ? 'text-emerald-300' : 'text-amber-200'}>
                {completedQuestIds.includes(quest.id) ? '✓' : '•'} {quest.title}
              </span>
              <p className="text-xs text-slate-400">{quest.objective}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3 rounded border border-slate-700 p-3">
        <p className="text-sm font-medium">Cápsulas de lección</p>
        <ul className="mt-2 space-y-1 text-sm text-slate-300">
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <span className="text-amber-200">{lesson.title}:</span> {lesson.tip}
            </li>
          ))}
        </ul>
      </div>
      {latestFeedback && (
        <div className="mt-3 rounded border border-slate-700 p-3 text-sm">
          <p>Comprensible: {latestFeedback.isUnderstandable ? 'Sí' : 'Todavía no'}</p>
          {latestFeedback.suggestedCorrection && <p>Sugerencia: {latestFeedback.suggestedCorrection}</p>}
          {latestFeedback.explanation && <p className="text-slate-300">{latestFeedback.explanation}</p>}
        </div>
      )}
    </aside>
  );
}
