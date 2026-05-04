'use client';

import type { Quest } from '@/types/game';
import { Es } from '@/components/newsprint/Es';
import { MeterRow } from '@/components/newsprint/MeterRow';
import { getCaseDefinition } from '@/game/content/cases';
import { useGameStore } from '@/store/useGameStore';

export function DetectiveNotebook() {
  const currentCaseId = useGameStore((s) => s.currentCaseId);
  const vocabularyXp = useGameStore((s) => s.vocabularyXp);
  const grammarXp = useGameStore((s) => s.grammarXp);
  const investigationXp = useGameStore((s) => s.investigationXp);
  const discoveredClues = useGameStore((s) => s.discoveredClues);
  const recordedStatements = useGameStore((s) => s.recordedStatements);
  const contradictions = useGameStore((s) => s.contradictions);
  const quests = useGameStore((s) => s.quests);
  const completedQuestIds = useGameStore((s) => s.completedQuestIds);
  const currentLocationId = useGameStore((s) => s.currentLocationId);
  const caseDef = getCaseDefinition(currentCaseId);

  const renderQuestRow = (q: Quest) => {
    const done = completedQuestIds.includes(q.id);
    const en = caseDef.questBilingual[q.id];
    return (
      <li
        key={q.id}
        style={{
          padding: '6px 0',
          borderBottom: '1px dotted var(--ink-faded)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--sans)',
            fontSize: 12,
            fontWeight: 800,
            color: done ? 'var(--red-deep)' : 'var(--ink)',
            minWidth: 16,
          }}
        >
          {done ? '✓' : '□'}
        </span>
        <div>
          <div
            style={{
              fontFamily: 'var(--display)',
              fontSize: 14,
              fontWeight: 700,
              textDecoration: done ? 'line-through' : 'none',
            }}
          >
            {en ? <Es es={q.title} en={en.title} /> : q.title}
          </div>
          <div className="body-serif" style={{ fontSize: 12 }}>
            {en ? <Es es={q.objective} en={en.objective} /> : q.objective}
          </div>
        </div>
      </li>
    );
  };

  const totalXp = vocabularyXp + grammarXp + investigationXp;

  return (
    <aside>
      <div
        style={{
          borderTop: '3px solid var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '6px 0 4px',
          marginBottom: 10,
        }}
      >
        <span className="kicker">Cuaderno del Detective</span>
        <h3 className="headline" style={{ fontSize: 20 }}>
          Progreso
        </h3>
      </div>

      <MeterRow label="Vocabulario" value={vocabularyXp} accent="var(--ink)" />
      <MeterRow label="Gramática" value={grammarXp} accent="var(--ink-soft)" />
      <MeterRow label="Investigación" value={investigationXp} accent="var(--red)" />

      <div
        style={{
          marginTop: 14,
          padding: '8px 10px',
          border: '1px solid var(--ink)',
          background: 'rgba(20, 16, 11, 0.04)',
        }}
      >
        <div className="byline" style={{ marginBottom: 4 }}>
          Total · {totalXp} XP
        </div>
        <div className="byline" style={{ fontSize: 9 }}>
          Pistas {discoveredClues.length} · Declaraciones {recordedStatements.length} · ⚡ {contradictions.length}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <hr className="rule" />
        <span className="kicker">
          <Es es="Misiones" en="Quests" />
        </span>
        {caseDef.locationOrder.map((locId) => {
          const locQuests = quests.filter((q) => q.locationId === locId);
          if (locQuests.length === 0) return null;
          const isCurrent = locId === currentLocationId;
          const doneCount = locQuests.filter((q) => completedQuestIds.includes(q.id)).length;
          const loc = caseDef.locations[locId]!;
          const summary = (
            <span
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <Es es={loc.name.es} en={loc.name.en} /> · {doneCount}/{locQuests.length}
              {doneCount === locQuests.length ? ' ✓' : ''}
            </span>
          );
          if (isCurrent) {
            return (
              <div key={locId} style={{ marginTop: 10 }}>
                <div style={{ padding: '4px 0' }}>{summary}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>{locQuests.map(renderQuestRow)}</ul>
              </div>
            );
          }
          return (
            <details key={locId} style={{ marginTop: 8, opacity: 0.55 }}>
              <summary style={{ cursor: 'pointer', padding: '4px 0' }}>{summary}</summary>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>{locQuests.map(renderQuestRow)}</ul>
            </details>
          );
        })}
      </div>

      <div style={{ marginTop: 16 }}>
        <hr className="rule" />
        <span className="kicker">Glosario · Vocablos del caso</span>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4px 12px',
            marginTop: 6,
          }}
        >
          {caseDef.vocabulary.map((v) => (
            <div key={v.es} style={{ fontFamily: 'var(--body)', fontSize: 12, lineHeight: 1.3 }}>
              <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{v.es}</span>
              <span style={{ color: 'var(--ink-faded)' }}> · {v.en}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
