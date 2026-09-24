import { useEffect, useRef } from 'react';

/**
 * Aparición progresiva al scrollear (fade + subida), vía IntersectionObserver.
 * Dentro del elemento devuelto, observa los hijos que tengan `revealClassName`
 * y les agrega `inClassName` la primera vez que entran en viewport (una sola
 * vez). Respeta prefers-reduced-motion: si está activo, todo aparece de una,
 * sin animar.
 *
 * Patrón pedido por la clienta (ref. Inviu) para la sección de Servicios —
 * pensado para reusarse tal cual en las próximas secciones de la home.
 */
export function useReveal<T extends HTMLElement>(revealClassName: string, inClassName: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const nodes = root.querySelectorAll<HTMLElement>(`.${CSS.escape(revealClassName)}`);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      nodes.forEach((node) => node.classList.add(inClassName));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(inClassName);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [revealClassName, inClassName]);

  return ref;
}
