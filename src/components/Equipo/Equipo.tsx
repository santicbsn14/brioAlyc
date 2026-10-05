import { useId, useState, type CSSProperties } from 'react';
import { equipo, type Empleado, type Socio } from '../../data/equipo';
import { useReveal } from '../../hooks/useReveal';
import styles from './Equipo.module.css';

type Tone = 'teal' | 'orange';

/** CSS custom property `--i` para escalonar el delay de la animación de entrada. */
function staggerStyle(index: number): CSSProperties {
  return { '--i': index } as CSSProperties;
}

/** Iniciales de nombre + último apellido ("Claudio Adrián Iglesias" → "CI"). */
function initials(nombre: string): string {
  const partes = nombre.split(' ').filter(Boolean);
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
  tone,
  size,
}: {
  nombre: string;
  foto?: string;
  tone: Tone;
  size: 'lg' | 'sm';
}) {
  if (foto) {
    return (
      <div className={`${styles.avatar} ${styles[`avatar${size === 'lg' ? 'Lg' : 'Sm'}`]}`}>
        <img src={foto} alt="" className={styles.avatarImg} />
      </div>
    );
  }
  return (
    <div
      className={`${styles.avatar} ${styles[`avatar${size === 'lg' ? 'Lg' : 'Sm'}`]} ${styles[`tone${tone === 'teal' ? 'Teal' : 'Orange'}`]}`}
      aria-hidden="true"
    >
      <span>{initials(nombre) || '?'}</span>
    </div>
  );
}

/**
 * Bio extendida desplegable in-place ("Ver más" / "Ver menos"). La transición de alto usa
 * el truco de `grid-template-rows: 0fr → 1fr` (anima a la altura real del texto, sin
 * max-height fijo). Colapsada queda `inert` para que no se lea ni se pueda enfocar.
 */
function BioExtendida({ texto }: { texto: string }) {
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
        {abierta ? 'Ver menos' : 'Ver más'}
      </button>
    </>
  );
}

function SocioCard({ socio, index }: { socio: Socio; index: number }) {
  const tone: Tone = index % 2 ? 'orange' : 'teal';
  return (
    <article className={`${styles.socio} ${styles.reveal}`} style={staggerStyle(index)}>
      <Avatar nombre={socio.nombre} foto={socio.foto} tone={tone} size="lg" />
      <h3 className={styles.socioNombre}>{socio.nombre}</h3>
      <p className={styles.socioCargo}>{socio.cargo}</p>
      <p className={styles.socioBio}>{socio.bio}</p>
      {socio.bioExtendida && <BioExtendida texto={socio.bioExtendida} />}
    </article>
  );
}

function EmpleadoCard({ empleado, index }: { empleado: Empleado; index: number }) {
  const tone: Tone = index % 2 ? 'orange' : 'teal';
  return (
    <div className={`${styles.emp} ${styles.reveal}`} style={staggerStyle(index % 5)}>
      <Avatar nombre={empleado.nombre} foto={empleado.foto} tone={tone} size="sm" />
      <p className={styles.empNombre}>{empleado.nombre}</p>
      <p className={styles.empCargo}>{empleado.cargo}</p>
    </div>
  );
}

/**
 * Sección Equipo de la home (#equipo). Portada tal cual del prototipo aprobado
 * `__ref/BrioEquipo.jsx` (diseño ya validado, no se rediseñó nada).
 *
 * Dos tratamientos: socios (3, tarjeta propia con bio) y empleados (9, grilla simple
 * sin tarjeta ni bio). Reusa `useReveal` con un único ref en la sección — igual que
 * QuienesSomos/Contacto — para la aparición al scrollear, con stagger por índice vía
 * la custom property `--i` (en empleados se reinicia cada 5 elementos para que el
 * escalonado no tarde demasiado con 9 personas).
 */
export default function Equipo() {
  const ref = useReveal<HTMLElement>(styles.reveal, styles.isIn);

  return (
    <section id="equipo" className={styles.equipo} aria-labelledby="equipo-title" ref={ref}>
      <div className={`${styles.head} ${styles.reveal}`}>
        <p className={styles.kicker}>{equipo.kicker}</p>
        <h2 id="equipo-title" className={styles.title}>
          {equipo.title}
        </h2>
        <p className={styles.lead}>{equipo.lead}</p>
      </div>

      <div className={styles.socios}>
        {equipo.socios.map((socio, i) => (
          <SocioCard key={socio.id} socio={socio} index={i} />
        ))}
      </div>

      <div className={styles.empWrap}>
        <p className={styles.empLabel}>{equipo.equipoLabel}</p>
        <div className={styles.empGrid}>
          {equipo.empleados.map((empleado, i) => (
            <EmpleadoCard key={empleado.id} empleado={empleado} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
