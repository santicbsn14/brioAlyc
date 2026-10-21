import Servicios from './Servicios';
import FaltaCargar, { AvisoFaltante } from '../FaltaCargar/FaltaCargar';
import { useSanityQuery } from '../../sanity/useSanityQuery';
import { SERVICIOS_QUERY } from '../../sanity/queries';
import type { PilarDoc, ProductosParaServicios, ServiciosQueryResult } from '../../sanity/types';
import type { InstrumentGroup, InstrumentItem, ServiceIconName, ServicePillar } from '../../data/placeholders';

/** Ícono de cada pilar, por posición. El destacado ("Nuestro diferencial") es siempre el primero. */
const ICONOS: ServiceIconName[] = ['growth', 'pie', 'layers'];

/** Qué categorías de Productos muestra la home y en qué orden: a propósito distinto al de la página
 * Productos (Financiamiento PyME es el diferencial). Futuros no se muestra en la home. */
const CATEGORIAS_HOME = ['categoriaFinanciamiento', 'categoriaRentaFija', 'categoriaRentaVariable'] as const;

/** Último renglón de Renta variable: link al Panel de Cotizaciones. El texto sale de Sanity; la
 * ruta y la flecha, de código. */
const PANEL_HREF = '/herramientas/acciones';

const texto = (t?: string | null) => t?.trim() || undefined;

function armarPilares(pilares: (PilarDoc | null | undefined)[]): ServicePillar[] {
  return pilares.map((p, i) => ({
    icon: ICONOS[i],
    featured: i === 0,
    title: p?.titulo ?? '',
    text: p?.texto ?? '',
  }));
}

/** Los instrumentos de la home son los nombres de Productos (sin la línea explicativa). Una
 * categoría sin nombre o sin instrumentos no se muestra. */
function armarInstrumentos(productos: ProductosParaServicios | null, textoLinkPanel?: string): InstrumentGroup[] {
  return CATEGORIAS_HOME.flatMap((campo) => {
    const cat = productos?.[campo];
    const nombre = texto(cat?.nombre);
    const items: InstrumentItem[] = (cat?.instrumentos ?? []).flatMap((i) => {
      const label = texto(i.nombre);
      return label ? [{ key: i._key, label }] : [];
    });
    if (!nombre || items.length === 0) return [];
    if (campo === 'categoriaRentaVariable' && textoLinkPanel) {
      items.push({ key: 'panel', label: textoLinkPanel, href: PANEL_HREF });
    }
    return [{ key: campo, category: nombre, items }];
  });
}

/** Servicios con "seccionServicios" + las tres categorías de "paginaProductos" que muestra la home,
 * en una sola query (entrada "Sección Servicios" de PROGRESO-STUDIO.md).
 *  - cargando o error de red → nada (está abajo del Hero; si alguien llegó con un link a una
 *    sección de más abajo, useScrollToTop la mantiene alineada cuando esta aparece);
 *  - seccionServicios sin publicar → recuadro FaltaCargar (en producción, nada);
 *  - Productos sin publicar o sin alguna de las tres categorías → Servicios sin esa columna de
 *    instrumentos, y en dev un aviso chico. */
export default function ServiciosSanity() {
  const { data, status } = useSanityQuery<ServiciosQueryResult>(SERVICIOS_QUERY);

  if (status !== 'listo') return null;

  const s = data?.servicios;
  if (!s) return <FaltaCargar nombre="Sección Servicios" ubicacion="Inicio → Servicios" />;

  const grupos = armarInstrumentos(data?.productos ?? null, texto(s.textoLinkPanel));

  return (
    <Servicios
      kicker={texto(s.kicker)}
      title={s.titulo ?? ''}
      lead={texto(s.bajada)}
      pillars={armarPilares([s.pilar1, s.pilar2, s.pilar3])}
      featuredBadge={s.textoDestacado ?? ''}
      instrumentsTitle={s.tituloInstrumentos ?? ''}
      instrumentGroups={grupos}
      instrumentsNote={
        grupos.length < CATEGORIAS_HOME.length && (
          <AvisoFaltante texto="Faltan los instrumentos: se cargan en Páginas → Productos (Financiamiento, Renta fija y Renta variable) y hay que tocar Publicar." />
        )
      }
      feesTitle={s.tituloComisiones ?? ''}
      feesLead={texto(s.bajadaComisiones)}
      feesCtaLabel={s.textoBotonComisiones ?? ''}
    />
  );
}
