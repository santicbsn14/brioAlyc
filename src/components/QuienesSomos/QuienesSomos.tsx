import type { CSSProperties, ReactNode, SVGProps } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { reserva } from '../../lib/reserva';
import styles from './QuienesSomos.module.css';

export type QuienesValueIcon = 'target' | 'clock' | 'compass' | 'shield';

export interface QuienesValue {
  icon: QuienesValueIcon;
  title: string;
  text: string;
}

/** Los textos y la foto de la sección (vienen de Sanity). Los opcionales vacíos no se pintan. */
export interface QuienesSomosTextos {
  kicker?: string;
  title: string;
  paragraphs: string[];
  /** Sin foto, el relato ocupa el ancho entero. */
  photoSrc?: string;
  photoSrcSet?: string;
  /** Qué ancho ocupa la foto en pantalla, para que el navegador elija del `photoSrcSet`. */
  photoSizes?: string;
  photoAlt: string;
  values: QuienesValue[];
  /** Aviso debajo del relato (ej. el recuadro "Falta…" cuando falta la foto). */
  note?: ReactNode;
}

/** `cargando`: los textos todavía no llegaron de Sanity. Se ve el fondo de la sección con el alto
 * que va a tener (texto de relleno invisible, ver RESERVA), así lo de abajo no salta. */
export type QuienesSomosProps = { cargando: true } | ({ cargando?: false } & QuienesSomosTextos);

/** Lo que se pinta (invisible) mientras carga: los largos de los textos actuales. */
const RESERVA: QuienesSomosTextos = {
  kicker: reserva(13),
  title: reserva(44),
  paragraphs: [reserva(212), reserva(212)],
  photoAlt: '',
  values: (
    [
      ['target', 13, 61],
      ['clock', 11, 52],
      ['compass', 13, 53],
      ['shield', 10, 48],
    ] as const
  ).map(([icon, title, text]) => ({ icon, title: reserva(title), text: reserva(text) })),
};

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

/** Recibe los textos y la foto por props (QuienesSomosSanity los arma desde Sanity). */
export default function QuienesSomos(props: QuienesSomosProps) {
  const { cargando } = props;
  const { kicker, title, paragraphs, photoSrc, photoSrcSet, photoSizes, photoAlt, values, note } = props.cargando
    ? RESERVA
    : props;
  const ref = useReveal<HTMLElement>(styles.reveal, styles.isIn);
  // Mientras carga, la foto es un recuadro vacío con su misma proporción.
  const conFoto = cargando || !!photoSrc;

  return (
    <section
      id="quienes"
      className={`${styles.quienesSomos} ${cargando ? styles.cargando : ''}`}
      ref={ref}
      aria-busy={cargando || undefined}
    >
      <div className={styles.inner} aria-hidden={cargando || undefined}>
        {/* ── Bloque 1 — Relato ── */}
        <div className={`${styles.relato} ${conFoto ? '' : styles.relatoSinFoto}`}>
          <div className={`${styles.relatoTxt} ${styles.reveal}`}>
            {kicker && (
              <p className={styles.kicker}>
                <span className={styles.kickerLine} aria-hidden="true" />
                {kicker}
              </p>
            )}
            <h2 className={styles.title}>{title}</h2>
            {/* Los párrafos no se reordenan: alcanza con el índice como key. */}
            {paragraphs.map((paragraph, i) => (
              <p key={i} className={styles.p}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* foto de la oficina */}
          {conFoto && (
            <div className={`${styles.relatoFoto} ${styles.reveal}`}>
              {photoSrc ? (
                <img src={photoSrc} srcSet={photoSrcSet} sizes={photoSizes} alt={photoAlt} className={styles.foto} />
              ) : (
                <div className={styles.foto} />
              )}
            </div>
          )}
        </div>
        {note}

        {/* ── Bloque 2 — Valores ── */}
        <div className={styles.values}>
          {/* 4 valores fijos que no se reordenan (el ícono va por posición): el índice alcanza como key. */}
          {values.map((value, i) => (
            <article key={i} className={`${styles.value} ${styles.reveal}`} style={staggerStyle(i)}>
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
