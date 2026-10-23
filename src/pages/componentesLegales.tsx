import type { PortableTextComponents } from '@portabletext/react';
import styles from './LegalDoc.module.css';

/** Los hijos de un bloque: pedazos de texto (`text`) y, en un inciso con subincisos, la lista anidada. */
type Hijos = { _type: string; text?: unknown }[] | undefined;

const tieneTexto = (children: Hijos) =>
  (children ?? []).some((c) => typeof c.text === 'string' && c.text.trim());

/** Cómo se pinta el cuerpo de las dos páginas legales (campo "Texto legal" de Sanity, entrada
 * "Legales" de PROGRESO-STUDIO.md). Mismo HTML que tenían con `data/legal.ts`, así
 * LegalDoc.module.css no cambia:
 *  - "Título de capítulo" (`h2`) → `.chapter` + `<h2 class="chapterTitle">`;
 *  - "Título de sección" (`h3` en Sanity, para que el pegado desde Word lo reconozca) → `.section`
 *    + `<h2 class="sectionTitle">`. Los dos son `<h2>`, como siempre;
 *  - viñetas → `.list`, y las del segundo nivel (subincisos) → `.sublist`, adentro del inciso;
 *  - los párrafos vacíos (los que entran al pegar desde Word) no se pintan.
 * El `<div>` de cada título envuelve solo al título (el cuerpo es plano), pero como `.chapter` y
 * `.section` solo dan margen de arriba, los márgenes quedan iguales. */
export const componentesLegales: PortableTextComponents = {
  block: {
    normal: ({ value, children }) =>
      tieneTexto(value.children) ? <p className={styles.p}>{children}</p> : null,
    h2: ({ children }) => (
      <div className={styles.chapter}>
        <h2 className={styles.chapterTitle}>{children}</h2>
      </div>
    ),
    h3: ({ children }) => (
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{children}</h2>
      </div>
    ),
  },
  list: {
    bullet: ({ value, children }) => (
      <ul className={value.level && value.level > 1 ? styles.sublist : styles.list}>{children}</ul>
    ),
  },
  listItem: {
    // Un inciso vacío tampoco se pinta, salvo que tenga subincisos (la lista anidada viene como
    // un hijo más, de tipo "@list").
    bullet: ({ value, children }) =>
      tieneTexto(value.children) || (value.children as Hijos)?.some((c) => c._type === '@list') ? (
        <li>{children}</li>
      ) : null,
  },
};
