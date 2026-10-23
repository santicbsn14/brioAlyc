import FinanciamientoPyme, { type BloqueTexto } from './FinanciamientoPyme';
import FaltaCargar from '../components/FaltaCargar/FaltaCargar';
import TextoResaltado from '../sanity/TextoResaltado';
import { tieneTexto } from '../sanity/resaltado';
import { useSanityQuery } from '../sanity/useSanityQuery';
import { FINANCIAMIENTO_QUERY } from '../sanity/queries';
import type { BloqueFijoDoc, FinanciamientoQueryResult } from '../sanity/types';

/** Los dos botones llevan a Contacto con el motivo "pyme" preseleccionado (Contacto lee `?motivo=`). */
const CTA_HREF = '/?motivo=pyme#contacto';

const texto = (t?: string | null) => t?.trim() || undefined;

/** Beneficios y pasos son campos fijos en Sanity (beneficio1..3, paso1..4): se arman en ese orden.
 * Uno sin título ni texto no se muestra (no debería pasar: en el Studio son obligatorios). */
const armarBloques = (bloques: (BloqueFijoDoc | null | undefined)[]): BloqueTexto[] =>
  bloques.flatMap((b) => {
    const t = texto(b?.titulo) ?? '';
    const d = texto(b?.texto) ?? '';
    return t || d ? [{ t, d }] : [];
  });

/** Página /servicios/financiamiento-pyme con el documento "paginaFinanciamiento" de Sanity (entrada
 * "Página Financiamiento PyME + tipo 'Texto con resaltado'" de PROGRESO-STUDIO.md).
 *  - cargando o error de red → la cáscara de la página (fondo, con el alto que va a tener), así el
 *    Footer no salta de arriba a abajo;
 *  - sin publicar → recuadro FaltaCargar (en producción, la página queda vacía entre el Navbar y
 *    el Footer).
 * La `key` hace que la página se monte de nuevo al llegar los textos: así la aparición al
 * scrollear (useReveal) y el paso a paso arrancan desde cero, como siempre. */
export default function FinanciamientoSanity() {
  const { data: pagina, status } = useSanityQuery<FinanciamientoQueryResult>(FINANCIAMIENTO_QUERY);

  if (status !== 'listo') return <FinanciamientoPyme key="cargando" cargando />;
  if (!pagina) {
    return <FaltaCargar nombre="Página Financiamiento PyME" ubicacion="Páginas → Financiamiento PyME" />;
  }

  return (
    <FinanciamientoPyme
      key="listo"
      kicker={texto(pagina.kicker)}
      title={pagina.titulo ?? ''}
      lead={tieneTexto(pagina.bajada) ? <TextoResaltado value={pagina.bajada} /> : undefined}
      ctaLabel={pagina.textoBoton ?? ''}
      ctaHref={CTA_HREF}
      beneficios={armarBloques([pagina.beneficio1, pagina.beneficio2, pagina.beneficio3])}
      pasosTitle={pagina.tituloPasos ?? ''}
      pasosSub={texto(pagina.bajadaPasos)}
      pasos={armarBloques([pagina.paso1, pagina.paso2, pagina.paso3, pagina.paso4])}
      cierre={pagina.textoCierre ?? ''}
    />
  );
}
