import Comisiones, { type ComisionesTab, type FeeTable } from './Comisiones';
import FaltaCargar, { AvisoFaltante } from '../components/FaltaCargar/FaltaCargar';
import { partirFecha } from '../lib/fecha';
import { useSanityQuery } from '../sanity/useSanityQuery';
import { COMISIONES_QUERY } from '../sanity/queries';
import type { ComisionesQueryResult, PaginaComisionesDoc, PestanaComisionesDoc } from '../sanity/types';

const texto = (t?: string | null) => t?.trim() || undefined;

/** "Vigencia:" + "2026-01-01" → "Vigencia: Enero 2026". La fecha se parte a mano (lib/fecha.ts),
 * nunca con `new Date()`: el 1° de enero en UTC es el 31 de diciembre en Argentina. Sin fecha
 * válida queda solo el texto. */
const armarVigencia = (pagina: PaginaComisionesDoc) => {
  const f = partirFecha(pagina.fechaVigencia);
  const fecha = f ? `${f.mes[0].toUpperCase()}${f.mes.slice(1)} ${f.anio}` : '';
  return [texto(pagina.textoVigencia), fecha].filter(Boolean).join(' ');
};

/** Cada tabla: la primera fila de la grilla son las columnas y el resto, las filas. Una tabla sin
 * título o sin filas de datos no se muestra, y una pestaña sin nombre o sin tablas tampoco (no
 * debería pasar: en el Studio son obligatorios). Las celdas vacías quedan en blanco. */
const armarPestanas = (pestanas: PestanaComisionesDoc[]): ComisionesTab[] =>
  pestanas.flatMap((p) => {
    const label = texto(p.nombre);
    const tablas = (p.tablas ?? []).flatMap((t): FeeTable[] => {
      const [columnas, ...filas] = (t.filas ?? []).map((fila) => (fila ?? []).map((c) => c ?? ''));
      const titulo = texto(t.titulo);
      if (!titulo || !columnas || filas.length === 0) return [];
      const notas = (t.notas ?? []).flatMap((n) => texto(n) ?? []);
      return [{ id: t._key, titulo, columnas, filas, notas }];
    });
    return label && tablas.length > 0 ? [{ id: p._id, label, tablas }] : [];
  });

/** Página /comisiones con el documento "paginaComisiones" y las "pestanaComisiones" de Sanity
 * (entrada "Página Comisiones" de PROGRESO-STUDIO.md).
 *  - cargando o error de red → la cáscara (fondo, con el alto del encabezado, las pestañas y una
 *    tabla), así el Footer no salta;
 *  - página sin publicar → recuadro FaltaCargar (en producción, la página queda vacía entre el
 *    Navbar y el Footer);
 *  - página publicada sin pestañas → el encabezado y, en dev, un aviso.
 * La `key` hace que la página se monte de nuevo al llegar los datos: así la aparición al scrollear
 * (useReveal) arranca desde cero y la pestaña activa es la primera de Sanity. */
export default function ComisionesSanity() {
  const { data, status } = useSanityQuery<ComisionesQueryResult>(COMISIONES_QUERY);

  if (status !== 'listo') return <Comisiones key="cargando" cargando />;
  const pagina = data?.pagina;
  if (!pagina) {
    return <FaltaCargar nombre="Página Comisiones" ubicacion="Páginas → Comisiones → Textos de la página" />;
  }

  const tabs = armarPestanas(data?.pestanas ?? []);

  return (
    <Comisiones
      key="listo"
      title={pagina.titulo ?? ''}
      subtitle={armarVigencia(pagina)}
      aclaracion={texto(pagina.aclaracion)}
      tabs={tabs}
      note={
        tabs.length === 0 && (
          <AvisoFaltante texto="Faltan las pestañas: se cargan en Páginas → Comisiones → Pestañas." />
        )
      }
    />
  );
}
