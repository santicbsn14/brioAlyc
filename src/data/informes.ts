// Datos de la página /informes (menú Herramientas, brief 3.4). Portado del prototipo
// aprobado `__ref/BrioInformes.jsx` (diseño y comportamiento ya validados, no se
// rediseñó nada). Todo tipado y listo para migrar a Sanity sin tocar el componente.
//
// CÓMO EDITAR:
//   - Agregar un informe → sumar un objeto a `informes`. El orden en el array no
//     importa: la página siempre lo muestra ordenado por `fecha` descendente.
//   - Agregar/quitar una categoría → editar `categorias`; chips y badges se ajustan solos.
//
// En Sanity: cada informe es un documento del modelo "Reporte" (doc de contexto, 3.4):
// título, fecha, archivo (campo `file`, PDF) y opcionales resumen + imagen de portada.
// `archivoUrl` acá simula ese campo `file` (hoy un import local, en Sanity la URL del
// asset). `categoria` referenciaría el campo de categoría del modelo si Sanity lo trae.
//
// TODO (provisorio / a confirmar con Agus): las categorías "mensual" y "especial" son de
// ejemplo, para mostrar el filtro funcionando. Solo el primer informe (`id: '1'`) es
// contenido real; los otros tres van comentados como TODO y se reemplazan o se borran
// cuando haya informes reales de esas categorías.

import informeReal from '../assets/informes/informe-2026-07-13.pdf';

export interface CategoriaInforme {
  id: string;
  label: string;
}

/** Un informe: `fecha` en formato ISO (yyyy-mm-dd). `resumen` es opcional en el tipo
 * (Sanity puede no traerlo) aunque hoy todos los informes de ejemplo lo tienen. */
export interface Informe {
  id: string;
  titulo: string;
  fecha: string;
  /** Referencia al `id` de una categoría en `categorias`. */
  categoria: string;
  resumen?: string;
  archivoUrl: string;
}

export const informesPage = {
  kicker: 'Herramientas',
  title: 'Informes',
  lead: 'Análisis y reportes elaborados por nuestro equipo, para que sigas de cerca el contexto macro y de mercado.',
  filterAllLabel: 'Todos',
  emptyLabel: 'Todavía no hay informes en esta categoría.',
  downloadLabel: 'Descargar PDF',
};

export const categorias: CategoriaInforme[] = [
  { id: 'semanal', label: 'Informes semanales' },
  { id: 'mensual', label: 'Informes mensuales' }, // TODO(Agus): categoría de ejemplo, confirmar si aplica
  { id: 'especial', label: 'Informes especiales' }, // TODO(Agus): ídem
];

export const informes: Informe[] = [
  {
    id: '1',
    titulo: 'Informe semanal — Semana del 6 al 12 de julio',
    fecha: '2026-07-13',
    categoria: 'semanal',
    resumen:
      'El Gobierno presentó el programa financiero en dólares para 2026-2027 y el riesgo país perforó mínimos de la gestión.',
    archivoUrl: informeReal,
  },
  // --- de acá para abajo, EJEMPLOS inventados solo para probar el filtro y el orden.
  // TODO: reemplazar por archivo real o borrar cuando haya contenido real de estas categorías.
  {
    id: '2',
    titulo: 'Informe mensual — Junio 2026',
    fecha: '2026-07-02',
    categoria: 'mensual',
    resumen: 'Repaso del mes: inflación, actividad industrial y evolución de tasas en pesos. Contenido de ejemplo.',
    archivoUrl: '#',
  },
  {
    id: '3',
    titulo: 'Informe semanal — Semana del 22 al 28 de junio',
    fecha: '2026-06-29',
    categoria: 'semanal',
    resumen:
      'Cierre de semana con foco en licitación del Tesoro y comportamiento de la curva CER. Contenido de ejemplo.',
    archivoUrl: '#',
  },
  {
    id: '4',
    titulo: 'Especial — Elecciones y mercado',
    fecha: '2026-06-10',
    categoria: 'especial',
    resumen:
      'Qué mirar de cara al calendario electoral y cómo posicionarse en renta fija y variable. Contenido de ejemplo.',
    archivoUrl: '#',
  },
];
