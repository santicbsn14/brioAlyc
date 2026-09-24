import { useMemo, useRef, useState } from 'react';
import type { CarPosition, CarUniverseItem, CarFlowsByDate } from '../../lib/rentaFija/cartera';
import type { CarWeightedStats } from '../../lib/rentaFija/cartera';
import { fmtFechaISO, fmtMesISO, fmtNum, fmtPct } from '../../lib/rentaFija/format';
import styles from './RentaFija.module.css';

type RangoFlujos = 'all' | '12m' | 'year';

interface Props {
  positions: CarPosition[];
  universe: CarUniverseItem[];
  flows: CarFlowsByDate;
  stats: CarWeightedStats;
  onAdd: (ticker: string, vn: number) => { ok: boolean; message: string };
  onRemove: (index: number) => void;
  onClear: () => void;
}

function lookupInfo(universe: CarUniverseItem[], ticker: string) {
  return universe.find((u) => u.ticker.toUpperCase() === ticker.toUpperCase()) ?? null;
}

function exportCSV(flows: CarFlowsByDate) {
  const fechas = Object.keys(flows).sort();
  if (fechas.length === 0) return;
  const rows = [['Fecha', 'Títulos', 'Renta USD', 'Amortización USD', 'Total USD']];
  fechas.forEach((f) => {
    const ev = flows[f];
    const tks = ev.tickers.map((t) => `${t.ticker}(${t.monto.toFixed(2)})`).join(' | ');
    rows.push([fmtFechaISO(f), tks, ev.renta.toFixed(2), ev.amort.toFixed(2), ev.total.toFixed(2)]);
  });
  const csv = rows
    .map((r) => r.map((c) => (String(c).includes(';') || String(c).includes('"') ? `"${String(c).replace(/"/g, '""')}"` : String(c))).join(';'))
    .join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `brio_cartera_flujos_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Cartera({ positions, universe, flows, stats, onAdd, onRemove, onClear }: Props) {
  const [tickerInput, setTickerInput] = useState('');
  const [vnInput, setVnInput] = useState('');
  const [rango, setRango] = useState<RangoFlujos>('all');
  const [msg, setMsg] = useState<string | null>(null);
  const tickerRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const vn = parseFloat(vnInput.replace(',', '.'));
    const res = onAdd(tickerInput, vn);
    setMsg(res.message);
    if (res.ok) {
      setTickerInput('');
      setVnInput('');
      tickerRef.current?.focus();
    }
  };

  const fechas = useMemo(() => {
    const todayIso = new Date().toISOString().slice(0, 10);
    let list = Object.keys(flows).filter((f) => f >= todayIso).sort();
    if (rango === '12m') {
      const cutoff = new Date();
      cutoff.setMonth(cutoff.getMonth() + 12);
      const cutoffIso = cutoff.toISOString().slice(0, 10);
      list = list.filter((f) => f <= cutoffIso);
    } else if (rango === 'year') {
      const y = new Date().getFullYear();
      list = list.filter((f) => f.startsWith(String(y)));
    }
    return list;
  }, [flows, rango]);

  const totales = useMemo(
    () => fechas.reduce(
      (acc, f) => ({ renta: acc.renta + flows[f].renta, amort: acc.amort + flows[f].amort, total: acc.total + flows[f].total }),
      { renta: 0, amort: 0, total: 0 },
    ),
    [fechas, flows],
  );

  const vnTotal = positions.reduce((s, p) => s + p.vn, 0);

  return (
    <div>
      <div className={styles.carAddRow}>
        <input
          ref={tickerRef}
          type="text"
          list="rf-car-tickers"
          className={styles.search}
          placeholder="Ticker (ej: GD30D)"
          value={tickerInput}
          onChange={(e) => setTickerInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          aria-label="Ticker a agregar"
        />
        <datalist id="rf-car-tickers">
          {universe.map((u) => (
            <option key={u.ticker} value={u.ticker}>
              {u.emisor} — {u.titulo}
            </option>
          ))}
        </datalist>
        <input
          type="text"
          inputMode="decimal"
          className={styles.vnInput}
          placeholder="Nominales"
          value={vnInput}
          onChange={(e) => setVnInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          aria-label="Cantidad de nominales"
        />
        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdd}>
          + Agregar posición
        </button>
      </div>
      {msg && <p className={styles.carMsg}>{msg}</p>}

      {positions.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Tu cartera</p>
          <p className={styles.emptyText}>Cargá tus posiciones para ver TIR y duration ponderados. Se guarda en este navegador (localStorage), no en una cuenta.</p>
        </div>
      ) : (
        <>
          <div className={styles.carSummary}>
            <div className={styles.carCard}>
              <div className={styles.carCardLbl}>Posiciones</div>
              <div className={styles.carCardVal}>{positions.length}</div>
              <div className={styles.carCardSub}>{vnTotal.toLocaleString('es-AR')} VN nominal total</div>
            </div>
            <div className={styles.carCard}>
              <div className={styles.carCardLbl}>TIR ponderada</div>
              <div className={styles.carCardVal}>{fmtPct(stats.tirPonderada, 2)}</div>
              <div className={styles.carCardSub}>{stats.posicionesValuadas} posición{stats.posicionesValuadas === 1 ? '' : 'es'} con precio hoy</div>
            </div>
            <div className={styles.carCard}>
              <div className={styles.carCardLbl}>Duration ponderada</div>
              <div className={styles.carCardVal}>{fmtNum(stats.durationPonderada, 2)}</div>
              <div className={styles.carCardSub}>promedio ponderado por valor de mercado</div>
            </div>
            <div className={styles.carCard}>
              <div className={styles.carCardLbl}>Total {rango === 'all' ? 'histórico + futuro' : 'filtrado'}</div>
              <div className={styles.carCardVal}>USD {fmtNum(totales.total, 2)}</div>
              <div className={styles.carCardSub}>R: {fmtNum(totales.renta, 2)} · A: {fmtNum(totales.amort, 2)}</div>
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Título</th>
                  <th className={styles.num}>VN</th>
                  <th>Vencimiento</th>
                  <th>Ley</th>
                  <th aria-label="Quitar" />
                </tr>
              </thead>
              <tbody>
                {positions.map((p, idx) => {
                  const info = lookupInfo(universe, p.ticker);
                  return (
                    <tr key={`${p.ticker}-${idx}`}>
                      <td>
                        <span className={styles.ticker}>{p.ticker}</span>
                      </td>
                      <td className={styles.muted}>{info ? `${info.emisor} · ${info.titulo}` : 'Ticker desconocido'}</td>
                      <td className={styles.num}>{p.vn.toLocaleString('es-AR')}</td>
                      <td className={styles.muted}>{info?.vencimiento ?? '—'}</td>
                      <td className={styles.muted}>{info?.ley ?? '—'}</td>
                      <td>
                        <button type="button" className={styles.rmBtn} onClick={() => onRemove(idx)} title="Quitar posición" aria-label={`Quitar ${p.ticker}`}>
                          ×
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={styles.toolbarRow}>
            <div className={styles.fbtns}>
              {([{ id: 'all', label: 'Todos' }, { id: '12m', label: 'Próx. 12 meses' }, { id: 'year', label: 'Este año' }] as const).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`${styles.fbtn} ${rango === f.id ? styles.isOn : ''}`}
                  onClick={() => setRango(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button type="button" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => exportCSV(flows)}>
              Exportar CSV
            </button>
            <button type="button" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={onClear}>
              Vaciar cartera
            </button>
          </div>

          {fechas.length === 0 ? (
            <p className={styles.emptyRow}>No hay cobros en el rango seleccionado.</p>
          ) : (
            <div className={styles.calList}>
              {fechas.map((f, idx) => {
                const mes = fmtMesISO(f);
                const mesAnterior = idx > 0 ? fmtMesISO(fechas[idx - 1]) : null;
                const showMonth = mes !== mesAnterior;
                const ev = flows[f];
                return (
                  <div key={f}>
                    {showMonth && <p className={styles.calMonth}>{mes}</p>}
                    <div className={styles.calRow}>
                      <span className={styles.calDate}>{fmtFechaISO(f)}</span>
                      <div className={styles.calEvents}>
                        {ev.tickers
                          .sort((a, b) => b.monto - a.monto)
                          .map((t, i) => (
                            <span key={`${t.ticker}-${i}`} className={styles.calChip}>
                              {t.ticker}
                            </span>
                          ))}
                      </div>
                      <span className={styles.carFlowTotal}>USD {fmtNum(ev.total, 2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
