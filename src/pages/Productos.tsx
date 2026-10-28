import { useState } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import { useReveal } from '../hooks/useReveal';
import { reserva } from '../lib/reserva';
import styles from './Productos.module.css';
import { limpio } from '../sanity/limpiar';

/** Un instrumento: `t` = nombre, `d` = línea explicativa. `key`: clave de React (en Sanity, el `_key`). */
export interface Instrumento {
  key: string;
  t: string;
  d: string;
}

/** Una categoría del carrusel. El `id` elige la ilustración (ver Ilustracion). */
export interface Categoria {
  id: string;
  nombre: string;
  claim: string;
  items: Instrumento[];
}

/** Los textos de la página (vienen de Sanity, ver ProductosSanity). Antetítulo y bajada vacíos no se
 * pintan; sin categorías se ve solo el encabezado. */
export interface ProductosTextos {
  kicker?: string;
  title: string;
  lead?: string;
  categorias: Categoria[];
}

/** `cargando`: los textos todavía no llegaron de Sanity. Se ve el fondo de la página con el alto del
 * encabezado y del carrusel (texto de relleno invisible, ver RESERVA), así el Footer no salta. */
export type ProductosProps = { cargando: true } | ({ cargando?: false } & ProductosTextos);

/** Lo que se pinta (invisible) mientras carga: los largos de los textos actuales, con la primera
 * categoría (la que se ve al entrar) de 4 instrumentos, como Renta fija. */
const RESERVA: ProductosTextos = {
  kicker: reserva(9),
  title: reserva(21),
  lead: reserva(132),
  categorias: [10, 14, 14, 18].map((largo, i) => ({
    id: `reserva-${i}`,
    nombre: reserva(largo),
    claim: reserva(42),
    items: [
      [28, 58],
      [24, 55],
      [6, 39],
      [21, 52],
    ].map(([t, d], j) => ({ key: String(j), t: reserva(t), d: reserva(d) })),
  })),
};

/** Duración de cada slide = lo que tarda en llenarse la banda de progreso. */
const AUTOPLAY_MS = 5200;

// Colores como var() de tokens.css (en atributos SVG, no hex duplicados).
const TEAL = 'var(--teal)';
const ORANGE = 'var(--orange)';
const NAVY = 'var(--navy)';

/** Ilustraciones abstractas (una por categoría, según `id`), SVG en código.
 * Después se pueden reemplazar por arte real. Un `id` desconocido cae en la genérica. */
function Ilustracion({ id }: { id: string }) {
  const common = {
    viewBox: '0 0 240 240',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true,
    className: styles.illusSvg,
  } as const;

  if (id === 'renta-fija')
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="prGradRentaFija" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={TEAL} stopOpacity=".9" />
            <stop offset="1" stopColor={TEAL} stopOpacity=".2" />
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r="96" fill="none" stroke={TEAL} strokeOpacity=".18" strokeWidth="1.5" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={54 + i * 28}
            y={150 - i * 22}
            width="16"
            height={30 + i * 22}
            rx="4"
            fill="url(#prGradRentaFija)"
          />
        ))}
        <line x1="46" y1="176" x2="196" y2="176" stroke={TEAL} strokeOpacity=".35" strokeWidth="1.5" />
      </svg>
    );

  if (id === 'renta-variable')
    return (
      <svg {...common}>
        <circle cx="120" cy="120" r="96" fill="none" stroke={ORANGE} strokeOpacity=".16" strokeWidth="1.5" />
        <polyline
          points="48,168 88,120 120,140 156,80 196,64"
          fill="none"
          stroke={TEAL}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="156,80 196,64 196,96"
          fill="none"
          stroke={ORANGE}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {[
          [88, 120],
          [120, 140],
          [156, 80],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" fill={NAVY} stroke={TEAL} strokeWidth="2" />
        ))}
      </svg>
    );

  if (id === 'financiamiento')
    return (
      <svg {...common}>
        <circle cx="120" cy="120" r="96" fill="none" stroke={TEAL} strokeOpacity=".16" strokeWidth="1.5" />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${64 + i * 18} ${150 - i * 26})`}>
            <rect width="86" height="52" rx="8" fill="none" stroke={TEAL} strokeOpacity={0.5 + i * 0.15} strokeWidth="2" />
            <line x1="14" y1="20" x2="56" y2="20" stroke={TEAL} strokeOpacity=".5" strokeWidth="2" />
            <circle cx="66" cy="32" r="8" fill={ORANGE} fillOpacity={0.4 + i * 0.25} />
          </g>
        ))}
      </svg>
    );

  return (
    <svg {...common}>
      <circle cx="120" cy="120" r="96" fill="none" stroke={ORANGE} strokeOpacity=".16" strokeWidth="1.5" />
      {[40, 70, 100].map((r, i) => (
        <circle
          key={r}
          cx="120"
          cy="120"
          r={r}
          fill="none"
          stroke={TEAL}
          strokeOpacity={0.5 - i * 0.12}
          strokeWidth="1.5"
          strokeDasharray="6 8"
        />
      ))}
      <path d="M120 120 L120 44" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
      <path d="M120 120 L182 156" stroke={TEAL} strokeWidth="3" strokeLinecap="round" />
      <circle cx="120" cy="120" r="6" fill={TEAL} />
    </svg>
  );
}

/** Página /servicios/productos (brief 6.5): carrusel de instrumentos por categoría.
 * El auto-avance lo maneja la banda de progreso: cuando su animación CSS termina de
 * llenarse (`onAnimationEnd`), salta a la siguiente categoría. Así banda y avance nunca
 * se desincronizan, y pausar la animación al hacer hover pausa también el avance sin
 * perder lo ya recorrido. Con prefers-reduced-motion la animación no corre → no hay
 * auto-avance (ver CSS).
 * Recibe los textos por props (ProductosSanity arma las categorías desde Sanity). */
export default function Productos(props: ProductosProps) {
  const { cargando } = props;
  const { kicker, title, lead, categorias } = props.cargando ? RESERVA : props;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useReveal<HTMLElement>(styles.reveal, styles.isIn);

  const total = categorias.length;
  const go = (n: number) => setIdx((n + total) % total);
  const actual = categorias[idx] as Categoria | undefined;

  // Solo mouse: en touch, mouseenter/leave sintéticos dejarían el carrusel trabado en pausa.
  const pause = (e: PointerEvent) => e.pointerType === 'mouse' && setPaused(true);
  const resume = (e: PointerEvent) => e.pointerType === 'mouse' && setPaused(false);

  return (
    <section
      className={`${styles.productos} ${cargando ? styles.cargando : ''}`}
      ref={ref}
      aria-busy={cargando || undefined}
    >
      <div className={styles.inner} aria-hidden={cargando || undefined}>
        <header className={`${styles.head} ${styles.reveal}`}>
          {kicker && (
            <p className={styles.kicker}>
              <span className={styles.kickerLine} aria-hidden="true" />
              {kicker}
            </p>
          )}
          <h1 className={styles.title}>{title}</h1>
          {lead && <p className={styles.lead}>{lead}</p>}
        </header>

        {actual && (
          <>

            <nav className={`${styles.tabs} ${styles.reveal}`} aria-label="Categorías de productos">
              {categorias.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  className={`${styles.tab} ${i === idx ? styles.tabActive : ''}`}
                  onClick={() => go(i)}
                  aria-current={i === idx}
                >
                  {c.nombre}
                </button>
              ))}
            </nav>

            <div
              className={`${styles.stage} ${styles.reveal}`}
              onPointerEnter={pause}
              onPointerLeave={resume}
            >
              <div className={styles.band} aria-hidden="true">
                <span
                  key={idx}
                  className={`${styles.bandFill} ${paused ? styles.bandPaused : ''}`}
                  style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                  onAnimationEnd={cargando ? undefined : () => go(idx + 1)}
                />
              </div>

              <div className={styles.slide} key={actual.id}>
                <div className={styles.slideIllus}>
                  <Ilustracion id={actual.id} />
                </div>

                <div className={styles.slideBody}>
                  <p className={styles.slideClaim}>{actual.claim}</p>
                  <ul className={styles.list}>
                    {actual.items.map((it, i) => (
                      <li key={it.key} className={styles.item} style={{ '--i': i } as CSSProperties}>
                        <span className={styles.itemDot} aria-hidden="true" />
                        <div>
                          <span className={styles.itemT}>{it.t}</span>
                          <span className={styles.itemD}>{it.d}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                className={`${styles.arrow} ${styles.arrowPrev}`}
                onClick={() => go(idx - 1)}
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                type="button"
                className={`${styles.arrow} ${styles.arrowNext}`}
                onClick={() => go(idx + 1)}
                aria-label="Siguiente"
              >
                ›
              </button>
            </div>

            <div className={`${styles.dots} ${styles.reveal}`}>
              {categorias.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  className={`${styles.dot} ${i === idx ? styles.dotActive : ''}`}
                  onClick={() => go(i)}
                  aria-label={limpio(c.nombre)}
                  aria-current={i === idx}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
