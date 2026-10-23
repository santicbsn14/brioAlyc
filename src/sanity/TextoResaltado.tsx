import { Fragment } from 'react';
import { MARCA_RESALTADO, spansResaltado } from './resaltado';
import type { TextoResaltadoDoc } from './types';

/** Pinta un campo "Texto con resaltado" de Sanity (entrada "Página Financiamiento PyME + tipo 'Texto
 * con resaltado'" de PROGRESO-STUDIO.md). Va adentro del <p> que ya tiene la página. Los resaltados
 * salen como <strong>, que cada página pinta con su CSS (ej. `.lead strong`). Un Shift+Enter llega
 * como "\n" dentro del texto y en el <p> se ve como un espacio. Antes de pintar el <p>, mirar
 * `tieneTexto` (./resaltado.ts). */
export default function TextoResaltado({ value }: { value?: TextoResaltadoDoc | null }) {
  return (
    <>
      {spansResaltado(value).map((s, i) => {
        const key = s._key || String(i);
        return s.marks?.includes(MARCA_RESALTADO) ? (
          <strong key={key}>{s.text}</strong>
        ) : (
          <Fragment key={key}>{s.text}</Fragment>
        );
      })}
    </>
  );
}
