// Lista maestra de acciones de BYMA: ticker + nombre de la empresa. Armada a partir de lo
// que devolvía data912 /live/arg_stocks el 2026-10-28 (93 especies), ordenada por ticker.
//
// ARCHIVO SIN DEPENDENCIAS (ni React ni imports del proyecto) a propósito: se copia tal
// cual a brio-studio, donde ACCIONES_BYMA es la lista fija de la que Brio elige las 8
// líderes. Si se cambia acá, se cambia también allá.
//
// - ACCIONES_BYMA: especies en pesos, una por acción. Es la lista para elegir líderes.
// - ACCIONES_BYMA_USD: las mismas acciones cotizando en dólares (sufijo D / .D). El Panel
//   de Cotizaciones las usa solo para mostrarles nombre; no se ofrecen como líderes.
// - Solo hay nombre donde se sabe con certeza qué empresa es. Las especies en pesos sin
//   nombre confirmado (ECOG, EDSH, GAMI, HSAT, IEB, RAGH, REIT) están con nombre vacío:
//   se pueden elegir como líderes y se ven con el ticker solo. Sus versiones en dólares
//   no están en la lista y el Panel también las muestra con el ticker solo. Ver
//   PROGRESO.md, pendiente de confirmar.

export interface AccionBYMA {
  /** Ticker tal cual lo devuelve data912. */
  ticker: string;
  /** Nombre de la empresa. */
  nombre: string;
}

export const ACCIONES_BYMA: AccionBYMA[] = [
  { ticker: 'A3', nombre: 'A3 Mercados' },
  { ticker: 'AGRO', nombre: 'Agrometal' },
  { ticker: 'ALUA', nombre: 'Aluar' },
  { ticker: 'AUSO', nombre: 'Autopistas del Sol' },
  { ticker: 'BBAR', nombre: 'BBVA Argentina' },
  { ticker: 'BHIP', nombre: 'Banco Hipotecario' },
  { ticker: 'BMA', nombre: 'Banco Macro' },
  { ticker: 'BOLT', nombre: 'Boldt' },
  { ticker: 'BPAT', nombre: 'Banco Patagonia' },
  { ticker: 'BYMA', nombre: 'Bolsas y Mercados Argentinos' },
  { ticker: 'CADO', nombre: 'Carlos Casado' },
  { ticker: 'CAPX', nombre: 'Capex' },
  { ticker: 'CARC', nombre: 'Carboclor' },
  { ticker: 'CECO2', nombre: 'Central Costanera' },
  { ticker: 'CELU', nombre: 'Celulosa Argentina' },
  { ticker: 'CEPU', nombre: 'Central Puerto' },
  { ticker: 'CGPA2', nombre: 'Camuzzi Gas Pampeana' },
  { ticker: 'COME', nombre: 'Sociedad Comercial del Plata' },
  { ticker: 'CRES', nombre: 'Cresud' },
  { ticker: 'CTIO', nombre: 'Consultatio' },
  { ticker: 'CVH', nombre: 'Cablevisión Holding' },
  { ticker: 'DGCU2', nombre: 'Distribuidora de Gas Cuyana' },
  { ticker: 'DOME', nombre: 'Domec' },
  { ticker: 'ECOG', nombre: '' },
  { ticker: 'EDN', nombre: 'Edenor' },
  { ticker: 'EDSH', nombre: '' },
  { ticker: 'FERR', nombre: 'Ferrum' },
  { ticker: 'FIPL', nombre: 'Fiplasto' },
  { ticker: 'GAMI', nombre: '' },
  { ticker: 'GARO', nombre: 'Garovaglio y Zorraquín' },
  { ticker: 'GBAN', nombre: 'Naturgy BAN' },
  { ticker: 'GCDI', nombre: 'GCDI' },
  { ticker: 'GCLA', nombre: 'Grupo Clarín' },
  { ticker: 'GGAL', nombre: 'Grupo Financiero Galicia' },
  { ticker: 'GRIM', nombre: 'Grimoldi' },
  { ticker: 'HARG', nombre: 'Holcim Argentina' },
  { ticker: 'HAVA', nombre: 'Havanna Holding' },
  { ticker: 'HSAT', nombre: '' },
  { ticker: 'IEB', nombre: '' },
  { ticker: 'INTR', nombre: 'Compañía Introductora de Buenos Aires' },
  { ticker: 'INVJ', nombre: 'Inversora Juramento' },
  { ticker: 'IRSA', nombre: 'IRSA' },
  { ticker: 'LEDE', nombre: 'Ledesma' },
  { ticker: 'LOMA', nombre: 'Loma Negra' },
  { ticker: 'LONG', nombre: 'Longvie' },
  { ticker: 'METR', nombre: 'Metrogas' },
  { ticker: 'MIRG', nombre: 'Mirgor' },
  { ticker: 'MOLA', nombre: 'Molinos Agro' },
  { ticker: 'MOLI', nombre: 'Molinos Río de la Plata' },
  { ticker: 'MORI', nombre: 'Morixe Hermanos' },
  { ticker: 'OEST', nombre: 'Grupo Concesionario del Oeste' },
  { ticker: 'PAMP', nombre: 'Pampa Energía' },
  { ticker: 'PATA', nombre: 'Importadora y Exportadora de la Patagonia' },
  { ticker: 'RAGH', nombre: '' },
  { ticker: 'REIT', nombre: '' },
  { ticker: 'RICH', nombre: 'Laboratorios Richmond' },
  { ticker: 'RIGO', nombre: 'Rigolleau' },
  { ticker: 'ROSE', nombre: 'Instituto Rosenbusch' },
  { ticker: 'SAMI', nombre: 'San Miguel' },
  { ticker: 'SEMI', nombre: 'Molinos Juan Semino' },
  { ticker: 'SUPV', nombre: 'Grupo Supervielle' },
  { ticker: 'TECO2', nombre: 'Telecom Argentina' },
  { ticker: 'TGNO4', nombre: 'Transportadora de Gas del Norte' },
  { ticker: 'TGSU2', nombre: 'Transportadora de Gas del Sur' },
  { ticker: 'TRAN', nombre: 'Transener' },
  { ticker: 'TXAR', nombre: 'Ternium Argentina' },
  { ticker: 'VALO', nombre: 'Grupo Financiero Valores' },
  { ticker: 'YPFD', nombre: 'YPF' },
];

export const ACCIONES_BYMA_USD: AccionBYMA[] = [
  { ticker: 'ALUAD', nombre: 'Aluar (en dólares)' },
  { ticker: 'BBARD', nombre: 'BBVA Argentina (en dólares)' },
  { ticker: 'BMA.D', nombre: 'Banco Macro (en dólares)' },
  { ticker: 'BYMAD', nombre: 'Bolsas y Mercados Argentinos (en dólares)' },
  { ticker: 'CEPUD', nombre: 'Central Puerto (en dólares)' },
  { ticker: 'COMED', nombre: 'Sociedad Comercial del Plata (en dólares)' },
  { ticker: 'CRESD', nombre: 'Cresud (en dólares)' },
  { ticker: 'CVHD', nombre: 'Cablevisión Holding (en dólares)' },
  { ticker: 'EDND', nombre: 'Edenor (en dólares)' },
  { ticker: 'GGALD', nombre: 'Grupo Financiero Galicia (en dólares)' },
  { ticker: 'IRSAD', nombre: 'IRSA (en dólares)' },
  { ticker: 'LOMAD', nombre: 'Loma Negra (en dólares)' },
  { ticker: 'METRD', nombre: 'Metrogas (en dólares)' },
  { ticker: 'PAMPD', nombre: 'Pampa Energía (en dólares)' },
  { ticker: 'SUPVD', nombre: 'Grupo Supervielle (en dólares)' },
  { ticker: 'TECOD', nombre: 'Telecom Argentina (en dólares)' },
  { ticker: 'TGN4D', nombre: 'Transportadora de Gas del Norte (en dólares)' },
  { ticker: 'TGSUD', nombre: 'Transportadora de Gas del Sur (en dólares)' },
  { ticker: 'TRAND', nombre: 'Transener (en dólares)' },
  { ticker: 'TXARD', nombre: 'Ternium Argentina (en dólares)' },
  { ticker: 'VALOD', nombre: 'Grupo Financiero Valores (en dólares)' },
  { ticker: 'YPFDD', nombre: 'YPF (en dólares)' },
];
