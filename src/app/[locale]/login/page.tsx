export default function LoginPage() {
  return (
    <div className="paper" style={{ minHeight: '100vh', padding: '24px 60px 40px' }}>
      <div
        style={{
          maxWidth: 560,
          margin: '0 auto',
          padding: 24,
          border: '2px solid var(--ink)',
          background: 'var(--paper-shadow)',
        }}
      >
        <span className="kicker">Acceso · Brigada Nocturna</span>
        <h1 className="headline" style={{ fontSize: 32, marginTop: 4 }}>
          Iniciar sesión
        </h1>
        <hr className="rule-fancy" style={{ margin: '14px 0' }} />
        <p className="body-serif" style={{ fontSize: 13 }}>
          La integración con Supabase Auth va después. Por ahora, esta pantalla marca dónde vivirá el acceso con email y
          redes sociales.
        </p>
      </div>
    </div>
  );
}
