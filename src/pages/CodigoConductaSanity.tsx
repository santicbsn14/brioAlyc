import { PortableText } from '@portabletext/react';
import CodigoConducta from './CodigoConducta';
import { componentesLegales } from './componentesLegales';
import FaltaCargar from '../components/FaltaCargar/FaltaCargar';
import { useSanityQuery } from '../sanity/useSanityQuery';
import { CODIGO_CONDUCTA_QUERY } from '../sanity/queries';
import type { CodigoConductaQueryResult } from '../sanity/types';

const texto = (t?: string | null) => t?.trim() || undefined;

/** Página /codigo-de-conducta con el documento "paginaCodigoConducta" + la razón social de
 * "datosEmpresa" (entrada "Legales" de PROGRESO-STUDIO.md). La razón social va en un renglón (los
 * renglones unidos con un espacio), arriba del título y debajo de la firma: en los dos lugares se
 * ve en mayúsculas, como está cargada (decidido: no hay un campo aparte para la firma).
 *  - cargando o error de red → la cáscara (el fondo, de una pantalla de alto);
 *  - sin publicar → recuadro FaltaCargar (en producción, la página queda vacía entre el Navbar y
 *    el Footer). Sin Datos de la empresa, la página se ve sin la razón social. */
export default function CodigoConductaSanity() {
  const { data, status } = useSanityQuery<CodigoConductaQueryResult>(CODIGO_CONDUCTA_QUERY);

  if (status !== 'listo') return <CodigoConducta key="cargando" cargando />;
  const pagina = data?.pagina;
  if (!pagina) {
    return <FaltaCargar nombre="Código de conducta" ubicacion="Páginas → Legales → Código de conducta" />;
  }

  return (
    <CodigoConducta
      key="listo"
      empresa={texto(data?.empresa?.razonSocial?.split('\n').map((l) => l.trim()).filter(Boolean).join(' '))}
      titulo={pagina.titulo ?? ''}
      cuerpo={<PortableText value={pagina.cuerpo ?? []} components={componentesLegales} onMissingComponent={false} />}
      cierre={texto(pagina.cierre)}
      firmante={texto(pagina.firma?.nombre)}
      firmanteCargo={texto(pagina.firma?.cargo)}
      textoVolver={pagina.textoVolver ?? ''}
    />
  );
}
