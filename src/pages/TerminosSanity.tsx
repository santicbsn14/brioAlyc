import { PortableText } from '@portabletext/react';
import TerminosCondiciones from './TerminosCondiciones';
import { componentesLegales } from './componentesLegales';
import FaltaCargar from '../components/FaltaCargar/FaltaCargar';
import { useSanityQuery } from '../sanity/useSanityQuery';
import { TERMINOS_QUERY } from '../sanity/queries';
import type { TerminosQueryResult } from '../sanity/types';
import { texto } from '../sanity/limpiar';

/** Página /terminos-y-condiciones con el documento "paginaTerminos" de Sanity (entrada "Legales" de
 * PROGRESO-STUDIO.md).
 *  - cargando o error de red → la cáscara (el fondo, de una pantalla de alto);
 *  - sin publicar → recuadro FaltaCargar (en producción, la página queda vacía entre el Navbar y
 *    el Footer). */
export default function TerminosSanity() {
  const { data: pagina, status } = useSanityQuery<TerminosQueryResult>(TERMINOS_QUERY);

  if (status !== 'listo') return <TerminosCondiciones key="cargando" cargando />;
  if (!pagina) {
    return <FaltaCargar nombre="Términos y condiciones" ubicacion="Páginas → Legales → Términos y condiciones" />;
  }

  return (
    <TerminosCondiciones
      key="listo"
      titulo={pagina.titulo ?? ''}
      cuerpo={<PortableText value={pagina.cuerpo ?? []} components={componentesLegales} onMissingComponent={false} />}
      cierre={texto(pagina.cierre)}
      textoVolver={pagina.textoVolver ?? ''}
    />
  );
}
