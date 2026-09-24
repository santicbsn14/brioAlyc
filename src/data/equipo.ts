// TODO(Agus): TODO el contenido de este archivo (nombres, cargos, bios, fotos) es de
// EJEMPLO. Se reemplaza cuando Agus mande las fotos reales (orientación vertical 4:5,
// las 12 personas) y la nómina real (nombres, cargos y, para los socios, la bio con
// años de mercado). El componente Equipo.tsx no se toca para cargar el contenido real:
// alcanza con editar los arrays de acá.
//
// Modelo pensando en Sanity (ver doc de contexto del proyecto): cada persona (socio o
// empleado) es en el fondo un documento "Persona" — nombre, cargo, foto, y los socios
// además tienen bio y años de mercado. Es probable que en Sanity "socios" y "empleados"
// terminen siendo un único tipo de documento "Persona" con un campo de tipo/booleano
// ("esSocio") en vez de dos arrays separados como acá. Esa es una decisión de la Fase 2
// (modelo de Sanity), no se cambia la estructura ahora — queda solo la nota.

export interface Socio {
  id: string;
  nombre: string;
  cargo: string;
  bio: string;
  /** URL/import de la foto (vertical 4:5). Ausente = se muestra el avatar placeholder (iniciales). */
  foto?: string;
}

export interface Empleado {
  id: string;
  nombre: string;
  cargo: string;
  /** URL/import de la foto (vertical 4:5). Ausente = se muestra el avatar placeholder (iniciales). */
  foto?: string;
}

export const equipo = {
  kicker: 'Nuestra gente',
  title: 'El equipo detrás de Brio',
  lead: 'Un grupo de especialistas que combina experiencia de mercado con cercanía real con cada cliente.',

  socios: [
    {
      id: 's1',
      nombre: 'Nombre Apellido',
      cargo: 'Socio Director',
      bio: 'Más de X años en el mercado de capitales. Texto de ejemplo a reemplazar por la descripción real.',
    },
    {
      id: 's2',
      nombre: 'Nombre Apellido',
      cargo: 'Socia',
      bio: 'Más de X años en el mercado de capitales. Texto de ejemplo a reemplazar por la descripción real.',
    },
    {
      id: 's3',
      nombre: 'Nombre Apellido',
      cargo: 'Socio',
      bio: 'Más de X años en el mercado de capitales. Texto de ejemplo a reemplazar por la descripción real.',
    },
  ] satisfies Socio[],

  equipoLabel: 'Equipo',
  // 9 empleados de ejemplo — nombres/cargos genéricos hasta tener la nómina real.
  empleados: Array.from({ length: 9 }, (_, i) => ({
    id: `e${i + 1}`,
    nombre: 'Nombre Apellido',
    cargo: 'Cargo',
  })) satisfies Empleado[],
};
