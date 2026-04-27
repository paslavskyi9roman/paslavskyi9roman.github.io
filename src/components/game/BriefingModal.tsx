'use client';

import { Es } from '@/components/newsprint/Es';
import { Stamp } from '@/components/newsprint/Stamp';
import { useGameStore } from '@/store/useGameStore';

export function BriefingModal() {
  const casePhase = useGameStore((state) => state.casePhase);
  const briefingSeen = useGameStore((state) => state.briefingSeen);
  const dismissBriefing = useGameStore((state) => state.dismissBriefing);

  if (casePhase !== 'briefing' || briefingSeen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="briefing-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 12, 8, 0.85)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
      }}
    >
      <div
        className="paper"
        style={{
          maxWidth: 720,
          width: '100%',
          padding: '32px 40px',
          border: '2px solid var(--ink)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ position: 'absolute', top: 18, right: 18 }}>
          <Stamp rotate={6}>Confidencial</Stamp>
        </div>
        <span className="kicker">Telegrama urgente · Jefatura Superior · Madrid</span>
        <h1 id="briefing-title" className="headline" style={{ fontSize: 48, marginTop: 6, lineHeight: 0.95 }}>
          Una Noche en <em style={{ fontStyle: 'italic', color: 'var(--red-deep)' }}>Lavapiés</em>
        </h1>
        <hr className="rule-fancy" style={{ margin: '14px 0' }} />
        <div className="cols-2 body-serif dropcap" style={{ fontSize: 14 }}>
          <p>
            <strong>MADRID, 14·X·1953.</strong> Antes del amanecer, el cuerpo del periodista{' '}
            <Es es="Ramón Quintero" en="Ramón Quintero" /> apareció en el callejón tras la{' '}
            <Es es="Taberna La Sirena" en="The Mermaid Tavern" />, en pleno barrio de Lavapiés. La{' '}
            <Es es="Inspectora Ruiz" en="Inspector Ruiz" /> le ha llamado a usted, detective, para coser las grietas de
            tres declaraciones.
          </p>
          <p>
            Tres testigos. Cuatro pistas físicas. Una <Es es="coartada" en="alibi" /> que no encaja con la hora. Su
            trabajo: hablar con cada uno en <Es es="español claro" en="clear Spanish" />, recoger las contradicciones y,
            cuando reúna pruebas suficientes, formular la <Es es="acusación formal" en="formal accusation" />.
          </p>
        </div>

        <div
          style={{
            marginTop: 18,
            padding: 16,
            background: 'var(--paper-shadow)',
            border: '1px solid var(--ink)',
          }}
        >
          <span className="kicker">Instrucciones de la Inspectora Ruiz</span>
          <ol
            style={{
              marginTop: 8,
              paddingLeft: 22,
              fontFamily: 'var(--body)',
              fontSize: 13,
              lineHeight: 1.65,
            }}
          >
            <li>Habla con los tres testigos. Empieza por hora, lugar y compañía.</li>
            <li>Examina la escena. Cada punto rojo del plano oculta una pista.</li>
            <li>
              Las pistas físicas <em>nunca</em> mienten — pero los testigos sí.
            </li>
            <li>
              Cuando aparezca el sello «
              <span style={{ color: 'var(--red-deep)', fontWeight: 700 }}>LISTO PARA ACUSAR</span>
              », pulsa <em>Acusar</em>.
            </li>
          </ol>
        </div>

        <div
          style={{
            marginTop: 22,
            display: 'flex',
            gap: 10,
            justifyContent: 'flex-end',
          }}
        >
          <button onClick={dismissBriefing} className="btn-news">
            Aceptar el caso
          </button>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 18,
            left: 28,
            fontFamily: 'var(--mono)',
            fontSize: 11,
            color: 'var(--ink-faded)',
          }}
        >
          firmado · Insp. M. Ruiz, Brigada Criminal
        </div>
      </div>
    </div>
  );
}
