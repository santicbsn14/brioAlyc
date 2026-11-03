/**
 * Título, descripción y si se indexa, por ruta. Quedan en código a propósito (no van a Sanity):
 * si Brio pide un cambio, lo hace el desarrollador.
 *
 * - Título: "<Página> | Brio Valores" (la home tiene el suyo), hasta ~60 caracteres.
 * - Descripción: 120 a 155 caracteres, sacada del contenido real de cada página.
 * - Los valores de la home son también los que trae index.html de fábrica (los ven WhatsApp,
 *   LinkedIn y Facebook, que no ejecutan JS): si se cambian acá, cambiarlos también allá.
 * - Si se suma una página indexable, sumarla también a public/sitemap.xml.
 */

/** Dominio final, sin barra al final. Base del canonical y de og:url. */
export const SITIO = 'https://briovalores.com';

export interface Pagina {
  titulo: string;
  descripcion: string;
  /** false → meta robots "noindex" mientras se ve la página. */
  indexar: boolean;
}

export const PAGINAS: Record<string, Pagina> = {
  '/': {
    titulo: 'Brio Valores | Agente de Liquidación y Compensación en Rosario',
    descripcion:
      'Agente de Liquidación y Compensación en Rosario, CNV Mat. 512. Financiamiento PyME, asesoramiento e inversiones en BYMA con acompañamiento real.',
    indexar: true,
  },
  '/servicios/financiamiento-pyme': {
    titulo: 'Financiamiento PyME | Brio Valores',
    descripcion:
      'Negociá tus Cheques de Pago Diferido en MAV y BYMA. Con el aval de una SGR, tu PyME accede a financiamiento a tasas competitivas, transparente y seguro.',
    indexar: true,
  },
  '/servicios/productos': {
    titulo: 'Productos | Brio Valores',
    descripcion:
      'Acciones, CEDEARs, bonos, ONs, LECAPs, cheques y cauciones: elegí los instrumentos para invertir o financiar tu empresa según tu perfil.',
    indexar: true,
  },
  '/abri-tu-cuenta': {
    titulo: 'Abrí tu cuenta | Brio Valores',
    descripcion:
      'Abrí tu cuenta en Brio Valores: la apertura es online y gratuita, y te acompañamos en cada paso. Resolvé tus dudas en las preguntas frecuentes.',
    indexar: true,
  },
  '/comisiones': {
    titulo: 'Comisiones | Brio Valores',
    descripcion:
      'Aranceles y comisiones vigentes de Brio Valores, por plazo y tipo de operación, con sus notas de prorrateo. Consultá las tablas completas antes de operar.',
    indexar: true,
  },
  '/informes': {
    titulo: 'Informes | Brio Valores',
    descripcion:
      'Informes y reportes del equipo de Brio Valores para seguir de cerca el contexto macro y de mercado. Descargalos en PDF, filtrados por categoría.',
    indexar: true,
  },
  '/herramientas/acciones': {
    titulo: 'Panel de Cotizaciones | Brio Valores',
    descripcion:
      'Cotizaciones de las acciones líderes de BYMA y buscador de todas las especies: compra, venta, último precio, variación y volumen, al día.',
    indexar: true,
  },
  '/herramientas/renta-fija': {
    titulo: 'Panel de Renta Fija | Brio Valores',
    descripcion:
      'Precios, TIR y duration de ONs, deuda soberana, LECAPs y BONCAPs, con calendario de pagos, flujo de fondos por título y armado de tu propia cartera.',
    indexar: true,
  },
  '/codigo-de-conducta': {
    titulo: 'Código de conducta | Brio Valores',
    descripcion:
      'Código de conducta de Brio Valores ALyC según las Normas CNV: el marco que unifica criterios de conducta y transparencia con el público inversor.',
    indexar: true,
  },
  '/terminos-y-condiciones': {
    titulo: 'Términos y condiciones | Brio Valores',
    descripcion:
      'Términos y condiciones de uso del sitio web de Brio Valores Agente de Liquidación y Compensación S.A., Agente CNV Mat. 512, Rosario, Santa Fe.',
    indexar: true,
  },
};

/** Cualquier ruta que no está arriba (la página 404). */
export const PAGINA_NO_ENCONTRADA: Pagina = {
  titulo: 'Página no encontrada | Brio Valores',
  descripcion: PAGINAS['/'].descripcion,
  indexar: false,
};

/** "/comisiones/" → "/comisiones"; la home queda "/". */
export function normalizarRuta(pathname: string): string {
  const sinBarra = pathname.replace(/\/+$/, '');
  return sinBarra === '' ? '/' : sinBarra;
}

export function paginaDe(pathname: string): Pagina {
  return PAGINAS[normalizarRuta(pathname)] ?? PAGINA_NO_ENCONTRADA;
}

/**
 * ¿La URL trae algún parámetro que no es del sitio? Los del sitio son `motivo` (Contacto) y los de
 * campañas (`utm_*`, `gclid`, `fbclid`). Cualquier otro (ej. "?x=37282471021860", "?p=1021") viene
 * del WordPress viejo o del spam del hackeo: Vercel sirve la home igual (no se puede dar 410 en
 * "/" con parámetros), así que la home pide "noindex" para que Google no la guarde con esa URL.
 */
export function tieneParametrosAjenos(search: string): boolean {
  for (const clave of new URLSearchParams(search).keys()) {
    if (clave === 'motivo' || clave === 'gclid' || clave === 'fbclid' || clave.startsWith('utm_')) continue;
    return true;
  }
  return false;
}

/** Canonical / og:url: dominio + ruta, sin query, sin hash y sin barra final (home: "SITIO/"). */
export function urlCanonica(pathname: string): string {
  const ruta = normalizarRuta(pathname);
  return ruta === '/' ? `${SITIO}/` : `${SITIO}${ruta}`;
}
