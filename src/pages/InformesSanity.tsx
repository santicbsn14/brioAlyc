import Informes, { type CategoriaInforme, type Informe } from './Informes';
import FaltaCargar from '../components/FaltaCargar/FaltaCargar';
import { useSanityQuery } from '../sanity/useSanityQuery';
import { INFORMES_QUERY } from '../sanity/queries';
import type {
  CategoriaInformeId,
  InformeDoc,
  InformesQueryResult,
  PaginaInformesDoc,
} from '../sanity/types';

/** Ids y orden de las categorías: los de CATEGORIAS_INFORME del Studio. El nombre visible sale de
 * `etiquetasCategorias`. */
const CATEGORIAS: CategoriaInformeId[] = ['semanal', 'mensual', 'especial'];

const texto = (t?: string | null) => t?.trim() || undefined;

/** Todas las categorías, tengan informes o no (como hoy). Una sin nombre no se muestra (no debería
 * pasar: en el Studio es obligatorio). */
const armarCategorias = (pagina: PaginaInformesDoc): CategoriaInforme[] =>
  CATEGORIAS.flatMap((id) => {
    const label = texto(pagina.etiquetasCategorias?.[id]);
    return label ? [{ id, label }] : [];
  });

/** Link de descarga: la URL del PDF + `?dl=<nombre original>`, así Sanity lo manda como descarga y
 * baja con el nombre con que se subió (el atributo `download` no sirve con otro dominio). Sin
 * nombre, `?dl=` vacío. */
const linkDescarga = (url: string, nombre?: string | null) =>
  `${url}?dl=${encodeURIComponent(nombre ?? '')}`;

/** Un informe sin título o sin PDF no se muestra (no debería pasar: en el Studio son obligatorios,
 * y la query ya deja afuera los que no tienen PDF). */
const armarInformes = (informes: InformeDoc[]): Informe[] =>
  informes.flatMap((inf) => {
    const titulo = texto(inf.titulo);
    if (!titulo || !inf.archivoUrl) return [];
    return [
      {
        id: inf._id,
        titulo,
        fecha: inf.fecha ?? '',
        categoria: inf.categoria ?? '',
        resumen: texto(inf.resumen),
        href: linkDescarga(inf.archivoUrl, inf.archivoNombre),
      },
    ];
  });

/** Página /informes con el documento "paginaInformes" y el listado de "informe" de Sanity (entrada
 * "Base del Studio + sección Informes" de PROGRESO-STUDIO.md).
 *  - cargando o error de red → la cáscara (fondo, con el alto del encabezado y de unas filas);
 *  - página sin publicar → recuadro FaltaCargar (en producción, la página queda vacía entre el
 *    Navbar y el Footer);
 *  - página publicada sin informes → el mensaje de vacío, como hoy (no es un faltante).
 * La `key` hace que la página se monte de nuevo al llegar los datos: así la aparición al scrollear
 * (useReveal) arranca desde cero, como siempre. */
export default function InformesSanity() {
  const { data, status } = useSanityQuery<InformesQueryResult>(INFORMES_QUERY);

  if (status !== 'listo') return <Informes key="cargando" cargando />;
  const pagina = data?.pagina;
  if (!pagina) {
    return <FaltaCargar nombre="Página Informes" ubicacion="Páginas → Informes → Textos de la página" />;
  }

  return (
    <Informes
      key="listo"
      kicker={texto(pagina.kicker)}
      title={pagina.titulo ?? ''}
      lead={texto(pagina.bajada)}
      filterAllLabel={texto(pagina.textoFiltroTodos) ?? ''}
      categorias={armarCategorias(pagina)}
      informes={armarInformes(data?.informes ?? [])}
      emptyLabel={texto(pagina.textoVacio)}
      downloadLabel={pagina.textoBotonDescarga ?? ''}
    />
  );
}
