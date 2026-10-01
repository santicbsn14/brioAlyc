import { useEffect, useMemo, useState } from 'react';
import { BONDS, SOVEREIGN_BONDS } from '../../lib/rentaFija/data/bonds';
import { LECAPS_DATA, BONCAPS_DATA } from '../../lib/rentaFija/data/lecapsYBoncaps';
import { buildCalEvents, buildMonthGrid, type CalEventTipo } from '../../lib/rentaFija/calendar';
import { fmtFechaISO, fmtNum } from '../../lib/rentaFija/format';
import styles from './RentaFija.module.css';

interface Props {
  onTickerClick: (ticker: string) => void;
}

type CalFiltro = 'all' | 'ons' | 'sov' | 'caps';

const FILTROS: { id: CalFiltro; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'ons', label: 'ONs' },
  { id: 'sov', label: 'Soberanos' },
  { id: 'caps', label: 'LECAPs / BONCAPs' },
];

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const DOWS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const TIPO_LABEL: Record<CalEventTipo, string> = { ambos: 'Renta + Amort.', amort: 'Amortización', renta: 'Renta' };
const TIPO_CLASS: Record<CalEventTipo, string> = { ambos: styles.evAmbos, amort: styles.evAmort, renta: styles.evRenta };

/** Breakpoint compartido con el resto del panel (ver @media de RentaFija.module.css). */
function useIsCompact(breakpoint = 640): boolean {
  const [compact, setCompact] = useState(() => typeof window !== 'undefined' && window.innerWidth <= breakpoint);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = () => setCompact(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [breakpoint]);
  return compact;
}

/** Pestaña Calendario: grilla mensual real (días de la semana, navegación, filtro por
 * tipo de instrumento) — reemplaza la lista agrupada por mes de la tarea anterior
 * (ver PROGRESO.md 2026-09-24 y 2026-10-01) por la grilla del original
 * (_buildCalEvents/renderCal/setCalFilter/calPrev/calNext/calGoToday/showCalTooltip
 * de herramientaRentaFija.html), con el diseño propio de Brio. Misma lógica de qué
 * eventos armar y cómo ordenarlos dentro de un día; el filtro por tipo se logra
 * pasándole a buildCalEvents solo los arreglos del tipo elegido (igual criterio que
 * `_calFilter` del original, sin tocar buildCalEvents). */
export default function Calendario({ onTickerClick }: Props) {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [filtro, setFiltro] = useState<CalFiltro>('all');
  const [hoverDay, setHoverDay] = useState<string | null>(null);
  const [sheetDay, setSheetDay] = useState<string | null>(null);
  const compact = useIsCompact();

  const events = useMemo(() => {
    const ons = filtro === 'all' || filtro === 'ons' ? BONDS : [];
    const sov = filtro === 'all' || filtro === 'sov' ? SOVEREIGN_BONDS : [];
    const lecaps = filtro === 'all' || filtro === 'caps' ? LECAPS_DATA : [];
    const boncaps = filtro === 'all' || filtro === 'caps' ? BONCAPS_DATA : [];
    return buildCalEvents(ons, sov, lecaps, boncaps);
  }, [filtro]);

  const grid = useMemo(() => buildMonthGrid(cursor.year, cursor.month, events), [cursor, events]);
  const weeks = useMemo(() => {
    const out: (typeof grid)[] = [];
    for (let i = 0; i < grid.length; i += 7) out.push(grid.slice(i, i + 7));
    return out;
  }, [grid]);

  // Cerrar tooltip/hoja al cambiar de mes o filtro, para no dejar algo abierto
  // apuntando a un día que ya no se ve (en los handlers, no en un efecto: no hay
  // nada externo que sincronizar, solo limpiar un estado derivado de la acción).
  const closeOverlays = () => {
    setHoverDay(null);
    setSheetDay(null);
  };
  const goPrev = () => {
    closeOverlays();
    setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }));
  };
  const goNext = () => {
    closeOverlays();
    setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }));
  };
  const goToday = () => {
    closeOverlays();
    setCursor({ year: today.getFullYear(), month: today.getMonth() });
  };
  const changeFiltro = (f: CalFiltro) => {
    closeOverlays();
    setFiltro(f);
  };

  const sheetCell = sheetDay ? grid.find((c) => c.iso === sheetDay) : null;
  const hasAnyEvent = grid.some((c) => c.inMonth && c.events.length > 0);

  return (
    <div className={styles.calWrap}>
      <div className={styles.calHead}>
        <div className={styles.calNav}>
          <button type="button" className={styles.calNavBtn} onClick={goPrev} aria-label="Mes anterior">
            ←
          </button>
          <p className={styles.calTitle}>
            {MESES[cursor.month]} {cursor.year}
          </p>
          <button type="button" className={styles.calNavBtn} onClick={goNext} aria-label="Mes siguiente">
            →
          </button>
        </div>
        <button type="button" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={goToday}>
          Hoy
        </button>
      </div>

      <div className={styles.fbtns} role="group" aria-label="Filtrar por tipo de instrumento">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`${styles.fbtn} ${filtro === f.id ? styles.isOn : ''}`}
            onClick={() => changeFiltro(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={styles.calLegend}>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.evRenta}`} aria-hidden="true" /> Renta
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.evAmort}`} aria-hidden="true" /> Amortización
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.evAmbos}`} aria-hidden="true" /> Renta + Amortización
        </span>
      </div>

      <div key={`${cursor.year}-${cursor.month}`} className={styles.calGrid}>
        {DOWS.map((d) => (
          <div key={d} className={styles.calDow}>
            {d}
          </div>
        ))}
        {weeks.map((week, wi) =>
          week.map((cell, ci) => {
            const visible = cell.events.slice(0, 4);
            const extra = cell.events.length - visible.length;
            const align = ci <= 1 ? styles.calTooltipStart : ci >= 5 ? styles.calTooltipEnd : styles.calTooltipCenter;
            const vPos = wi < 2 ? styles.calTooltipBelow : styles.calTooltipAbove;
            return (
              <div
                key={cell.iso}
                className={`${styles.calCell} ${!cell.inMonth ? styles.calCellOut : ''} ${cell.isToday ? styles.calCellToday : ''}`}
              >
                <span className={styles.calCellNum}>{cell.day}</span>

                {cell.inMonth && visible.length > 0 && (
                  compact ? (
                    <button
                      type="button"
                      className={styles.calDotsBtn}
                      onClick={() => setSheetDay(cell.iso)}
                      aria-label={`${cell.events.length} ${cell.events.length === 1 ? 'evento' : 'eventos'} el ${fmtFechaISO(cell.iso)}`}
                    >
                      {visible.map((ev, i) => (
                        <span key={i} className={`${styles.calDot} ${TIPO_CLASS[ev.tipo]}`} />
                      ))}
                      {extra > 0 && <span className={styles.calDotMore}>+{extra}</span>}
                    </button>
                  ) : (
                    <div className={styles.calCellEvents}>
                      {visible.map((ev, i) => (
                        <button
                          key={i}
                          type="button"
                          className={`${styles.calEvent} ${TIPO_CLASS[ev.tipo]}`}
                          onClick={() => onTickerClick(ev.ticker)}
                          onMouseEnter={() => setHoverDay(cell.iso)}
                          onMouseLeave={() => setHoverDay((d) => (d === cell.iso ? null : d))}
                          onFocus={() => setHoverDay(cell.iso)}
                          onBlur={() => setHoverDay((d) => (d === cell.iso ? null : d))}
                        >
                          {ev.ticker}
                          {ev.tipo === 'ambos' ? ' R+A' : ev.tipo === 'amort' ? ' Amort' : ''}
                        </button>
                      ))}
                      {extra > 0 && <span className={styles.calMore}>+{extra} más</span>}
                    </div>
                  )
                )}

                {!compact && hoverDay === cell.iso && cell.events.length > 0 && (
                  <div className={`${styles.calTooltip} ${align} ${vPos}`} role="tooltip">
                    <p className={styles.calTooltipTitle}>{fmtFechaISO(cell.iso)}</p>
                    {cell.events.map((ev, i) => (
                      <div key={i} className={styles.calTooltipRow}>
                        <span>
                          {ev.ticker} <span className={styles.calTooltipTipo}>{TIPO_LABEL[ev.tipo]}</span>
                        </span>
                        <span className={styles.calTooltipVal}>{ev.cf > 0 ? `c/${fmtNum(ev.cf, 2)}` : '—'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }),
        )}
      </div>

      {compact && sheetCell && (
        <>
          <button type="button" className={styles.calSheetBackdrop} aria-label="Cerrar" onClick={() => setSheetDay(null)} />
          <div className={styles.calSheet} role="dialog" aria-label={`Eventos del ${fmtFechaISO(sheetCell.iso)}`}>
            <div className={styles.calSheetHead}>
              <p className={styles.calSheetTitle}>{fmtFechaISO(sheetCell.iso)}</p>
              <button type="button" className={styles.calSheetClose} onClick={() => setSheetDay(null)} aria-label="Cerrar">
                ×
              </button>
            </div>
            {sheetCell.events.map((ev, i) => (
              <button
                key={i}
                type="button"
                className={styles.calSheetRow}
                onClick={() => {
                  onTickerClick(ev.ticker);
                  setSheetDay(null);
                }}
              >
                <span className={`${styles.calDot} ${TIPO_CLASS[ev.tipo]}`} aria-hidden="true" />
                <span className={styles.calSheetTicker}>{ev.ticker}</span>
                <span className={styles.calSheetTipo}>{TIPO_LABEL[ev.tipo]}</span>
                <span className={styles.calSheetVal}>{ev.cf > 0 ? `c/${fmtNum(ev.cf, 2)}` : '—'}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {!hasAnyEvent && (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Sin pagos este mes</p>
          <p className={styles.emptyText}>
            No hay vencimientos de renta o amortización en {MESES[cursor.month]} {cursor.year} para el filtro seleccionado.
          </p>
        </div>
      )}
    </div>
  );
}
