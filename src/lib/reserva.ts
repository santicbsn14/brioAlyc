// Texto de relleno para las "cáscaras" de carga (Hero, Servicios, Quiénes somos, Equipo, Productos,
// Financiamiento PyME, Abrí tu cuenta, Informes y Comisiones):
// mientras llegan los textos de Sanity, el componente pinta este texto invisible para ocupar el
// mismo alto que el real y que la página no salte. Nunca se ve.

/** Letras y largos de palabra parecidos a los de un texto real. */
const RELLENO =
  'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi';

/** Texto invisible de `largo` caracteres: corta en renglones más o menos como un texto de verdad
 * del mismo largo, así reserva su alto en cualquier ancho. Si hace falta más largo que RELLENO,
 * lo repite. */
export const reserva = (largo: number) =>
  `${RELLENO} `.repeat(Math.ceil(largo / RELLENO.length)).slice(0, largo).trim();
