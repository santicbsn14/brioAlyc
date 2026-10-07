import type { IncomingMessage, ServerResponse } from 'node:http';
import { getData912 } from '../_lib/data912.js';

// GET /api/mercado/arg-bonds — proxea https://data912.com/live/arg_bonds (deuda
// soberana Globales/Bonares/Bopreales + BONCAPs). Ver api/_lib/data912.ts para el
// criterio de caché/fallback/deduplicación.

interface VercelLikeResponse extends ServerResponse {
  status(code: number): VercelLikeResponse;
  json(body: unknown): void;
}

export default async function handler(_req: IncomingMessage, res: VercelLikeResponse) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const { data, stale } = await getData912('arg_bonds');
    if (stale) res.setHeader('X-Data-Stale', 'true');
    res.status(200).json(data);
  } catch (err) {
    console.error('[api/mercado/arg-bonds]', err);
    res.status(502).json({ ok: false, error: 'No pudimos obtener datos de mercado (arg_bonds).' });
  }
}
