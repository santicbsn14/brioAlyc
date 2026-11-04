import { useId, useState, type CSSProperties, type ReactNode } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { reserva } from '../../lib/reserva';
import { limpio } from '../../sanity/limpiar';
import styles from './Equipo.module.css';

type Tone = 'teal' | 'orange';

/** Foto de una persona (vertical 4:5), con varios tamaños para que el navegador elija. */
export interface FotoPersona {
  src: string;
  srcSet?: string;
}

export interface Socio {
  /** Solo se usa como key. */
  id: string;
  nombre: string;
  cargo: string;
  /** Texto de certificación ("Idóneo registrado ante CNV"), debajo del cargo. Ausente = no se pinta. */
  certificacion?: string;
  /** Bio corta, siempre visible en la tarjeta. Vacía = no se pinta. */
  bio?: string;
  /** Bio completa, se despliega con "Ver más". Ausente = la tarjeta no muestra el toggle. */
  bioExtendida?: string;
  /** Ausente = se muestra el avatar placeholder (iniciales). */
  foto?: FotoPersona;
  /** Atributo de edición de la foto (solo en la vista previa del Studio, ver sanity/edicion.ts). */
  fotoEdit?: string;
}

export interface Empleado {
  /** Solo se usa como key. */
  id: string;
  nombre: string;
  cargo: string;
  /** Texto de certificación, debajo del cargo. Ausente = no se pinta. */
  certificacion?: string;
  /** Ausente = se muestra el avatar placeholder (iniciales). */
  foto?: FotoPersona;
  /** Atributo de edición de la foto (solo en la vista previa del Studio, ver sanity/edicion.ts). */
  fotoEdit?: string;
}

/** Los textos y las personas de la sección (vienen de Sanity). Los opcionales vacíos no se pintan. */
export interface EquipoTextos {
  kicker?: string;
  title: string;
  lead?: string;
  /** Sin socios no se pinta su bloque. */
  socios: Socio[];
  /** Rótulo del bloque de empleados ("Equipo"). */
  empleadosLabel: string;
  /** Sin empleados no se pinta su bloque ni su rótulo. */
  empleados: Empleado[];
  verMasLabel: string;
  verMenosLabel: string;
  /** Aviso debajo del encabezado (ej. el recuadro "Faltan las personas"). */
  note?: ReactNode;
}

/** `cargando`: los textos todavía no llegaron de Sanity. Se ve el fondo de la sección con el alto
 * que va a tener (texto de relleno invisible, ver RESERVA), así lo de abajo no salta. */
export type EquipoProps = { cargando: true } | ({ cargando?: false } & EquipoTextos);

/** Lo que se pinta (invisible) mientras carga: los largos de los textos actuales, con 3 socios
 * (todos con "Ver más") y 9 empleados, sin fotos (el avatar de iniciales mide lo mismo). */
const RESERVA: EquipoTextos = {
  kicker: reserva(13),
  title: reserva(24),
  lead: reserva(98),
  socios: (
    [
      [32, 25, 145],
      [23, 5, 145],
      [23, 5, 145],
    ] as const
  ).map(([nombre, cargo, bio], i) => ({
    id: String(i),
    nombre: reserva(nombre),
    cargo: reserva(cargo),
    bio: reserva(bio),
    bioExtendida: reserva(10),
  })),
  empleadosLabel: reserva(6),
  empleados: [17, 16, 13, 11, 12, 12, 19, 18, 14].map((nombre, i) => ({
    id: String(i),
    nombre: reserva(nombre),
    cargo: reserva(12),
  })),
  verMasLabel: reserva(7),
  verMenosLabel: reserva(9),
};

/** Ancho de cada avatar en pantalla (ver .avatarLg / .avatarSm), para elegir del srcSet. */
const SIZES = { lg: '120px', sm: '84px' } as const;

/** CSS custom property `--i` para escalonar el delay de la animación de entrada. */
function staggerStyle(index: number): CSSProperties {
  return { '--i': index } as CSSProperties;
}

/** Iniciales de nombre + último apellido ("Claudio Adrián Iglesias" → "CI"), del nombre limpio. */
function initials(nombre: string): string {
  const partes = limpio(nombre).split(' ').filter(Boolean);
  const elegidas = partes.length > 1 ? [partes[0], partes[partes.length - 1]] : partes;
  return elegidas
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

/** Avatar de una persona: foto real si `foto` tiene valor, si no un placeholder con las iniciales. */
function Avatar({
  nombre,
  foto,
  edit,
  tone,
  size,
}: {
  nombre: string;
  foto?: FotoPersona;
  /** Atributo de edición: en la vista previa, tocar la foto (o las iniciales) abre el campo Foto. */
  edit?: string;
  tone: Tone;
  size: 'lg' | 'sm';
}) {
  if (foto) {
    return (
      <div className={`${styles.avatar} ${styles[`avatar${size === 'lg' ? 'Lg' : 'Sm'}`]}`} data-sanity={edit}>
        <img src={foto.src} srcSet={foto.srcSet} sizes={SIZES[size]} alt="" className={styles.avatarImg} />
      </div>
    );
  }
  return (
    <div
      className={`${styles.avatar} ${styles[`avatar${size === 'lg' ? 'Lg' : 'Sm'}`]} ${styles[`tone${tone === 'teal' ? 'Teal' : 'Orange'}`]}`}
      aria-hidden="true"
      data-sanity={edit}
    >
      <span>{initials(nombre) || '?'}</span>
    </div>
  );
}

/** Texto de certificación debajo del cargo, con un escudo con tilde chico (decorativo). El ícono va
 * dentro del renglón, así si el texto baja a dos renglones (grilla angosta) queda prolijo. */
function Certificacion({ texto }: { texto: string }) {
  return (
    <p className={styles.certificacion}>
      <svg className={styles.certIcono} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path
          d="M8 1.2 2.8 3.1v4.1c0 3.3 2.2 6.1 5.2 7.1 3-1 5.2-3.8 5.2-7.1V3.1L8 1.2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="m5.6 8 1.7 1.7 3.2-3.4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {texto}
    </p>
  );
}

/**
 * Bio extendida desplegable in-place ("Ver más" / "Ver menos"). La transición de alto usa
 * el truco de `grid-template-rows: 0fr → 1fr` (anima a la altura real del texto, sin
 * max-height fijo). Colapsada queda `inert` para que no se lea ni se pueda enfocar.
 */
function BioExtendida({ texto, verMas, verMenos }: { texto: string; verMas: string; verMenos: string }) {
  const [abierta, setAbierta] = useState(false);
  const id = useId();
  return (
    <>
      <div id={id} className={`${styles.bioExt} ${abierta ? styles.bioExtOpen : ''}`} inert={!abierta}>
        <div className={styles.bioExtInner}>
          <p className={styles.socioBio}>{texto}</p>
        </div>
      </div>
      <button
        type="button"
        className={styles.verMas}
        aria-expanded={abierta}
        aria-controls={id}
        onClick={() => setAbierta((v) => !v)}
      >
        {abierta ? verMenos : verMas}
      </button>
    </>
  );
}

function SocioCard({
  socio,
  index,
  verMas,
  verMenos,
}: {
  socio: Socio;
  index: number;
  verMas: string;
  verMenos: string;
}) {
  const tone: Tone = index % 2 ? 'orange' : 'teal';
  return (
    <article className={`${styles.socio} ${styles.reveal}`} style={staggerStyle(index)}>
      <Avatar nombre={socio.nombre} foto={socio.foto} edit={socio.fotoEdit} tone={tone} size="lg" />
      <h3 className={styles.socioNombre}>{socio.nombre}</h3>
      <p className={styles.socioCargo}>{socio.cargo}</p>
      {socio.certificacion && <Certificacion texto={socio.certificacion} />}
      {socio.bio && <p className={styles.socioBio}>{socio.bio}</p>}
      {socio.bioExtendida && <BioExtendida texto={socio.bioExtendida} verMas={verMas} verMenos={verMenos} />}
    </article>
  );
}

function EmpleadoCard({ empleado, index }: { empleado: Empleado; index: number }) {
  const tone: Tone = index % 2 ? 'orange' : 'teal';
  return (
    <div className={`${styles.emp} ${styles.reveal}`} style={staggerStyle(index % 5)}>
      <Avatar nombre={empleado.nombre} foto={empleado.foto} edit={empleado.fotoEdit} tone={tone} size="sm" />
      <p className={styles.empNombre}>{empleado.nombre}</p>
      <p className={styles.empCargo}>{empleado.cargo}</p>
      {empleado.certificacion && <Certificacion texto={empleado.certificacion} />}
    </div>
  );
}

/**
 * Sección Equipo de la home (#equipo). Portada tal cual del prototipo aprobado
 * `__ref/BrioEquipo.jsx` (diseño ya validado, no se rediseñó nada).
 *
 * Dos tratamientos: socios (tarjeta propia con bio) y empleados (grilla simple sin tarjeta
 * ni bio). Reusa `useReveal` con un único ref en la sección — igual que
 * QuienesSomos/Contacto — para la aparición al scrollear, con stagger por índice vía
 * la custom property `--i` (en empleados se reinicia cada 5 elementos para que el
 * escalonado no tarde demasiado con muchas personas).
 * Recibe todo por props (EquipoSanity lo arma desde Sanity).
 */
export default function Equipo(props: EquipoProps) {
  const { cargando } = props;
  const { kicker, title, lead, socios, empleadosLabel, empleados, verMasLabel, verMenosLabel, note } =
    props.cargando ? RESERVA : props;
  const ref = useReveal<HTMLElement>(styles.reveal, styles.isIn);

  return (
    <section
      id="equipo"
      className={`${styles.equipo} ${cargando ? styles.cargando : ''}`}
      aria-labelledby="equipo-title"
      aria-busy={cargando || undefined}
      ref={ref}
    >
      <div className={styles.inner} aria-hidden={cargando || undefined}>
        <div className={`${styles.head} ${styles.reveal}`}>
          {kicker && <p className={styles.kicker}>{kicker}</p>}
          <h2 id="equipo-title" className={styles.title}>
            {title}
          </h2>
          {lead && <p className={styles.lead}>{lead}</p>}
        </div>
        {note}

        {socios.length > 0 && (
          <div className={styles.socios}>
            {socios.map((socio, i) => (
              <SocioCard key={socio.id} socio={socio} index={i} verMas={verMasLabel} verMenos={verMenosLabel} />
            ))}
          </div>
        )}

        {empleados.length > 0 && (
          <div className={styles.empWrap}>
            <p className={styles.empLabel}>{empleadosLabel}</p>
            <div className={styles.empGrid}>
              {empleados.map((empleado, i) => (
                <EmpleadoCard key={empleado.id} empleado={empleado} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
