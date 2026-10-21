// Lo que queda en código de la sección Contacto de la home (#contacto). El resto de los textos
// (título, canales, labels, botones, mensajes de éxito y de error de envío) y los datos de
// contacto vienen de Sanity (ver components/Contacto/ContactoSanity.tsx).
//
// CÓMO EDITAR:
//   - Agregar/quitar un motivo de consulta → sumar/borrar un `ContactoMotivo` en `motivos`.
//     El id de cada motivo es el valor que se usa en el query param `?motivo=` que llega desde
//     otras páginas (ver `components/Contacto/Contacto.tsx`, ABRI_CUENTA_HREF y
//     `data/financiamiento.ts`). Opcionalmente un motivo pide un campo extra (hoy solo "pyme"
//     pide el nombre de la empresa).
//   - Si se suma un motivo, actualizar a mano los otros dos lados que tienen los mismos ids:
//     `api/contacto.ts` (arma el asunto del mail con su propia copia de las labels) y
//     MOTIVOS_CONTACTO de brio-studio (el texto de ayuda del mensaje de cada motivo), además
//     del tipo `MotivoContactoId` de `sanity/types.ts`.

import type { MotivoContactoId } from '../sanity/types';

/** Campo extra que pide un motivo puntual (hoy solo "Financiamiento para mi PyME"). */
export interface ContactoMotivoExtra {
  name: 'empresa';
  label: string;
  placeholder: string;
}

/** Un motivo de consulta: arma el chip del formulario. */
export interface ContactoMotivo {
  id: MotivoContactoId;
  label: string;
  extra: ContactoMotivoExtra | null;
}

export const motivos: ContactoMotivo[] = [
  { id: 'cuenta', label: 'Abrir mi cuenta', extra: null },
  {
    id: 'pyme',
    label: 'Financiamiento para mi PyME',
    extra: { name: 'empresa', label: 'Nombre de la empresa', placeholder: 'Razón social' },
  },
  { id: 'consulta', label: 'Otra consulta', extra: null },
];

/** Mensajes de validación de cada campo del formulario. */
export const erroresValidacion = {
  nombre: 'Escribí tu nombre.',
  email: 'Revisá el email: parece que falta algo.',
  mensaje: 'Contanos brevemente qué necesitás.',
};
