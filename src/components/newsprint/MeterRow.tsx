interface MeterRowProps {
  label: string;
  value: number;
  max?: number;
  accent?: string;
}

export function MeterRow({ label, value, max = 120, accent = 'var(--ink)' }: MeterRowProps) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ marginBottom: 8 }}>
      <div
        className="flex justify-between"
        style={{
          fontFamily: 'var(--sans)',
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--ink)',
          marginBottom: 3,
        }}
      >
        <span>{label}</span>
        <span>{value} XP</span>
      </div>
      <div
        style={{
          height: 10,
          background: 'var(--paper-shadow)',
          border: '1px solid var(--ink)',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: accent,
            backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 3px, rgba(255,255,255,0.06) 3px 6px)',
          }}
        />
      </div>
    </div>
  );
}
