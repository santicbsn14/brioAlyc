import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Reintentos máximos esperando que el elemento del hash aparezca en el DOM (ver abajo). */
const MAX_HASH_RETRIES = 30;

/** Cuánto tiempo, después de scrollear a un hash, se mantiene la sección alineada si la página
 * cambia de alto (ver abajo). Alcanza para una respuesta de Sanity lenta (2–3 s). */
const SEGUIR_MS = 4000;

/**
 * React Router no resetea el scroll al navegar entre rutas (a diferencia de una
 * carga de página normal). Sin esto, un link que vive lejos del tope de la página
 * (p. ej. el CTA "Ver comisiones completas" al final de Servicios) deja la próxima
 * página con el scroll heredado: su encabezado queda arriba del viewport y nunca
 * dispara el reveal-on-scroll (useReveal), así que se ve en blanco hasta que el
 * usuario scrollea a mano.
 *
 * Si la navegación además trae un hash (ej. "/?motivo=pyme#contacto" desde el CTA de
 * Financiamiento PyME, o "#quienes" del navbar estando parado en otra ruta), no hay
 * que ir a (0,0): hay que scrollear hasta ese elemento. Como recién estamos navegando,
 * la página de destino puede todavía no haber montado el elemento del hash en el primer
 * render — se reintenta con requestAnimationFrame hasta encontrarlo (con un tope, para
 * no quedar reintentando para siempre si el id no existe).
 *
 * Depende también de `key` (cambia en cada navegación): así un link a la misma URL en la
 * que ya estamos (ej. tocar dos veces "Contacto" del Navbar estando en la home) vuelve a scrollear.
 */
export function useScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    let raf = 0;
    let attempts = 0;
    let vigente = true;
    let observer: ResizeObserver | undefined;
    let timer = 0;
    const eventos = ['wheel', 'touchstart', 'touchmove', 'keydown', 'mousedown'] as const;

    // Se vuelve a buscar por id cada vez: la sección puede haberse reemplazado mientras tanto
    // (ej. Contacto, que se monta recién cuando llegan sus datos de Sanity).
    const alinear = () => {
      if (vigente) document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    };

    // Después del primer scroll, lo de arriba puede cambiar de alto: las fuentes (Google Fonts)
    // que terminan de cargar en una carga en frío, o una sección que recién llega de Sanity
    // (ej. Servicios, que no ocupa lugar mientras carga). Mientras la página cambie de alto, se
    // mantiene la sección alineada, durante SEGUIR_MS como máximo. Se deja de seguir en cuanto la
    // persona scrollea, toca la pantalla, hace click o usa el teclado: nunca se le roba el scroll.
    const dejarDeSeguir = () => {
      vigente = false;
      observer?.disconnect();
      window.clearTimeout(timer);
      eventos.forEach((e) => window.removeEventListener(e, dejarDeSeguir));
    };
    eventos.forEach((e) => window.addEventListener(e, dejarDeSeguir, { passive: true }));

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
        observer = new ResizeObserver(alinear);
        observer.observe(document.body);
        timer = window.setTimeout(() => {
          observer?.disconnect();
          // Las fuentes pueden tardar más que SEGUIR_MS con una conexión lenta: ese único caso
          // se sigue esperando (sin tope), con las mismas condiciones.
          if (document.fonts.status !== 'loaded') document.fonts.ready.then(alinear);
        }, SEGUIR_MS);
        return;
      }
      attempts += 1;
      if (attempts < MAX_HASH_RETRIES) {
        raf = requestAnimationFrame(tryScroll);
      }
    };
    tryScroll();

    return () => {
      cancelAnimationFrame(raf);
      dejarDeSeguir();
    };
  }, [pathname, hash, key]);
}
