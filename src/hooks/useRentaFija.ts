import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BONDS, SOVEREIGN_BONDS, type Bond, type SovereignBond } from '../lib/rentaFija/data/bonds';
import { LECAPS_DATA, BONCAPS_DATA, type LecapOrBoncap } from '../lib/rentaFija/data/lecapsYBoncaps';
import { calcTIR, calcDuration, calcLecapRates, calcLecapDiasVenc } from '../lib/rentaFija/calc';
import {
  d912parseAll,
  d912parse,
  calcTCMEP,
  lookupON,
  lookupBond,
  lookupLecapOrBoncap,
  lookupONVol,
  lookupBondVol,
  lookupLecapOrBoncapVol,
  type PriceMap,
} from '../lib/rentaFija/lookups';
import {
  buildCarUniverse,
  buildCarFlows,
  computeCarteraStats,
  type CarPosition,
  type CarUniverseItem,
  type CarFlowsByDate,
  type CarWeightedStats,
} from '../lib/rentaFija/cartera';

// Hook central del Panel de Renta Fija: junta el motor de cálculo (lib/rentaFija) con
// el estado de React (precios de mercado, precios manuales, auto-refresh, cartera).
// Traducción TAL CUAL de la lógica de estado de herramientaRentaFija.html — mismo
// criterio de "precio de mercado pisa al manual, y si hoy no operó se restaura el
// manual" para ONs (fetchBYMA/onPriceChange), y el mismo criterio ASIMÉTRICO para
// Soberana/LECAPs (fetchSov/onSovPriceChange/onLecapPriceChange): ahí un precio
// manual SÍ se borra en el siguiente auto-refresh si el instrumento no operó ese
// día — así se comportaba el original (sovPrices/lecapPrices no tienen un mapa de
// "manual" aparte como sí tiene ONs), se mantiene igual a propósito.

export type FetchStatus = 'idle' | 'loading' | 'ok' | 'error';

const LS_MANUAL_ONS = 'brio_manual_prices';
const LS_SOV_PRICES = 'brio_sov_prices';
const LS_LECAP_PRICES = 'brio_lecap_prices';
const LS_CARTERA = 'brio_cartera_positions';

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage puede fallar (navegación privada, cuota llena); no romper la UI.
  }
}

function parsePriceInput(raw: string): number | null {
  const v = parseFloat(raw.replace(',', '.'));
  return !isNaN(v) && v > 0 ? v : null;
}

export interface OnsRow extends Bond {
  precio: number | null;
  tir: number | null;
  duration: number | null;
  volumen: number | null;
  esManual: boolean;
}

export interface SovRow extends SovereignBond {
  precio: number | null;
  tir: number | null;
  duration: number | null;
  volumen: number | null;
}

export interface LecapRow extends LecapOrBoncap {
  tipo: 'LECAP' | 'BONCAP';
  precio: number | null;
  tna: number | null;
  tem: number | null;
  tea: number | null;
  diasVenc: number | null;
  volumen: number | null;
}

async function fetchJSON(url: string): Promise<unknown> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${url} respondió HTTP ${res.status}`);
  return res.json();
}

export function useRentaFija() {
  // Estado inicial leído de localStorage de forma SÍNCRONA (initializer de useState,
  // no un useEffect posterior): así el primer render ya muestra el precio manual
  // persistido y el input correspondiente monta con el `defaultValue` correcto,
  // sin una carrera entre "primer render vacío" y "efecto que carga y pisa".

  // ── ONs ──────────────────────────────────────────────────────────
  const [onsManualPrices, setOnsManualPrices] = useState<PriceMap>(() => loadJSON<PriceMap>(LS_MANUAL_ONS, {}));
  const [onsPrices, setOnsPrices] = useState<PriceMap>(() => loadJSON<PriceMap>(LS_MANUAL_ONS, {}));
  const [mapCorpVol, setMapCorpVol] = useState<PriceMap>({});
  const [onsStatus, setOnsStatus] = useState<FetchStatus>('idle');
  const [onsLastUpdated, setOnsLastUpdated] = useState<Date | null>(null);
  const [onsIntervalSec, setOnsIntervalSec] = useState(120);

  // ── Soberana + LECAPs/BONCAPs ────────────────────────────────────
  const [sovPrices, setSovPrices] = useState<PriceMap>(() => loadJSON<PriceMap>(LS_SOV_PRICES, {}));
  const [lecapPrices, setLecapPrices] = useState<PriceMap>(() => loadJSON<PriceMap>(LS_LECAP_PRICES, {}));
  const [mapBondsVol, setMapBondsVol] = useState<PriceMap>({});
  const [mapNotesVol, setMapNotesVol] = useState<PriceMap>({});
  const [sovStatus, setSovStatus] = useState<FetchStatus>('idle');
  const [sovLastUpdated, setSovLastUpdated] = useState<Date | null>(null);
  const [sovIntervalSec, setSovIntervalSec] = useState(120);

  // ── Cartera ──────────────────────────────────────────────────────
  const [carPositions, setCarPositions] = useState<CarPosition[]>(() => loadJSON<CarPosition[]>(LS_CARTERA, []));

  // Ref con el último valor de onsManualPrices: fetchOns la necesita para restaurar
  // el manual cuando hoy no hay precio de mercado, sin tener que meter setOnsPrices
  // adentro de un updater de setOnsManualPrices solo para "leer" el valor actual.
  const onsManualPricesRef = useRef<PriceMap>(onsManualPrices);
  useEffect(() => {
    onsManualPricesRef.current = onsManualPrices;
  }, [onsManualPrices]);

  // ── Fetch ONs (arg_corp) ─────────────────────────────────────────
  const fetchOns = useCallback(async () => {
    setOnsStatus('loading');
    try {
      const raw = await fetchJSON('/api/mercado/arg-corp');
      const { withVol, vols } = d912parseAll(raw);
      const tcMEP = calcTCMEP(withVol);
      setMapCorpVol(vols);

      const manual = onsManualPricesRef.current;
      const next: PriceMap = {};
      BONDS.forEach((b) => {
        const p = lookupON(b.ticker, withVol, withVol, tcMEP);
        if (p !== null) {
          next[b.ticker] = p;
        } else if (manual[b.ticker]) {
          next[b.ticker] = manual[b.ticker];
        }
      });
      setOnsPrices(next);

      setOnsLastUpdated(new Date());
      setOnsStatus('ok');
    } catch (err) {
      console.error('[useRentaFija] fetchOns', err);
      setOnsStatus('error');
    }
  }, []);

  // ── Fetch Soberana + LECAPs/BONCAPs (arg_bonds + arg_notes) ──────
  const fetchSov = useCallback(async () => {
    setSovStatus('loading');
    try {
      const [rawBonds, rawNotes] = await Promise.all([
        fetchJSON('/api/mercado/arg-bonds'),
        fetchJSON('/api/mercado/arg-notes'),
      ]);
      const bondsVol: PriceMap = {};
      const notesVol: PriceMap = {};
      const mapBonds = d912parse(rawBonds, true, bondsVol);
      const mapNotes = d912parse(rawNotes, true, notesVol);
      setMapBondsVol(bondsVol);
      setMapNotesVol(notesVol);

      const nextSov: PriceMap = {};
      SOVEREIGN_BONDS.forEach((b) => {
        const p = lookupBond(b.ticker, mapBonds);
        if (p !== null) nextSov[b.ticker] = p;
      });
      setSovPrices(nextSov);

      const nextLecap: PriceMap = {};
      [...LECAPS_DATA, ...BONCAPS_DATA].forEach((l) => {
        const p = lookupLecapOrBoncap(l.ticker, mapNotes, mapBonds);
        if (p !== null) nextLecap[l.ticker] = p;
      });
      setLecapPrices(nextLecap);

      setSovLastUpdated(new Date());
      setSovStatus('ok');
    } catch (err) {
      console.error('[useRentaFija] fetchSov', err);
      setSovStatus('error');
    }
  }, []);

  // Auto-fetch inicial, igual que el original que solo dispara al cargar la página.
  // Sin guard por ref: el propio cleanup (clearTimeout) ya hace esto seguro bajo el
  // doble-efecto de StrictMode en desarrollo (el primer setTimeout se cancela con
  // el cleanup simulado y el segundo pase programa el que realmente termina
  // disparando) — un guard con useRef acá terminaba cancelando el único fetch real.
  useEffect(() => {
    const t = setTimeout(() => {
      fetchOns();
      fetchSov();
    }, 400);
    return () => clearTimeout(t);
  }, [fetchOns, fetchSov]);

  // Auto-refresh: un timer por grupo, se reinicia si cambia el intervalo (mismo
  // criterio que changeBYMAInterval/changeSovInterval: no dispara un fetch
  // inmediato al cambiar, solo rearma el timer).
  useEffect(() => {
    if (onsIntervalSec <= 0) return undefined;
    const id = setInterval(fetchOns, onsIntervalSec * 1000);
    return () => clearInterval(id);
  }, [onsIntervalSec, fetchOns]);

  useEffect(() => {
    if (sovIntervalSec <= 0) return undefined;
    const id = setInterval(fetchSov, sovIntervalSec * 1000);
    return () => clearInterval(id);
  }, [sovIntervalSec, fetchSov]);

  // ── Precios manuales ─────────────────────────────────────────────
  const setManualOnPrice = useCallback((ticker: string, raw: string) => {
    const v = parsePriceInput(raw);
    setOnsManualPrices((prev) => {
      const next = { ...prev };
      if (v !== null) next[ticker] = v;
      else delete next[ticker];
      saveJSON(LS_MANUAL_ONS, next);
      return next;
    });
    setOnsPrices((prev) => {
      const next = { ...prev };
      if (v !== null) next[ticker] = v;
      else delete next[ticker];
      return next;
    });
  }, []);

  const setManualSovPrice = useCallback((ticker: string, raw: string) => {
    const v = parsePriceInput(raw);
    setSovPrices((prev) => {
      const next = { ...prev };
      if (v !== null) next[ticker] = v;
      else delete next[ticker];
      saveJSON(LS_SOV_PRICES, next);
      return next;
    });
  }, []);

  const setManualLecapPrice = useCallback((ticker: string, raw: string) => {
    const v = parsePriceInput(raw);
    setLecapPrices((prev) => {
      const next = { ...prev };
      if (v !== null) next[ticker] = v;
      else delete next[ticker];
      saveJSON(LS_LECAP_PRICES, next);
      return next;
    });
  }, []);

  // ── Filas calculadas ─────────────────────────────────────────────
  const onsRows: OnsRow[] = useMemo(
    () =>
      BONDS.map((b) => {
        const precio = onsPrices[b.ticker] ?? null;
        const tir = precio ? calcTIR(precio, b.cashflows) : null;
        const duration = precio && tir !== null ? calcDuration(precio, b.cashflows, tir) : null;
        return {
          ...b,
          precio,
          tir,
          duration,
          volumen: lookupONVol(b.ticker, mapCorpVol),
          esManual: onsManualPrices[b.ticker] != null && onsPrices[b.ticker] === onsManualPrices[b.ticker],
        };
      }),
    [onsPrices, onsManualPrices, mapCorpVol],
  );

  const sovRows: SovRow[] = useMemo(
    () =>
      SOVEREIGN_BONDS.map((b) => {
        const precio = sovPrices[b.ticker] ?? null;
        const tir = precio ? calcTIR(precio, b.cashflows) : null;
        const duration = precio && tir !== null ? calcDuration(precio, b.cashflows, tir) : null;
        return { ...b, precio, tir, duration, volumen: lookupBondVol(b.ticker, mapBondsVol) };
      }),
    [sovPrices, mapBondsVol],
  );

  const lecapRows: LecapRow[] = useMemo(() => {
    // Las ya vencidas (días al vencimiento <= 0, mismo criterio t+1 que
    // calcLecapRates) no entran a la tabla. Calendario y Cartera usan
    // LECAPS_DATA/BONCAPS_DATA directo, no pasan por acá.
    const build = (list: LecapOrBoncap[], tipo: 'LECAP' | 'BONCAP') =>
      list.filter((item) => calcLecapDiasVenc(item) > 0).map((item) => {
        const precio = lecapPrices[item.ticker] ?? null;
        const { tna, tem, tea, diasVenc } = calcLecapRates(item, precio);
        return {
          ...item,
          tipo,
          precio,
          tna,
          tem,
          tea,
          diasVenc,
          volumen: lookupLecapOrBoncapVol(item.ticker, mapNotesVol, mapBondsVol),
        };
      });
    return [...build(LECAPS_DATA, 'LECAP'), ...build(BONCAPS_DATA, 'BONCAP')];
  }, [lecapPrices, mapNotesVol, mapBondsVol]);

  // ── Cartera ──────────────────────────────────────────────────────
  const carUniverse: CarUniverseItem[] = useMemo(
    () => buildCarUniverse(BONDS, SOVEREIGN_BONDS, LECAPS_DATA, BONCAPS_DATA),
    [],
  );

  const addCarPosition = useCallback(
    (tickerRaw: string, vn: number): { ok: boolean; message: string } => {
      const tk = tickerRaw.trim().toUpperCase();
      if (!tk) return { ok: false, message: 'Ingresá un ticker' };
      const found = carUniverse.find((x) => x.ticker.toUpperCase() === tk);
      if (!found) return { ok: false, message: `Ticker no encontrado: ${tk}` };
      if (!vn || vn <= 0) return { ok: false, message: 'Ingresá una cantidad de nominales válida' };

      let message = '';
      setCarPositions((prev) => {
        const idx = prev.findIndex((p) => p.ticker.toUpperCase() === tk);
        let next: CarPosition[];
        if (idx >= 0) {
          next = [...prev];
          next[idx] = { ...next[idx], vn: next[idx].vn + vn };
          message = `+${vn.toLocaleString('es-AR')} VN a ${tk} (total: ${next[idx].vn.toLocaleString('es-AR')})`;
        } else {
          next = [...prev, { ticker: found.ticker, vn }];
          message = `Agregado: ${found.ticker} — ${vn.toLocaleString('es-AR')} VN`;
        }
        saveJSON(LS_CARTERA, next);
        return next;
      });
      return { ok: true, message };
    },
    [carUniverse],
  );

  const removeCarPosition = useCallback((index: number) => {
    setCarPositions((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      const next = prev.filter((_, i) => i !== index);
      saveJSON(LS_CARTERA, next);
      return next;
    });
  }, []);

  const clearCarPositions = useCallback(() => {
    setCarPositions(() => {
      saveJSON(LS_CARTERA, []);
      return [];
    });
  }, []);

  const carFlows: CarFlowsByDate = useMemo(
    () => buildCarFlows(carPositions, carUniverse, BONDS, SOVEREIGN_BONDS, LECAPS_DATA, BONCAPS_DATA),
    [carPositions, carUniverse],
  );

  const carStats: CarWeightedStats = useMemo(
    () =>
      computeCarteraStats(
        carPositions,
        carUniverse,
        BONDS,
        SOVEREIGN_BONDS,
        LECAPS_DATA,
        BONCAPS_DATA,
        onsPrices,
        sovPrices,
        lecapPrices,
      ),
    [carPositions, carUniverse, onsPrices, sovPrices, lecapPrices],
  );

  return {
    onsRows,
    onsStatus,
    onsLastUpdated,
    onsIntervalSec,
    setOnsIntervalSec,
    fetchOns,
    setManualOnPrice,

    sovRows,
    lecapRows,
    sovStatus,
    sovLastUpdated,
    sovIntervalSec,
    setSovIntervalSec,
    fetchSov,
    setManualSovPrice,
    setManualLecapPrice,

    carPositions,
    carUniverse,
    addCarPosition,
    removeCarPosition,
    clearCarPositions,
    carFlows,
    carStats,
  };
}

export type UseRentaFijaReturn = ReturnType<typeof useRentaFija>;
