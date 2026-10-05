import { useMemo, useState, type ReactNode } from 'react';
import { ACCIONES_LIDERES } from '../data/accionesLideres';
import { useAccionesLideres } from '../hooks/useAccionesLideres';
import type { FetchStatus } from '../hooks/useRentaFija';
import { useReveal } from '../hooks/useReveal';
import type { CotizacionAccion } from '../lib/mercado/accionesLideres';
import { fmtVol } from '../lib/rentaFija/calc';
import styles from './Acciones.module.css';

// Mismas opciones que Renta Fija (sin auto-refresh / 1 / 2 / 5 min).
const INTERVALOS = [
  { value: 0, label: 'Sin auto-refresh' },
  { value: 60, label: 'Cada 1 min' },
  { value: 120, label: 'Cada 2 min' },
  { value: 300, label: 'Cada 5 min' },
];

// Fallback SIN precios: en esta tabla no se muestran precios de ejemplo (a diferencia
// del Hero) — mientras carga, o si data912 falla, las filas se ven con "—".
const FILAS_VACIAS: CotizacionAccion[] = ACCIONES_LIDERES.map((a) => ({
  symbol: a.ticker,
  name: a.nombre,
  price: null,
  changePct: null,
  bid: null,
  ask: null,
  volume: null,
}));

type SortKey = 'symbol' | 'name' | 'bid' | 'ask' | 'price' | 'changePct' | 'volume';

const COLUMNAS: { key: SortKey; label: string; num?: boolean }[] = [
  { key: 'symbol', label: 'Ticker' },
  { key: 'name', label: 'Nombre' },
  { key: 'bid', label: 'Compra', num: true },
  { key: 'ask', label: 'Venta', num: true },
  { key: 'price', label: 'Último', num: true },
  { key: 'changePct', label: 'Var. %', num: true },
  { key: 'volume', label: 'Volumen', num: true },
];

const fmtPx = (n: number | null | undefined) =>
  n != null ? n.toLocaleString('es-AR', { maximumFractionDigits: 2 }) : '—';

const fmtPct = (n: number) =>
  `${Math.abs(n).toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

function fmtHora(d: Date | null): string {
  if (!d) return 'sin actualizar todavía';
  return `Actualizado ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}hs`;
}

function textoEstado(status: FetchStatus, lastUpdated: Date | null): string {
  if (status === 'loading') return lastUpdated ? fmtHora(lastUpdated) : 'Cargando cotizaciones…';
  if (status === 'error') return lastUpdated ? `${fmtHora(lastUpdated)} · falló el último intento` : 'No pudimos obtener cotizaciones';
  return fmtHora(lastUpdated);
}

function StatusDot({ status }: { status: FetchStatus }) {
  const cls =
    status === 'ok' ? styles.dotOk : status === 'loading' ? styles.dotBusy : status === 'error' ? styles.dotErr : styles.dot;
  return <span className={cls} aria-hidden="true" />;
}

/** Ordena con los valores faltantes (null/undefined) siempre al final, en ambas direcciones. */
function ordenar(rows: CotizacionAccion[], key: SortKey, dir: 1 | -1): CotizacionAccion[] {
  return [...rows].sort((a, b) => {
    const va = a[key];
    const vb = b[key];
    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    if (typeof va === 'string' && typeof vb === 'string') return va.localeCompare(vb, 'es') * dir;
    return ((va as number) - (vb as number)) * dir;
  });
}

/** Descarga lo que se ve en pantalla (filtro + orden activos). Mismo formato que el CSV de Renta Fija. */
function exportCSV(rows: CotizacionAccion[]) {
  const header = COLUMNAS.map((c) => c.label);
  const lines = [
    header,
    ...rows.map((s) => [s.symbol, s.name, s.bid ?? '', s.ask ?? '', s.price ?? '', s.changePct ?? '', s.volume ?? '']),
  ];
  const csv = lines.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,﻿' + encodeURIComponent(csv);
  a.download = `briovalores-acciones-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

/**
 * Página /herramientas/acciones: panel de cotizaciones de las acciones líderes de BYMA.
 * Diseño portado de `__ref/BrioAcciones.jsx` (prototipo aprobado). Es la versión "tabla
 * completa" de lo que el Hero muestra resumido: misma lista (ACCIONES_LIDERES), mismo
 * endpoint y mismo hook (useAccionesLideres), con intervalo de refresh elegible.
 */
export default function Acciones() {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('symbol');
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [intervalSec, setIntervalSec] = useState(120);
  const ref = useReveal<HTMLElement>(styles.reveal, styles.isIn);

  const { stocks, status, lastUpdated, refrescar } = useAccionesLideres(ACCIONES_LIDERES, FILAS_VACIAS, {
    intervalSec,
    simularLatido: false,
  });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtradas = q
      ? stocks.filter((s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
      : stocks;
    return ordenar(filtradas, sortBy, sortDir);
  }, [stocks, query, sortBy, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortBy(key);
      setSortDir(1);
    }
  };

  const th = (key: SortKey, label: ReactNode, num?: boolean) => (
    <th
      key={key}
      className={num ? styles.num : undefined}
      aria-sort={sortBy === key ? (sortDir === 1 ? 'ascending' : 'descending') : 'none'}
    >
      <button type="button" className={styles.thBtn} onClick={() => toggleSort(key)}>
        {label}
        {sortBy === key && (
          <span className={styles.sortArrow} aria-hidden="true">
            {sortDir === 1 ? '↑' : '↓'}
          </span>
        )}
      </button>
    </th>
  );

  return (
    <section className={styles.acciones} aria-labelledby="ac-title" ref={ref}>
      <div className={`${styles.head} ${styles.reveal}`}>
        <p className={styles.kicker}>
          <span className={styles.kickerLine} aria-hidden="true" />
          Herramientas
        </p>
        <h1 id="ac-title" className={styles.title}>
          Panel de Cotizaciones
        </h1>
        <p className={styles.lead}>
          Precios de las principales acciones líderes de BYMA — datos referenciales, con actualización automática cada 2
          minutos aproximadamente.
        </p>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          type="search"
          placeholder="Buscar por ticker o nombre…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar acción"
        />

        <div className={styles.status}>
          <StatusDot status={status} />
          <span aria-live="polite">{textoEstado(status, lastUpdated)}</span>
          <select
            className={styles.intervalSelect}
            value={intervalSec}
            onChange={(e) => setIntervalSec(Number(e.target.value))}
            aria-label="Auto-refresh de cotizaciones"
          >
            {INTERVALOS.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
          <button type="button" className={styles.btn} onClick={() => void refrescar()}>
            ⟳ Actualizar
          </button>
          <button type="button" className={styles.btn} onClick={() => exportCSV(rows)}>
            ⇩ Exportar CSV
          </button>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>{COLUMNAS.map((c) => th(c.key, c.label, c.num))}</tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const pct = s.changePct;
              const tono = pct == null ? styles.flat : pct > 0 ? styles.up : pct < 0 ? styles.down : styles.flat;
              return (
                <tr key={s.symbol}>
                  <td>
                    <span className={styles.ticker}>{s.symbol}</span>
                  </td>
                  <td className={styles.muted}>{s.name}</td>
                  <td className={styles.num}>{fmtPx(s.bid)}</td>
                  <td className={styles.num}>{fmtPx(s.ask)}</td>
                  <td className={`${styles.num} ${styles.last}`}>{fmtPx(s.price)}</td>
                  <td className={`${styles.num} ${styles.pct} ${tono}`}>
                    {pct == null ? '—' : `${pct > 0 ? '▲' : pct < 0 ? '▼' : '–'} ${fmtPct(pct)}`}
                  </td>
                  <td className={`${styles.num} ${styles.muted}`}>{fmtVol(s.volume) ?? '—'}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={COLUMNAS.length} className={styles.empty}>
                  No encontramos ninguna acción que coincida con tu búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className={styles.disclaimer}>
        * Datos referenciales, no en tiempo real. No constituye recomendación de inversión. Fuente: data912.
      </p>
    </section>
  );
}
