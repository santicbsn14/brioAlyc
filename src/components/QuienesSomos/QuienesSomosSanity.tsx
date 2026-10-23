import QuienesSomos, { type QuienesValue, type QuienesValueIcon } from './QuienesSomos';
import FaltaCargar, { AvisoFaltante } from '../FaltaCargar/FaltaCargar';
import { useSanityQuery } from '../../sanity/useSanityQuery';
import { QUIENES_SOMOS_QUERY } from '../../sanity/queries';
import { srcSetImagen, tieneImagen, urlImagen } from '../../sanity/imagen';
import type { QuienesSomosQueryResult, ValorDoc } from '../../sanity/types';

/** Ícono de cada valor, por posición: diana, reloj, brújula, escudo con tilde. */
const ICONOS: QuienesValueIcon[] = ['target', 'clock', 'compass', 'shield'];

/** Si la descripción de la foto viene vacía, la web usa esta. */
const ALT_FOTO = 'Oficinas de Brio Valores en Rosario';

/** Foto horizontal 4:3. Anchos para el srcSet: en compu ocupa ~528 px (la mitad del contenido) y
 * debajo de 860 px, el ancho entero de la pantalla. */
const PROPORCION_FOTO = 4 / 3;
const ANCHOS_FOTO = [600, 900, 1200, 1600];
const SIZES_FOTO = '(max-width: 860px) 100vw, 528px';

const texto = (t?: string | null) => t?.trim() || undefined;

/** El relato es un solo texto: cada renglón en blanco (dos Enter) empieza un párrafo nuevo. Un Enter
 * solo queda dentro del mismo párrafo (en la web se ve como un espacio). */
const partirParrafos = (relato?: string | null) =>
  (relato ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/** Un valor sin título ni línea no se muestra. */
const armarValores = (valores: (ValorDoc | null | undefined)[]): QuienesValue[] =>
  valores.flatMap((v, i) => {
    const title = texto(v?.titulo) ?? '';
    const text = texto(v?.texto) ?? '';
    return title || text ? [{ icon: ICONOS[i], title, text }] : [];
  });

/** Quiénes somos con el documento "seccionQuienesSomos" (entrada "Flechas fuera del texto + sección
 * Quiénes somos" de PROGRESO-STUDIO.md).
 *  - cargando o error de red → la cáscara (el fondo con el alto de la sección), así lo de abajo no
 *    salta cuando llegan los textos;
 *  - sin publicar → recuadro FaltaCargar (en producción, nada).
 * La `key` hace que la sección se monte de nuevo al llegar los textos: así la aparición al
 * scrollear arranca desde cero, como siempre. */
export default function QuienesSomosSanity() {
  const { data: qs, status } = useSanityQuery<QuienesSomosQueryResult>(QUIENES_SOMOS_QUERY);

  if (status !== 'listo') return <QuienesSomos key="cargando" cargando />;
  if (!qs) return <FaltaCargar nombre="Sección Quiénes somos" ubicacion="Inicio → Quiénes somos" />;

  const foto = tieneImagen(qs.foto) ? qs.foto : undefined;

  return (
    <QuienesSomos
      key="listo"
      kicker={texto(qs.kicker)}
      title={qs.titulo ?? ''}
      paragraphs={partirParrafos(qs.relato)}
      photoSrc={foto && urlImagen(foto, 1200, PROPORCION_FOTO)}
      photoSrcSet={foto && srcSetImagen(foto, ANCHOS_FOTO, PROPORCION_FOTO)}
      photoSizes={SIZES_FOTO}
      photoAlt={texto(qs.foto?.alt) ?? ALT_FOTO}
      values={armarValores([qs.valor1, qs.valor2, qs.valor3, qs.valor4])}
      note={
        !foto && (
          <AvisoFaltante texto="Falta la foto: se sube en Inicio → Quiénes somos → Foto de la oficina, y hay que tocar Publicar." />
        )
      }
    />
  );
}
