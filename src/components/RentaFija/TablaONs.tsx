import { useMemo, useState } from 'react';
import type { OnsRow } from '../../hooks/useRentaFija';
import { fmtNum, fmtPct } from '../../lib/rentaFija/format';
import { fmtVol } from '../../lib/rentaFija/calc';
import styles from './RentaFija.module.css';

type FiltroOns = 'all' | 'local' | 'ny' | 'conprecio' | 'dur1' | 'dur3';

const FILTROS: { id: FiltroOns; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'local', label: 'Ley local' },
  { id: 'ny', label: 'Ley NY' },
  { id: 'conprecio', label: 'Con precio' },
  { id: 'dur1', label: 'Duration <1' },
  { id: 'dur3', label: 'Duration <3' },
];

function tirColor(tirPct: number): string {
  if (tirPct < 5) return styles.cRed;
  if (tirPct < 7) return styles.cYellow;
  return styles.cGreen;
}

function exportCSV(rows: OnsRow[]) {
  const header = ['Emisor', 'Ticker', 'Título', 'Ley', 'Vencimiento', 'Precio', 'TIR%', 'Duration', 'Volumen', 'Lámina'];
  const lines = [header, ...rows.map((b) => [
    b.emisor,
    b.ticker,
    b.titulo,
    b.ley,
    b.vencimiento,
    b.precio ?? '',
    b.tir !== null ? (b.tir * 100).toFixed(4) : '',
    b.duration !== null ? b.duration.toFixed(4) : '',
    b.volumen != null ? Math.round(b.volumen) : '',
    b.lamina ?? '',
  ])];
  const csv = lines.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,﻿' + encodeURIComponent(csv);
  a.download = `briovalores-ons-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

interface Props {
  rows: OnsRow[];
  onManualPriceChange: (ticker: string, raw: string) => void;
  onTickerClick: (ticker: string) => void;
}

export default function TablaONs({ rows, onManualPriceChange, onTickerClick }: Props) {
  const [q, setQ] = useState('');
  const [filtro, setFiltro] = useState<FiltroOns>('all');

  const filtrados = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return rows.filter((b) => {
      if (ql && !b.emisor.toLowerCase().includes(ql) && !b.ticker.toLowerCase().includes(ql) && !b.titulo.toLowerCase().includes(ql)) {
        return false;
      }
      if (filtro === 'local' && b.ley !== 'Local') return false;
      if (filtro === 'ny' && b.ley !== 'NY') return false;
      if (filtro === 'conprecio' && b.precio == null) return false;
      if (filtro === 'dur1' && (b.duration === null || b.duration >= 1)) return false;
      if (filtro === 'dur3' && (b.duration === null || b.duration >= 3)) return false;
      return true;
    });
  }, [rows, q, filtro]);

  return (
    <div>
      <div className={styles.toolbarRow}>
        <input
          type="text"
          className={styles.search}
          placeholder="Buscar por emisor, ticker o título…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Buscar Obligaciones Negociables"
        />
        <div className={styles.fbtns}>
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`${styles.fbtn} ${filtro === f.id ? styles.isOn : ''}`}
              onClick={() => setFiltro(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button type="button" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => exportCSV(rows)}>
          Exportar CSV
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Emisor</th>
              <th>Ticker</th>
              <th>Título</th>
              <th>Ley</th>
              <th>Vencimiento</th>
              <th className={styles.num}>Precio</th>
              <th className={styles.num}>TIR %</th>
              <th className={styles.num}>Duration</th>
              <th className={styles.num}>Volumen</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((b) => (
              <tr key={b.ticker}>
                <td>{b.emisor}</td>
                <td>
                  <button type="button" className={styles.tickerBtn} onClick={() => onTickerClick(b.ticker)} title="Ver flujo de fondos">
                    {b.ticker}
                    <span className={styles.tickerArrow} aria-hidden="true">↗</span>
                  </button>
                </td>
                <td className={styles.muted} title={b.titulo}>{b.titulo}</td>
                <td>
                  <span className={`${styles.chip} ${b.ley === 'NY' ? styles.chipNy : ''}`}>{b.ley}</span>
                </td>
                <td className={styles.muted}>{b.vencimiento}</td>
                <td className={styles.num}>
                  {b.precio !== null && !b.esManual ? (
                    fmtNum(b.precio, 3)
                  ) : (
                    <input
                      className={styles.priceInput}
                      type="text"
                      inputMode="decimal"
                      placeholder="Sin volumen"
                      aria-label={`Precio manual de ${b.ticker}`}
                      defaultValue={b.esManual && b.precio !== null ? String(b.precio) : ''}
                      onChange={(e) => onManualPriceChange(b.ticker, e.target.value)}
                    />
                  )}
                </td>
                <td className={`${styles.num} ${b.tir !== null ? tirColor(b.tir * 100) : ''}`}>{fmtPct(b.tir, 1)}</td>
                <td className={styles.num}>{fmtNum(b.duration, 1)}</td>
                <td className={`${styles.num} ${styles.muted}`}>{fmtVol(b.volumen) ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtrados.length === 0 && <p className={styles.emptyRow}>No hay ONs que coincidan con la búsqueda o el filtro.</p>}
      </div>
    </div>
  );
}
