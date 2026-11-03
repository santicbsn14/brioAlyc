import type { IncomingMessage, ServerResponse } from 'node:http';

// Responde 410 Gone ("ya no existe y no va a volver") + X-Robots-Tag noindex. Le llegan, por
// reescritura en vercel.json, las URLs del WordPress viejo que no tienen equivalente: los
// internos de WordPress (/wp-admin, /wp-content/…, /xmlrpc.php, /feed…) y las páginas de spam
// que dejó el hackeo. Con 410, Google las saca del índice más rápido que con un 404.
export default function handler(_req: IncomingMessage, res: ServerResponse) {
  res.statusCode = 410;
  res.setHeader('X-Robots-Tag', 'noindex');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('410 — Esta página ya no existe. Brio Valores: https://briovalores.com/\n');
}
