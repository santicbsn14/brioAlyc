import Footer, { type FooterLink, type FooterProps, type FooterRed } from './Footer';
import FaltaCargar from '../FaltaCargar/FaltaCargar';
import { useSanityQuery } from '../../sanity/useSanityQuery';
import { FOOTER_QUERY } from '../../sanity/queries';
import { hrefEmail, hrefTelefono } from '../../sanity/links';
import type { DatosEmpresaFooter, Direccion, FooterDoc, FooterQueryResult } from '../../sanity/types';

/** Texto alternativo del logo y aria-labels de las redes: no son texto visible, quedan en código. */
const LOGO_ALT = 'Brio Valores';

/** Orden e ícono de las redes en código; el link sale de Datos de la empresa. */
const REDES: { id: FooterRed['id']; label: string }[] = [
  { id: 'youtube', label: 'YouTube' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'x', label: 'X' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'linkedin', label: 'LinkedIn' },
];

function linkTelefono(telefono?: string | null): FooterLink | null {
  if (!telefono?.trim()) return null;
  return { texto: telefono, href: hrefTelefono(telefono) };
}

function linkEmail(email?: string | null): FooterLink | null {
  if (!email?.trim()) return null;
  return { texto: email, href: hrefEmail(email) };
}

/** Dirección en 3 líneas, como hoy: "Córdoba 1464 Piso 4," / "Rosario, CP 2000," / "Santa Fe, Argentina".
 * Las comas y el "CP" los pone el front; una parte vacía se saltea. */
function lineasDireccion(d?: Direccion | null): string[] {
  if (!d) return [];
  const lineas = [
    d.calle,
    [d.ciudad, d.codigoPostal && `CP ${d.codigoPostal}`].filter(Boolean).join(', '),
    [d.provincia, d.pais].filter(Boolean).join(', '),
  ].filter((l): l is string => Boolean(l?.trim()));
  return lineas.map((l, i) => (i < lineas.length - 1 ? `${l},` : l));
}

/** "Agente BYMA 210 · Agente MAV 429 · …". Sin prefijo cargado, "BYMA 210 · MAV 429 · …". */
function textoCredenciales(empresa: DatosEmpresaFooter, prefijo?: string | null): string {
  return (empresa.credenciales ?? [])
    .filter((c) => c.entidad?.trim() && c.numero?.trim())
    .map((c) => [prefijo?.trim(), c.entidad, c.numero].filter(Boolean).join(' '))
    .join(' · ');
}

function armarFooter(footer: FooterDoc, empresa: DatosEmpresaFooter): FooterProps {
  return {
    logoAlt: LOGO_ALT,
    contacto: {
      titulo: footer.tituloContacto ?? '',
      telefono: linkTelefono(empresa.telefono),
      email: linkEmail(empresa.email),
    },
    direccion: { titulo: footer.tituloDireccion ?? '', lineas: lineasDireccion(empresa.direccion) },
    redes: {
      titulo: footer.tituloRedes ?? '',
      // Una red sin link no se muestra.
      links: REDES.flatMap((r) => {
        const href = empresa[r.id]?.trim();
        return href ? [{ ...r, href }] : [];
      }),
    },
    // Un renglón por línea, como se carga en el Studio.
    razonSocial: (empresa.razonSocial ?? '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean),
    registro: empresa.leyendaCnv ?? '',
    credenciales: textoCredenciales(empresa, footer.prefijoCredencial),
    // Destinos en código: cada link legal tiene su página y su ruta en App.tsx.
    legalLinks: [
      { id: 'conducta', texto: footer.textoLinkConducta ?? '', href: '/codigo-de-conducta' },
      { id: 'terminos', texto: footer.textoLinkTerminos ?? '', href: '/terminos-y-condiciones' },
    ].filter((l) => l.texto.trim()),
    textoCopyright: footer.textoCopyright ?? '',
  };
}

/** Footer con los documentos "footer" y "datosEmpresa" de Sanity, en una sola query.
 * Montado en App.tsx, fuera de <Routes>: la query no se repite al navegar (además está en caché).
 *  - cargando o error de red → nada (está al pie: que aparezca tarde no mueve la página);
 *  - algún documento sin publicar → un recuadro FaltaCargar por cada uno (en producción, nada). */
export default function FooterSanity() {
  const { data, status } = useSanityQuery<FooterQueryResult>(FOOTER_QUERY);

  if (status !== 'listo') return null;

  const footer = data?.footer;
  const empresa = data?.empresa;
  if (!footer || !empresa) {
    return (
      <>
        {!footer && <FaltaCargar nombre="Footer" ubicacion="General → Footer" />}
        {!empresa && <FaltaCargar nombre="Datos de la empresa" ubicacion="General → Datos de la empresa" />}
      </>
    );
  }

  return <Footer {...armarFooter(footer, empresa)} />;
}
