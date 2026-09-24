// Contenido placeholder para maquetar Navbar + Hero.
// Objetivo: todo esto sale de Sanity más adelante sin tocar los componentes
// (ver brief 6.0 "todo sale de Sanity") — por eso nada va hardcodeado en el JSX.

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
  href: string;
  variant: 'primary' | 'ghost';
}

export interface Credential {
  label: string;
  number: string;
}

export interface StockRow {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
}

export const brand = {
  logoAlt: 'Brio Valores',
};

// Los 3 anchors de acá abajo ("Quiénes somos", "Equipo", "Contacto") usan "/#id" (no
// "#id") a propósito: el Navbar los renderiza con <Link> de React Router, así funcionan
// parado en cualquier ruta (navegan a "/" y hacen scroll a la sección vía
// hooks/useScrollToTop.ts) y también como scroll simple estando ya en la home.
export const navLinks: NavLinkItem[] = [
  { label: 'Quiénes somos', href: '/#quienes' },
  {
    label: 'Servicios',
    dropdownItems: [
      { kind: 'internal', label: 'Financiamiento PyME', href: '/servicios/financiamiento-pyme' },
      { kind: 'internal', label: 'Productos', href: '/servicios/productos' },
    ],
  },
  {
    label: 'Herramientas',
    dropdownItems: [
      { kind: 'internal', label: 'Comisiones', href: '/comisiones' },
      { kind: 'internal', label: 'Informes', href: '/informes' },
      { kind: 'external', label: 'Consulta de Portafolio', href: 'https://brio-web.aunesa.com/Irmo/' },
      { kind: 'disabled', label: 'Panel de cotizaciones' },
      { kind: 'internal', label: 'Renta fija', href: '/herramientas/renta-fija' },
    ],
  },
  { label: 'Equipo', href: '/#equipo' },
  { label: 'Contacto', href: '/#contacto' },
];

export const navActions = {
  portfolioLabel: 'Mi Portafolio',
  portfolioHref: 'https://virtualbroker-brio.aunesa.com/auth/signin',
  ctaLabel: 'Abrí tu cuenta',
  ctaHref: '#abri-cuenta',
};

// TODO(Agus): copy definitivo del hero (H1 + bajada).
export const heroContent = {
  kicker: 'Agente registrado en CNV · Mat. 512',
  title: 'Tu acceso profesional al mercado de capitales',
  lead:
    'Financiamiento PyME, asesoramiento e inversiones con la solidez de un agente registrado. Operá en BYMA con acompañamiento real.',
};

export const heroCtas: CtaAction[] = [
  { label: 'Abrí tu cuenta', href: '#abri-cuenta', variant: 'primary' },
  { label: 'Operá online', href: '#opera-online', variant: 'ghost' },
];

export const credentials: Credential[] = [
  { label: 'BYMA', number: '210' },
  { label: 'MAV', number: '429' },
  { label: 'A3', number: '378' },
  { label: 'MAE', number: '072' },
  { label: 'ACDI', number: '108' },
];

export const panelCopy = {
  title: 'Acciones · BYMA líderes',
  tag: 'Referencial',
  footnote: 'Datos referenciales · no en tiempo real',
};

// TODO: mock referencial — se reemplaza por data912 (arg_stocks) vía backend
// con caché en la Fase 4. El % acá deriva del precio de forma independiente;
// se va con la data real (detalle conocido, ver brief).
export const stocksInitial: StockRow[] = [
  { symbol: 'GGAL', name: 'Grupo Galicia', price: 5842.5, changePct: 1.8 },
  { symbol: 'YPFD', name: 'YPF', price: 41200, changePct: 0.9 },
  { symbol: 'BMA', name: 'Banco Macro', price: 9740, changePct: 2.3 },
  { symbol: 'PAMP', name: 'Pampa Energía', price: 3128, changePct: -0.6 },
  { symbol: 'ALUA', name: 'Aluar', price: 1086.5, changePct: -0.4 },
];

// ── Servicios (sección 6.4) ──────────────────────────────────────────────

export type ServiceIconName = 'growth' | 'pie' | 'layers';

export interface ServicePillar {
  icon: ServiceIconName;
  title: string;
  text: string;
  /** "Financiamiento PyME": el diferencial, se destaca con badge. */
  featured?: boolean;
}

export interface InstrumentGroup {
  category: string;
  items: string[];
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
    items: ['Acciones (BYMA líderes)', 'Panel de cotizaciones en vivo →'],
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
