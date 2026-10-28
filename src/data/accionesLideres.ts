// Acciones líderes que muestra el panel del Hero (y la vista por defecto del Panel de
// Cotizaciones), en este orden. Dato ESTÁTICO, hoy editable solo por el desarrollador —
// mismo criterio que LECAPS_DATA de Renta Fija. Próximo paso: que Brio elija las 8 desde
// Sanity, de la lista fija de accionesBYMA.ts. Los nombres salen de esa lista. Los precios
// NO van acá: salen de data912 (arg_stocks) vía /api/mercado/arg-stocks; el fallback con
// precios de ejemplo está en placeholders.ts (stocksInitial).

import { ACCIONES_BYMA, type AccionBYMA } from './accionesBYMA';

export type AccionLider = AccionBYMA;

const TICKERS_LIDERES = ['GGAL', 'YPFD', 'PAMP', 'ALUA', 'BMA', 'CEPU', 'TGSU2', 'BBAR'];

export const ACCIONES_LIDERES: AccionLider[] = TICKERS_LIDERES.map((ticker) => ({
  ticker,
  nombre: ACCIONES_BYMA.find((a) => a.ticker === ticker)?.nombre ?? '',
}));
