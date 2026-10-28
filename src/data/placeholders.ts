// Tipos del Navbar, del Hero y de Servicios y destinos de los botones.
// En la rama feature/sanity el Navbar, el Hero y Servicios ya leen sus textos de Sanity: de ellos
// acá quedan solo los tipos y los destinos (ABRI_CUENTA_HREF, APERTURA_CUENTA_URL, BROKER_LOGIN_URL).
// Quiénes somos y Equipo también leen de Sanity (sus tipos viven en sus componentes). Las acciones
// del panel del Hero también: ya no hay precios de ejemplo (mientras cargan, "—").

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

/** Login del broker online. Lo usan "Mi Portafolio" (Navbar) y "Operá online" (Hero). */
export const BROKER_LOGIN_URL = 'https://virtualbroker-brio.aunesa.com/auth/signin';

/** "Abrí tu cuenta" (Navbar, también en el menú del celular, y Hero): la página /abri-tu-cuenta. */
export const ABRI_CUENTA_HREF = '/abri-tu-cuenta';

/** Apertura de cuenta online (botón "Empezar" de /abri-tu-cuenta; abre en otra pestaña). */
export const APERTURA_CUENTA_URL = 'https://app.briovalores.com/registro';

// ── Servicios (sección 6.4) ──────────────────────────────────────────────

export type ServiceIconName = 'growth' | 'pie' | 'layers';

/** Un pilar. El ícono y el destacado van por posición (los pone ServiciosSanity). */
export interface ServicePillar {
  icon: ServiceIconName;
  title: string;
  text: string;
  /** "Financiamiento PyME": el diferencial, se destaca con badge. */
  featured?: boolean;
}

/** Ítem de la lista de instrumentos. Con `href` es un link interno (ruta de react-router) y
 * Servicios le agrega la flecha "→" al final. `key`: clave de React (en Sanity, el `_key`). */
export interface InstrumentItem {
  key: string;
  label: string;
  href?: string;
}

export interface InstrumentGroup {
  key: string;
  category: string;
  items: InstrumentItem[];
}
