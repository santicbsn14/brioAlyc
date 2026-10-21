import type { CSSProperties, ReactNode, SVGProps } from 'react';
import { Link } from 'react-router-dom';
import type { InstrumentGroup, ServiceIconName, ServicePillar } from '../../data/placeholders';
import { useReveal } from '../../hooks/useReveal';
import styles from './Servicios.module.css';

/** Los textos de la sección (vienen de Sanity). Los opcionales vacíos no se pintan. */
export interface ServiciosProps {
  kicker?: string;
  title: string;
  lead?: string;
  pillars: ServicePillar[];
  /** Etiqueta del pilar destacado ("Nuestro diferencial"). */
  featuredBadge: string;
  instrumentsTitle: string;
  /** Sin grupos no se pinta el bloque de instrumentos. */
  instrumentGroups: InstrumentGroup[];
  /** Aviso debajo de los instrumentos (ej. el recuadro "Falta cargar" cuando falta alguna categoría). */
  instrumentsNote?: ReactNode;
  feesTitle: string;
  feesLead?: string;
  /** Sin la flecha: la agrega el componente. */
  feesCtaLabel: string;
}

/** Flecha decorativa al final de un link: en código, fuera del texto editable. Va pegada al texto
 * con un espacio común, como cuando era parte del texto. */
function ConFlecha({ children }: { children: string }) {
  return (
    <span>
      {children}{' '}
      <span aria-hidden="true">→</span>
    </span>
  );
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
  featuredBadge,
  instrumentsTitle,
  instrumentGroups,
  instrumentsNote,
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
          {kicker && (
            <p className={styles.kicker}>
              <span className={styles.kickerLine} aria-hidden="true" />
              {kicker}
            </p>
          )}
          <h2 className={styles.title}>{title}</h2>
          {lead && <p className={styles.lead}>{lead}</p>}
        </header>

        {/* ── Nivel 1 — pilares ── */}
        <div className={styles.pillars}>
          {/* Los pilares son 3 fijos que no se reordenan: alcanza con el índice como key. */}
          {pillars.map((p, i) => (
            <article
              key={i}
              className={`${styles.card} ${styles.reveal} ${p.featured ? styles.cardFeatured : ''}`}
              style={staggerStyle(i)}
            >
              {p.featured && featuredBadge && <span className={styles.badge}>{featuredBadge}</span>}
              <span className={styles.ico}>
                <ServiceIcon name={p.icon} />
              </span>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardText}>{p.text}</p>
            </article>
          ))}
        </div>

        {/* ── Nivel 2 — instrumentos ── */}
        {instrumentGroups.length > 0 && (
          <>
            <div className={`${styles.sub} ${styles.reveal}`}>
              <h3 className={styles.subTitle}>{instrumentsTitle}</h3>
            </div>
            <div className={styles.instruments}>
              {instrumentGroups.map((g, i) => (
                <div key={g.key} className={`${styles.inst} ${styles.reveal}`} style={staggerStyle(i)}>
                  <div className={styles.instCat}>{g.category}</div>
                  <ul className={styles.instList}>
                    {g.items.map((item) => (
                      <li key={item.key}>
                        {item.href ? (
                          <Link to={item.href} className={styles.instLink}>
                            <ConFlecha>{item.label}</ConFlecha>
                          </Link>
                        ) : (
                          item.label
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
        {instrumentsNote}

        {/* ── Comisiones ── */}
        <div className={`${styles.feesCta} ${styles.reveal}`}>
          <h3 className={styles.subTitle}>{feesTitle}</h3>
          {feesLead && <p className={styles.feesLead}>{feesLead}</p>}
          <Link to="/comisiones" className={styles.feesLink}>
            <ConFlecha>{feesCtaLabel}</ConFlecha>
          </Link>
        </div>
      </div>
    </section>
  );
}
