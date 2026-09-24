// Helpers de formateo compartidos por las 4 pestañas del Panel de Renta Fija.
// Presentación pura (no cálculo financiero) — no vienen del original 1:1 porque el
// HTML viejo formateaba inline con template strings; acá se centralizan para no
// repetir el mismo `.toLocaleString('es-AR', …)` en cada tabla.

export function fmtNum(n: number | null | undefined, decimals = 2): string {
  if (n === null || n === undefined || !isFinite(n)) return '—';
  return n.toLocaleString('es-AR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function fmtPct(n: number | null | undefined, decimals = 2): string {
  if (n === null || n === undefined || !isFinite(n)) return '—';
  return `${(n * 100).toLocaleString('es-AR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}%`;
}

/** "YYYY-MM-DD" → "dd/mm/yyyy" */
export function fmtFechaISO(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

/** "YYYY-MM-DD" → "Julio 2026" */
export function fmtMesISO(iso: string): string {
  const [, m] = iso.split('-');
  return MESES[parseInt(m, 10) - 1];
}
