import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { CtaAction, Credential } from '../../data/placeholders';
import { useAccionesLideres } from '../../hooks/useAccionesLideres';
import type { AccionLider, CotizacionAccion } from '../../lib/mercado/accionesLideres';
import { reserva } from '../../lib/reserva';
import styles from './Hero.module.css';

/** Los textos del Hero (vienen de Sanity). Los opcionales vacíos no se pintan. */
export interface HeroTextos {
  kicker?: string;
  title: string;
  lead?: string;
  ctas: CtaAction[];
  /** Sin credenciales no se pinta la fila de sellos. */
  credentials: Credential[];
  panelTitle: string;
  panelTag: string;
  panelFootnote: string;
  /** Texto visible del pie que indica que el panel es clickeable. Vacío → el panel sigue siendo link, sin el texto. */
  panelLinkLabel?: string;
}

/** Qué acciones muestra el panel (vienen de Sanity). */
export interface HeroAcciones {
  /** Acciones del panel (tickers + nombres), en su orden; los precios vienen de data912. Sin
   * ninguna, el panel no se pinta y en su lugar va `avisoPanel`. */
  leaders: AccionLider[];
  /** Lo que va en lugar del panel si no hay acciones (el aviso de dev; en producción, nada). */
  avisoPanel?: ReactNode;
  /** Atributo de edición de la lista de acciones (solo en la vista previa del Studio, ver
   * sanity/edicion.ts): los tickers no llevan marcas invisibles, así que el overlay va en la lista. */
  panelEdit?: string;
}

/** `cargando`: los textos todavía no llegaron de Sanity. Se ve la cáscara (el fondo) con el mismo
 * alto, sin textos, para que la página no salte (ver RESERVA). La entrada animada arranca cuando
 * llegan los textos. */
export type HeroProps = {
  /** Ruta interna a la que lleva todo el panel (Panel de Cotizaciones). */
  panelHref: string;
  /** Nombre accesible del link (así el lector de pantalla no lee las 8 filas como texto del link). */
  panelLinkAriaLabel: string;
} & ({ cargando: true } | ({ cargando?: false } & HeroTextos & HeroAcciones));

/** Lo que se pinta (invisible) mientras carga. Los largos se midieron para que corten en los mismos
 * renglones que los textos actuales del Hero, de 360 a 1920 px (el título y los del panel quedaron
 * un poco distintos del largo real porque el relleno no tiene las mismas letras). Si Agus cambia
 * mucho los textos, el alto mientras carga puede diferir un poco del final. */
const RESERVA: HeroTextos = {
  kicker: reserva(35),
  title: reserva(52),
  lead: reserva(128),
  ctas: [
    { label: reserva(14), href: '#', variant: 'primary' },
    { label: reserva(12), href: '#', variant: 'ghost' },
  ],
  credentials: ['BYMA', 'MAV', 'A3', 'MAE', 'ACDI'].map((e) => ({ key: e, label: 'N'.repeat(e.length), number: '000' })),
  panelTitle: reserva(21),
  panelTag: reserva(10),
  panelFootnote: reserva(39),
  panelLinkLabel: reserva(18),
};

/** Filas invisibles del panel mientras carga: tantas como el máximo del Studio (8). Con menos
 * acciones elegidas, el panel queda más bajo cuando llegan (en celular eso corre lo de abajo). */
const FILAS_RESERVA: CotizacionAccion[] = Array.from({ length: 8 }, (_, i) => ({
  symbol: `R${i}`,
  name: reserva(18),
  price: null,
  changePct: null,
  bid: null,
  ask: null,
  volume: null,
}));

const SIN_ACCIONES: AccionLider[] = [];

const formatPrice = (n: number) =>
  n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatChange = (n: number) =>
  `${n > 0 ? '+' : ''}${n.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

export default function Hero(props: HeroProps) {
  const { panelHref, panelLinkAriaLabel, cargando } = props;
  const leaders = props.cargando ? SIN_ACCIONES : props.leaders;
  const avisoPanel = props.cargando ? undefined : props.avisoPanel;
  const panelEdit = props.cargando ? undefined : props.panelEdit;
  const {
    kicker,
    title,
    lead,
    ctas,
    credentials,
    panelTitle,
    panelTag,
    panelFootnote,
    panelLinkLabel,
  } = props.cargando ? RESERVA : props;
  const [mounted, setMounted] = useState(false);
  // Precios reales de BYMA (data912 vía /api/mercado/arg-stocks); mientras cargan o si falla,
  // las filas van con "—". El "latido" (resaltado de filas) lo maneja el hook. El pedido no
  // depende de Sanity: arranca aunque los textos y las acciones todavía estén cargando.
  const { stocks, fuente, flash } = useAccionesLideres(leaders);
  const filas = cargando ? FILAS_RESERVA : stocks;
  const conPanel = cargando || leaders.length > 0;

  // Entrada orquestada (fade + subida), una sola vez, cuando ya están los textos. Mientras
  // carga, todo queda en su estado inicial (opacity 0) y además oculto (ver .cargando).
  useEffect(() => {
    if (cargando) return;
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, [cargando]);

  return (
    <section
      className={`${styles.hero} ${mounted ? styles.isIn : ''} ${cargando ? styles.cargando : ''}`}
      aria-busy={cargando || undefined}
    >
      <div className={styles.grid} aria-hidden={cargando || undefined}>
        {/* ── Columna izquierda ── */}
        <div className={styles.copy}>
          {kicker && (
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              {kicker}
            </p>
          )}

          <h1 className={styles.title}>{title}</h1>

          {lead && <p className={styles.lead}>{lead}</p>}

          <div className={styles.ctas}>
            {ctas.map((cta) => {
              const className = `${styles.btn} ${cta.variant === 'primary' ? styles.btnPrimary : styles.btnGhost}`;
              // Externo (http…) → pestaña nueva; interno → Link, navega sin recargar.
              return /^https?:\/\//.test(cta.href) ? (
                <a key={cta.label} href={cta.href} className={className} target="_blank" rel="noopener noreferrer">
                  {cta.label}
                </a>
              ) : (
                <Link key={cta.label} to={cta.href} className={className}>
                  {cta.label}
                </Link>
              );
            })}
          </div>

          {credentials.length > 0 && (
            <ul className={styles.creds}>
              {credentials.map((c) => (
                <li key={c.key} className={styles.cred}>
                  <span className={styles.credLabel}>{c.label}</span>
                  <span className={styles.credNum}>{c.number}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Columna derecha ── (sin acciones: solo el aviso, que en producción no pinta nada) */}
        {!conPanel && <div className={styles.visual}>{avisoPanel}</div>}
        {conPanel && (
        <div className={styles.visual}>
          <div className={styles.glow} aria-hidden="true" />
          <div className={styles.gridLines} aria-hidden="true" />

          {/* Todo el panel es un link. El bob sigue en este mismo elemento: el hover
              solo toca borde/fondo/sombra, nunca transform (ver Hero.module.css). */}
          <Link to={panelHref} className={styles.panel} aria-label={panelLinkAriaLabel} data-fuente={fuente}>
            <div className={styles.panelHead}>
              <div className={styles.panelTitle}>
                <span className={styles.live} aria-hidden="true" />
                {panelTitle}
              </div>
              <span className={styles.tag}>{panelTag}</span>
            </div>

            <ul className={styles.rows} data-sanity={panelEdit}>
              {filas.map((s) => {
                const up = (s.changePct ?? 0) >= 0;
                return (
                  <li key={s.symbol} className={`${styles.row} ${flash.has(s.symbol) ? styles.isFlash : ''}`}>
                    {s.name ? (
                      <div className={styles.sym}>
                        <span className={styles.symCode}>{s.symbol}</span>
                        <span className={styles.symName}>{s.name}</span>
                      </div>
                    ) : (
                      // Sin nombre: el ticker solo, centrado en el alto de dos renglones (ver .symSolo).
                      <div className={`${styles.sym} ${styles.symSolo}`}>
                        <span className={styles.symCode}>{s.symbol}</span>
                        <span className={`${styles.symCode} ${styles.symHueco}`} aria-hidden="true">
                          {s.symbol}
                        </span>
                        <span className={`${styles.symName} ${styles.symHueco}`} aria-hidden="true">
                          {' '}
                        </span>
                      </div>
                    )}
                    <div className={styles.px}>{s.price !== null ? `$ ${formatPrice(s.price)}` : '—'}</div>
                    {s.changePct !== null ? (
                      <div className={`${styles.chg} ${up ? styles.up : styles.down}`}>
                        <span className={styles.arrow} aria-hidden="true">
                          {up ? '▲' : '▼'}
                        </span>
                        {formatChange(s.changePct)}
                      </div>
                    ) : (
                      <div className={`${styles.chg} ${styles.na}`}>—</div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className={styles.panelFoot}>
              <span>{panelFootnote}</span>
              {panelLinkLabel && (
                <span className={styles.panelCta}>
                  {panelLinkLabel}
                  <span className={styles.panelCtaArrow} aria-hidden="true">
                    →
                  </span>
                </span>
              )}
            </div>
          </Link>
        </div>
        )}
      </div>
    </section>
  );
}
