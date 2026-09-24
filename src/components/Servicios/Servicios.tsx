import type { CSSProperties, SVGProps } from 'react';
import { Link } from 'react-router-dom';
import type { InstrumentGroup, ServiceIconName, ServicePillar } from '../../data/placeholders';
import { useReveal } from '../../hooks/useReveal';
import styles from './Servicios.module.css';

export interface ServiciosProps {
  kicker: string;
  title: string;
  lead: string;
  pillars: ServicePillar[];
  instrumentsTitle: string;
  instrumentGroups: InstrumentGroup[];
  feesTitle: string;
  feesLead: string;
  feesCtaLabel: string;
}

const iconProps: SVGProps<SVGSVGElement> = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function ServiceIcon({ name }: { name: ServiceIconName }) {
  if (name === 'growth') {
    return (
      <svg {...iconProps} aria-hidden="true">
        <polyline points="3 17 9 11 13 15 21 6" />
        <polyline points="15 6 21 6 21 12" />
      </svg>
    );
  }
  if (name === 'pie') {
    return (
      <svg {...iconProps} aria-hidden="true">
        <path d="M21 15.5A9 9 0 1 1 8.5 3" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
      </svg>
    );
  }
  return (
    <svg {...iconProps} aria-hidden="true">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

/** CSS custom property `--i` para escalonar el delay de la animación de entrada. */
function staggerStyle(index: number): CSSProperties {
  return { '--i': index } as CSSProperties;
}

export default function Servicios({
  kicker,
  title,
  lead,
  pillars,
  instrumentsTitle,
  instrumentGroups,
  feesTitle,
  feesLead,
  feesCtaLabel,
}: ServiciosProps) {
  const ref = useReveal<HTMLElement>(styles.reveal, styles.isIn);

  return (
    <section id="servicios" className={styles.servicios} ref={ref}>
      <div className={styles.inner}>
        {/* encabezado */}
        <header className={`${styles.head} ${styles.reveal}`}>
          <p className={styles.kicker}>
            <span className={styles.kickerLine} aria-hidden="true" />
            {kicker}
          </p>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.lead}>{lead}</p>
        </header>

        {/* ── Nivel 1 — pilares ── */}
        <div className={styles.pillars}>
          {pillars.map((p, i) => (
            <article
              key={p.title}
              className={`${styles.card} ${styles.reveal} ${p.featured ? styles.cardFeatured : ''}`}
              style={staggerStyle(i)}
            >
              {p.featured && <span className={styles.badge}>Nuestro diferencial</span>}
              <span className={styles.ico}>
                <ServiceIcon name={p.icon} />
              </span>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardText}>{p.text}</p>
            </article>
          ))}
        </div>

        {/* ── Nivel 2 — instrumentos ── */}
        <div className={`${styles.sub} ${styles.reveal}`}>
          <h3 className={styles.subTitle}>{instrumentsTitle}</h3>
        </div>
        <div className={styles.instruments}>
          {instrumentGroups.map((g, i) => (
            <div key={g.category} className={`${styles.inst} ${styles.reveal}`} style={staggerStyle(i)}>
              <div className={styles.instCat}>{g.category}</div>
              <ul className={styles.instList}>
                {g.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Comisiones ── */}
        <div className={`${styles.feesCta} ${styles.reveal}`}>
          <h3 className={styles.subTitle}>{feesTitle}</h3>
          <p className={styles.feesLead}>{feesLead}</p>
          <Link to="/comisiones" className={styles.feesLink}>
            {feesCtaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
