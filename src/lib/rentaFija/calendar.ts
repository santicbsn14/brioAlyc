import type { Bond, SovereignBond } from './data/bonds';
import type { LecapOrBoncap } from './data/lecapsYBoncaps';

// Portado de _buildCalEvents (herramientaRentaFija.html): arma los eventos de pago
// (renta/amortización) de todos los instrumentos cargados, agrupados por fecha ISO.
// Misma lógica de "tipo" (ambos/amort/renta) y mismo criterio de qué cuenta como
// pago (> 0.001, para no listar redondeos de cero).

export type CalEventTipo = 'ambos' | 'amort' | 'renta';

export interface CalEvent {
  ticker: string;
  tipo: CalEventTipo;
  cf: number;
  amort: number;
  cupon: number;
}

export type CalEventsByDate = Record<string, CalEvent[]>;

function parseDDMMYYYY(s: string): string {
  const [d, m, y] = s.split('/');
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

export function buildCalEvents(
  bonds: Bond[],
  sovereignBonds: SovereignBond[],
  lecaps: LecapOrBoncap[],
  boncaps: LecapOrBoncap[],
): CalEventsByDate {
  const ev: CalEventsByDate = {};

  const addFlow = (ticker: string, flows: Bond['cashflows'] | undefined) => {
    (flows || []).forEach((f) => {
      if (!f.fecha) return;
      const amort = f.amort || 0;
      const cf = f.cf || 0;
      const cupon = cf - amort;
      const hasAmort = amort > 0.001;
      const hasCupon = cupon > 0.001;
      if (!hasAmort && !hasCupon) return;
      const tipo: CalEventTipo = hasAmort && hasCupon ? 'ambos' : hasAmort ? 'amort' : 'renta';
      if (!ev[f.fecha]) ev[f.fecha] = [];
      ev[f.fecha].push({ ticker, tipo, cf, amort, cupon: Math.max(0, cupon) });
    });
  };

  bonds.forEach((b) => addFlow(b.ticker, b.cashflows));
  sovereignBonds.forEach((b) => addFlow(b.ticker, b.cashflows));

  const addDiscount = (list: LecapOrBoncap[]) =>
    list.forEach((b) => {
      if (!b.vencimiento) return;
      const fecha = parseDDMMYYYY(b.vencimiento);
      const cf = b.cotiz_ref ?? 100;
      if (!ev[fecha]) ev[fecha] = [];
      ev[fecha].push({ ticker: b.ticker, tipo: 'amort', cf, amort: cf, cupon: 0 });
    });
  addDiscount(lecaps);
  addDiscount(boncaps);

  return ev;
}

const TIPO_ORDEN: Record<CalEventTipo, number> = { ambos: 0, amort: 1, renta: 2 };

/** Mismo criterio de orden que renderCal: lo más "importante" (ambos > amort > renta) arriba. */
export function sortDayEvents(events: CalEvent[]): CalEvent[] {
  return [...events].sort((a, b) => TIPO_ORDEN[a.tipo] - TIPO_ORDEN[b.tipo]);
}

export interface CalDayCell {
  iso: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
  events: CalEvent[];
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Arma las celdas de un mes (año, mes 0-based) en semanas de Lunes a Domingo (orden
 * habitual en Argentina; el original arrancaba en Domingo), con relleno de los meses
 * adyacentes — adaptación de renderCal. Los días fuera del mes no traen eventos,
 * igual que el original (solo muestran el número de día). */
export function buildMonthGrid(year: number, month: number, events: CalEventsByDate): CalDayCell[] {
  const todayIso = toISO(new Date());
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // Lunes=0 ... Domingo=6
  const daysInMonth = lastDay.getDate();
  const totalCells = startDow + daysInMonth;
  const trailing = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

  const cells: CalDayCell[] = [];
  for (let i = 0; i < startDow; i++) {
    const d = new Date(year, month, 1 - (startDow - i));
    cells.push({ iso: toISO(d), day: d.getDate(), inMonth: false, isToday: false, events: [] });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const iso = toISO(d);
    cells.push({ iso, day, inMonth: true, isToday: iso === todayIso, events: sortDayEvents(events[iso] || []) });
  }
  for (let i = 1; i <= trailing; i++) {
    const d = new Date(year, month + 1, i);
    cells.push({ iso: toISO(d), day: d.getDate(), inMonth: false, isToday: false, events: [] });
  }
  return cells;
}
