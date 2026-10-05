// Parser de la respuesta de data912 /live/arg_stocks para las acciones líderes (panel
// del Hero y tabla de /herramientas/acciones). Mismo criterio de lectura que d912parse
// de Renta Fija (symbol normalizado, `c` = último precio, descartar precios no numéricos
// o <= 0), con dos diferencias a propósito:
//  - NO exige volumen (v > 0): el panel del Hero es informativo, no operativo, así que
//    alcanza con el último precio aunque el papel no haya operado hoy. En Renta Fija el
//    volumen sí importa porque decide si la TIR usa precio de mercado o manual.
//  - También lee `pct_change` (variación % del día, ya viene en porcentaje: 1.59 = 1,59%),
//    y para la tabla completa `px_bid` / `px_ask` (puntas de compra/venta) y `v` (volumen).

import type { AccionLider } from '../../data/accionesLideres';
import type { D912Row } from '../rentaFija/lookups';

interface D912StockRow extends D912Row {
  pct_change?: number | string;
  px_bid?: number | string;
  px_ask?: number | string;
}

/**
 * Cotización de una acción. `null` = ese dato no vino en la respuesta (se muestra "—").
 * `bid`/`ask`/`volume` son opcionales porque el fallback de ejemplo del Hero
 * (placeholders.ts) no los tiene — el Hero no los muestra.
 */
export interface CotizacionAccion {
  symbol: string;
  name: string;
  price: number | null;
  changePct: number | null;
  bid?: number | null;
  ask?: number | null;
  volume?: number | null;
}

function toNumber(x: unknown): number | null {
  const n = parseFloat(String(x));
  return Number.isFinite(n) ? n : null;
}

function toPositive(x: unknown): number | null {
  const n = toNumber(x);
  return n !== null && n > 0 ? n : null;
}

/**
 * Arma las filas en el orden de `lideres`. Devuelve `null` si ninguno de los tickers
 * vino con precio válido (respuesta vacía o con otro formato) — el caller lo trata como
 * falla y sigue mostrando lo que tenía (el fallback o el último dato real bueno).
 */
export function parseAccionesLideres(raw: unknown, lideres: AccionLider[]): CotizacionAccion[] | null {
  const porTicker = new Map<string, D912StockRow>();
  for (const r of Array.isArray(raw) ? (raw as D912StockRow[]) : []) {
    const sym = String(r?.symbol ?? '').trim().toUpperCase();
    if (sym) porTicker.set(sym, r);
  }

  let conPrecio = 0;
  const filas = lideres.map((a): CotizacionAccion => {
    const r = porTicker.get(a.ticker);
    const price = toPositive(r?.c);
    if (price !== null) conPrecio++;
    const v = toNumber(r?.v);
    return {
      symbol: a.ticker,
      name: a.nombre,
      price,
      changePct: price !== null ? toNumber(r?.pct_change) : null,
      bid: toPositive(r?.px_bid),
      ask: toPositive(r?.px_ask),
      volume: v !== null && v >= 0 ? v : null,
    };
  });

  return conPrecio > 0 ? filas : null;
}
