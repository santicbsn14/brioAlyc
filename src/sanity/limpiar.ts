// Textos de Sanity usados para algo más que pintarlos.
//
// Adentro de la "Vista previa" del Studio, cada texto de Sanity trae al final unos caracteres
// invisibles (stega) que dicen de qué documento y campo sale: así, al tocarlo, se abre ese campo.
// Para pintarlo hay que dejarlos (si no, deja de ser clickeable), pero para cualquier otra cosa
// (armar un link, comparar, partir, decidir si está vacío, un atributo) hay que sacarlos.
// En la web pública los textos llegan sin esos caracteres y estas funciones no cambian nada.
// Ver PROGRESO.md, entrada "Vista previa del Studio (edición visual)".
import { stegaClean } from '@sanity/client/stega';

/** El texto sin los caracteres invisibles. Para links, comparaciones, atributos y cuentas. */
export const limpio = (t?: string | null): string => (t ? stegaClean(t) : '');

/** true si tiene algo escrito (no vacío ni solo espacios), sin contar los caracteres invisibles. */
export const hayTexto = (t?: string | null): t is string => limpio(t).trim() !== '';

/**
 * Un opcional para pintar: `undefined` si está vacío. En la web pública, recortado (como siempre);
 * en la vista previa, tal cual (`trim()` borraría parte de los caracteres invisibles del final).
 */
export const texto = (t?: string | null): string | undefined => {
  if (!hayTexto(t)) return undefined;
  return t === limpio(t) ? t.trim() : t;
};

/** Un texto para un atributo (alt, aria-label, placeholder…): limpio, o `undefined` si está vacío. */
export const paraAtributo = (t?: string | null): string | undefined => limpio(t).trim() || undefined;

/** Los caracteres invisibles del final del texto (vacío en la web pública). */
const marca = (t: string) => {
  const c = limpio(t);
  return t.startsWith(c) ? t.slice(c.length) : '';
};

/**
 * Parte un texto en pedazos (párrafos, renglones) y le devuelve a cada pedazo la marca invisible
 * del texto entero: así cada párrafo sigue llevando al mismo campo. Los pedazos vacíos se sacan.
 */
export const partir = (t: string | null | undefined, separador: RegExp | string): string[] => {
  if (!t) return [];
  const m = marca(t);
  return limpio(t)
    .split(separador)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => p + m);
};

/** Los renglones de un texto unidos en uno solo, con un espacio (ej. la razón social). */
export const unirRenglones = (t?: string | null): string | undefined => {
  if (!hayTexto(t)) return undefined;
  const renglones = limpio(t)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  return renglones.join(' ') + marca(t);
};

/** Párrafos de un texto plano: cada renglón en blanco (dos Enter) empieza uno nuevo; un Enter solo
 * queda dentro del mismo párrafo (en la web se ve como un espacio). */
export const partirParrafos = (t?: string | null) => partir(t, /\n\s*\n/);
