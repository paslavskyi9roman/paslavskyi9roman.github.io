export default function LocaleLoading() {
  return (
    <div className="paper" style={{ minHeight: '100vh', padding: '60px 60px 40px' }}>
      <div
        style={{
          maxWidth: 480,
          margin: '0 auto',
          padding: 18,
          border: '1px solid var(--ink)',
          background: 'var(--paper-shadow)',
          textAlign: 'center',
        }}
      >
        <span className="kicker">Cargando expediente…</span>
        <div
          style={{
            marginTop: 14,
            height: 10,
            border: '1px solid var(--ink)',
            background: 'var(--paper)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '40%',
              background: 'var(--red)',
              backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 3px, rgba(255,255,255,0.08) 3px 6px)',
              animation: 'fadeIn 0.4s ease-in-out infinite alternate',
            }}
          />
        </div>
      </div>
    </div>
  );
}
