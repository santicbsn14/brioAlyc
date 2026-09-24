// Datos de la página /servicios/productos (brief 6.5).
// Estructura por categorías (ref. TSA) + carrusel animado (ref. Inviu). SIN mercado
// internacional: Brio no opera.
// Todo tipado y listo para migrar a Sanity sin tocar el componente.
//
// CÓMO EDITAR:
//   - Agregar un instrumento → sumar un `{ t, d }` al array `items` de su categoría.
//   - Quitar una categoría   → borrar su objeto de `categorias`; pestañas, dots y
//     carrusel se ajustan solos.
//   - La ilustración de cada slide se elige por `id` de categoría (ver Productos.tsx);
//     una categoría nueva con un `id` desconocido muestra la ilustración genérica.
//
// TODO (provisorio / a confirmar con Agus):
//   - Renta variable: Acciones, CEDEARs y ADRs (confirmado por Agus que Brio opera CEDEARs
//     y ADRs). Pendiente confirmar si se suman opciones.
//   - Futuros y opciones: confirmar que va como categoría.
//   - Copy de las líneas explicativas: provisorio.

/** Un instrumento: `t` = nombre, `d` = línea explicativa. */
export interface Instrumento {
  t: string;
  d: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  claim: string;
  items: Instrumento[];
}

export const productosHeader = {
  kicker: 'Productos',
  title: 'Elegí en qué invertir',
  lead: 'Una cartera de instrumentos para diseñar la estrategia que se adapte a tu perfil, tanto para invertir como para financiar tu empresa.',
};

export const categorias: Categoria[] = [
  {
    id: 'renta-fija',
    nombre: 'Renta fija',
    claim: 'Previsibilidad y flujo de fondos conocido.',
    items: [
      {
        t: 'Títulos públicos y soberanos',
        d: 'Bonos del Estado nacional y provincias, en pesos o dólares.',
      },
      {
        t: 'Obligaciones Negociables',
        d: 'Deuda de empresas que paga interés en forma periódica.',
      },
      { t: 'LECAPs', d: 'Instrumentos de corto plazo del Tesoro.' },
      {
        t: 'Cauciones colocadoras',
        d: 'Colocás fondos a plazo corto con garantía del mercado.',
      },
    ],
  },
  {
    id: 'renta-variable',
    nombre: 'Renta variable',
    claim: 'Sé parte de las principales empresas del país.',
    items: [
      {
        t: 'Acciones (BYMA)',
        d: 'Comprá participación en las empresas líderes argentinas.',
      },
      {
        t: 'CEDEARs',
        d: 'Comprá en pesos partes de empresas del exterior, como Apple o Tesla.',
      },
      {
        t: 'ADRs',
        d: 'Acciones argentinas que cotizan en el mercado de Estados Unidos.',
      },
    ],
  },
  {
    id: 'financiamiento',
    nombre: 'Financiamiento',
    claim: 'El mercado de capitales al servicio de tu empresa.',
    items: [
      {
        t: 'Cheques de Pago Diferido',
        d: 'Descontá cheques propios o de terceros con el aval de una SGR.',
      },
      {
        t: 'Fideicomisos Financieros',
        d: 'Estructurá y colocá activos para fondear tu proyecto.',
      },
      { t: 'Pagarés Bursátiles', d: 'Financiamiento de corto plazo para tu PyME.' },
    ],
  },
  {
    id: 'futuros',
    nombre: 'Futuros y opciones',
    claim: 'Cobertura frente a la volatilidad de precios.',
    items: [
      {
        t: 'Futuros de dólar',
        d: 'Cubrí tu posición ante la variación del tipo de cambio.',
      },
      { t: 'Financieros', d: 'Futuros sobre índices, tasas y activos financieros.' },
      { t: 'Agropecuarios', d: 'Cobertura para granos y producción del campo.' },
      { t: 'Commodities', d: 'Contratos sobre materias primas.' },
    ],
  },
];
