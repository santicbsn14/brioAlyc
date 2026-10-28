// Lo mínimo de la edición visual que va en la web pública: saber si la página está adentro de la
// "Vista previa" del Studio y, para fotos y PDFs, el atributo que las hace clickeables ahí.
// El código de edición en sí (overlays, datos en vivo, stega) está en ./vistaPrevia/ y se baja
// recién cuando hace falta (main.tsx). Ver PROGRESO.md, entrada "Vista previa del Studio".

/**
 * true si la web está adentro de un iframe: así la muestra la Vista previa del Studio. Ningún otro
 * sitio puede mostrarla en un iframe (vercel.json solo se lo permite al Studio), así que para un
 * visitante común es siempre false. Si el navegador no deja mirar la ventana de arriba (otro
 * origen, en algunos navegadores), también es un iframe.
 */
export function enVistaPrevia(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

/** Arma el atributo `data-sanity` (lo registra ./vistaPrevia/ al cargarse). */
type CrearAtributo = (doc: { id: string; type: string }, campo: string) => string;

let crearAtributo: CrearAtributo | null = null;

export function registrarAtributoEdicion(crear: CrearAtributo) {
  crearAtributo = crear;
}

/**
 * Atributo `data-sanity` de un elemento que no es texto (una foto, el link al PDF): en la vista
 * previa, tocarlo abre ese campo del documento. En la web pública, `undefined` (no se pinta).
 */
export const atributoEdicion = (id: string | undefined, tipo: string, campo: string) =>
  crearAtributo && id ? crearAtributo({ id: id.replace(/^drafts\./, ''), type: tipo }, campo) : undefined;
