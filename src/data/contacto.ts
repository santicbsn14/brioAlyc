// Datos de la sección Contacto de la home (#contacto) — brief "Sección Contacto (home)".
// Portado tal cual del prototipo aprobado `__ref/BrioContacto.jsx` (objeto `contacto`).
// Todo tipado y listo para migrar a Sanity sin tocar el componente.
//
// CÓMO EDITAR:
//   - Agregar/quitar un motivo de consulta → sumar/borrar un `ContactoMotivo` en `motivos`.
//     Cada motivo tiene su propio placeholder de mensaje y, opcionalmente, un campo extra
//     (hoy solo "pyme" pide el nombre de la empresa). El id de cada motivo es el valor que
//     también se usa en el query param `?motivo=` que llega desde otras páginas (ver
//     `components/Contacto/Contacto.tsx` y `pages/FinanciamientoPyme.tsx`).
//   - Agregar/quitar un canal de contacto (WhatsApp, mail, etc.) → sumar/borrar un
//     `ContactoChannel` en `channels`. Si no tiene link (ej. horario, dirección sin mapa),
//     `href` va en `null` y se muestra como texto plano en vez de link.
//   - El endpoint de envío (`api/contacto.ts`) valida los mismos tres campos que el
//     formulario (nombre, email, mensaje) y arma el asunto del mail a partir de
//     `motivos[].label` — si se agrega un motivo acá, revisar que el backend lo siga
//     etiquetando bien (hoy tiene su propia copia de las labels, ver comentario ahí).
//
// TODO(Agus): `channels` todavía tiene datos de EJEMPLO en "whatsapp" y "hs" (número de
// WhatsApp y horario). Los canales "email", "tel" y "dir" ya son reales (sincronizados con
// `data/footer.ts`). En `social`, Instagram y LinkedIn siguen siendo placeholder — confirmar
// los links reales antes de publicar.

/** Campo extra que pide un motivo puntual (hoy solo "Financiamiento para mi PyME"). */
export interface ContactoMotivoExtra {
  name: string;
  label: string;
  placeholder: string;
}

/** Un motivo de consulta: arma el chip del formulario y su placeholder de mensaje. */
export interface ContactoMotivo {
  id: string;
  label: string;
  mensajePlaceholder: string;
  extra: ContactoMotivoExtra | null;
}

/** Un canal de contacto (WhatsApp, email, teléfono, oficina, horario). */
export interface ContactoChannel {
  id: string;
  label: string;
  value: string;
  href: string | null;
  external?: boolean;
  sub?: string;
}

/** Una red social. */
export interface ContactoSocial {
  id: string;
  label: string;
  href: string;
}

export interface ContactoContent {
  title: string;
  lead: string;
  motivosLabel: string;
  motivos: ContactoMotivo[];
  fields: {
    nombre: string;
    email: string;
    telefono: string;
    mensaje: string;
  };
  submitLabel: string;
  sendingLabel: string;
  legal: string;
  success: {
    title: string;
    text: string;
    again: string;
  };
  errors: {
    nombre: string;
    email: string;
    mensaje: string;
    envio: string;
  };
  channels: ContactoChannel[];
  socialLabel: string;
  social: ContactoSocial[];
  seal: string;
}

export const contacto: ContactoContent = {
  title: 'Hablemos de lo que necesitás',
  lead: 'Contanos qué querés hacer y te respondemos a la brevedad. Si preferís, escribinos directo por el canal que te quede más cómodo.',
  motivosLabel: '¿En qué te ayudamos?',
  motivos: [
    {
      id: 'cuenta',
      label: 'Abrir mi cuenta',
      mensajePlaceholder: 'Contanos si ya invertís o si es tu primera vez, y qué te interesa operar.',
      extra: null,
    },
    {
      id: 'pyme',
      label: 'Financiamiento para mi PyME',
      mensajePlaceholder: 'Contanos qué necesita tu empresa: descuento de cheques, obligaciones negociables, otra cosa.',
      extra: { name: 'empresa', label: 'Nombre de la empresa', placeholder: 'Razón social' },
    },
    {
      id: 'consulta',
      label: 'Otra consulta',
      mensajePlaceholder: 'Escribinos tu consulta.',
      extra: null,
    },
  ],
  fields: {
    nombre: 'Nombre y apellido',
    email: 'Email',
    telefono: 'Teléfono (opcional)',
    mensaje: 'Mensaje',
  },
  submitLabel: 'Enviar consulta',
  sendingLabel: 'Enviando…',
  legal: 'Usamos tus datos solo para responderte esta consulta.',
  success: {
    title: 'Recibimos tu consulta',
    text: 'Te respondemos por email o teléfono en el horario de atención.',
    again: 'Enviar otra consulta',
  },
  errors: {
    nombre: 'Escribí tu nombre.',
    email: 'Revisá el email: parece que falta algo.',
    mensaje: 'Contanos brevemente qué necesitás.',
    envio: 'No pudimos enviar el mensaje. Probá de nuevo o escribinos por WhatsApp.',
  },
  channels: [
    // TODO(Agus): dato de EJEMPLO, confirmar el número real de WhatsApp.
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      value: '+54 9 341 000 0000',
      href: 'https://wa.me/5493410000000',
      external: true,
    },
    { id: 'email', label: 'Email', value: 'info@briovalores.com', href: 'mailto:info@briovalores.com' },
    { id: 'tel', label: 'Teléfono', value: '+54 (341) 5275351/52', href: 'tel:+543415275351' },
    { id: 'dir', label: 'Oficina', value: 'Rosario, Santa Fe', sub: 'Córdoba 1464 Piso 4, CP 2000', href: null },
    // TODO(Agus): dato de EJEMPLO, confirmar el horario real de atención.
    { id: 'hs', label: 'Horario', value: 'Lunes a viernes, 10 a 17 hs', href: null },
  ],
  socialLabel: 'Seguinos',
  social: [
    // TODO(Agus): confirmar link real de Instagram (hoy es placeholder).
    { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/briovalores' },
    // TODO(Agus): confirmar link real de LinkedIn (hoy es placeholder).
    { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/company/briovalores' },
  ],
  seal: 'Agente registrado en CNV · Mat. 512',
};
