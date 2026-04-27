interface MastheadProps {
  small?: boolean;
  subtitle?: string;
  subtitleEn?: string;
}

export function Masthead({
  small = false,
  subtitle = 'Edición de la Noche · Madrid · 14 de Octubre de 1953',
  subtitleEn = 'Evening Edition · Madrid · 14 October 1953',
}: MastheadProps) {
  return (
    <header className="relative" style={{ padding: small ? '10px 0 8px' : '18px 0 12px' }}>
      <div
        className="flex items-center justify-between"
        style={{
          borderTop: '3px solid var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '6px 12px',
        }}
      >
        <span className="byline">Vol. XII · Nº 3,481</span>
        <span className="byline">10 céntimos</span>
        <span className="byline">Tiempo en Madrid · llovizna · 9°</span>
      </div>
      <div className="text-center" style={{ padding: small ? '4px 0 0' : '10px 0 4px' }}>
        <h1 className="masthead" style={{ fontSize: small ? 56 : 96, letterSpacing: '-0.04em' }}>
          MADRID <span style={{ color: 'var(--red-deep)', fontStyle: 'italic' }}>Noir</span>
        </h1>
        <div className="rule-fancy" style={{ margin: '6px auto', width: '60%' }} />
        <p className="byline" style={{ fontSize: 11 }}>
          <span className="es" tabIndex={0}>
            {subtitle}
            <span className="es-tooltip">{subtitleEn}</span>
          </span>
          <span style={{ margin: '0 12px' }}>·</span>
          DIARIO DE LA NOCHE
        </p>
      </div>
    </header>
  );
}
