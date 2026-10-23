import { useMemo, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { reserva } from '../lib/reserva';
import styles from './Informes.module.css';

/** Una categoría del filtro: `id` fijo en código (semanal / mensual / especial), `label` de Sanity. */
export interface CategoriaInforme {
  id: string;
  label: string;
}

/** Un informe: `fecha` en formato "AAAA-MM-DD"; `resumen` opcional; `href`, el link de descarga. */
export interface Informe {
  id: string;
  titulo: string;
  fecha: string;
  /** El `id` de una categoría de `categorias`. */
  categoria: string;
  resumen?: string;
  href: string;
}

/** Los textos y el listado (vienen de Sanity, ver InformesSanity). Antetítulo, bajada y resumen
 * vacíos no se pintan. El listado ya viene ordenado (el más nuevo arriba). */
export interface InformesTextos {
  kicker?: string;
  title: string;
  lead?: string;
  /** "Todos". */
  filterAllLabel: string;
  categorias: CategoriaInforme[];
  informes: Informe[];
  /** Cuando la categoría elegida no tiene informes. */
  emptyLabel?: string;
  /** "Descargar PDF". */
  downloadLabel: string;
}

/** `cargando`: los textos todavía no llegaron de Sanity. Se ve el fondo de la página con el alto del
 * encabezado y de unas filas del listado (texto de relleno invisible, ver RESERVA). */
export type InformesProps = { cargando: true } | ({ cargando?: false } & InformesTextos);

/** Lo que se pinta (invisible) mientras carga: los largos de los textos actuales, con 3 filas. */
const RESERVA: InformesTextos = {
  kicker: reserva(12),
  title: reserva(8),
  lead: reserva(106),
  filterAllLabel: reserva(5),
  categorias: [18, 18, 19].map((largo, i) => ({ id: `reserva-${i}`, label: reserva(largo) })),
  informes: [0, 1, 2].map((i) => ({
    id: String(i),
    titulo: reserva(45),
    fecha: '2026-07-13',
    categoria: 'reserva-0',
    resumen: reserva(117),
    href: '',
  })),
  downloadLabel: reserva(13),
};

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/** "AAAA-MM-DD" → "13 de julio de 2026". Se parte a mano: `new Date("AAAA-MM-DD")` la toma como
 * medianoche UTC, que en Argentina es el día anterior. Una fecha con otro formato no se muestra. */
function formatFecha(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  const mes = m && MESES[Number(m[2]) - 1];
  return m && mes ? `${Number(m[3])} de ${mes} de ${m[1]}` : '';
}

function IconDoc() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7 3.5Z" />
      <path d="M13.5 3.5V8h4" />
      <path d="M9 13h6M9 16.5h6" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4v11m0 0 4-4m-4 4-4-4" />
      <path d="M5 18.5h14" />
    </svg>
  );
}

/** Página /informes (menú Herramientas, brief 3.4): listado de PDFs con filtro por
 * categoría y descarga directa. Portada tal cual del prototipo aprobado
 * `__ref/BrioInformes.jsx` (diseño ya validado, no se rediseñó nada). Recibe los textos y el
 * listado por props (InformesSanity). Los botones de filtro son siempre los de todas las
 * categorías, tengan informes o no: una categoría sin informes muestra `emptyLabel`. */
export default function Informes(props: InformesProps) {
  const { cargando } = props;
  const { kicker, title, lead, filterAllLabel, categorias, informes, emptyLabel, downloadLabel } =
    props.cargando ? RESERVA : props;
  const [activa, setActiva] = useState('todos');
  const ref = useReveal<HTMLElement>(styles.reveal, styles.isIn);

  const filtrados = useMemo(
    () => (activa === 'todos' ? informes : informes.filter((i) => i.categoria === activa)),
    [activa, informes],
  );

  const categoriaLabel = (id: string) => categorias.find((c) => c.id === id)?.label;

  return (
    <section
      className={`${styles.informes} ${cargando ? styles.cargando : ''}`}
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

        <div className={`${styles.filters} ${styles.reveal}`} role="tablist" aria-label="Filtrar por categoría">
          {filterAllLabel && (
            <button
              type="button"
              role="tab"
              aria-selected={activa === 'todos'}
              className={`${styles.chip} ${activa === 'todos' ? styles.isOn : ''}`}
              onClick={() => setActiva('todos')}
            >
              {filterAllLabel}
            </button>
          )}
          {categorias.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={activa === c.id}
              className={`${styles.chip} ${activa === c.id ? styles.isOn : ''}`}
              onClick={() => setActiva(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <ul className={`${styles.list} ${styles.reveal}`}>
          {filtrados.length === 0 && emptyLabel && <p className={styles.empty}>{emptyLabel}</p>}

          {filtrados.map((inf) => {
            const fecha = formatFecha(inf.fecha);
            const badge = categoriaLabel(inf.categoria);
            return (
              <li key={inf.id} className={styles.item}>
                <span className={styles.ico} aria-hidden="true">
                  <IconDoc />
                </span>

                <div className={styles.body}>
                  <div className={styles.meta}>
                    {fecha && <time dateTime={inf.fecha}>{fecha}</time>}
                    {badge && <span className={styles.badge}>{badge}</span>}
                  </div>
                  <h2 className={styles.itemTitle}>{inf.titulo}</h2>
                  {inf.resumen && <p className={styles.resumen}>{inf.resumen}</p>}
                </div>

                <a className={styles.dl} href={cargando ? undefined : inf.href} download>
                  <IconDownload />
                  <span>{downloadLabel}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
