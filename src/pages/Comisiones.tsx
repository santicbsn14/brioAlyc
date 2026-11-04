import { useState, type ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';
import { reserva } from '../lib/reserva';
import styles from './Comisiones.module.css';
import { limpio } from '../sanity/limpiar';

/** Una tabla de comisiones: columnas variables (no todas las tablas tienen las mismas). Los valores
 * van tal cual (con %, "+ IVA", "$", "USD" y los asteriscos de prorrateo). */
export interface FeeTable {
  /** `_key` de la tabla en Sanity. */
  id: string;
  titulo: string;
  columnas: string[];
  /** Cada fila tiene tantas celdas como `columnas`. */
  filas: string[][];
  /** Leyenda de asteriscos / aclaraciones al pie de la tabla (opcional). */
  notas?: string[];
}

export interface ComisionesTab {
  /** `_id` de la pestaña en Sanity (también es el estado de la pestaña activa). */
  id: string;
  label: string;
  tablas: FeeTable[];
}

/** Los textos y las pestañas (vienen de Sanity, ver ComisionesSanity). La aclaración vacía no se
 * pinta. Sin pestañas se ve solo el encabezado (y `note`). */
export interface ComisionesTextos {
  title: string;
  /** "Vigencia: Enero 2026". */
  subtitle: string;
  aclaracion?: string;
  tabs: ComisionesTab[];
  /** Aviso debajo del encabezado (ej. el recuadro "Faltan las pestañas"). */
  note?: ReactNode;
}

/** `cargando`: los textos todavía no llegaron de Sanity. Se ve el fondo de la página con el alto del
 * encabezado, la barra de pestañas y una tabla (texto de relleno invisible, ver RESERVA). */
export type ComisionesProps = { cargando: true } | ({ cargando?: false } & ComisionesTextos);

/** Lo que se pinta (invisible) mientras carga: los textos de hoy, con la primera tabla de la primera
 * pestaña (Plaza Buenos Aires, 4 columnas, 13 filas y 2 aclaraciones). Los largos están ajustados
 * (no son los exactos) para que el alto dé igual al real a 390, 768, 1024 y 1440 px. */
const RESERVA: ComisionesTextos = {
  title: reserva(10),
  subtitle: reserva(20),
  aclaracion: reserva(118),
  tabs: [12, 7, 10, 8, 17].map((largo, i) => ({
    id: `reserva-${i}`,
    label: reserva(largo),
    tablas:
      i > 0
        ? []
        : [
            {
              id: 'reserva',
              titulo: reserva(18),
              columnas: [10, 13, 16, 7].map(reserva),
              filas: [
                [17, 11, 11, 4],
                [17, 5, 5, 4],
                [36, 6, 6, 2],
                [31, 12, 14, 4],
                [33, 12, 14, 4],
                [33, 12, 14, 2],
                [35, 12, 14, 2],
                [18, 11, 11, 4],
                [18, 5, 5, 4],
                [35, 6, 7, 2],
                [27, 11, 7, 2],
                [17, 6, 7, 2],
                [27, 11, 8, 4],
              ].map((fila) => fila.map(reserva)),
              notas: [27, 27].map(reserva),
            },
          ],
  })),
};

function FeeTableCard({ table }: { table: FeeTable }) {
  // Sin animación de scroll-reveal acá: las tablas cambian al clickear una pestaña
  // (contenido ya visible en pantalla), no al entrar en viewport — useReveal solo
  // observa una vez al montar, así que una tabla nueva de otra pestaña nunca se
  // observaría y quedaría con opacity:0 para siempre.
  // Las `key` de columnas, filas y notas son el índice: los textos se pueden repetir.
  return (
    <div className={styles.tableWrap}>
      <h3 className={styles.tableTitle}>{table.titulo}</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            {table.columnas.map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.filas.map((fila, i) => (
            <tr key={i}>
              {fila.map((cell, j) => (
                <td
                  key={j}
                  data-label={limpio(table.columnas[j])}
                  className={j === 0 ? styles.tdMain : styles.tdFee}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {table.notas && table.notas.length > 0 && (
        <ul className={styles.notes}>
          {table.notas.map((nota, i) => (
            <li key={i}>{nota}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Página /comisiones (brief 6.4): las tablas completas del PDF, organizadas en pestañas por
 * plaza para no hacer un muro infinito. Recibe los textos y las pestañas por props
 * (ComisionesSanity). */
export default function Comisiones(props: ComisionesProps) {
  const { cargando } = props;
  const { title, subtitle, aclaracion, tabs, note } = props.cargando ? RESERVA : props;
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const ref = useReveal<HTMLElement>(styles.reveal, styles.isIn);

  const active = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <section
      className={`${styles.comisiones} ${cargando ? styles.cargando : ''}`}
      ref={ref}
      aria-busy={cargando || undefined}
    >
      <div className={styles.inner} aria-hidden={cargando || undefined}>
        <header className={`${styles.head} ${styles.reveal}`}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          {aclaracion && <p className={styles.aclaracion}>{aclaracion}</p>}
        </header>

        {note}

        {active && (
          <>
            <div className={`${styles.tabs} ${styles.reveal}`} role="tablist" aria-label="Grupos de comisiones">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={tab.id === active.id}
                  className={`${styles.tab} ${tab.id === active.id ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  tabIndex={cargando ? -1 : undefined}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={styles.tablesGroup} role="tabpanel">
              {active.tablas.map((table) => (
                <FeeTableCard key={table.id} table={table} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
