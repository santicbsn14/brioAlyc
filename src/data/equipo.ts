// Contenido real de la sección Equipo (nómina, cargos, bios de socios y fotos). Fotos en
// src/assets/equipo/ (WebP 960x1200, vertical 4:5). El componente Equipo.tsx no se toca
// para cambiar el contenido: alcanza con editar los arrays de acá.
//
// Modelo pensando en Sanity (ver doc de contexto del proyecto): cada persona (socio o
// empleado) es en el fondo un documento "Persona" — nombre, cargo, foto, y los socios
// además tienen bio (corta + extendida). Es probable que en Sanity "socios" y "empleados"
// terminen siendo un único tipo de documento "Persona" con un campo de tipo/booleano
// ("esSocio") en vez de dos arrays separados como acá. Esa es una decisión de la Fase 2
// (modelo de Sanity), no se cambia la estructura ahora — queda solo la nota.

import fotoCarlosRodriguezAnsaldi from '../assets/equipo/carlos-rodriguez-ansaldi.webp';
import fotoPabloBortolato from '../assets/equipo/pablo-bortolato.webp';
import fotoAgustinaIglesias from '../assets/equipo/agustina-iglesias.webp';
import fotoFabricioGattuso from '../assets/equipo/fabricio-gattuso.webp';
import fotoLucioMattana from '../assets/equipo/lucio-mattana.webp';
import fotoMateoTorti from '../assets/equipo/mateo-torti.webp';
import fotoSofiaCovolo from '../assets/equipo/sofia-covolo.webp';
import fotoIvanCoronel from '../assets/equipo/ivan-coronel.webp';
import fotoMauricioAlbarenque from '../assets/equipo/mauricio-albarenque.webp';
import fotoSantiagoMusuruana from '../assets/equipo/santiago-musuruana.webp';
import fotoNahuelNoguera from '../assets/equipo/nahuel-noguera.webp';

export interface Socio {
  id: string;
  nombre: string;
  cargo: string;
  /** Bio corta, siempre visible en la tarjeta. */
  bio: string;
  /** Bio completa, se despliega con "Ver más". Ausente = la tarjeta no muestra el toggle. */
  bioExtendida?: string;
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
      id: 'carlos-rodriguez-ansaldi',
      nombre: 'Carlos Alberto Rodríguez Ansaldi',
      cargo: 'Presidente del Directorio',
      foto: fotoCarlosRodriguezAnsaldi,
      bio: 'Agente de Bolsa del Mercado de Valores de Rosario desde 1993. Expresidente del Mercado de Valores de Rosario y de Rosario Valores Sociedad de Bolsa.',
      bioExtendida:
        'Perteneció a la sociedad Rodríguez Ansaldi de su padre, que data del año 1961. Agente de Bolsa del Mercado de Valores de Rosario desde el año 1993. Participó en el ámbito institucional como Director del Mercado de Valores de Rosario entre los años 1996 y 2008, Presidente desde el año 2008 hasta el año 2012. En Rosario Valores Sociedad de Bolsa S.A. ha sido Vicepresidente desde el año 2002 y luego desde el 2007 al 2013 fue Presidente. Ex Presidente de la Cámara de Agentes de Bolsa de Rosario, Ex miembro del Consejo de la Bolsa de Comercio de Rosario, Ex Director de la Bolsa de Comercio de Rosario, y Ex Consejero suplente de la Bolsa de Comercio de Buenos Aires.',
    },
    {
      id: 'pablo-bortolato',
      nombre: 'Pablo Alberto Bortolato',
      cargo: 'Socio',
      foto: fotoPabloBortolato,
      bio: 'Tercera generación de brokers de su familia. Agente del Mercado de Valores de Rosario desde 1994. Actual presidente del Mercado Argentino de Valores S.A.',
      bioExtendida:
        'Es la tercera generación de Brokers de la familia Bortolato, viene de su abuelo Amadeo Bortolato desde 1955. Agente del Mercado de Valores de Rosario desde el año 1994. Fue vocal en la Bolsa de Comercio de Rosario en el año 2013, y en el año 2014 Protesorero Segundo. Vicepresidente del Mercado Argentino de Valores S.A. del 2012 al 2016. Actual presidente del Mercado Argentino de Valores S.A.',
    },
    {
      id: 'claudio-iglesias',
      nombre: 'Claudio Adrián Iglesias',
      cargo: 'Socio',
      // TODO(Agus): falta la foto — hasta que llegue se muestra el avatar con iniciales.
      bio: 'Contador Público Nacional. Broker del Mercado de Valores de Rosario desde hace más de 20 años. Expresidente del Mercado Argentino de Valores S.A.',
      bioExtendida:
        'Es Broker desde hace más de 20 años del Mercado de Valores de Rosario. Contador Público Nacional. Fue Presidente del Mercado Argentino de Valores S.A. del 2012 al 2016, Ex Presidente de Rosario Fiduciaria S.A., Ex Miembro del Consejo Consultivo de la Bolsa de Comercio de Rosario, Ex Director de la Bolsa de Comercio de Rosario, Ex Revisor de Cuentas de la Cámara de Agentes de Bolsa de Rosario.',
    },
  ] satisfies Socio[],

  equipoLabel: 'Equipo',
  // NOTA: Agus avisó que el mes que viene (nov. 2026) se suma una décima persona, del área
  // Comercial. Cuando llegue, es solo sumar un objeto más a este array (con su foto en
  // src/assets/equipo/) — la grilla se reacomoda sola. No se deja un casillero vacío.
  empleados: [
    { id: 'agustina-iglesias', nombre: 'Agustina Iglesias', cargo: 'Gerencia', foto: fotoAgustinaIglesias },
    { id: 'fabricio-gattuso', nombre: 'Fabricio Gattuso', cargo: 'Coordinador Back Office', foto: fotoFabricioGattuso },
    { id: 'lucio-mattana', nombre: 'Lucio Mattana', cargo: 'Liquidaciones', foto: fotoLucioMattana },
    { id: 'mateo-torti', nombre: 'Mateo Torti', cargo: 'Liquidaciones', foto: fotoMateoTorti },
    { id: 'sofia-covolo', nombre: 'Sofía Cóvolo', cargo: 'Tesorería', foto: fotoSofiaCovolo },
    { id: 'ivan-coronel', nombre: 'Iván Coronel', cargo: 'Contable', foto: fotoIvanCoronel },
    { id: 'mauricio-albarenque', nombre: 'Mauricio Albarenque', cargo: 'Compliance', foto: fotoMauricioAlbarenque },
    { id: 'santiago-musuruana', nombre: 'Santiago Musuruana', cargo: 'Compliance', foto: fotoSantiagoMusuruana },
    { id: 'nahuel-noguera', nombre: 'Nahuel Noguera', cargo: 'Research', foto: fotoNahuelNoguera },
  ] satisfies Empleado[],
};
