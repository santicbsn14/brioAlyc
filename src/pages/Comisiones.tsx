import { useState } from 'react';
import { comisionesHeader, comisionesTabs } from '../data/comisiones';
import type { FeeTable } from '../data/comisiones';
import { useReveal } from '../hooks/useReveal';
import styles from './Comisiones.module.css';

function FeeTableCard({ table }: { table: FeeTable }) {
  // Sin animación de scroll-reveal acá: las tablas cambian al clickear una pestaña
  // (contenido ya visible en pantalla), no al entrar en viewport — useReveal solo
  // observa una vez al montar, así que una tabla nueva de otra pestaña nunca se
  // observaría y quedaría con opacity:0 para siempre.
  return (
    <div className={styles.tableWrap}>
      <h3 className={styles.tableTitle}>{table.titulo}</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            {table.columnas.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.filas.map((fila, i) => (
            <tr key={i}>
              {fila.map((cell, j) => (
                <td
                  key={j}
                  data-label={table.columnas[j]}
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
          {table.notas.map((nota) => (
            <li key={nota}>{nota}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Página /comisiones (brief 6.4). Antes era una tabla placeholder dentro de Servicios;
 * ahora tiene ruta propia y las tablas completas del PDF, organizadas en pestañas por
 * plaza para no hacer un muro infinito. */
export default function Comisiones() {
  const [activeTab, setActiveTab] = useState(comisionesTabs[0].id);
  const ref = useReveal<HTMLElement>(styles.reveal, styles.isIn);

  const active = comisionesTabs.find((tab) => tab.id === activeTab) ?? comisionesTabs[0];

  return (
    <section className={styles.comisiones} ref={ref}>
      <div className={styles.inner}>
        <header className={`${styles.head} ${styles.reveal}`}>
          <h1 className={styles.title}>{comisionesHeader.title}</h1>
          <p className={styles.subtitle}>{comisionesHeader.subtitle}</p>
          <p className={styles.aclaracion}>{comisionesHeader.aclaracion}</p>
        </header>

        <div className={`${styles.tabs} ${styles.reveal}`} role="tablist" aria-label="Grupos de comisiones">
          {comisionesTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={tab.id === activeTab}
              className={`${styles.tab} ${tab.id === activeTab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.tablesGroup} role="tabpanel">
          {active.tablas.map((table) => (
            <FeeTableCard key={table.titulo} table={table} />
          ))}
        </div>
      </div>
    </section>
  );
}
