import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Reintentos máximos esperando que el elemento del hash aparezca en el DOM (ver abajo). */
const MAX_HASH_RETRIES = 30;

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
 * que ya estamos (ej. tocar dos veces "Abrí tu cuenta" estando en la home) vuelve a scrollear.
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
    // Si la persona scrollea por su cuenta, no se la vuelve a mover (ver abajo).
    let scrolleoPropio = false;
    const marcarScrolleo = () => {
      scrolleoPropio = true;
    };
    const eventos = ['wheel', 'touchmove', 'keydown', 'mousedown'] as const;
    eventos.forEach((e) => window.addEventListener(e, marcarScrolleo, { passive: true }));

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
        // En una carga en frío las fuentes (Google Fonts) suelen terminar de cargar después de
        // este scroll y cambian el alto de todo lo de arriba: el elemento queda corrido cientos
        // de píxeles. Cuando terminan, se vuelve a acomodar. Se busca de nuevo por id: la sección
        // puede haberse reemplazado mientras tanto (ej. Contacto, cuando llegan sus datos de Sanity).
        if (document.fonts.status !== 'loaded') {
          document.fonts.ready.then(() => {
            if (vigente && !scrolleoPropio) {
              document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
            }
          });
        }
        return;
      }
      attempts += 1;
      if (attempts < MAX_HASH_RETRIES) {
        raf = requestAnimationFrame(tryScroll);
      }
    };
    tryScroll();

    return () => {
      vigente = false;
      cancelAnimationFrame(raf);
      eventos.forEach((e) => window.removeEventListener(e, marcarScrolleo));
    };
  }, [pathname, hash, key]);
}
