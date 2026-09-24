// ═══════════════════════════════════════════════════════════════════
// DATOS ESTÁTICOS — LECAPs y BONCAPs.
//
// Portados TAL CUAL desde la herramienta vieja (herramientaRentaFija.html,
// arrays LECAPS_DATA y BONCAPS_DATA). tasa_emision y dias_tot son los parámetros
// fijos de la licitación (TEM de emisión y DAYS360 emisión→vencimiento) — se
// usan en calcLecapRates para recalcular TNA/TEM/TEA dinámicamente contra el
// precio de mercado del día.
//
// Hoy son estáticos y solo los puede editar el desarrollador (hay que tocar este
// archivo y hacer un deploy para dar de alta una LECAP/BONCAP nueva). Candidato
// a Fase 2: modelarlos en Sanity para que Brio pueda cargar una letra nueva sin
// pedir un deploy. No se implementa Sanity ahora, solo queda la nota.
// ═══════════════════════════════════════════════════════════════════

export interface LecapOrBoncap {
  ticker: string;
  vencimiento: string;
  tasa_emision: number;
  dias_tot: number;
  /** Precio de referencia (fallback sin API) — no está seteado en los datos actuales. */
  cotiz_ref?: number;
}

export const LECAPS_DATA: LecapOrBoncap[] = [
  {
    "ticker": "S15S6",
    "vencimiento": "15/09/2026",
    "tasa_emision": 0.0199,
    "dias_tot": 106
  },
  {
    "ticker": "S30S6",
    "vencimiento": "30/09/2026",
    "tasa_emision": 0.0253,
    "dias_tot": 194
  },
  {
    "ticker": "S16O6",
    "vencimiento": "16/10/2026",
    "tasa_emision": 0.0205,
    "dias_tot": 76
  },
  {
    "ticker": "S30O6",
    "vencimiento": "30/10/2026",
    "tasa_emision": 0.0255,
    "dias_tot": 360
  },
  {
    "ticker": "S13N6",
    "vencimiento": "13/11/2026",
    "tasa_emision": 0.021,
    "dias_tot": 133
  },
  {
    "ticker": "S30N6",
    "vencimiento": "30/11/2026",
    "tasa_emision": 0.023,
    "dias_tot": 345
  },
  {
    "ticker": "S29E7",
    "vencimiento": "29/01/2027",
    "tasa_emision": 0.0225,
    "dias_tot": 149
  }
];

export const BONCAPS_DATA: LecapOrBoncap[] = [
  {
    "ticker": "T15E7",
    "vencimiento": "15/01/2027",
    "tasa_emision": 0.0205,
    "dias_tot": 705
  },
  {
    "ticker": "T30A7",
    "vencimiento": "30/04/2027",
    "tasa_emision": 0.0255,
    "dias_tot": 540
  },
  {
    "ticker": "T31Y7",
    "vencimiento": "31/05/2027",
    "tasa_emision": 0.024,
    "dias_tot": 526
  },
  {
    "ticker": "T30J7",
    "vencimiento": "30/06/2027",
    "tasa_emision": 0.0258,
    "dias_tot": 524
  }
];
