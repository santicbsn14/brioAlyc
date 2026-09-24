import type { IncomingMessage, ServerResponse } from 'node:http';
import { Resend } from 'resend';

// Función serverless de Vercel: POST /api/contacto — recibe el formulario de la sección
// Contacto de la home (`components/Contacto/Contacto.tsx`) y envía un mail con los datos.
//
// CONFIGURACIÓN EN VERCEL (variables de entorno, no van en el repo — ver `.env.example`):
//   - RESEND_API_KEY: API key de https://resend.com. Sin ella, la función responde
//     { ok:false } y no rompe: queda logueado en la consola del servidor para debug.
//   - CONTACTO_DESTINATARIO: mail de Brio a donde llega la consulta.
//     TODO(Agus): hoy no sabemos el mail real, se usa un placeholder de ejemplo.
//
// Se usa la firma clásica de función de Vercel (req/res al estilo Node, sin depender
// de @vercel/node): Vercel la reconoce igual y así no suma una dependencia solo para
// tipos. Los tipos de req/res acá son mínimos (lo que se usa), no el contrato completo.

interface VercelLikeRequest extends IncomingMessage {
  method?: string;
  body?: unknown;
}

interface VercelLikeResponse extends ServerResponse {
  status(code: number): VercelLikeResponse;
  json(body: unknown): void;
}

/** Mismos ids/labels que `src/data/contacto.ts` → `motivos[]`. Se duplica acá porque
 * el endpoint corre aislado del bundle del front (no comparte el árbol de `src/`) — si
 * se agrega o edita un motivo en `data/contacto.ts`, actualizar también esta lista. */
const MOTIVO_LABELS: Record<string, string> = {
  cuenta: 'Abrir mi cuenta',
  pyme: 'Financiamiento para mi PyME',
  consulta: 'Otra consulta',
};

// Mismo criterio de validación que el frontend (`Contacto.tsx`): nunca hay que confiar
// solo en la validación del cliente, alguien puede pegarle directo al endpoint.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface ContactoBody {
  motivo?: string;
  nombre?: string;
  email?: string;
  telefono?: string;
  empresa?: string;
  mensaje?: string;
  /** Honeypot anti-spam: si viene lleno, es un bot (ver abajo). */
  website?: string;
}

function readJsonBody(req: VercelLikeRequest): Promise<ContactoBody> {
  // Vercel ya parsea `req.body` cuando el Content-Type es application/json, pero por si
  // corre en un entorno que no lo hace (ej. `vercel dev` con ciertas configuraciones),
  // se banca leer el stream a mano como respaldo.
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body as ContactoBody);
  }
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk: Buffer) => {
      raw += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(raw ? (JSON.parse(raw) as ContactoBody) : {});
      } catch {
        reject(new Error('JSON inválido'));
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(req: VercelLikeRequest, res: VercelLikeResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Método no permitido.' });
    return;
  }

  let body: ContactoBody;
  try {
    body = await readJsonBody(req);
  } catch {
    res.status(400).json({ ok: false, error: 'No pudimos leer los datos del formulario.' });
    return;
  }

  const { motivo, nombre, email, telefono, empresa, mensaje, website } = body;

  // Honeypot: si un bot lo completó, respondemos 200 sin enviar nada — no le mostramos
  // al bot que fue detectado (mismo criterio silencioso que el frontend).
  if (website) {
    res.status(200).json({ ok: true });
    return;
  }

  if (!nombre?.trim() || !EMAIL_RE.test(email?.trim() ?? '') || !mensaje || mensaje.trim().length < 5) {
    res.status(400).json({ ok: false, error: 'Faltan datos o son inválidos: revisá nombre, email y mensaje.' });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  // TODO(Agus): CONTACTO_DESTINATARIO hoy es un placeholder — confirmar el mail real de
  // Brio y configurarlo como variable de entorno en Vercel.
  const destinatario = process.env.CONTACTO_DESTINATARIO;

  if (!apiKey || !destinatario) {
    console.error('[api/contacto] Falta configurar RESEND_API_KEY y/o CONTACTO_DESTINATARIO en Vercel.');
    res.status(500).json({ ok: false, error: 'El envío no está configurado todavía. Escribinos por WhatsApp.' });
    return;
  }

  const motivoLabel = (motivo && MOTIVO_LABELS[motivo]) || 'Consulta';
  const subject = `Nueva consulta — ${motivoLabel}`;
  const text = [
    `Motivo: ${motivoLabel}`,
    `Nombre: ${nombre}`,
    `Email: ${email}`,
    telefono ? `Teléfono: ${telefono}` : null,
    empresa ? `Empresa: ${empresa}` : null,
    '',
    'Mensaje:',
    mensaje,
  ]
    .filter((line) => line !== null)
    .join('\n');

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      // TODO(Agus): reemplazar por un remitente del dominio real de Brio una vez que
      // esté verificado en Resend (resend.com/domains). Mientras tanto, el dominio de
      // pruebas de Resend siempre funciona sin verificación.
      from: 'Brio Valores — Web <onboarding@resend.dev>',
      to: destinatario,
      replyTo: email,
      subject,
      text,
    });

    if (error) {
      console.error('[api/contacto] Error de Resend:', error);
      res.status(500).json({ ok: false, error: 'No pudimos enviar el mensaje.' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[api/contacto] Error inesperado:', err);
    res.status(500).json({ ok: false, error: 'No pudimos enviar el mensaje.' });
  }
}
