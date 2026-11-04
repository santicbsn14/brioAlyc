import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { paginaDe, urlCanonica } from './paginas';

/** Cambia el valor de una etiqueta que ya trae index.html. No crea etiquetas: si no está, no
 * hace nada (así nunca quedan duplicadas en el <head>). */
function actualizar(selector: string, atributo: 'content' | 'href', valor: string) {
  document.head.querySelector(selector)?.setAttribute(atributo, valor);
}

/**
 * Al cambiar de ruta, actualiza título, descripción, canonical y Open Graph con los datos de
 * src/seo/paginas.ts. Las etiquetas ya están en index.html (con los valores de la home, para los
 * que no ejecutan JS); acá solo se les cambia el valor. La meta robots la maneja `useNoIndex`.
 */
export function useSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const pagina = paginaDe(pathname);
    const url = urlCanonica(pathname);
    document.title = pagina.titulo;
    actualizar('meta[name="description"]', 'content', pagina.descripcion);
    actualizar('link[rel="canonical"]', 'href', url);
    actualizar('meta[property="og:title"]', 'content', pagina.titulo);
    actualizar('meta[property="og:description"]', 'content', pagina.descripcion);
    actualizar('meta[property="og:url"]', 'content', url);
  }, [pathname]);
}

/** Cuántos componentes piden "noindex" en este momento. */
let pedidosNoIndex = 0;

/**
 * Mientras `activo` sea true y el componente esté montado, el <head> lleva
 * <meta name="robots" content="noindex">; al desmontarse (o pasar a false) se saca. Es la única
 * etiqueta que se agrega y se quita, y nunca hay más de una.
 */
export function useNoIndex(activo = true) {
  useEffect(() => {
    if (!activo) return;
    pedidosNoIndex += 1;
    if (!document.head.querySelector('meta[name="robots"]')) {
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex';
      document.head.appendChild(meta);
    }
    return () => {
      pedidosNoIndex -= 1;
      if (pedidosNoIndex === 0) document.head.querySelector('meta[name="robots"]')?.remove();
    };
  }, [activo]);
}
