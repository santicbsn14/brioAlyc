import Hero, { type HeroTextos } from './Hero';
import FaltaCargar from '../FaltaCargar/FaltaCargar';
import { useSanityQuery } from '../../sanity/useSanityQuery';
import { HERO_QUERY } from '../../sanity/queries';
import type { DatosEmpresaHero, HeroQueryResult, SeccionHeroDoc } from '../../sanity/types';
import { ACCIONES_LIDERES } from '../../data/accionesLideres';
import { ABRI_CUENTA_HREF, BROKER_LOGIN_URL, stocksInitial } from '../../data/placeholders';

/** Todo el panel es un link al Panel de Cotizaciones (mismas 8 acciones, tabla completa).
 * Ruta y nombre para lectores de pantalla en código; de Sanity viene solo el texto del pie. */
const PANEL_HREF = '/herramientas/acciones';
const PANEL_ARIA_LABEL = 'Ver panel de cotizaciones completo';

/** Lo que no viene de Sanity: qué acciones muestra el panel, sus precios de ejemplo y el link. */
const EN_CODIGO = {
  leaders: ACCIONES_LIDERES,
  fallbackStocks: stocksInitial,
  panelHref: PANEL_HREF,
  panelLinkAriaLabel: PANEL_ARIA_LABEL,
};

/** Arma los textos del Hero, como dice la entrada del Hero de PROGRESO-STUDIO.md. El antetítulo es el
 * sello CNV y los sellos son las credenciales de Datos de la empresa (sin "Agente": es del Footer).
 * Destinos y estilos de los botones quedan en código; un botón sin texto no se pinta. */
function armarTextos(hero: SeccionHeroDoc, empresa: DatosEmpresaHero | null): HeroTextos {
  return {
    kicker: empresa?.selloCnv?.trim() || undefined,
    title: hero.titulo ?? '',
    lead: hero.bajada?.trim() || undefined,
    ctas: [
      { label: hero.textoBotonPrincipal ?? '', href: ABRI_CUENTA_HREF, variant: 'primary' as const },
      { label: hero.textoBotonSecundario ?? '', href: BROKER_LOGIN_URL, variant: 'ghost' as const },
    ].filter((c) => c.label.trim()),
    credentials: (empresa?.credenciales ?? [])
      .filter((c) => c.entidad?.trim() && c.numero?.trim())
      .map((c) => ({ key: c._key, label: c.entidad ?? '', number: c.numero ?? '' })),
    panelTitle: hero.tituloPanel ?? '',
    panelTag: hero.etiquetaPanel ?? '',
    panelFootnote: hero.notaPanel ?? '',
    panelLinkLabel: hero.textoLinkPanel?.trim() || undefined,
  };
}

/** Hero con "seccionHero" + el sello CNV y las credenciales de "datosEmpresa", en una sola query.
 *  - cargando o error de red → la cáscara del Hero (el fondo, con el mismo alto: está arriba de
 *    todo y su alto mueve la página);
 *  - seccionHero sin publicar → recuadro FaltaCargar (en producción, nada). Si falta Datos de la
 *    empresa, el Hero se pinta sin antetítulo ni sellos (su recuadro ya lo muestra el Footer).
 * Los precios del panel no dependen de Sanity: siguen viniendo de /api/mercado. */
export default function HeroSanity() {
  const { data, status } = useSanityQuery<HeroQueryResult>(HERO_QUERY);

  if (status !== 'listo') return <Hero {...EN_CODIGO} cargando />;

  const hero = data?.hero;
  if (!hero) return <FaltaCargar nombre="Sección Hero (portada)" ubicacion="Inicio → Hero (portada)" />;

  return <Hero {...EN_CODIGO} {...armarTextos(hero, data?.empresa ?? null)} />;
}
