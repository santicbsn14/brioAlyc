import type { Bond, SovereignBond } from './data/bonds';
import type { LecapOrBoncap } from './data/lecapsYBoncaps';
import { calcTIR, calcDuration, calcLecapRates } from './calc';

// Portado de la lógica de cartera (herramientaRentaFija.html — carUniverse, carLookup,
// carBuildFlows): universo de títulos disponibles para cargar en la cartera del
// usuario y cálculo de flujos de fondos agregados por fecha. Mismo criterio de
// cashflow por posición (ONs/soberanos: cf expresado por 100 VN; LECAPs/BONCAPs:
// pago único capitalizado a la tasa de emisión).
//
// La TIR/duration PONDERADAS de la cartera (computeCarteraStats) no existen en la
// herramienta vieja (esa solo mostraba posiciones + calendario de flujos) — es un
// agregado nuevo pedido en el brief de este panel, construido reusando el mismo
// motor de cálculo (calc.ts) sobre cada posición, sin inventar una fórmula nueva:
// promedio ponderado por valor de mercado de la TIR/duration (u TNA/plazo para
// LECAPs y BONCAPs, tratando el pago único como un cupón cero cuya duration es su
// propio plazo). Solo entran al promedio las posiciones con precio disponible hoy.

export type CarSource = 'on' | 'sov' | 'lecap' | 'boncap';

export interface CarUniverseItem {
  ticker: string;
  emisor: string;
  titulo: string;
  vencimiento: string;
  ley: string;
  source: CarSource;
}

export interface CarPosition {
  ticker: string;
  vn: number;
}

export interface CarFlowTicker {
  ticker: string;
  monto: number;
  tipo: 'ambos' | 'amort' | 'renta';
}

export interface CarFlowEntry {
  renta: number;
  amort: number;
  total: number;
  tickers: CarFlowTicker[];
}

export type CarFlowsByDate = Record<string, CarFlowEntry>;

export function buildCarUniverse(
  bonds: Bond[],
  sovereignBonds: SovereignBond[],
  lecaps: LecapOrBoncap[],
  boncaps: LecapOrBoncap[],
): CarUniverseItem[] {
  const out: CarUniverseItem[] = [];
  bonds.forEach((b) => {
    out.push({ ticker: b.ticker, emisor: b.emisor, titulo: b.titulo, vencimiento: b.vencimiento, ley: b.ley, source: 'on' });
  });
  sovereignBonds.forEach((b) => {
    out.push({ ticker: b.ticker, emisor: b.grupo || 'Soberano', titulo: b.titulo, vencimiento: b.vencimiento, ley: b.ley, source: 'sov' });
  });
  lecaps.forEach((b) => {
    out.push({ ticker: b.ticker, emisor: 'Tesoro', titulo: 'LECAP ' + b.ticker, vencimiento: b.vencimiento, ley: 'Local', source: 'lecap' });
  });
  boncaps.forEach((b) => {
    out.push({ ticker: b.ticker, emisor: 'Tesoro', titulo: 'BONCAP ' + b.ticker, vencimiento: b.vencimiento, ley: 'Local', source: 'boncap' });
  });
  return out;
}

export function carLookup(universe: CarUniverseItem[], ticker: string | null | undefined): CarUniverseItem | null {
  if (!ticker) return null;
  const tk = ticker.trim().toUpperCase();
  return universe.find((x) => x.ticker.toUpperCase() === tk) || null;
}

function parseDMY(s: string): string | null {
  if (!s) return null;
  const [d, m, y] = s.split('/');
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

export function buildCarFlows(
  positions: CarPosition[],
  universe: CarUniverseItem[],
  bonds: Bond[],
  sovereignBonds: SovereignBond[],
  lecaps: LecapOrBoncap[],
  boncaps: LecapOrBoncap[],
): CarFlowsByDate {
  const flows: CarFlowsByDate = {};
  const bondsByTicker = new Map(bonds.map((b) => [b.ticker, b]));
  const sovByTicker = new Map(sovereignBonds.map((b) => [b.ticker, b]));
  const lecapByTicker = new Map([...lecaps, ...boncaps].map((b) => [b.ticker, b]));

  positions.forEach((pos) => {
    const info = carLookup(universe, pos.ticker);
    if (!info) return;
    const vn = pos.vn;

    if (info.source === 'on' || info.source === 'sov') {
      const obj = info.source === 'on' ? bondsByTicker.get(info.ticker) : sovByTicker.get(info.ticker);
      (obj?.cashflows || []).forEach((cf) => {
        const fecha = cf.fecha;
        if (!fecha) return;
        const amort = (cf.amort || 0) * vn / 100;
        const total = (cf.cf || 0) * vn / 100;
        const renta = total - amort;
        if (total < 0.001) return;

        if (!flows[fecha]) flows[fecha] = { renta: 0, amort: 0, total: 0, tickers: [] };
        flows[fecha].renta += renta;
        flows[fecha].amort += amort;
        flows[fecha].total += total;
        flows[fecha].tickers.push({
          ticker: pos.ticker,
          monto: total,
          tipo: amort > 0.001 && renta > 0.001 ? 'ambos' : amort > 0.001 ? 'amort' : 'renta',
        });
      });
    } else if (info.source === 'lecap' || info.source === 'boncap') {
      const b = lecapByTicker.get(info.ticker);
      if (!b) return;
      const fecha = parseDMY(b.vencimiento);
      if (!fecha) return;
      const dias = b.dias_tot || 0;
      const tasa = b.tasa_emision || 0;
      const payoff = vn * Math.pow(1 + tasa, dias / 30);
      if (!flows[fecha]) flows[fecha] = { renta: 0, amort: 0, total: 0, tickers: [] };
      flows[fecha].amort += payoff;
      flows[fecha].total += payoff;
      flows[fecha].tickers.push({ ticker: pos.ticker, monto: payoff, tipo: 'amort' });
    }
  });

  return flows;
}

export interface CarWeightedStats {
  tirPonderada: number | null;
  durationPonderada: number | null;
  valorTotal: number;
  /** Cantidad de posiciones que entraron al promedio (tienen precio disponible hoy). */
  posicionesValuadas: number;
}

/** TIR y duration ponderadas por valor de mercado de toda la cartera (ver nota arriba). */
export function computeCarteraStats(
  positions: CarPosition[],
  universe: CarUniverseItem[],
  bonds: Bond[],
  sovereignBonds: SovereignBond[],
  lecaps: LecapOrBoncap[],
  boncaps: LecapOrBoncap[],
  onPrices: Record<string, number>,
  sovPrices: Record<string, number>,
  lecapPrices: Record<string, number>,
): CarWeightedStats {
  const bondsByTicker = new Map(bonds.map((b) => [b.ticker, b]));
  const sovByTicker = new Map(sovereignBonds.map((b) => [b.ticker, b]));
  const lecapByTicker = new Map([...lecaps, ...boncaps].map((b) => [b.ticker, b]));

  let sumWeightTir = 0;
  let sumTir = 0;
  let sumWeightDur = 0;
  let sumDur = 0;
  let valorTotal = 0;
  let posicionesValuadas = 0;

  positions.forEach((pos) => {
    const info = carLookup(universe, pos.ticker);
    if (!info) return;

    if (info.source === 'on' || info.source === 'sov') {
      const obj = info.source === 'on' ? bondsByTicker.get(info.ticker) : sovByTicker.get(info.ticker);
      const precio = info.source === 'on' ? onPrices[info.ticker] : sovPrices[info.ticker];
      if (!obj || !precio) return;
      const tir = calcTIR(precio, obj.cashflows);
      const duration = calcDuration(precio, obj.cashflows, tir);
      const valor = (precio * pos.vn) / 100;
      valorTotal += valor;
      posicionesValuadas++;
      if (tir !== null) {
        sumTir += tir * valor;
        sumWeightTir += valor;
      }
      if (duration !== null) {
        sumDur += duration * valor;
        sumWeightDur += valor;
      }
    } else {
      const item = lecapByTicker.get(info.ticker);
      if (!item) return;
      const precio = lecapPrices[info.ticker];
      const p = precio && precio > 0 ? precio : item.cotiz_ref;
      if (!p) return;
      const { tna, diasVenc } = calcLecapRates(item, precio);
      const valor = (p * pos.vn) / 100;
      valorTotal += valor;
      posicionesValuadas++;
      if (tna !== null) {
        sumTir += tna * valor;
        sumWeightTir += valor;
      }
      if (diasVenc !== null && diasVenc > 0) {
        const durAprox = diasVenc / 365;
        sumDur += durAprox * valor;
        sumWeightDur += valor;
      }
    }
  });

  return {
    tirPonderada: sumWeightTir > 0 ? sumTir / sumWeightTir : null,
    durationPonderada: sumWeightDur > 0 ? sumDur / sumWeightDur : null,
    valorTotal,
    posicionesValuadas,
  };
}
