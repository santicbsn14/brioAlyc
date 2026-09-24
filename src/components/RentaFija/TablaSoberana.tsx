import { Fragment, useMemo, useState } from 'react';
import type { SovRow, LecapRow } from '../../hooks/useRentaFija';
import { fmtNum, fmtPct } from '../../lib/rentaFija/format';
import { fmtVol, daysTo } from '../../lib/rentaFija/calc';
import styles from './RentaFija.module.css';

type FiltroSov = 'all' | 'globales' | 'bonares' | 'bopreales' | 'local' | 'ny' | 'dur3';

const FILTROS: { id: FiltroSov; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'globales', label: 'Globales' },
  { id: 'bonares', label: 'Bonares' },
  { id: 'bopreales', label: 'Bopreales' },
  { id: 'local', label: 'Ley local' },
  { id: 'ny', label: 'Ley NY' },
  { id: 'dur3', label: 'Duration <3' },
];

function tirColor(tirPct: number): string {
  if (tirPct < 4) return styles.cRed;
  if (tirPct < 7) return styles.cYellow;
  return styles.cGreen;
}
function tnaColor(tna: number): string {
  if (tna >= 0.28) return styles.cGreen;
  if (tna >= 0.24) return styles.cYellow;
  return styles.cRed;
}

function exportCSV(sovRows: SovRow[], lecapRows: LecapRow[]) {
  const header = ['Grupo', 'Ticker', 'Título', 'Ley', 'Vencimiento', 'Precio', 'TIR%', 'Duration', 'Volumen'];
  const lines = [header, ...sovRows.map((b) => [
    b.grupo, b.ticker, b.titulo, b.ley, b.vencimiento, b.precio ?? '',
    b.tir !== null ? (b.tir * 100).toFixed(4) : '',
    b.duration !== null ? b.duration.toFixed(4) : '',
    b.volumen != null ? Math.round(b.volumen) : '',
  ])];
  lines.push([]);
  lines.push(['Instrumento', 'Vencimiento', 'Precio', 'TNA%', 'TEM%', 'TEA%', 'Volumen']);
  lecapRows.forEach((l) => {
    lines.push([
      l.ticker, l.vencimiento, l.precio ?? l.cotiz_ref ?? '',
      l.tna != null ? (l.tna * 100).toFixed(4) : '',
      l.tem != null ? (l.tem * 100).toFixed(4) : '',
      l.tea != null ? (l.tea * 100).toFixed(4) : '',
      l.volumen != null ? Math.round(l.volumen) : '',
    ]);
  });
  const csv = lines.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,﻿' + encodeURIComponent(csv);
  a.download = `briovalores-soberana-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

interface Props {
  sovRows: SovRow[];
  lecapRows: LecapRow[];
  onManualSovPriceChange: (ticker: string, raw: string) => void;
  onManualLecapPriceChange: (ticker: string, raw: string) => void;
}

export default function TablaSoberana({ sovRows, lecapRows, onManualSovPriceChange, onManualLecapPriceChange }: Props) {
  const [q, setQ] = useState('');
  const [filtro, setFiltro] = useState<FiltroSov>('all');

  const filtrados = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return sovRows.filter((b) => {
      if (ql && !b.ticker.toLowerCase().includes(ql) && !b.titulo.toLowerCase().includes(ql) && !b.grupo.toLowerCase().includes(ql)) {
        return false;
      }
      if (filtro === 'globales' && b.grupo !== 'Globales') return false;
      if (filtro === 'bonares' && b.grupo !== 'Bonares') return false;
      if (filtro === 'bopreales' && b.grupo !== 'Bopreales') return false;
      if (filtro === 'local' && b.ley !== 'Local') return false;
      if (filtro === 'ny' && b.ley !== 'NY') return false;
      if (filtro === 'dur3' && (b.duration === null || b.duration >= 3)) return false;
      return true;
    });
  }, [sovRows, q, filtro]);

  return (
    <div>
      <div className={styles.toolbarRow}>
        <input
          type="text"
          className={styles.search}
          placeholder="Buscar por ticker, título o grupo…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Buscar deuda soberana"
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
        <button type="button" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => exportCSV(sovRows, lecapRows)}>
          Exportar CSV
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
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
            {filtrados.map((b, idx) => {
              const showGrupo = idx === 0 || b.grupo !== filtrados[idx - 1].grupo;
              return (
                <Fragment key={b.ticker}>
                  {showGrupo && (
                    <tr className={styles.sectionRow}>
                      <td colSpan={8}>{b.grupo}</td>
                    </tr>
                  )}
                  <tr>
                    <td>
                      <span className={styles.ticker}>{b.ticker}</span>
                    </td>
                    <td className={styles.muted} title={b.titulo}>{b.titulo}</td>
                    <td>
                      <span className={`${styles.chip} ${b.ley === 'NY' ? styles.chipNy : ''}`}>{b.ley}</span>
                    </td>
                    <td className={styles.muted}>{b.vencimiento}</td>
                    <td className={styles.num}>
                      {b.precio !== null ? (
                        fmtNum(b.precio, 3)
                      ) : (
                        <input
                          className={styles.priceInput}
                          type="text"
                          inputMode="decimal"
                          placeholder="Sin volumen"
                          aria-label={`Precio manual de ${b.ticker}`}
                          defaultValue=""
                          onChange={(e) => onManualSovPriceChange(b.ticker, e.target.value)}
                        />
                      )}
                    </td>
                    <td className={`${styles.num} ${b.tir !== null ? tirColor(b.tir * 100) : ''}`}>{fmtPct(b.tir, 1)}</td>
                    <td className={styles.num}>{fmtNum(b.duration, 1)}</td>
                    <td className={`${styles.num} ${styles.muted}`}>{fmtVol(b.volumen) ?? '—'}</td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
        {filtrados.length === 0 && <p className={styles.emptyRow}>No hay títulos que coincidan con la búsqueda o el filtro.</p>}
      </div>

      <h3 className={styles.subTableTitle}>LECAPs y BONCAPs</h3>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Ticker</th>
              <th>Vencimiento</th>
              <th className={styles.num}>Días</th>
              <th className={styles.num}>Precio</th>
              <th className={styles.num}>TNA %</th>
              <th className={styles.num}>TEM %</th>
              <th className={styles.num}>TEA %</th>
              <th className={styles.num}>Volumen</th>
            </tr>
          </thead>
          <tbody>
            {lecapRows.map((l) => (
              <tr key={l.ticker}>
                <td>
                  <span className={`${styles.chip} ${l.tipo === 'BONCAP' ? styles.chipNy : ''}`}>{l.tipo}</span>
                </td>
                <td>
                  <span className={styles.ticker}>{l.ticker}</span>
                </td>
                <td className={styles.muted}>{l.vencimiento}</td>
                <td className={`${styles.num} ${styles.muted}`}>
                  {l.diasVenc != null && l.diasVenc > 0 ? l.diasVenc : daysTo(l.vencimiento) || '—'}
                </td>
                <td className={styles.num}>
                  {l.precio !== null ? (
                    fmtNum(l.precio, 3)
                  ) : (
                    <input
                      className={styles.priceInput}
                      type="text"
                      inputMode="decimal"
                      placeholder={l.cotiz_ref != null ? fmtNum(l.cotiz_ref, 3) : 'Sin volumen'}
                      aria-label={`Precio manual de ${l.ticker}`}
                      defaultValue=""
                      onChange={(e) => onManualLecapPriceChange(l.ticker, e.target.value)}
                    />
                  )}
                </td>
                <td className={`${styles.num} ${l.tna !== null && isFinite(l.tna) ? tnaColor(l.tna) : ''}`}>{fmtPct(l.tna, 2)}</td>
                <td className={styles.num}>{fmtPct(l.tem, 4)}</td>
                <td className={`${styles.num} ${styles.muted}`}>{fmtPct(l.tea, 2)}</td>
                <td className={`${styles.num} ${styles.muted}`}>{fmtVol(l.volumen) ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
