import { useEffect, useState } from 'react';
import { sanityClient } from './client';

export type EstadoQuery = 'cargando' | 'listo' | 'error';

export type Parametros = Record<string, string | number | boolean>;

type Resultado = { status: 'listo'; data: unknown } | { status: 'error' };

// Caché en memoria por query + parámetros, compartida por toda la app mientras la pestaña
// está abierta: un componente que se vuelve a montar (ej. al navegar) no vuelve a pedir.
// Solo se guardan las respuestas buenas; un error se reintenta en el próximo montaje.
const resultados = new Map<string, Resultado>();
// Pedidos en vuelo, para que dos componentes con la misma query hagan un solo pedido.
const pedidos = new Map<string, Promise<Resultado>>();

function pedir(clave: string, query: string, params: Parametros): Promise<Resultado> {
  let pedido = pedidos.get(clave);
  if (!pedido) {
    pedido = sanityClient
      .fetch<unknown>(query, params)
      .then((data): Resultado => {
        const resultado: Resultado = { status: 'listo', data };
        resultados.set(clave, resultado);
        return resultado;
      })
      .catch((error: unknown): Resultado => {
        if (import.meta.env.DEV) console.warn('[sanity] Falló la query:', error);
        return { status: 'error' };
      })
      .finally(() => pedidos.delete(clave));
    pedidos.set(clave, pedido);
  }
  return pedido;
}

/**
 * Corre una query GROQ contra Sanity y devuelve `{ data, status }`:
 *  - `cargando`: todavía no llegó la respuesta (`data` es undefined).
 *  - `listo`: llegó. `data` puede ser `null` si el documento no está cargado/publicado.
 *  - `error`: falló el pedido (red, CORS…). La página no se rompe; cada componente decide qué mostrar.
 *
 * El tipo `T` es lo que devuelve la query (ver sanity/types.ts); no se valida en tiempo de ejecución.
 */
export function useSanityQuery<T>(
  query: string,
  params: Parametros = {},
): { data: T | null | undefined; status: EstadoQuery } {
  // Se elige una sola vez, antes del primer render (main.tsx): siempre se llama el mismo hook.
  const usar = (hookVistaPrevia ?? useSanityQueryPublica) as HookQuery<T>;
  return usar(query, params);
}

export type ResultadoQuery<T> = { data: T | null | undefined; status: EstadoQuery };
type HookQuery<T> = (query: string, params: Parametros) => ResultadoQuery<T>;

/** En la Vista previa del Studio, el hook que trae los datos en vivo (./vistaPrevia/). */
let hookVistaPrevia: HookQuery<unknown> | null = null;

/** Lo llama ./vistaPrevia/ al cargarse, antes de que se pinte la app (main.tsx). */
export function usarHookVistaPrevia(hook: <T>(query: string, params: Parametros) => ResultadoQuery<T>) {
  hookVistaPrevia = hook;
}

/** La web pública: pedido directo a Sanity, solo lo publicado, con caché en memoria. */
function useSanityQueryPublica<T>(query: string, params: Parametros): ResultadoQuery<T> {
  const paramsJson = JSON.stringify(params);
  const clave = `${query}\n${paramsJson}`;
  const [estado, setEstado] = useState<{ clave: string; resultado?: Resultado }>(() => ({
    clave,
    resultado: resultados.get(clave),
  }));

  useEffect(() => {
    if (resultados.has(clave)) return;
    let vigente = true;
    pedir(clave, query, JSON.parse(paramsJson) as Parametros).then((resultado) => {
      if (vigente) setEstado({ clave, resultado });
    });
    return () => {
      vigente = false;
    };
  }, [clave, query, paramsJson]);

  const resultado = (estado.clave === clave ? estado.resultado : undefined) ?? resultados.get(clave);
  if (!resultado) return { data: undefined, status: 'cargando' };
  if (resultado.status === 'error') return { data: undefined, status: 'error' };
  return { data: resultado.data as T | null, status: 'listo' };
}
