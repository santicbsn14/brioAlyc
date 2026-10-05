import { useCallback, useEffect, useRef, useState } from 'react';
import type { AccionLider } from '../data/accionesLideres';
import { parseAccionesLideres, type CotizacionAccion } from '../lib/mercado/accionesLideres';
import type { FetchStatus } from './useRentaFija';

/** Default = TTL de caché del proxy (api/_lib/data912.ts): refrescar más seguido no trae datos nuevos. */
const DEFAULT_INTERVAL_SEC = 90;
const FLASH_MS = 550;
const SIM_TICK_MS = 2800;

export type FuenteAcciones = 'ejemplo' | 'data912';

export interface OpcionesAccionesLideres {
  /** Segundos entre refrescos automáticos; 0 = sin auto-refresh. Default 90. */
  intervalSec?: number;
  /**
   * Latido simulado (deriva aleatoria + resaltado) mientras se ven los precios de
   * `fallback`. Default true (Hero). La tabla de /herramientas/acciones lo apaga: su
   * fallback no tiene precios, son filas con "—" mientras carga.
   */
  simularLatido?: boolean;
}

/**
 * Cotizaciones de las acciones líderes (data912 arg_stocks vía /api/mercado/arg-stocks).
 * Lo usan el panel resumido del Hero y la tabla completa de /herramientas/acciones.
 *
 * - Arranca con `fallback` para que el primer render nunca esté vacío, y al montar
 *   pide el endpoint. Si responde bien, pasa a datos reales; si falla, se queda con lo
 *   que tenía (el fallback, o el último dato real bueno si la falla es en un refresh
 *   posterior) — nunca vuelve al fallback después de haber mostrado reales.
 * - Auto-refresh cada `intervalSec` (solo con la pestaña visible; al volver a la
 *   pestaña refresca si ya pasó ese tiempo). Cambiar el intervalo no dispara un fetch,
 *   solo rearma el timer — mismo criterio que Renta Fija. `refrescar` fuerza uno manual.
 * - Resalta (`flash`) las filas cuyo precio o % cambió entre datos reales. Ese resaltado
 *   reemplaza al "latido" simulado: sobre precios reales no se inventan movimientos.
 * - Mientras se ven los precios de ejemplo, si `simularLatido`, se mantiene el latido
 *   simulado del mock original, salvo con prefers-reduced-motion.
 */
export function useAccionesLideres(
  lideres: AccionLider[],
  fallback: CotizacionAccion[],
  { intervalSec = DEFAULT_INTERVAL_SEC, simularLatido = true }: OpcionesAccionesLideres = {},
) {
  const [stocks, setStocks] = useState<CotizacionAccion[]>(fallback);
  const [fuente, setFuente] = useState<FuenteAcciones>('ejemplo');
  const [flash, setFlash] = useState<ReadonlySet<string>>(() => new Set());
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  // Último dato real recibido, para resaltar solo lo que cambió entre refrescos.
  const ultimoReal = useRef<CotizacionAccion[] | null>(null);
  const ctrlRef = useRef<AbortController | null>(null);
  const ultimoFetchRef = useRef(0);

  const refrescar = useCallback(async () => {
    ctrlRef.current?.abort();
    const actual = new AbortController();
    ctrlRef.current = actual;
    ultimoFetchRef.current = Date.now();
    setStatus('loading');
    try {
      const res = await fetch('/api/mercado/arg-stocks', { cache: 'no-store', signal: actual.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const filas = parseAccionesLideres(await res.json(), lideres);
      if (!filas) throw new Error('la respuesta no trae ninguno de los tickers');

      const prev = ultimoReal.current;
      const cambiaron = filas
        .filter((f, i) => !prev || prev[i]?.price !== f.price || prev[i]?.changePct !== f.changePct)
        .map((f) => f.symbol);
      ultimoReal.current = filas;
      setStocks(filas);
      setFuente('data912');
      setStatus('ok');
      setLastUpdated(new Date());
      if (cambiaron.length) setFlash(new Set(cambiaron));
    } catch (err) {
      if (actual.signal.aborted) return;
      setStatus('error');
      // warn y no error: lo que se estaba mostrando sigue en pantalla, no rompe nada.
      console.warn('[useAccionesLideres] sin datos de arg-stocks, se mantiene lo que había:', err);
    }
  }, [lideres]);

  // Fetch inicial. Con setTimeout(0) (mismo patrón que useRentaFija): el cleanup lo
  // cancela en el doble montaje de StrictMode, y el setState de `refrescar` no corre
  // sincrónico dentro del efecto.
  useEffect(() => {
    const t = setTimeout(() => void refrescar(), 0);
    return () => {
      clearTimeout(t);
      ctrlRef.current?.abort();
    };
  }, [refrescar]);

  // Auto-refresh + refresco al volver a la pestaña si el dato quedó viejo.
  useEffect(() => {
    if (intervalSec <= 0) return undefined;
    const ms = intervalSec * 1000;
    const id = setInterval(() => {
      if (!document.hidden) void refrescar();
    }, ms);
    const onVisible = () => {
      if (!document.hidden && Date.now() - ultimoFetchRef.current >= ms) void refrescar();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [intervalSec, refrescar]);

  // Latido simulado, SOLO mientras se ven los precios de ejemplo (ver doc arriba).
  useEffect(() => {
    if (!simularLatido || fuente !== 'ejemplo') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      // Si justo llegaron datos reales y el cleanup todavía no corrió, no tocarlos.
      if (ultimoReal.current) return;
      const i = Math.floor(Math.random() * fallback.length);
      setStocks((prev) =>
        prev.map((s, idx) => {
          if (idx !== i || s.price === null || s.changePct === null) return s;
          const drift = (Math.random() - 0.48) * 0.6; // -0.29..+0.31
          return {
            ...s,
            price: Math.max(1, s.price * (1 + drift / 100)),
            changePct: +(s.changePct + drift).toFixed(1),
          };
        }),
      );
      setFlash(new Set([fallback[i].symbol]));
    }, SIM_TICK_MS);
    return () => clearInterval(id);
  }, [simularLatido, fuente, fallback]);

  useEffect(() => {
    if (!flash.size) return;
    const t = setTimeout(() => setFlash(new Set()), FLASH_MS);
    return () => clearTimeout(t);
  }, [flash]);

  return { stocks, fuente, flash, status, lastUpdated, refrescar };
}
