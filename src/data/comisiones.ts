// Datos de la página /comisiones (brief 6.4).
// Fuente de verdad: PDF "Comisiones al 01-01-2026" (ver __ref/). Valores VERBATIM:
// no redondear ni "limpiar" %, "+ IVA", "$", "USD" ni los asteriscos de prorrateo.
// Archivo aparte de placeholders.ts para no inflarlo — misma idea: todo tipado y
// listo para migrar a Sanity sin tocar los componentes.

/** Una tabla de comisiones: columnas variables (no todas las tablas tienen las mismas). */
export interface FeeTable {
  titulo: string;
  columnas: string[];
  /** Cada fila tiene tantas celdas como `columnas`. */
  filas: string[][];
  /** Leyenda de asteriscos / aclaraciones al pie de la tabla (opcional). */
  notas?: string[];
}

export interface ComisionesTab {
  id: string;
  label: string;
  tablas: FeeTable[];
}

export const comisionesHeader = {
  title: 'Comisiones',
  subtitle: 'Vigencia: Enero 2026',
  aclaracion:
    'Los aranceles pueden estar expresados "+ IVA". Los asteriscos (*, **, ***) indican prorrateo — ver notas al pie de cada tabla.',
};

const notasBuenosAires = ['* Prorrateado por 360 días.', '** Prorrateado por 90 días.'];

const notasRosario = [
  '* Prorrateado por 360 días.',
  '** Prorrateado por 90 días.',
  '*** Prorrateado por 365 días.',
];

const notasEeuu = ['*** Prorrateado por 365 días.'];

export const comisionesTabs: ComisionesTab[] = [
  {
    id: 'buenos-aires',
    label: 'Buenos Aires',
    tablas: [
      {
        titulo: 'Plaza Buenos Aires',
        columnas: ['Operatoria', 'Arancel Brio', 'Derecho Mercado', 'Mínima'],
        filas: [
          ['Contado Privados', '1,00% + IVA', '0,08% + IVA', '$300'],
          ['Contado Públicos', '1,00%', '0,01%', '$300'],
          ['Contado Instrumentos BCRA / LETES', '2,00%*', '0,001%', '$0'],
          ['Cauciones Tomadoras en Pesos', '5,00%* + IVA', '0,045%** + IVA', '$300'],
          ['Cauciones Tomadoras en Dólares', '2,00%* + IVA', '0,045%** + IVA', '$300'],
          ['Cauciones Colocadoras en Pesos', '2,50%* + IVA', '0,045%** + IVA', '$0'],
          ['Cauciones Colocadoras en Dólares', '0,20%* + IVA', '0,045%** + IVA', '$0'],
          ['Opciones Privados', '1,00% + IVA', '0,20% + IVA', '$300'],
          ['Opciones Públicos', '1,00%', '0,06%', '$300'],
          ['Licitación Primaria BCRA / LETES', '2,00%*', '0,0125%', '$0'],
          ['Licitación Primaria Privados', '1,00% + IVA', '0,0125%', '$0'],
          ['Licitación LETES', '0,20%*', '0,0125%', '$0'],
          ['Suscripción Caja de Valores', '1,00% + IVA', '0% + IVA', '$300'],
        ],
        notas: notasBuenosAires,
      },
    ],
  },
  {
    id: 'rosario',
    label: 'Rosario',
    tablas: [
      {
        titulo: 'Plaza Rosario',
        columnas: ['Operatoria', 'Arancel Brio', 'Derecho Mercado', 'Mínima'],
        filas: [
          ['Cauciones Tomadoras en Pesos', '5,00%* + IVA', '0,06%** + IVA', '$300'],
          ['Cauciones Tomadoras en Dólares', '2,00%* + IVA', '0,06%** + IVA', '$300'],
          ['Cauciones Colocadoras en Pesos', '2,50%* + IVA', '0,06%** + IVA', '$0'],
          ['Cauciones Colocadoras en Dólares', '0,20%* + IVA', '0,06%** + IVA', '$0'],
          ['Compra Cheque/ECHEQ Segmento Directo', '3,00%*** + IVA', '0,03%** + IVA', '$0'],
          ['Venta Cheque/ECHEQ Segmento Directo', '6,00%*** + IVA', '0,06%** + IVA', '$0'],
          ['Compra FCE Segmento Directo', '3,00%*** + IVA', '0,03%** + IVA', '$0'],
          ['Venta FCE Segmento Directo', '3,00%*** + IVA', '0,06%** + IVA', '$0'],
          ['Compra Pagarés Pesos Segmento Directo', '3,00%*** + IVA', '0,03%** + IVA', '$0'],
          ['Venta Pagarés Pesos Segmento Directo', '3,00%*** + IVA', '0,06%** + IVA', '$0'],
          ['Compra Cheque/ECHEQ Avalados', '2,00%*** + IVA', '0,03%** + IVA', '$0'],
          ['Venta Cheque/ECHEQ Avalados', '2,00%*** + IVA', '0,06%** + IVA', '$0'],
          ['Compra Pagares Dólares Avalados', '1,00%*** + IVA', '0,03%** + IVA', '$0'],
          ['Venta Pagares Dólares Avalados', '1,00%*** + IVA', '0,06%** + IVA', '$0'],
        ],
        notas: notasRosario,
      },
    ],
  },
  {
    id: 'a3-rofex',
    label: 'A3 / Rofex',
    tablas: [
      {
        titulo: 'A3 Mercados (ex Matba – Rofex)',
        columnas: ['Operatoria', 'Arancel Brio', 'Derecho Rofex', 'Derecho Clearing', 'Mínima'],
        filas: [
          ['Futuros de Dólar', '0,40% + IVA', '0,14% (por contrato)', '0,06% (por contrato)', '$0'],
          ['Futuros Financieros', '0,40% + IVA', '0,02% + IVA', '0,004% + IVA', '$0'],
          ['Futuros Agropecuarios', '0,40% + IVA', '0,02% + IVA', '0,004% + IVA', '$0'],
          ['Futuros Commodities', '0,40% + IVA', '0,02% + IVA', '0,004% + IVA', '$0'],
          ['Opciones Fin./Agro./Comm.', '15 USD x Contrato', '0,24% + IVA', '0,06% + IVA', '$0'],
        ],
      },
    ],
  },
  {
    id: 'exterior',
    label: 'Exterior',
    tablas: [
      {
        titulo: 'Plaza EEUU',
        columnas: ['Operatoria', 'Arancel Brio', 'Arancel IBKR', 'Mínima'],
        filas: [
          ['Acciones', '1,00% + IVA', 'Informado por bróker', '$0'],
          ['Bonos', '0,50%', 'Informado por bróker', 'USD 50'],
          ['Treasuries', '0,35%***', 'Informado por bróker', '$0'],
          ['Futuros', '0,40% + IVA', 'Informado por bróker', '$0'],
          ['Derivados', '1,00% + IVA', 'Informado por bróker', '$0'],
        ],
        notas: notasEeuu,
      },
      {
        titulo: 'Dividendos EEUU',
        columnas: ['Operatoria', 'Arancel'],
        filas: [
          ['Dividendo', '1,00% + IVA'],
          ['Comisión IBKR / Retenciones', 'Informado por bróker'],
        ],
      },
    ],
  },
  {
    id: 'custodia-rentas',
    label: 'Custodia y rentas',
    tablas: [
      {
        titulo: 'Custodia de títulos',
        columnas: ['Mantenimiento de cuenta', 'Arancel'],
        filas: [['Mensual', '$3.100 + IVA + Costos Trasladados de Caja de Valores']],
      },
      {
        titulo: 'Rentas en pesos y dólares',
        columnas: ['Rango', 'Arancel'],
        filas: [
          ['Entre 1 y 300', '8,00%'],
          ['Entre 301 y 1000', '5,00%'],
          ['Entre 1001 y 3000', '3,00%'],
          ['Más de 3000', '2,00%'],
          ['Comisión Caja de Valores', 'Según % informado por la entidad'],
        ],
      },
      {
        titulo: 'Dividendos en pesos y dólares',
        columnas: ['Rango', 'Arancel'],
        filas: [
          ['Entre 1 y 1250', '8,00% + IVA'],
          ['Más de 1250', '2,00% + IVA'],
          ['Comisión Caja de Valores', 'Según % informado por la entidad'],
        ],
      },
      {
        titulo: 'Dividendos en acciones',
        columnas: ['Rango', 'Arancel'],
        filas: [
          ['Arancel BRIO', '3,00% + IVA'],
          ['Comisión Caja de Valores', 'Según % informado por la entidad + IVA'],
        ],
      },
    ],
  },
];
