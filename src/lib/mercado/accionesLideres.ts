// Parser de la respuesta de data912 /live/arg_stocks para las acciones líderes (panel
// del Hero y tabla de /herramientas/acciones) y para el panel completo de BYMA (buscador
// de /herramientas/acciones). Mismo criterio de lectura que d912parse de Renta Fija
// (symbol normalizado, `c` = último precio, descartar precios no numéricos o <= 0), con
// dos diferencias a propósito:
//  - NO exige volumen (v > 0): el panel del Hero es informativo, no operativo, así que
//    alcanza con el último precio aunque el papel no haya operado hoy. En Renta Fija el
//    volumen sí importa porque decide si la TIR usa precio de mercado o manual.
//  - También lee `pct_change` (variación % del día, ya viene en porcentaje: 1.59 = 1,59%),
//    y para la tabla completa `px_bid` / `px_ask` (puntas de compra/venta) y `v` (volumen).
//
// Qué acciones son las líderes lo elige Brio en el Studio (seccionHero.accionesPanel, solo
// tickers); los nombres salen de la lista maestra (data/accionesBYMA.ts).

import { ACCIONES_BYMA, type AccionBYMA } from '../../data/accionesBYMA';
import type { D912Row } from '../rentaFija/lookups';

/** Una acción del panel: ticker + nombre (vacío si la lista maestra no lo tiene). */
export type AccionLider = AccionBYMA;

const NOMBRES_BYMA = new Map(ACCIONES_BYMA.map((a) => [a.ticker, a.nombre]));

/**
 * Las acciones elegidas en Sanity (solo tickers, en su orden) con su nombre de la lista maestra.
 * Descarta los vacíos y las repetidas (el Studio no las deja publicar, pero el front no se rompe
 * si llegan). Un ticker que no está en la lista queda con nombre vacío: se ve solo el ticker.
 */
export function accionesElegidas(tickers: readonly (string | null | undefined)[] | null | undefined): AccionLider[] {
  const vistos = new Set<string>();
  const acciones: AccionLider[] = [];
  for (const t of tickers ?? []) {
    const ticker = (t ?? '').trim().toUpperCase();
    if (!ticker || vistos.has(ticker)) continue;
    vistos.add(ticker);
    acciones.push({ ticker, nombre: NOMBRES_BYMA.get(ticker) ?? '' });
  }
  return acciones;
}

interface D912StockRow extends D912Row {
  pct_change?: number | string;
  px_bid?: number | string;
  px_ask?: number | string;
}

/**
 * Cotización de una acción. `null` = ese dato no vino en la respuesta, o todavía no hay
 * datos (se muestra "—"). `name` vacío = la lista maestra no tiene su nombre.
 */
export interface CotizacionAccion {
  symbol: string;
  name: string;
  price: number | null;
  changePct: number | null;
  bid: number | null;
  ask: number | null;
  volume: number | null;
}

function toNumber(x: unknown): number | null {
  const n = parseFloat(String(x));
  return Number.isFinite(n) ? n : null;
}

function toPositive(x: unknown): number | null {
  const n = toNumber(x);
  return n !== null && n > 0 ? n : null;
}

function normSymbol(r: D912StockRow | undefined): string {
  return String(r?.symbol ?? '').trim().toUpperCase();
}

function porTicker(raw: unknown): Map<string, D912StockRow> {
  const map = new Map<string, D912StockRow>();
  for (const r of Array.isArray(raw) ? (raw as D912StockRow[]) : []) {
    const sym = normSymbol(r);
    if (sym) map.set(sym, r);
  }
  return map;
}

function aCotizacion(symbol: string, name: string, r: D912StockRow | undefined): CotizacionAccion {
  const price = toPositive(r?.c);
  const v = toNumber(r?.v);
  return {
    symbol,
    name,
    price,
    changePct: price !== null ? toNumber(r?.pct_change) : null,
    bid: toPositive(r?.px_bid),
    ask: toPositive(r?.px_ask),
    volume: v !== null && v >= 0 ? v : null,
  };
}

/** El panel completo de BYMA de una respuesta: ticker → cotización (sin nombre), en el orden de data912. */
export type PanelBYMA = ReadonlyMap<string, CotizacionAccion>;

/**
 * Lee la respuesta de arg_stocks. Devuelve `null` si no trae ninguna especie con precio válido
 * (respuesta vacía o con otro formato): el caller lo trata como falla y sigue mostrando lo que
 * tenía (las filas con "—" o el último dato real bueno).
 */
export function parsePanelBYMA(raw: unknown): PanelBYMA | null {
  const panel = new Map<string, CotizacionAccion>();
  for (const [sym, r] of porTicker(raw)) panel.set(sym, aCotizacion(sym, '', r));
  return [...panel.values()].some((c) => c.price !== null) ? panel : null;
}

/** Fila sin datos de mercado: ticker y nombre, "—" en todo lo demás. */
const filaVacia = (a: AccionLider): CotizacionAccion => ({
  symbol: a.ticker,
  name: a.nombre,
  price: null,
  changePct: null,
  bid: null,
  ask: null,
  volume: null,
});

/**
 * Las filas de las líderes, en su orden. Sin `panel` (todavía no llegó o falló la API), todas
 * con "—"; una líder que no vino en la respuesta (ej. dejó de cotizar), también.
 */
export function filasLideres(lideres: AccionLider[], panel: PanelBYMA | null): CotizacionAccion[] {
  return lideres.map((a) => {
    const c = panel?.get(a.ticker);
    return c ? { ...c, name: a.nombre } : filaVacia(a);
  });
}

/**
 * Todas las especies del panel, en el orden de data912, con el nombre de `catalogo` (lista
 * maestra). Las que no están en el catálogo quedan con nombre vacío: no se descartan.
 */
export function todasLasAcciones(panel: PanelBYMA, catalogo: AccionLider[]): CotizacionAccion[] {
  const nombres = new Map(catalogo.map((a) => [a.ticker, a.nombre]));
  return [...panel.values()].map((c) => ({ ...c, name: nombres.get(c.symbol) ?? '' }));
}
