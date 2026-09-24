import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import {
  beneficios,
  financiamientoCierre,
  financiamientoCta,
  financiamientoHeader,
  pasos,
  pasosHeader,
} from '../data/financiamiento';
import { useReveal } from '../hooks/useReveal';
import styles from './FinanciamientoPyme.module.css';

/** Página /servicios/financiamiento-pyme (brief 6.4/6.5): intro, beneficios, paso a
 * paso de 4 etapas y cierre con CTA. Toda la copy vive en `data/financiamiento.ts`.
 * El paso a paso es una tira horizontal en desktop y vertical en mobile (solo CSS). */
export default function FinanciamientoPyme() {
  const ref = useReveal<HTMLElement>(styles.reveal, styles.isIn);
  const { lead } = financiamientoHeader;

  return (
    <section className={styles.fp} ref={ref}>
      <div className={styles.inner}>
        <header className={`${styles.hero} ${styles.reveal}`}>
          <p className={styles.kicker}>
            <span className={styles.kickerLine} aria-hidden="true" />
            {financiamientoHeader.kicker}
          </p>
          <h1 className={styles.title}>{financiamientoHeader.title}</h1>
          <p className={styles.lead}>
            {lead.antes}
            <strong>{lead.destacado}</strong>
            {lead.despues}
          </p>
          <Link to={financiamientoCta.href} className={styles.cta}>
            {financiamientoCta.label}
          </Link>
        </header>

        <div className={styles.benes}>
          {beneficios.map((b, i) => (
            <article
              key={b.t}
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
          <h2 className={styles.h2}>{pasosHeader.title}</h2>
          <p className={styles.h2Sub}>{pasosHeader.sub}</p>
        </div>

        <ol className={styles.steps}>
          {pasos.map((p, i) => (
            <li
              key={p.n}
              className={`${styles.step} ${styles.reveal}`}
              style={{ '--i': i } as CSSProperties}
            >
              <span className={styles.stepNum}>{p.n}</span>
              <h3 className={styles.stepT}>{p.t}</h3>
              <p className={styles.stepD}>{p.d}</p>
            </li>
          ))}
        </ol>

        <div className={`${styles.close} ${styles.reveal}`}>
          <p className={styles.closeTxt}>{financiamientoCierre}</p>
          <Link to={financiamientoCta.href} className={styles.cta}>
            {financiamientoCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
