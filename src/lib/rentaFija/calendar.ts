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
