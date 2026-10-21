import Productos, { type Categoria } from './Productos';
import FaltaCargar from '../components/FaltaCargar/FaltaCargar';
import { useSanityQuery } from '../sanity/useSanityQuery';
import { PRODUCTOS_QUERY } from '../sanity/queries';
import type { PaginaProductosDoc, ProductosQueryResult } from '../sanity/types';

/** Orden del carrusel e id de cada categoría (el id elige la ilustración en Productos.tsx). Las 4
 * categorías son campos fijos en Sanity; el orden y la ilustración quedan en código. */
const ORDEN = [
  { id: 'renta-fija', campo: 'rentaFija' },
  { id: 'renta-variable', campo: 'rentaVariable' },
  { id: 'financiamiento', campo: 'financiamiento' },
  { id: 'futuros', campo: 'futuros' },
] as const;

const texto = (t?: string | null) => t?.trim() || undefined;

/** Arma el array del carrusel como dice la entrada "Página Productos" de PROGRESO-STUDIO.md. Una
 * categoría sin nombre o sin instrumentos no se muestra; un instrumento sin nombre, tampoco. */
function armarCategorias(pagina: PaginaProductosDoc): Categoria[] {
  return ORDEN.flatMap(({ id, campo }) => {
    const c = pagina.categorias?.[campo];
    const nombre = texto(c?.nombre);
    const items = (c?.instrumentos ?? []).flatMap((i) => {
      const t = texto(i.nombre);
      return t ? [{ key: i._key, t, d: i.linea ?? '' }] : [];
    });
    if (!nombre || items.length === 0) return [];
    return [{ id, nombre, claim: c?.frase ?? '', items }];
  });
}

/** Página /servicios/productos con el documento "paginaProductos" de Sanity.
 *  - cargando o error de red → la cáscara de la página (fondo, con el alto del encabezado y del
 *    carrusel), así el Footer no salta de arriba a abajo;
 *  - sin publicar → recuadro FaltaCargar (en producción, la página queda vacía entre el Navbar y
 *    el Footer).
 * La `key` hace que la página se monte de nuevo al llegar los textos: así la aparición al
 * scrollear (useReveal) y el carrusel arrancan desde cero, como siempre. */
export default function ProductosSanity() {
  const { data: pagina, status } = useSanityQuery<ProductosQueryResult>(PRODUCTOS_QUERY);

  if (status !== 'listo') return <Productos key="cargando" cargando />;
  if (!pagina) return <FaltaCargar nombre="Página Productos" ubicacion="Páginas → Productos" />;

  return (
    <Productos
      key="listo"
      kicker={texto(pagina.kicker)}
      title={pagina.titulo ?? ''}
      lead={texto(pagina.bajada)}
      categorias={armarCategorias(pagina)}
    />
  );
}
