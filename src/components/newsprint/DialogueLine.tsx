interface DialogueLineProps {
  speaker?: string;
  text: string;
  en?: string;
  role: 'npc' | 'player' | 'system';
}

export function DialogueLine({ speaker, text, en, role }: DialogueLineProps) {
  if (role === 'system') {
    return (
      <div
        className="fade-in"
        style={{
          padding: '8px 0',
          borderTop: '1px dashed var(--ink-faded)',
          borderBottom: '1px dashed var(--ink-faded)',
          margin: '8px 0',
        }}
      >
        <span className="kicker" style={{ color: 'var(--red)' }}>
          ⚡ Anotación del detective
        </span>
        <p className="body-serif" style={{ marginTop: 4, fontStyle: 'italic', color: 'var(--ink-soft)' }}>
          {text}
        </p>
      </div>
    );
  }

  const isPlayer = role === 'player';

  return (
    <div
      className="fade-in"
      style={{
        marginBottom: 14,
        paddingLeft: isPlayer ? 24 : 0,
        paddingRight: isPlayer ? 0 : 24,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--sans)',
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: isPlayer ? 'var(--red-deep)' : 'var(--ink)',
          marginBottom: 2,
        }}
      >
        — {speaker} {isPlayer ? '(detective)' : ''}
      </div>
      <p className="body-serif" style={{ fontSize: 15, color: 'var(--ink)', margin: 0 }}>
        {en ? (
          <span className="es" tabIndex={0}>
            «{text}»<span className="es-tooltip">{en}</span>
          </span>
        ) : (
          <>«{text}»</>
        )}
      </p>
    </div>
  );
}
