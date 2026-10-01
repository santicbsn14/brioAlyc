import type { Cashflow } from './data/bonds';
import type { OnsRow, SovRow, LecapRow } from '../../hooks/useRentaFija';
import { calcLecapK } from './calc';

// Detalle de flujo de fondos por ticker (drawer lateral del panel), portado TAL CUAL
// desde la herramienta vieja de Brio (herramientaRentaFija.html — openCFDrawer y
// calcFlows). Mismo criterio de selección de flujos (solo fecha >= hoy), mismo flujo
// sintético de pago único para LECAP/BONCAP (cf = K, amort = 100) y misma escala
// (USD con precio → nominales = monto / precio × 100; Nominales → monto directo;
// sin monto válido → valores "por cada 100 nominales").
//
// Única diferencia: el original buscaba el ticker en los arrays de datos y volvía a
// llamar a getCalc/getSovCalc; acá se reciben las filas que ya calculó
// useRentaFija (mismos TIR/Duration/TNA/TEM/TEA que muestra la tabla), sin recalcular.

export type CFCurrency = 'USD' | 'NOM';

export interface CFInfo {
  ticker: string;
  /** 'LECAP' | 'BONCAP' para capitalizables (pago único), null para ONs/soberanos. */
  tipoCap: 'LECAP' | 'BONCAP' | null;
  vencimiento: string;
  precio: number | null;
  /** ONs/soberanos */
  tir: number | null;
  duration: number | null;
  /** LECAP/BONCAP */
  tna: number | null;
  tem: number | null;
  tea: number | null;
  flows: Cashflow[];
}

/** Hoy en ISO (UTC), igual que `new Date().toISOString().slice(0,10)` del original. */
function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Arma la info del drawer para un ticker, o null si no hay que abrirlo (ticker
 * desconocido, LECAP/BONCAP ya vencida, o bono sin flujos futuros) — mismos
 * `return` silenciosos que openCFDrawer.
 */
export function buildCFInfo(
  ticker: string,
  onsRows: OnsRow[],
  sovRows: SovRow[],
  lecapRows: LecapRow[],
): CFInfo | null {
  // ── LECAP / BONCAP: pago único al vencimiento ──
  const cap = lecapRows.find((l) => l.ticker === ticker);
  if (cap) {
    const [d, m, y] = cap.vencimiento.split('/');
    const fechaISO = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    if (fechaISO < todayISO()) return null;
    const K = calcLecapK(cap);
    return {
      ticker,
      tipoCap: cap.tipo,
      vencimiento: cap.vencimiento,
      precio: cap.precio,
      tir: null,
      duration: null,
      tna: cap.tna,
      tem: cap.tem,
      tea: cap.tea,
      flows: [{ fecha: fechaISO, cf: K, amort: 100 }],
    };
  }

  // ── ON / soberano ──
  const bond = onsRows.find((b) => b.ticker === ticker) ?? sovRows.find((b) => b.ticker === ticker);
  if (!bond) return null;
  const today = todayISO();
  const flows = (bond.cashflows || []).filter((f) => f.fecha >= today);
  if (!flows.length) return null;
  return {
    ticker,
    tipoCap: null,
    vencimiento: bond.vencimiento,
    precio: bond.precio,
    tir: bond.tir,
    duration: bond.duration,
    tna: null,
    tem: null,
    tea: null,
    flows,
  };
}

export interface CFRow {
  fecha: string;
  cupon: number;
  amort: number;
  cf: number;
  /** Peso de este pago sobre el total (0–100), null si el total es 0. */
  pct: number | null;
}

export interface CFView {
  /** Factor de escala: cantidad nominal. null = valores "por cada 100 nominales". */
  scale: number | null;
  totalCF: number;
  totalCupon: number;
  totalAmort: number;
  rows: CFRow[];
}

/** calcFlows del original: totales y filas, escalados según moneda + monto tipeado. */
export function calcCFView(info: CFInfo, currency: CFCurrency, rawAmountInput: string): CFView {
  const rawAmount = parseFloat((rawAmountInput || '').replace(',', '.'));
  let scale: number | null = null;
  if (!isNaN(rawAmount) && rawAmount > 0) {
    if (currency === 'USD' && info.precio != null) {
      scale = (rawAmount / info.precio) * 100;
    } else if (currency === 'NOM') {
      scale = rawAmount;
    }
  }
  const k = scale !== null ? scale / 100 : 1;

  let totalCF = 0;
  let totalAmort = 0;
  let totalCupon = 0;
  info.flows.forEach((f) => {
    const cf = f.cf || 0;
    const amort = f.amort || 0;
    totalCF += cf;
    totalAmort += amort;
    totalCupon += cf - amort;
  });

  const rows: CFRow[] = info.flows.map((f) => {
    const cf = f.cf || 0;
    const amort = f.amort || 0;
    return {
      fecha: f.fecha,
      cupon: (cf - amort) * k,
      amort: amort * k,
      cf: cf * k,
      pct: totalCF > 0 ? (cf / totalCF) * 100 : null,
    };
  });

  return { scale, totalCF: totalCF * k, totalCupon: totalCupon * k, totalAmort: totalAmort * k, rows };
}
