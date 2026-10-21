// Contenido placeholder de Servicios y Quiénes somos, tipos del Navbar y del Hero, destinos de
// los botones y precios de ejemplo del panel del Hero.
// En la rama feature/sanity el Navbar y el Hero ya leen sus textos de Sanity: de ellos acá
// quedan solo los destinos (ABRI_CUENTA_HREF, BROKER_LOGIN_URL) y los precios de ejemplo.
// Servicios y Quiénes somos siguen leyendo de acá hasta que se conecten.

import { ACCIONES_LIDERES } from './accionesLideres';

export type NavItemKind = 'internal' | 'external' | 'disabled';

export interface NavDropdownItem {
  kind: NavItemKind;
  label: string;
  /** Ruta interna (react-router) o URL externa. Ausente cuando kind es 'disabled'. */
  href?: string;
}

export interface NavLinkItem {
  label: string;
  /** Ancla/link directo. Ausente cuando el ítem es un disparador de dropdown. */
  href?: string;
  dropdownItems?: NavDropdownItem[];
}

export interface CtaAction {
  label: string;
  /** Ruta interna (react-router) o URL externa (empieza con http; abre en pestaña nueva). */
  href: string;
  variant: 'primary' | 'ghost';
}

export interface Credential {
  /** Clave única de React (en Sanity, el `_key` de la credencial). */
  key: string;
  label: string;
  number: string;
}

export interface StockRow {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
}

/** Login del broker online. Lo usan "Mi Portafolio" (Navbar) y "Operá online" (Hero). */
export const BROKER_LOGIN_URL = 'https://virtualbroker-brio.aunesa.com/auth/signin';

/** "Abrí tu cuenta" (Navbar y Hero): Contacto de la home con el motivo "cuenta" preseleccionado,
 * mismo mecanismo que el CTA de Financiamiento PyME (el id sale de `data/contacto.ts`).
 * TODO(Agus): si Brio tiene link de apertura de cuenta online, apuntar ahí. */
export const ABRI_CUENTA_HREF = '/?motivo=cuenta#contacto';

// FALLBACK del panel de acciones del Hero: precios de EJEMPLO (no reales) que se ven
// en el primer render, antes de que resuelva /api/mercado/arg-stocks, y si ese fetch
// falla — el Hero nunca queda vacío. Los tickers/nombres salen de ACCIONES_LIDERES
// (mismas filas, mismo orden que con datos reales → sin salto de layout). Los precios
// están en un orden de magnitud parecido al real (oct. 2026) para que el cambio a los
// datos reales no sea brusco; no hace falta mantenerlos al día.
const precioEjemplo: Record<string, { price: number; changePct: number }> = {
  GGAL: { price: 6100, changePct: 1.8 },
  YPFD: { price: 8200, changePct: 0.9 },
  PAMP: { price: 5100, changePct: -0.6 },
  ALUA: { price: 830, changePct: -0.4 },
  BMA: { price: 11000, changePct: 2.3 },
  CEPU: { price: 1980, changePct: 1.1 },
  TGSU2: { price: 8550, changePct: -0.8 },
  BBAR: { price: 7100, changePct: 1.4 },
};

export const stocksInitial: StockRow[] = ACCIONES_LIDERES.map((a) => ({
  symbol: a.ticker,
  name: a.nombre,
  ...(precioEjemplo[a.ticker] ?? { price: 1000, changePct: 0 }),
}));

// ── Servicios (sección 6.4) ──────────────────────────────────────────────

export type ServiceIconName = 'growth' | 'pie' | 'layers';

export interface ServicePillar {
  icon: ServiceIconName;
  title: string;
  text: string;
  /** "Financiamiento PyME": el diferencial, se destaca con badge. */
  featured?: boolean;
}

/** Ítem de la lista de instrumentos: texto plano, o `{ label, href }` cuando
 * tiene que ser un link interno (ruta de react-router). */
export type InstrumentItem = string | { label: string; href: string };

export interface InstrumentGroup {
  category: string;
  items: InstrumentItem[];
}

export const serviciosContent = {
  kicker: 'Servicios',
  title: 'Qué hacemos por vos y tu empresa',
  lead:
    'Financiamiento, asesoramiento y estructuración en el mercado de capitales, con la solidez de un agente registrado en CNV.',
  instrumentsTitle: 'Instrumentos que operamos',
  feesTitle: 'Comisiones',
  feesLead: 'Aranceles vigentes por plaza y tipo de operación, actualizados a enero 2026.',
  feesCtaLabel: 'Ver comisiones completas →',
};

export const servicePillars: ServicePillar[] = [
  {
    icon: 'growth',
    title: 'Financiamiento PyME',
    text: 'Negociá los cheques de pago diferido de tu PyME en el mercado, propios y de terceros. Con el aval de una SGR accedés a tasas similares a las de una gran empresa, y te acompañamos en todo el armado de la documentación.',
    featured: true,
  },
  {
    icon: 'pie',
    title: 'Asesoramiento e inversiones',
    text: 'Facilitamos a instituciones, empresas y personas el acceso a inversiones en el mercado de capitales, con el respaldo de nuestra trayectoria y conocimiento profesional.',
  },
  {
    icon: 'layers',
    title: 'Estructuración y colocación',
    text: 'Asesoramos en las distintas alternativas de financiación en el mercado de capitales: estructuración y colocación de fideicomisos financieros y obligaciones negociables.',
  },
];

// TODO(Agus): confirmar el listado fino de instrumentos que operan hoy.
// No incluir LEBAC: no existen desde 2018 (ver doc de contexto, 6.4).
export const instrumentGroups: InstrumentGroup[] = [
  {
    category: 'Financiamiento',
    items: ['Cheques de Pago Diferido', 'Obligaciones Negociables', 'Fideicomisos Financieros'],
  },
  {
    category: 'Renta fija',
    items: ['Títulos públicos y soberanos', 'Obligaciones Negociables', 'LECAPs / letras'],
  },
  {
    category: 'Renta variable',
    items: [
      'Acciones (BYMA líderes)',
      { label: 'Panel de cotizaciones en vivo →', href: '/herramientas/acciones' },
    ],
  },
];

// ── Quiénes somos (sección 6.2) ──────────────────────────────────────────

export type QuienesValueIcon = 'target' | 'clock' | 'compass' | 'shield';

export interface QuienesValue {
  icon: QuienesValueIcon;
  title: string;
  text: string;
}

// TODO(Agus): relato = copy base del sitio actual, provisorio hasta que confirme el texto definitivo.
export const quienesContent = {
  kicker: 'Quiénes somos',
  title: 'Un agente de bolsa con mirada de largo plazo',
  paragraphs: [
    'Brio Valores es un Agente de Liquidación y Compensación registrado en la CNV, con base en Rosario y presencia en todo el país. Acompañamos a empresas e inversores en el mercado de capitales argentino.',
    'Combinamos experiencia, especialización y un trato cercano para que cada cliente —desde una PyME que busca financiarse hasta un inversor que arma su cartera— tenga asesoramiento profesional y honesto.',
  ],
  photoAlt: 'Oficinas de Brio Valores en Rosario',
};

// TODO: contenido definitivo de valores viene de Sanity.
export const quienesValues: QuienesValue[] = [
  { icon: 'target', title: 'ESPECIALISTAS', text: 'Foco en el mercado de capitales argentino y sus instrumentos.' },
  { icon: 'clock', title: 'EXPERIENCIA', text: 'Años operando y acompañando a empresas e inversores.' },
  { icon: 'compass', title: 'ASESORAMIENTO', text: 'Estrategias a medida según el perfil de cada cliente.' },
  { icon: 'shield', title: 'HONESTIDAD', text: 'Transparencia en cada operación y recomendación.' },
];
