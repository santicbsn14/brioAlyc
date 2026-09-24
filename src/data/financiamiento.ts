// Datos de la página /servicios/financiamiento-pyme (brief 6.4/6.5).
// Versión extendida de Financiamiento PyME: parte del menú Servicios, no página suelta.
// Contenido rescatado del sitio anterior de Brio. Todo tipado y listo para migrar a
// Sanity sin tocar el componente.
//
// CÓMO EDITAR:
//   - Agregar/quitar un beneficio → sumar/borrar un `{ t, d }` en `beneficios`.
//   - Editar los pasos           → cambiar `t`/`d` en `pasos`. `n` es el número que se
//     muestra. La tira está diseñada para exactamente 4 etapas (4 columnas en desktop
//     y la línea entre el centro del 1.º y del 4.º): sumar o quitar una etapa pide
//     ajustar también el CSS de la página.
//   - Frase destacada de la bajada → `lead.destacado` (se ve en blanco y semibold).
//
// TODO (provisorio / a confirmar con Agus): el copy final lo repasa ella.
// Ojo: no copiar del sitio anterior instrumentos discontinuados (ver doc de contexto, 6.4).

/** Un beneficio: `t` = título, `d` = línea explicativa. */
export interface Beneficio {
  t: string;
  d: string;
}

/** Una etapa del proceso: `n` = número de secuencia, `t` = título, `d` = detalle. */
export interface Paso {
  n: number;
  t: string;
  d: string;
}

/** Botón de llamada a la acción. */
export interface Cta {
  label: string;
  href: string;
}

export const financiamientoHeader = {
  kicker: 'Servicios · Financiamiento PyME',
  title: 'Financiá tu PyME en el mercado de capitales',
  /** La bajada va en tres partes para poder resaltar `destacado` sin HTML en el dato. */
  lead: {
    antes:
      'Negociá tus Cheques de Pago Diferido en el Mercado Argentino de Valores (MAV) y en BYMA. Con el ',
    destacado: 'segmento avalado por una SGR',
    despues:
      ', tu empresa accede a financiamiento a tasas competitivas, de forma transparente y segura.',
  },
};

/** Se usa en el CTA de arriba y en el del cierre. Apunta a la sección Contacto de la
 * home con el motivo "pyme" preseleccionado (`Contacto.tsx` lee `?motivo=` al montar). */
export const financiamientoCta: Cta = {
  label: 'Consultá por tu PyME',
  href: '/?motivo=pyme#contacto',
};

export const beneficios: Beneficio[] = [
  {
    t: 'Cheques propios y de terceros',
    d: 'Negociás tus cheques o los de tus clientes en el mercado.',
  },
  {
    t: 'Tasas de gran empresa',
    d: 'Con el aval de una SGR accedés a tasas similares a las de grandes compañías.',
  },
  {
    t: 'Simple, transparente y seguro',
    d: 'Operás bajo oferta pública en el Mercado Argentino de Valores (MAV) y BYMA.',
  },
];

export const pasosHeader = {
  title: 'Cómo negociás tus cheques, paso a paso',
  sub: 'Te acompañamos en todo el armado de la documentación para que puedas operar en el corto plazo.',
};

export const pasos: Paso[] = [
  {
    n: 1,
    t: 'Presentás la documentación',
    d: 'Tu PyME entrega la documentación y Brio la gestiona ante la SGR.',
  },
  {
    n: 2,
    t: 'La SGR emite el aval',
    d: 'La Sociedad de Garantía Recíproca avala tus cheques.',
  },
  {
    n: 3,
    t: 'Brio opera en el mercado',
    d: 'Como agente de negociación, Brio coloca los CPD en el mercado.',
  },
  {
    n: 4,
    t: 'Cobrás los fondos',
    d: 'Recibís el dinero por cheque endosable o transferencia a tu cuenta.',
  },
];

export const financiamientoCierre =
  'Desde Brio Valores acercamos tu PyME al mercado de capitales de manera simple y segura.';
