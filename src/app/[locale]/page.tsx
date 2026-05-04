import Link from 'next/link';
import { Es } from '@/components/newsprint/Es';
import { Masthead } from '@/components/newsprint/Masthead';
import { NewsprintPhoto } from '@/components/newsprint/NewsprintPhoto';
import { Stamp } from '@/components/newsprint/Stamp';
import { CASE_ORDER, getCaseDefinition } from '@/game/content/cases';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tickerLines = CASE_ORDER.flatMap((caseId) => getCaseDefinition(caseId).ticker);
  const case001 = getCaseDefinition('case_001');
  const case002 = getCaseDefinition('case_002');

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
              href={`/${locale}/game?case=case_001`}
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
              archivo abierto · A2–B1 ↗
            </span>
          </div>
        </article>

        <aside>
          {CASE_ORDER.map((caseId, index) => {
            const caseDef = getCaseDefinition(caseId);
            return (
              <div
                key={caseId}
                style={{
                  position: 'relative',
                  padding: 16,
                  border: '2px solid var(--ink)',
                  background: index === 0 ? 'var(--paper-shadow)' : 'var(--paper)',
                  marginTop: index === 0 ? 0 : 16,
                }}
              >
                <Stamp rotate={index === 0 ? 4 : -4} style={{ position: 'absolute', top: -12, right: -8 }}>
                  Caso {caseDef.number}
                </Stamp>
                <span className="kicker">{caseDef.menu.eyebrow}</span>
                <h3 className="headline" style={{ fontSize: 26, lineHeight: 0.95, marginTop: 4 }}>
                  {caseDef.title.es}
                </h3>
                <p className="body-serif" style={{ fontSize: 13, marginTop: 8 }}>
                  {caseDef.menu.summary}
                </p>
                <div
                  style={{
                    marginTop: 12,
                    fontFamily: 'var(--mono)',
                    fontSize: 11,
                    color: 'var(--ink-soft)',
                  }}
                >
                  {caseDef.menu.meta.map((line) => (
                    <div key={line}>⌁ {line}</div>
                  ))}
                </div>
                <Link
                  href={`/${locale}/game?case=${caseId}`}
                  className="btn-news"
                  style={{ display: 'inline-block', marginTop: 14, textDecoration: 'none', fontSize: 12 }}
                >
                  Abrir expediente
                </Link>
              </div>
            );
          })}

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
            {case002.npcs
              .filter((npc) => npc.id !== 'npc_inspectora_ruiz')
              .map((npc) => {
                const bilingual = case002.bilingualNpcs[npc.id];
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
        {case001.title.es} — {case002.title.es}
      </p>
    </div>
  );
}
