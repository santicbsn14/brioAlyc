import type { IncomingMessage, ServerResponse } from 'node:http';
import { getData912 } from '../_lib/data912';

// GET /api/mercado/arg-corp — proxea https://data912.com/live/arg_corp (ONs, precio
// USD MEP). El frontend consume este endpoint en vez de pegarle directo a data912
// (mismo shape de datos, solo cambia la URL base). Ver api/_lib/data912.ts para el
// criterio de caché/fallback/deduplicación.

interface VercelLikeResponse extends ServerResponse {
  status(code: number): VercelLikeResponse;
  json(body: unknown): void;
}

export default async function handler(_req: IncomingMessage, res: VercelLikeResponse) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const { data, stale } = await getData912('arg_corp');
    if (stale) res.setHeader('X-Data-Stale', 'true');
    res.status(200).json(data);
  } catch (err) {
    console.error('[api/mercado/arg-corp]', err);
    res.status(502).json({ ok: false, error: 'No pudimos obtener datos de mercado (arg_corp).' });
  }
}
