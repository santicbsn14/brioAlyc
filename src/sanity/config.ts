// Configuración de la conexión con Sanity (el Studio vive en el repo hermano `brio-studio`).
// projectId y dataset no son secretos: el dataset es público para lectura y no usamos token.
// Se pueden pisar con variables de entorno (ver .env.example).

export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 's4crxz9i';
export const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';

/** Fecha fija de la API de Sanity: si Sanity cambia algo, esta versión sigue respondiendo igual. */
export const apiVersion = '2026-10-01';

/** CDN de Sanity: más rápido, pero tarda unos segundos en ver lo que se publica en el Studio.
 * Apagado en local y en las previews (lo publicado se ve al recargar); prendido solo en el build
 * de producción con VITE_SANITY_USE_CDN=true (cargarla solo en el entorno Production de Vercel:
 * las previews de Vercel también son builds de producción). */
export const useCdn = import.meta.env.PROD && import.meta.env.VITE_SANITY_USE_CDN === 'true';

/** Mostrar los recuadros "Falta cargar en Sanity" (components/FaltaCargar): siempre con
 * `vite dev`, y en un build solo si VITE_MOSTRAR_FALTANTES=true (para la preview de Vercel). */
export const mostrarFaltantes = import.meta.env.DEV || import.meta.env.VITE_MOSTRAR_FALTANTES === 'true';
