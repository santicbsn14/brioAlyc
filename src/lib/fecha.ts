// Fechas de Sanity ("AAAA-MM-DD"), partidas a mano. `new Date("AAAA-MM-DD")` la toma como
// medianoche UTC, que en Argentina es el día anterior (y el 1° de enero, el año anterior). Así no
// depende de la zona horaria ni del idioma del navegador. La usan Informes y Comisiones.

export const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/** "AAAA-MM-DD" → `{ dia, mes, anio }`, con `mes` ya en palabras ("julio"). Otro formato → null. */
export function partirFecha(iso?: string | null) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '');
  const mes = m && MESES[Number(m[2]) - 1];
  return m && mes ? { dia: Number(m[3]), mes, anio: m[1] } : null;
}
