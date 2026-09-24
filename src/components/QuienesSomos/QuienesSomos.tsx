import type { CSSProperties, SVGProps } from 'react';
import type { QuienesValue, QuienesValueIcon } from '../../data/placeholders';
import { useReveal } from '../../hooks/useReveal';
import oficinaFoto from '../../assets/oficina-quienes.jpeg';
import styles from './QuienesSomos.module.css';

export interface QuienesSomosProps {
  kicker: string;
  title: string;
  paragraphs: string[];
  photoAlt: string;
  values: QuienesValue[];
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

function ValueIcon({ name }: { name: QuienesValueIcon }) {
  if (name === 'target') {
    return (
      <svg {...iconProps} aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.2" />
      </svg>
    );
  }
  if (name === 'clock') {
    return (
      <svg {...iconProps} aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 16 14" />
      </svg>
    );
  }
  if (name === 'compass') {
    return (
      <svg {...iconProps} aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <polygon points="16 8 13 13 8 16 11 11 16 8" />
      </svg>
    );
  }
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

/** CSS custom property `--i` para escalonar el delay de la animación de entrada. */
function staggerStyle(index: number): CSSProperties {
  return { '--i': index } as CSSProperties;
}

export default function QuienesSomos({ kicker, title, paragraphs, photoAlt, values }: QuienesSomosProps) {
  const ref = useReveal<HTMLElement>(styles.reveal, styles.isIn);

  return (
    <section id="quienes" className={styles.quienesSomos} ref={ref}>
      <div className={styles.inner}>
        {/* ── Bloque 1 — Relato ── */}
        <div className={styles.relato}>
          <div className={`${styles.relatoTxt} ${styles.reveal}`}>
            <p className={styles.kicker}>
              <span className={styles.kickerLine} aria-hidden="true" />
              {kicker}
            </p>
            <h2 className={styles.title}>{title}</h2>
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className={styles.p}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* foto real de oficina */}
          <div className={`${styles.relatoFoto} ${styles.reveal}`}>
            <img src={oficinaFoto} alt={photoAlt} className={styles.foto} />
          </div>
        </div>

        {/* ── Bloque 2 — Valores ── */}
        <div className={styles.values}>
          {values.map((value, i) => (
            <article key={value.title} className={`${styles.value} ${styles.reveal}`} style={staggerStyle(i)}>
              <span className={styles.valueIco}>
                <ValueIcon name={value.icon} />
              </span>
              <h3 className={styles.valueTitle}>{value.title}</h3>
              <span className={styles.valueLine} aria-hidden="true" />
              <p className={styles.valueText}>{value.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
