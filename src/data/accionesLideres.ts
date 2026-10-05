// Acciones líderes que muestra el panel del Hero, en este orden. Dato ESTÁTICO, hoy
// editable solo por el desarrollador — mismo criterio que LECAPS_DATA de Renta Fija.
// Candidato a Sanity: a futuro Agus podría elegir desde el CMS qué tickers mostrar (y en
// qué orden) sin tocar código. Los precios NO van acá: salen de data912 (arg_stocks) vía
// /api/mercado/arg-stocks; el fallback con precios de ejemplo está en placeholders.ts
// (stocksInitial).

export interface AccionLider {
  /** Ticker tal cual lo devuelve data912 (BYMA, en pesos). */
  ticker: string;
  /** Nombre amigable que se muestra debajo del ticker. */
  nombre: string;
}

export const ACCIONES_LIDERES: AccionLider[] = [
  { ticker: 'GGAL', nombre: 'Grupo Financiero Galicia' },
  { ticker: 'YPFD', nombre: 'YPF' },
  { ticker: 'PAMP', nombre: 'Pampa Energía' },
  { ticker: 'ALUA', nombre: 'Aluar' },
  { ticker: 'BMA', nombre: 'Banco Macro' },
  { ticker: 'CEPU', nombre: 'Central Puerto' },
  { ticker: 'TGSU2', nombre: 'Transportadora de Gas del Sur' },
  { ticker: 'BBAR', nombre: 'BBVA Argentina' },
];
