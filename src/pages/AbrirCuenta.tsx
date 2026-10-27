import { useId, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { reserva } from '../lib/reserva';
import styles from './AbrirCuenta.module.css';

/** Una pregunta frecuente. `respuesta` ya viene partida en párrafos. */
export interface PreguntaFrecuente {
  key: string;
  pregunta: string;
  respuesta: string[];
}

/** Los textos de la página (vienen de Sanity, ver AbrirCuentaSanity). Antetítulo, bajada y texto del
 * cierre vacíos no se pintan. */
export interface AbrirCuentaTextos {
  kicker?: string;
  title: string;
  lead?: string;
  empezarLabel: string;
  /** Externo: abre en otra pestaña. */
  empezarHref: string;
  preguntasTitle: string;
  preguntas: PreguntaFrecuente[];
  cierreTitle: string;
  cierreTxt?: string;
  contactoLabel: string;
  contactoHref: string;
}

/** `cargando`: los textos todavía no llegaron de Sanity. Se ve el fondo de la página con el alto que
 * va a tener (texto de relleno invisible, ver RESERVA), así el Footer no salta. */
export type AbrirCuentaProps = { cargando: true } | ({ cargando?: false } & AbrirCuentaTextos);

/** Lo que se pinta (invisible) mientras carga: los largos de los textos actuales, con las preguntas
 * cerradas (las respuestas no ocupan alto). */
const RESERVA: AbrirCuentaTextos = {
  kicker: reserva(14),
  title: reserva(26),
  lead: reserva(62),
  empezarLabel: reserva(7),
  empezarHref: '',
  preguntasTitle: reserva(20),
  preguntas: [17, 37, 28, 46, 53, 93, 59, 28, 26, 86].map((largo, i) => ({
    key: String(i),
    pregunta: reserva(largo),
    respuesta: [],
  })),
  cierreTitle: reserva(22),
  cierreTxt: reserva(41),
  contactoLabel: reserva(11),
  contactoHref: '',
};

/**
 * Una pregunta del acordeón. El botón abre y cierra la respuesta; la transición de alto usa el
 * truco de `grid-template-rows: 0fr → 1fr` (como la bio de Equipo). Cerrada queda `inert` para que
 * no se lea ni se pueda enfocar. El "+" gira a "×" al abrir (CSS).
 */
function Pregunta({ pregunta, respuesta, index }: { pregunta: string; respuesta: string[]; index: number }) {
  const [abierta, setAbierta] = useState(false);
  const id = useId();
  // La clase del <li> no cambia al abrir: useReveal le suma `isIn` a mano y React se lo borraría.
  // El estado abierto lo lee el CSS del aria-expanded del botón y de la clase de la respuesta.
  return (
    <li className={`${styles.item} ${styles.reveal}`} style={{ '--i': index } as CSSProperties}>
      <h3 className={styles.q}>
        <button
          type="button"
          className={styles.qBtn}
          aria-expanded={abierta}
          aria-controls={id}
          onClick={() => setAbierta((v) => !v)}
        >
          <span className={styles.qTxt}>{pregunta}</span>
          <span className={styles.qIcon} aria-hidden="true" />
        </button>
      </h3>
      <div id={id} className={`${styles.a} ${abierta ? styles.aOpen : ''}`} inert={!abierta}>
        <div className={styles.aInner}>
          {respuesta.map((p, i) => (
            <p key={i} className={styles.aTxt}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </li>
  );
}

/** Página /abri-tu-cuenta: encabezado con el botón a la apertura online, preguntas frecuentes en
 * acordeón (varias abiertas a la vez, todas cerradas al entrar) y cierre con el botón a Contacto.
 * Recibe los textos por props (AbrirCuentaSanity). Misma línea visual que Financiamiento PyME. */
export default function AbrirCuenta(props: AbrirCuentaProps) {
  const { cargando } = props;
  const {
    kicker,
    title,
    lead,
    empezarLabel,
    empezarHref,
    preguntasTitle,
    preguntas,
    cierreTitle,
    cierreTxt,
    contactoLabel,
    contactoHref,
  } = props.cargando ? RESERVA : props;
  const ref = useReveal<HTMLElement>(styles.reveal, styles.isIn);

  return (
    <section
      className={`${styles.ac} ${cargando ? styles.cargando : ''}`}
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
          {/* Mientras carga, el botón es texto invisible: no lleva a ningún lado. */}
          {cargando ? (
            <span className={styles.cta}>{empezarLabel}</span>
          ) : (
            <a href={empezarHref} className={styles.cta} target="_blank" rel="noopener">
              {empezarLabel}
              <span className={styles.ctaArrow} aria-hidden="true">
                ↗
              </span>
            </a>
          )}
        </header>

        <h2 className={`${styles.h2} ${styles.reveal}`}>{preguntasTitle}</h2>
        <ul className={styles.faq}>
          {preguntas.map((p, i) => (
            <Pregunta key={p.key} pregunta={p.pregunta} respuesta={p.respuesta} index={i} />
          ))}
        </ul>

        <div className={`${styles.close} ${styles.reveal}`}>
          <h2 className={styles.closeTitle}>{cierreTitle}</h2>
          {cierreTxt && <p className={styles.closeTxt}>{cierreTxt}</p>}
          {cargando ? (
            <span className={styles.cta}>{contactoLabel}</span>
          ) : (
            <Link to={contactoHref} className={styles.cta}>
              {contactoLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
