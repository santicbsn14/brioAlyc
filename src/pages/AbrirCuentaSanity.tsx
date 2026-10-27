import AbrirCuenta, { type PreguntaFrecuente } from './AbrirCuenta';
import FaltaCargar from '../components/FaltaCargar/FaltaCargar';
import { APERTURA_CUENTA_URL } from '../data/placeholders';
import { useSanityQuery } from '../sanity/useSanityQuery';
import { ABRIR_CUENTA_QUERY } from '../sanity/queries';
import type { AbrirCuentaQueryResult, PreguntaFrecuenteDoc } from '../sanity/types';

/** El botón del cierre lleva a Contacto con el motivo "cuenta" ("Abrir mi cuenta") preseleccionado. */
const CONTACTO_HREF = '/?motivo=cuenta#contacto';

const texto = (t?: string | null) => t?.trim() || undefined;

/** La respuesta es un solo texto: cada renglón en blanco (dos Enter) empieza un párrafo nuevo. Un
 * Enter solo queda dentro del mismo párrafo (en la web se ve como un espacio). */
const partirParrafos = (respuesta?: string | null) =>
  (respuesta ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/** Una pregunta sin texto no se muestra (no debería pasar: en el Studio es obligatoria). */
const armarPreguntas = (preguntas?: PreguntaFrecuenteDoc[] | null): PreguntaFrecuente[] =>
  (preguntas ?? []).flatMap((p) => {
    const pregunta = texto(p.pregunta);
    return pregunta ? [{ key: p._key, pregunta, respuesta: partirParrafos(p.respuesta) }] : [];
  });

/** Página /abri-tu-cuenta con el documento "paginaAbrirCuenta" de Sanity (entrada "Página Abrí tu
 * cuenta (modelo + carga)" de PROGRESO-STUDIO.md).
 *  - cargando o error de red → la cáscara de la página (fondo, con el alto que va a tener), así el
 *    Footer no salta de arriba a abajo;
 *  - sin publicar → recuadro FaltaCargar (en producción, la página queda vacía entre el Navbar y
 *    el Footer).
 * La `key` hace que la página se monte de nuevo al llegar los textos: así la aparición al
 * scrollear (useReveal) arranca desde cero. */
export default function AbrirCuentaSanity() {
  const { data: pagina, status } = useSanityQuery<AbrirCuentaQueryResult>(ABRIR_CUENTA_QUERY);

  if (status !== 'listo') return <AbrirCuenta key="cargando" cargando />;
  if (!pagina) {
    return <FaltaCargar nombre="Página Abrí tu cuenta" ubicacion="Páginas → Abrí tu cuenta" />;
  }

  return (
    <AbrirCuenta
      key="listo"
      kicker={texto(pagina.kicker)}
      title={pagina.titulo ?? ''}
      lead={texto(pagina.bajada)}
      empezarLabel={pagina.textoBotonEmpezar ?? ''}
      empezarHref={APERTURA_CUENTA_URL}
      preguntasTitle={pagina.tituloPreguntas ?? ''}
      preguntas={armarPreguntas(pagina.preguntas)}
      cierreTitle={pagina.tituloCierre ?? ''}
      cierreTxt={texto(pagina.textoCierre)}
      contactoLabel={pagina.textoBotonContacto ?? ''}
      contactoHref={CONTACTO_HREF}
    />
  );
}
