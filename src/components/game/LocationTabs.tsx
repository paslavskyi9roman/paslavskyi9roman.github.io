'use client';

import { LOCATION_ORDER, LOCATIONS } from '@/game/content/locations';
import { useGameStore } from '@/store/useGameStore';

export function LocationTabs() {
  const currentLocationId = useGameStore((s) => s.currentLocationId);
  const setLocation = useGameStore((s) => s.setLocation);

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
      {LOCATION_ORDER.map((id) => {
        const loc = LOCATIONS[id];
        const active = currentLocationId === id;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => setLocation(id)}
            style={{
              flex: 1,
              padding: '8px 10px',
              background: active ? 'var(--paper)' : 'transparent',
              border: 'none',
              borderRight: id === LOCATION_ORDER[LOCATION_ORDER.length - 1] ? 'none' : '1px solid var(--ink)',
              cursor: 'pointer',
              fontFamily: 'var(--sans)',
              fontSize: 11,
              letterSpacing: '0.16em',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: active ? 'var(--ink)' : 'var(--ink-faded)',
              borderBottom: active ? '3px solid var(--red)' : '3px solid transparent',
              textAlign: 'left',
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
              {loc.address.es}
            </span>
          </button>
        );
      })}
    </div>
  );
}
