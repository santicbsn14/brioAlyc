// Proxy a data912 con caché en memoria del proceso + deduplicación de requests en
// vuelo. Un archivo con prefijo "_" bajo api/ NO se convierte en endpoint de Vercel
// (solo lo importan las funciones de api/mercado/*.ts).
//
// Criterio (brief "Panel de Renta Fija", parte 1):
//  - Cache-hit dentro del TTL → devolver sin pegarle a data912 de nuevo.
//  - Fetch a data912 falla y hay caché previo (aunque esté vencido) → devolver ese
//    dato igual, marcado `stale: true` (el handler agrega el header X-Data-Stale).
//  - Fetch falla y no hay caché (cold start) → el caller debe responder 502.
//  - Dos requests casi simultáneas sin caché válido → comparten una sola promesa
//    de fetch (no disparan dos llamadas en paralelo a data912).
//
// Nota: la caché es una variable module-level en memoria del proceso de la función
// serverless, no Vercel KV. Sirve mientras la instancia esté "caliente"; en un cold
// start arranca vacía (por eso el caso sin caché responde 502 en vez de romper).

const TTL_MS = 90_000;

interface CacheEntry {
  data: unknown;
  fetchedAt: number;
}

const cacheByEndpoint = new Map<string, CacheEntry>();
const inFlightByEndpoint = new Map<string, Promise<unknown>>();

async function fetchFresh(endpoint: string): Promise<unknown> {
  const res = await fetch(`https://data912.com/live/${endpoint}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`data912 ${endpoint} respondió HTTP ${res.status}`);
  return res.json();
}

export interface Data912Result {
  data: unknown;
  stale: boolean;
}

export async function getData912(endpoint: string): Promise<Data912Result> {
  const cached = cacheByEndpoint.get(endpoint);
  const now = Date.now();
  if (cached && now - cached.fetchedAt < TTL_MS) {
    return { data: cached.data, stale: false };
  }

  let pending = inFlightByEndpoint.get(endpoint);
  if (!pending) {
    pending = fetchFresh(endpoint).finally(() => {
      inFlightByEndpoint.delete(endpoint);
    });
    inFlightByEndpoint.set(endpoint, pending);
  }

  try {
    const data = await pending;
    cacheByEndpoint.set(endpoint, { data, fetchedAt: Date.now() });
    return { data, stale: false };
  } catch (err) {
    if (cached) {
      return { data: cached.data, stale: true };
    }
    throw err;
  }
}
