import Link from 'next/link';
import { Es } from '@/components/newsprint/Es';
import { Masthead } from '@/components/newsprint/Masthead';
import { NewsprintPhoto } from '@/components/newsprint/NewsprintPhoto';
import { Stamp } from '@/components/newsprint/Stamp';
import { CASE_001_BILINGUAL_NPCS, CASE_001_HEADLINE, CASE_001_TICKER } from '@/game/content/case001-bilingual';
import { CASE_001_NPCS } from '@/game/content/case001';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tickerLines = [...CASE_001_TICKER, ...CASE_001_TICKER];

  return (
    <div className="paper" style={{ minHeight: '100vh', padding: '0 60px 40px' }}>
      <Masthead />

      <div
        style={{
          borderTop: '1px solid var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '4px 0',
          overflow: 'hidden',
          background: 'var(--paper-shadow)',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          className="ticker"
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 12,
            letterSpacing: '0.05em',
            color: 'var(--ink-soft)',
          }}
        >
          {tickerLines.map((line, i) => (
            <span key={i} style={{ paddingRight: 40 }}>
              {line}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          gap: 28,
          marginTop: 18,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <article>
          <span className="kicker">Crónica negra · Por la Redacción</span>
          <h1 className="headline" style={{ fontSize: 78, lineHeight: 0.92, marginTop: 6 }}>
            Aprende <em style={{ fontStyle: 'italic', color: 'var(--red-deep)' }}>español</em>
            <br />
            resolviendo <em style={{ fontStyle: 'italic' }}>crímenes</em>.
          </h1>
          <hr className="rule-fancy" style={{ margin: '16px 0' }} />
          <NewsprintPhoto
            src="/assets/scenes/bg_landing_hero.png"
            alt="Madrid de noche"
            height={340}
            priority
            caption="MADRID, ANOCHECER · Calle de Alcalá hacia la Gran Vía. Foto del archivo."
          />

          <div className="cols-2 body-serif dropcap" style={{ marginTop: 16, fontSize: 14 }}>
            <p>
              <strong>MADRID, OTOÑO DE 1953.</strong> En las calles mojadas de la capital, las palabras valen más que
              las balas. <em>Madrid Noir</em> es un juego-novela en el que tú, detective, interrogas a sospechosos en{' '}
              <Es es="español" en="Spanish" /> para resolver crímenes reales del Madrid de posguerra.
            </p>
            <p>
              Cada pregunta que formulas suma <Es es="vocabulario" en="vocabulary" />. Cada conjugación correcta
              refuerza tu <Es es="gramática" en="grammar" />. Cada contradicción que detectas te acerca a la verdad. Sin
              tarjetas, sin ejercicios — sólo el oficio.
            </p>
          </div>

          <div style={{ marginTop: 22, display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link
              href={`/${locale}/game`}
              className="btn-news"
              style={{
                fontSize: 14,
                padding: '16px 28px',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              ▸ Aceptar el caso
            </Link>
            <Link
              href={`/${locale}/dashboard`}
              className="btn-ghost"
              style={{
                fontSize: 14,
                padding: '14px 22px',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Ver progreso
            </Link>
            <span className="handwritten" style={{ fontSize: 22, marginLeft: 8 }}>
              nivel · A2–B1 ↗
            </span>
          </div>
        </article>

        <aside>
          <div
            style={{
              position: 'relative',
              padding: 16,
              border: '2px solid var(--ink)',
              background: 'var(--paper-shadow)',
            }}
          >
            <Stamp rotate={4} style={{ position: 'absolute', top: -12, right: -8 }}>
              Caso 001
            </Stamp>
            <span className="kicker">Esta semana</span>
            <h3 className="headline" style={{ fontSize: 26, lineHeight: 0.95, marginTop: 4 }}>
              Una Noche en <em style={{ fontStyle: 'italic' }}>Lavapiés</em>
            </h3>
            <p className="body-serif" style={{ fontSize: 13, marginTop: 8 }}>
              Un periodista muerto. Tres testigos. Cuatro pistas. Lo que tú digas, en español, decide la sentencia.
            </p>
            <div
              style={{
                marginTop: 12,
                fontFamily: 'var(--mono)',
                fontSize: 11,
                color: 'var(--ink-soft)',
              }}
            >
              ⌁ Tiempo medio: 25–40 min
              <br />
              ⌁ Nivel: intermedio (A2–B1)
              <br />⌁ Idiomas: ES (con ayuda EN)
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              padding: 14,
              border: '1px solid var(--ink)',
              background: 'var(--paper)',
            }}
          >
            <span className="kicker">Reparto</span>
            <hr className="rule" style={{ marginTop: 4 }} />
            {CASE_001_NPCS.map((npc) => {
              const bilingual = CASE_001_BILINGUAL_NPCS[npc.id];
              return (
                <div
                  key={npc.id}
                  style={{
                    display: 'flex',
                    gap: 10,
                    padding: '8px 0',
                    borderBottom: '1px dotted var(--ink-faded)',
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 56,
                      flexShrink: 0,
                      position: 'relative',
                    }}
                  >
                    <NewsprintPhoto
                      src={bilingual?.portrait ?? `/assets/characters/${npc.id}.png`}
                      alt={npc.name}
                      height={56}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--display)',
                        fontWeight: 800,
                        fontSize: 14,
                      }}
                    >
                      {npc.name}
                    </div>
                    <div className="byline" style={{ fontSize: 9 }}>
                      {npc.role}
                    </div>
                    <p className="body-serif" style={{ fontSize: 11, marginTop: 2, color: 'var(--ink-soft)' }}>
                      {bilingual?.tagline ?? npc.openingLine}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              background: 'var(--ink)',
              color: 'var(--paper)',
            }}
          >
            <span className="byline" style={{ color: 'var(--paper-shadow)' }}>
              Cómo se juega
            </span>
            <ol
              style={{
                paddingLeft: 18,
                fontFamily: 'var(--body)',
                fontSize: 12,
                lineHeight: 1.6,
                marginTop: 6,
                color: 'var(--paper)',
              }}
            >
              <li>Pulsa puntos rojos · recoge pistas.</li>
              <li>Interroga · pulsa preguntas en español o escríbelas tú.</li>
              <li>Pasa el cursor sobre cualquier frase para ver la traducción.</li>
              <li>Acusa con pruebas físicas — o pierdes el caso.</li>
            </ol>
          </div>
        </aside>
      </div>

      <p className="byline" style={{ marginTop: 32, textAlign: 'center', opacity: 0.7 }}>
        {CASE_001_HEADLINE.es} — {CASE_001_HEADLINE.en}
      </p>
    </div>
  );
}
