import type { Cashflow } from './data/bonds';
import type { LecapOrBoncap } from './data/lecapsYBoncaps';

// Motor de cálculo financiero portado TAL CUAL desde la herramienta vieja de Brio
// (herramientaRentaFija.html — calcTIR, calcDuration, calcLecapRates). Mismo
// algoritmo (Newton-Raphson), mismos límites de iteración, mismo manejo de bordes
// (devuelve null en los mismos casos). No se cambió ninguna fórmula: son cálculos
// financieros, cualquier diferencia de resultado contra la herramienta vieja es un bug.

// Settlement = "mañana a las 00:00" (liquidación t+1), no "hoy". Se recalcula una
// sola vez al cargar el módulo, igual que TODAY_MS en el original (no es un bug
// que no se actualice a medianoche mientras la pestaña sigue abierta: así era el
// comportamiento original).
const TODAY_MS = (() => {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  t.setHours(0, 0, 0, 0);
  return t.getTime();
})();

/** TIR anual (Newton-Raphson) de un bono a un precio dado, sobre sus cashflows futuros. */
export function calcTIR(precio: number, cashflows: Cashflow[] | undefined | null): number | null {
  if (!cashflows || cashflows.length === 0) return null;
  const settlement = TODAY_MS;
  const flows = cashflows
    .map((c) => ({ t: (new Date(c.fecha).getTime() - settlement) / (365.25 * 86400000), cf: c.cf }))
    .filter((c) => c.t > 0);
  if (flows.length === 0) return null;

  let r = 0.06;
  for (let iter = 0; iter < 200; iter++) {
    let pv = 0;
    let dpv = 0;
    for (const { t, cf } of flows) {
      const disc = Math.pow(1 + r, t);
      pv += cf / disc;
      dpv -= (t * cf) / (disc * (1 + r));
    }
    const f = pv - precio;
    if (Math.abs(f) < 1e-10) break;
    if (Math.abs(dpv) < 1e-15) break;
    r = r - f / dpv;
    if (r < -0.999 || r > 100) return null;
  }
  return isFinite(r) ? r : null;
}

/** Duration (Macaulay) a partir de la TIR ya calculada. `_precio` no se usa adentro
 * (tampoco se usaba en el original) — se mantiene en la firma para llamar a esta
 * función igual que a calcTIR(precio, cashflows). */
export function calcDuration(
  _precio: number,
  cashflows: Cashflow[] | undefined | null,
  tir: number | null,
): number | null {
  if (tir === null || !cashflows || cashflows.length === 0) return null;
  const settlement = TODAY_MS;
  const flows = cashflows
    .map((c) => ({ t: (new Date(c.fecha).getTime() - settlement) / (365.25 * 86400000), cf: c.cf }))
    .filter((c) => c.t > 0);
  if (flows.length === 0) return null;

  let sumPV = 0;
  let sumTxPV = 0;
  for (const { t, cf } of flows) {
    const pv = cf / Math.pow(1 + tir, t);
    sumPV += pv;
    sumTxPV += t * pv;
  }
  if (sumPV === 0) return null;
  return sumTxPV / sumPV;
}

/** K = cotización final capitalizada de una LECAP/BONCAP (col K del Excel LECAPS):
 * 100 × (1 + TEM de emisión) ^ (días / 360 × 12), redondeado a 3 decimales.
 * Misma fórmula que el original usaba inline en calcLecapRates y en openCFDrawer. */
export function calcLecapK(item: LecapOrBoncap): number {
  return Math.round(100 * Math.pow(1 + item.tasa_emision, (item.dias_tot / 360) * 12) * 1000) / 1000;
}

export interface LecapRates {
  tna: number | null;
  tem: number | null;
  tea: number | null;
  diasVenc: number | null;
}

/** Días al vencimiento de una LECAP/BONCAP contados desde t+1 (columna G del
 * Excel); <= 0 = ya venció. Lo usan calcLecapRates y el filtro de vencidas de la
 * tabla de LECAPs/BONCAPs (useRentaFija). */
export function calcLecapDiasVenc(item: LecapOrBoncap): number {
  const t1 = new Date();
  t1.setHours(0, 0, 0, 0);
  t1.setDate(t1.getDate() + 1);
  const [d, m, y] = item.vencimiento.split('/').map(Number);
  const venc = new Date(y, m - 1, d);
  return Math.round((venc.getTime() - t1.getTime()) / 86400000);
}

/**
 * TNA/TEM/TEA de una LECAP/BONCAP a partir de su precio de mercado (o `cotiz_ref`
 * como fallback). Fórmulas exactas del Excel original (hoja LECAPS, columnas G–N):
 *   K   = cotización final capitalizada a la TEM de emisión (tasa_emision, fija)
 *   G   = días al vencimiento desde t+1 (dinámico, se recalcula siempre)
 *   TNA = (K/precio − 1) / G × 365
 *   TEM = (K/precio) ^ (1/(G/30)) − 1
 *   TEA = (K/precio) ^ (365/G) − 1
 */
export function calcLecapRates(item: LecapOrBoncap, precioMkt: number | null | undefined): LecapRates {
  const p = precioMkt && precioMkt > 0 ? precioMkt : item.cotiz_ref;
  if (!p || p <= 0) return { tna: null, tem: null, tea: null, diasVenc: null };

  const K = calcLecapK(item);
  const diasVenc = calcLecapDiasVenc(item);

  if (diasVenc <= 0) return { tna: null, tem: null, tea: null, diasVenc: 0 };

  const ratio = K / p;
  const tna = ((ratio - 1) / diasVenc) * 365;
  const tem = Math.pow(ratio, 1 / (diasVenc / 30)) - 1;
  const tea = Math.pow(ratio, 365 / diasVenc) - 1;
  return { tna, tem, tea, diasVenc };
}

/** "1.234.567" → "1,2M" · "45.000" → "45K" · null/0/negativo → null (mostrar "—"). */
export function fmtVol(v: number | null | undefined): string | null {
  if (v == null || !isFinite(v) || v <= 0) return null;
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(v >= 10_000_000 ? 0 : 1).replace('.', ',') + 'M';
  if (v >= 1_000) return Math.round(v / 1_000).toLocaleString('es-AR') + 'K';
  return Math.round(v).toLocaleString('es-AR');
}

/** "dd/mm/yyyy" → Date (mismo parseVenc del original, para ordenar/comparar vencimientos). */
export function parseVenc(s: string | undefined): number {
  if (!s) return 0;
  const [d, m, y] = s.split('/');
  return new Date(Number(y), Number(m) - 1, Number(d)).getTime();
}

export function daysTo(s: string | undefined): number {
  return s ? Math.round((parseVenc(s) - Date.now()) / 86400000) : 9999;
}
