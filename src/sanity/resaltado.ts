// Ayudas para los campos "Texto con resaltado" de Sanity (las usa TextoResaltado.tsx y los
// componentes conectados que tienen que decidir si pintar el párrafo).
import type { TextoResaltadoDoc } from './types';

/** Nombre de la marca en Sanity (MARCA_RESALTADO del Studio). */
export const MARCA_RESALTADO = 'resaltado';

/** Los pedazos del párrafo (el tipo tiene un solo bloque). */
export const spansResaltado = (value?: TextoResaltadoDoc | null) => value?.[0]?.children ?? [];

/** true si el párrafo tiene algo escrito: vacío o un bloque sin texto → false (no se pinta el <p>). */
export const tieneTexto = (value?: TextoResaltadoDoc | null) =>
  spansResaltado(value).some((s) => s.text?.trim());
