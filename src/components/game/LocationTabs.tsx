'use client';

import { getCaseDefinition } from '@/game/content/cases';
import { useGameStore } from '@/store/useGameStore';

export function LocationTabs() {
  const currentCaseId = useGameStore((s) => s.currentCaseId);
  const currentLocationId = useGameStore((s) => s.currentLocationId);
  const completedQuestIds = useGameStore((s) => s.completedQuestIds);
  const setLocation = useGameStore((s) => s.setLocation);
  const caseDef = getCaseDefinition(currentCaseId);

  return (
    <div
      role="tablist"
      aria-label="Ubicaciones del caso"
      style={{
        display: 'flex',
        gap: 0,
        marginBottom: 8,
        border: '2px solid var(--ink)',
        background: 'var(--paper-shadow)',
      }}
    >
      {caseDef.locationOrder.map((id) => {
        const loc = caseDef.locations[id]!;
        const active = currentLocationId === id;
        const required = caseDef.locationRequiredQuests[id] ?? [];
        const unlocked = required.every((questId) => completedQuestIds.includes(questId));
        return (
          <button
            key={id}
            role="tab"
            aria-selected={active}
            aria-disabled={!unlocked}
            type="button"
            onClick={() => setLocation(id)}
            disabled={!unlocked}
            title={
              unlocked ? undefined : 'Completa la investigación en la ubicación anterior para desbloquear esta escena.'
            }
            style={{
              flex: 1,
              padding: '8px 10px',
              background: active ? 'var(--paper)' : 'transparent',
              border: 'none',
              borderRight:
                id === caseDef.locationOrder[caseDef.locationOrder.length - 1] ? 'none' : '1px solid var(--ink)',
              cursor: unlocked ? 'pointer' : 'not-allowed',
              fontFamily: 'var(--sans)',
              fontSize: 11,
              letterSpacing: '0.16em',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: active ? 'var(--ink)' : 'var(--ink-faded)',
              borderBottom: active ? '3px solid var(--red)' : '3px solid transparent',
              textAlign: 'left',
              opacity: unlocked ? 1 : 0.55,
            }}
          >
            <span style={{ display: 'block' }}>{loc.name.es}</span>
            <span
              className="byline"
              style={{
                display: 'block',
                fontSize: 9,
                marginTop: 2,
                letterSpacing: '0.12em',
                color: active ? 'var(--ink-soft)' : 'var(--ink-faded)',
              }}
            >
              {unlocked ? loc.address.es : 'Bloqueado'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
