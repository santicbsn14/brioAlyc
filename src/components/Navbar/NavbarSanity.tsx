import Navbar from './Navbar';
import FaltaCargar from '../FaltaCargar/FaltaCargar';
import { useSanityQuery } from '../../sanity/useSanityQuery';
import { NAVBAR_QUERY } from '../../sanity/queries';
import type { NavbarDoc, NavbarQueryResult } from '../../sanity/types';
import { hayTexto } from '../../sanity/limpiar';
import { ABRI_CUENTA_HREF, BROKER_LOGIN_URL, type NavDropdownItem, type NavLinkItem } from '../../data/placeholders';

/** Texto alternativo del logo: no es texto visible, queda en código. */
const LOGO_ALT = 'Brio Valores';

/** Un ítem con el texto tal como llega de Sanity (puede faltar). */
type ConTextoSanity<T> = Omit<T, 'label'> & { label?: string | null };

/** Saca los ítems sin texto (no debería pasar: en el Studio son obligatorios). */
function conTexto<T>(items: ConTextoSanity<T>[]): T[] {
  return items.filter((i) => hayTexto(i.label)) as T[];
}

/** Arma los links del Navbar. De Sanity viene solo el texto; destinos, tipo de link (interno o
 * externo, que decide el "↗") y orden quedan en código. Un desplegable sin ítems no se muestra. */
function armarLinks(nav: NavbarDoc): NavLinkItem[] {
  const s = nav.servicios;
  const h = nav.herramientas;

  return conTexto<NavLinkItem>([
    { label: nav.linkQuienesSomos, href: '/#quienes' },
    {
      label: s?.disparador,
      dropdownItems: conTexto<NavDropdownItem>([
        { kind: 'internal', label: s?.financiamientoPyme, href: '/servicios/financiamiento-pyme' },
        { kind: 'internal', label: s?.productos, href: '/servicios/productos' },
      ]),
    },
    {
      label: h?.disparador,
      dropdownItems: conTexto<NavDropdownItem>([
        { kind: 'internal', label: h?.comisiones, href: '/comisiones' },
        { kind: 'internal', label: h?.informes, href: '/informes' },
        { kind: 'external', label: h?.consultaPortafolio, href: 'https://brio-web.aunesa.com/Irmo/' },
        { kind: 'internal', label: h?.panelCotizaciones, href: '/herramientas/acciones' },
        { kind: 'internal', label: h?.rentaFija, href: '/herramientas/renta-fija' },
      ]),
    },
    { label: nav.linkEquipo, href: '/#equipo' },
    { label: nav.linkContacto, href: '/#contacto' },
  ]).filter((link) => !link.dropdownItems || link.dropdownItems.length > 0);
}

/** Navbar con los textos de Sanity (documento único "navbar"). Montado en App.tsx, fuera de
 * <Routes>: se monta una vez y la query no se repite al navegar (además está en caché).
 *  - cargando o error de red → barra con el logo, sin links (mismo alto, la página no salta);
 *  - documento sin publicar → recuadro FaltaCargar (en producción, nada). */
export default function NavbarSanity() {
  const { data: nav, status } = useSanityQuery<NavbarQueryResult>(NAVBAR_QUERY);

  if (status !== 'listo') return <Navbar logoAlt={LOGO_ALT} cargando />;
  if (!nav) return <FaltaCargar nombre="Menú de navegación (Navbar)" ubicacion="General → Menú de navegación (Navbar)" />;

  return (
    <Navbar
      logoAlt={LOGO_ALT}
      links={armarLinks(nav)}
      portfolioLabel={nav.textoPortafolio ?? ''}
      portfolioHref={BROKER_LOGIN_URL}
      ctaLabel={nav.textoBotonCuenta ?? ''}
      ctaHref={ABRI_CUENTA_HREF}
    />
  );
}
