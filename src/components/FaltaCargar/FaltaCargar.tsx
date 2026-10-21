import { mostrarFaltantes } from '../../sanity/config';
import styles from './FaltaCargar.module.css';

export interface FaltaCargarProps {
  /** Nombre del documento como se ve en el Studio, ej. "Footer". */
  nombre: string;
  /** Dónde se carga en el menú del Studio, ej. "General → Footer". */
  ubicacion: string;
}

/** Recuadro para cuando un documento de Sanity no está cargado/publicado (la query vuelve `null`).
 * Solo se ve con `vite dev` o con VITE_MOSTRAR_FALTANTES=true (preview de Vercel); en producción
 * no pinta nada y la sección simplemente no aparece. */
export default function FaltaCargar({ nombre, ubicacion }: FaltaCargarProps) {
  if (!mostrarFaltantes) return null;

  return (
    <div className={styles.recuadro} role="note">
      <p className={styles.titulo}>Falta cargar en Sanity: {nombre}</p>
      <p className={styles.ubicacion}>Se carga en el Studio, en {ubicacion}, y hay que tocar Publicar.</p>
    </div>
  );
}

/** Variante chica, para algo que falta dentro de una sección que sí se muestra (ej. Servicios sin
 * alguna categoría de Productos). `texto` dice qué falta y dónde se carga. Mismas reglas: solo en
 * dev o con VITE_MOSTRAR_FALTANTES=true. */
export function AvisoFaltante({ texto }: { texto: string }) {
  if (!mostrarFaltantes) return null;

  return (
    <p className={`${styles.recuadro} ${styles.chico}`} role="note">
      {texto}
    </p>
  );
}
