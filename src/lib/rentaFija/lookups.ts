// Parsers y lookups de precios de mercado (data912), portados TAL CUAL desde la
// herramienta vieja de Brio (herramientaRentaFija.html — d912parse, d912parseAll,
// calcTCMEP, lookupON, lookupBond, lookupLecapOrBoncap y sus variantes *Vol).
//
// Diferencia estructural respecto al original (no de comportamiento): el HTML viejo
// guardaba los mapas de precios/volúmenes en variables globales mutables a nivel de
// módulo (mapCorp, _tcMEP, etc.) porque no tenía un framework con estado. Acá esos
// mapas viven en el estado de React (ver hooks/useRentaFijaData.ts) y se pasan como
// parámetro a estas funciones — mismos cálculos, mismo criterio de "solo precio si
// hubo volumen hoy", mismo fallback de ON vía TC MEP implícito.

export interface D912Row {
  symbol?: string;
  c?: number | string;
  v?: number | string;
}

export type PriceMap = Record<string, number>;

export interface D912ParseAllResult {
  withVol: PriceMap;
  noVol: PriceMap;
  vols: PriceMap;
}

/**
 * Parsea una respuesta data912 devolviendo precios con y sin volumen por separado
 * (withVol/noVol) más el volumen del día por símbolo (vols). Usado para arg_corp,
 * donde además de los precios "operados hoy" hace falta el resto para calcular el
 * TC MEP implícito (calcTCMEP).
 *
 * Criterio de "tiene precio operado": v > 0 (hubo volumen nominal durante el día).
 * v == 0 → el precio `c` es el cierre de otro día, no de hoy.
 */
export function d912parseAll(arr: unknown): D912ParseAllResult {
  const withVol: PriceMap = {};
  const noVol: PriceMap = {};
  const vols: PriceMap = {};
  for (const r of Array.isArray(arr) ? (arr as D912Row[]) : []) {
    const sym = String(r.symbol ?? '').trim().toUpperCase();
    const precio = parseFloat(String(r.c));
    const vol = parseFloat(String(r.v)) || 0;
    if (!sym || !isFinite(precio) || precio <= 0) continue;
    if (vol > 0) {
      withVol[sym] = precio;
      vols[sym] = vol;
    } else {
      noVol[sym] = precio;
    }
  }
  return { withVol, noVol, vols };
}

/**
 * Parsea una respuesta data912 a { SYMBOL: precio }. Si `requireVolume` es true,
 * descarta los símbolos con v <= 0 (no operaron hoy). `volOut`, si se pasa, se
 * puebla con { SYMBOL: volumen } para los símbolos con volumen > 0.
 */
export function d912parse(arr: unknown, requireVolume: boolean, volOut?: PriceMap): PriceMap {
  const m: PriceMap = {};
  for (const r of Array.isArray(arr) ? (arr as D912Row[]) : []) {
    const sym = String(r.symbol ?? '').trim().toUpperCase();
    const precio = parseFloat(String(r.c));
    const vol = parseFloat(String(r.v)) || 0;
    if (!sym || !isFinite(precio) || precio <= 0) continue;
    if (requireVolume && vol <= 0) continue;
    m[sym] = precio;
    if (volOut && vol > 0) volOut[sym] = vol;
  }
  return m;
}

/**
 * Tipo de cambio MEP implícito: mediana de precioO/precioD de todos los pares
 * O/D de arg_corp que tuvieron volumen hoy (ej. LOC4O(ARS)/LOC4D(USD)).
 */
export function calcTCMEP(withVol: PriceMap): number | null {
  const tcs: number[] = [];
  for (const sym of Object.keys(withVol)) {
    if (!sym.endsWith('D')) continue;
    const base = sym.slice(0, -1);
    const pricO = withVol[base + 'O'];
    const pricD = withVol[sym];
    if (pricO && pricD && pricO > 1000 && pricD > 10 && pricD < 2000) {
      tcs.push(pricO / pricD);
    }
  }
  if (tcs.length === 0) return null;
  tcs.sort((a, b) => a - b);
  return tcs[Math.floor(tcs.length / 2)];
}

/**
 * Precio USD MEP de una ON. Orden de prioridad:
 *  1. XXXXD con volumen en arg_corp → precio USD MEP directo.
 *  2. XXXXO con volumen → convertir dividiendo por el TC MEP implícito del día.
 *  3. null → sin operaciones hoy en ninguna de las dos puntas.
 */
export function lookupON(ticker: string, mapCorp: PriceMap, mapCorpAllWithVol: PriceMap, tcMEP: number | null): number | null {
  const tk = ticker.toUpperCase();
  const tkD = tk.endsWith('O') ? tk.slice(0, -1) + 'D' : tk + 'D';
  const tkO = tk.endsWith('O') ? tk : tk.slice(0, -1) + 'O';

  if (mapCorp[tkD]) return mapCorp[tkD];

  const pARS = mapCorpAllWithVol[tkO] || mapCorpAllWithVol[tk];
  if (pARS && tcMEP && pARS > 1000) {
    return parseFloat((pARS / tcMEP).toFixed(4));
  }
  return null;
}

/** Soberanos: match directo en arg_bonds (los tickers del panel ya llevan sufijo D). */
export function lookupBond(ticker: string, mapBonds: PriceMap): number | null {
  return mapBonds[ticker.toUpperCase()] ?? null;
}

/** LECAPs: arg_notes. BONCAPs: arg_bonds (viven ahí, no en arg_notes). */
export function lookupLecapOrBoncap(ticker: string, mapNotes: PriceMap, mapBonds: PriceMap): number | null {
  const tk = ticker.toUpperCase();
  return mapNotes[tk] ?? mapBonds[tk] ?? null;
}

/** Volumen del día de una ON: suma de las láminas operadas en ARS (XXXO) y USD MEP (XXXD). */
export function lookupONVol(ticker: string, mapCorpVol: PriceMap): number | null {
  const tk = ticker.toUpperCase();
  const tkO = tk.endsWith('O') ? tk : tk.slice(0, -1) + 'O';
  const tkD = tk.endsWith('D') ? tk : tk.slice(0, -1) + 'D';
  const vO = mapCorpVol[tkO] || 0;
  const vD = mapCorpVol[tkD] || 0;
  const sum = vO + vD;
  return sum > 0 ? sum : null;
}

export function lookupBondVol(ticker: string, mapBondsVol: PriceMap): number | null {
  return mapBondsVol[ticker.toUpperCase()] || null;
}

export function lookupLecapOrBoncapVol(ticker: string, mapNotesVol: PriceMap, mapBondsVol: PriceMap): number | null {
  const tk = ticker.toUpperCase();
  return mapNotesVol[tk] ?? mapBondsVol[tk] ?? null;
}
