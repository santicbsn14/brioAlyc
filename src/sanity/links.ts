// Links que se arman en código a partir de Datos de la empresa (los usan el Footer y Contacto).
// En el Studio se cargan los datos tal como se muestran; el "tel:", "mailto:" y "wa.me" los pone el front.
// El dato se limpia antes (sanity/limpiar.ts): en la vista previa del Studio trae caracteres invisibles.
import { limpio } from './limpiar';

const digitos = (t: string) => limpio(t).replace(/\D/g, '');

/** "+54 (341) 5275351/52" → tel:+543415275351 (llama al primer número, el de antes de la barra). */
export const hrefTelefono = (telefono: string) => `tel:+${digitos(limpio(telefono).split('/')[0])}`;

export const hrefEmail = (email: string) => `mailto:${limpio(email).trim()}`;

/** El número va en formato internacional, solo dígitos ("5493410000000"). */
export const hrefWhatsapp = (numero: string) => `https://wa.me/${digitos(numero)}`;

/** Link de una red social (Instagram, LinkedIn…): la URL limpia, o `undefined` si está vacía. */
export const hrefRed = (url?: string | null) => limpio(url).trim() || undefined;
