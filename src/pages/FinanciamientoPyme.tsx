import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { reserva } from '../lib/reserva';
import styles from './FinanciamientoPyme.module.css';

/** Un beneficio o un paso: `t` = título, `d` = texto. Los pasos se numeran por posición (1 a 4). */
export interface BloqueTexto {
  t: string;
  d: string;
}

/** Los textos de la página (vienen de Sanity, ver FinanciamientoSanity). Antetítulo, bajada y bajada
 * del paso a paso vacíos no se pintan. `lead` ya viene armado (con el resaltado en <strong>). */
export interface FinanciamientoTextos {
  kicker?: string;
  title: string;
  lead?: ReactNode;
  /** El mismo texto en los dos botones (intro y cierre). */
  ctaLabel: string;
  ctaHref: string;
  beneficios: BloqueTexto[];
  pasosTitle: string;
  pasosSub?: string;
  pasos: BloqueTexto[];
  cierre: string;
}

/** `cargando`: los textos todavía no llegaron de Sanity. Se ve el fondo de la página con el alto que
 * va a tener (texto de relleno invisible, ver RESERVA), así el Footer no salta. */
export type FinanciamientoProps = { cargando: true } | ({ cargando?: false } & FinanciamientoTextos);

const bloques = (largos: number[][]) => largos.map(([t, d]) => ({ t: reserva(t), d: reserva(d) }));

/** Lo que se pinta (invisible) mientras carga: los largos de los textos actuales. */
const RESERVA: FinanciamientoTextos = {
  kicker: reserva(31),
  title: reserva(42),
  lead: reserva(216),
  ctaLabel: reserva(19),
  ctaHref: '',
  beneficios: bloques([
    [29, 57],
    [21, 79],
    [29, 80],
  ]),
  pasosTitle: reserva(38),
  pasosSub: reserva(94),
  pasos: bloques([
    [26, 64],
    [20, 56],
    [24, 62],
    [17, 67],
  ]),
  cierre: reserva(87),
};

/** Página /servicios/financiamiento-pyme (brief 6.4/6.5): intro, beneficios, paso a
 * paso de 4 etapas y cierre con CTA. Recibe los textos por props (FinanciamientoSanity).
 * El paso a paso es una tira horizontal en desktop y vertical en mobile (solo CSS). */
export default function FinanciamientoPyme(props: FinanciamientoProps) {
  const { cargando } = props;
  const { kicker, title, lead, ctaLabel, ctaHref, beneficios, pasosTitle, pasosSub, pasos, cierre } =
    props.cargando ? RESERVA : props;
  const ref = useReveal<HTMLElement>(styles.reveal, styles.isIn);

  // Mientras carga, los botones son texto invisible: no llevan a ningún lado.
  const cta = cargando ? (
    <span className={styles.cta}>{ctaLabel}</span>
  ) : (
    <Link to={ctaHref} className={styles.cta}>
      {ctaLabel}
    </Link>
  );

  return (
    <section
      className={`${styles.fp} ${cargando ? styles.cargando : ''}`}
      ref={ref}
      aria-busy={cargando || undefined}
    >
      <div className={styles.inner} aria-hidden={cargando || undefined}>
        <header className={`${styles.hero} ${styles.reveal}`}>
          {kicker && (
            <p className={styles.kicker}>
              <span className={styles.kickerLine} aria-hidden="true" />
              {kicker}
            </p>
          )}
          <h1 className={styles.title}>{title}</h1>
          {lead && <p className={styles.lead}>{lead}</p>}
          {cta}
        </header>

        <div className={styles.benes}>
          {beneficios.map((b, i) => (
            <article
              key={i}
              className={`${styles.bene} ${styles.reveal}`}
              style={{ '--i': i } as CSSProperties}
            >
              <span className={styles.beneMark} aria-hidden="true" />
              <h2 className={styles.beneT}>{b.t}</h2>
              <p className={styles.beneD}>{b.d}</p>
            </article>
          ))}
        </div>

        <div className={`${styles.stepsHead} ${styles.reveal}`}>
          <h2 className={styles.h2}>{pasosTitle}</h2>
          {pasosSub && <p className={styles.h2Sub}>{pasosSub}</p>}
        </div>

        <ol className={styles.steps}>
          {pasos.map((p, i) => (
            <li
              key={i}
              className={`${styles.step} ${styles.reveal}`}
              style={{ '--i': i } as CSSProperties}
            >
              <span className={styles.stepNum}>{i + 1}</span>
              <h3 className={styles.stepT}>{p.t}</h3>
              <p className={styles.stepD}>{p.d}</p>
            </li>
          ))}
        </ol>

        <div className={`${styles.close} ${styles.reveal}`}>
          <p className={styles.closeTxt}>{cierre}</p>
          {cta}
        </div>
      </div>
    </section>
  );
}
