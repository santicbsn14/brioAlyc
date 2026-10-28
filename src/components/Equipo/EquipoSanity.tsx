import Equipo, { type Empleado, type FotoPersona, type Socio } from './Equipo';
import FaltaCargar, { AvisoFaltante } from '../FaltaCargar/FaltaCargar';
import { useSanityQuery } from '../../sanity/useSanityQuery';
import { EQUIPO_QUERY } from '../../sanity/queries';
import { srcSetImagen, tieneImagen, urlImagen } from '../../sanity/imagen';
import type { EquipoQueryResult, ImagenDoc, PersonaDoc } from '../../sanity/types';

/** Fotos verticales 4:5. Anchos del srcSet según lo que mide cada avatar en pantalla (120 px los
 * socios, 84 px los empleados) a 1x, 2x y 3x; `src` es el de 2x. */
const PROPORCION_FOTO = 4 / 5;
const ANCHOS = { socio: [120, 240, 360], empleado: [84, 168, 252] } as const;

const texto = (t?: string | null) => t?.trim() || undefined;

function armarFoto(foto: ImagenDoc | null | undefined, anchos: readonly number[]): FotoPersona | undefined {
  if (!tieneImagen(foto)) return undefined;
  return { src: urlImagen(foto, anchos[1], PROPORCION_FOTO), srcSet: srcSetImagen(foto, [...anchos], PROPORCION_FOTO) };
}

/** El texto de certificación, solo si la persona está marcada y la sección tiene el texto. */
const certificacionDe = (p: PersonaDoc, textoCertificacion?: string) =>
  p.certificado ? textoCertificacion : undefined;

/** Una persona sin nombre no se muestra. */
const conNombre = (p: PersonaDoc) => !!texto(p.nombre);

const armarSocio = (p: PersonaDoc, textoCert?: string): Socio => ({
  id: p._id,
  nombre: texto(p.nombre) ?? '',
  cargo: p.cargo ?? '',
  certificacion: certificacionDe(p, textoCert),
  bio: texto(p.bio),
  bioExtendida: texto(p.bioExtendida),
  foto: armarFoto(p.foto, ANCHOS.socio),
});

const armarEmpleado = (p: PersonaDoc, textoCert?: string): Empleado => ({
  id: p._id,
  nombre: texto(p.nombre) ?? '',
  cargo: p.cargo ?? '',
  certificacion: certificacionDe(p, textoCert),
  foto: armarFoto(p.foto, ANCHOS.empleado),
});

/** Equipo con "seccionEquipo" + las personas de las listas Socios y Empleados del Studio, en su
 * orden (entrada "Sección Equipo" de PROGRESO-STUDIO.md).
 *  - cargando o error de red → la cáscara (el fondo con el alto de la sección);
 *  - seccionEquipo sin publicar → recuadro FaltaCargar (en producción, nada);
 *  - persona marcada como certificada y texto de certificación cargado → ese texto debajo del cargo
 *    (sin marca o sin texto, nada);
 *  - sin socios o sin empleados → la sección sin ese bloque; sin ninguna persona, solo el
 *    encabezado y, en dev, un aviso chico.
 * La `key` hace que la sección se monte de nuevo al llegar los textos: así la aparición al
 * scrollear arranca desde cero, como siempre. */
export default function EquipoSanity() {
  const { data, status } = useSanityQuery<EquipoQueryResult>(EQUIPO_QUERY);

  if (status !== 'listo') return <Equipo key="cargando" cargando />;

  const s = data?.seccion;
  if (!s) return <FaltaCargar nombre="Sección Equipo" ubicacion="Inicio → Equipo → Textos de la sección" />;

  const textoCert = texto(s.textoCertificacion);
  const socios = (data?.socios ?? []).filter(conNombre).map((p) => armarSocio(p, textoCert));
  const empleados = (data?.empleados ?? []).filter(conNombre).map((p) => armarEmpleado(p, textoCert));

  return (
    <Equipo
      key="listo"
      kicker={texto(s.kicker)}
      title={s.titulo ?? ''}
      lead={texto(s.bajada)}
      socios={socios}
      empleadosLabel={s.rotuloEmpleados ?? ''}
      empleados={empleados}
      verMasLabel={s.textoVerMas ?? ''}
      verMenosLabel={s.textoVerMenos ?? ''}
      note={
        socios.length + empleados.length === 0 && (
          <AvisoFaltante texto="Faltan las personas: se cargan en Inicio → Equipo → Socios / Empleados." />
        )
      }
    />
  );
}
