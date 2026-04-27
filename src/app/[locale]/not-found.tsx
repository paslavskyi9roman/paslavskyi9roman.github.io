import Link from 'next/link';
import { Stamp } from '@/components/newsprint/Stamp';
import { defaultLocale } from '@/i18n/config';

export default function LocaleNotFound() {
  return (
    <div className="paper" style={{ minHeight: '100vh', padding: '60px 60px 40px' }}>
      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: 24,
          border: '2px solid var(--ink)',
          background: 'var(--paper-shadow)',
          position: 'relative',
        }}
      >
        <Stamp rotate={-6} style={{ position: 'absolute', top: -12, right: 18 }}>
          Cerrado
        </Stamp>
        <span className="kicker">404 · Pista perdida</span>
        <h1 className="headline" style={{ fontSize: 44, marginTop: 4 }}>
          Esta calle no existe en Madrid Noir.
        </h1>
        <hr className="rule-fancy" style={{ margin: '14px 0' }} />
        <p className="body-serif">
          The lead you followed leads nowhere. Volver al caso principal y continuar la investigación.
        </p>
        <div style={{ marginTop: 18 }}>
          <Link
            href={`/${defaultLocale}`}
            className="btn-news"
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
