import type { IncomingMessage, ServerResponse } from 'node:http';
import { Resend } from 'resend';

// Función serverless de Vercel: POST /api/contacto — recibe el formulario de la sección
// Contacto de la home (`components/Contacto/Contacto.tsx`) y envía un mail con los datos.
//
// CONFIGURACIÓN EN VERCEL (variables de entorno, no van en el repo — ver `.env.example`):
//   - RESEND_API_KEY: API key de https://resend.com. Sin ella, la función responde
//     { ok:false } y no rompe: queda logueado en la consola del servidor para debug.
//   - CONTACTO_DESTINATARIO: mail de Brio a donde llega la consulta (info@briovalores.com).
//   - CONTACTO_REMITENTE (opcional): el "from" del mail. Tiene que ser de un dominio
//     verificado en Resend (briovalores.com lo está). Si no está definida, se usa
//     REMITENTE_POR_DEFECTO (abajo).
//
// El mail sale con reply_to = el email que dejó la persona (ya validado), así al tocar
// "Responder" desde info@ le contestan directo a ella.
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

const REMITENTE_POR_DEFECTO = 'Brio Valores — Web <web@briovalores.com>';

/** Escapa el texto que escribió la persona antes de meterlo en el HTML del mail. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Para asunto y campos de una línea: sin saltos de línea ni espacios de más. */
function oneLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

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

  const emailLimpio = email?.trim() ?? '';
  if (!nombre?.trim() || !EMAIL_RE.test(emailLimpio) || !mensaje || mensaje.trim().length < 5) {
    res.status(400).json({ ok: false, error: 'Faltan datos o son inválidos: revisá nombre, email y mensaje.' });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const destinatario = process.env.CONTACTO_DESTINATARIO;
  const remitente = process.env.CONTACTO_REMITENTE?.trim() || REMITENTE_POR_DEFECTO;

  if (!apiKey || !destinatario) {
    console.error('[api/contacto] Falta configurar RESEND_API_KEY y/o CONTACTO_DESTINATARIO en Vercel.');
    res.status(500).json({ ok: false, error: 'El envío no está configurado todavía. Escribinos por WhatsApp.' });
    return;
  }

  const motivoLabel = (motivo && MOTIVO_LABELS[motivo]) || 'Consulta';
  const nombreLinea = oneLine(nombre);
  const telefonoLinea = telefono ? oneLine(telefono) : '';
  // La empresa solo corresponde al motivo PyME: el front manda el campo siempre, aunque
  // la persona la haya escrito y después cambiado de motivo.
  const empresaLinea = motivo === 'pyme' && empresa ? oneLine(empresa) : '';
  const mensajeLimpio = mensaje.trim();

  const subject = `Consulta web — ${motivoLabel} — ${nombreLinea}`;

  const campos: Array<[string, string]> = [
    ['Motivo', motivoLabel],
    ['Nombre', nombreLinea],
    ['Email', emailLimpio],
    ['Teléfono', telefonoLinea || '(no lo dejó)'],
  ];
  if (empresaLinea) campos.push(['Empresa', empresaLinea]);

  const pie = 'Enviado desde el formulario de contacto de la web. Respondé este mail para contestarle directo.';

  const text = [...campos.map(([label, value]) => `${label}: ${value}`), '', 'Mensaje:', mensajeLimpio, '', '—', pie].join(
    '\n',
  );

  const filasHtml = campos
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#555;vertical-align:top;white-space:nowrap"><strong>${escapeHtml(label)}</strong></td>` +
        `<td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
    )
    .join('');
  const html =
    `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#111">` +
    `<p style="margin:0 0 12px">Nueva consulta desde la web.</p>` +
    `<table style="border-collapse:collapse;margin:0 0 16px">${filasHtml}</table>` +
    `<p style="margin:0 0 4px"><strong>Mensaje:</strong></p>` +
    `<p style="margin:0 0 16px">${escapeHtml(mensajeLimpio).replace(/\r?\n/g, '<br>')}</p>` +
    `<p style="margin:0;color:#777;font-size:12px">${escapeHtml(pie)}</p>` +
    `</div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: remitente,
      to: destinatario,
      replyTo: emailLimpio,
      subject,
      text,
      html,
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
