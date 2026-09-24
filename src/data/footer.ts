// Contenido del Footer (visible en todas las páginas, montado en App.tsx fuera de <Routes>).
// Portado del prototipo aprobado `__ref/BrioFooter.jsx` (objeto `footer`), con los datos
// reales de contacto/dirección/redes ya confirmados (a diferencia de `data/contacto.ts`,
// que todavía tiene varios canales de ejemplo).
//
// CÓMO EDITAR:
//   - Agregar/quitar una red social → sumar/borrar un `FooterSocial` en `social`.
//   - Agregar/quitar un link legal (ej. Política de privacidad) → sumar/borrar un
//     `FooterLegalLink` en `legalLinks` y crear su página + ruta en `App.tsx`.
//   - `copyright` recibe el año actual (lo calcula el componente con `new Date().getFullYear()`)
//     para no tener que venir a actualizar este archivo cada enero.
//
// TODO(Agus): confirmar los links reales de Instagram y LinkedIn — hoy son placeholder,
// igual que en `data/contacto.ts`.

export interface FooterContactChannel {
  label: string;
  value: string;
  href: string;
}

export interface FooterSocial {
  id: string;
  label: string;
  href: string;
}

export interface FooterLegalLink {
  id: string;
  label: string;
  href: string;
}

export interface FooterContent {
  brand: { logoAlt: string };
  contacto: {
    title: string;
    telefono: FooterContactChannel;
    email: FooterContactChannel;
  };
  direccion: {
    title: string;
    lineas: string[];
  };
  socialLabel: string;
  social: FooterSocial[];
  razonSocial: string[];
  registro: string;
  credenciales: string;
  legalLinks: FooterLegalLink[];
  copyright: (year: number) => string;
}

export const footer: FooterContent = {
  brand: {
    logoAlt: 'Brio Valores',
  },
  contacto: {
    title: 'Contacto',
    telefono: {
      label: 'Teléfono',
      value: '+54 (341) 5275351/52',
      href: 'tel:+543415275351',
    },
    email: {
      label: 'Email',
      value: 'info@briovalores.com',
      href: 'mailto:info@briovalores.com',
    },
  },
  direccion: {
    title: 'Dirección',
    lineas: ['Córdoba 1464 Piso 4,', 'Rosario, CP 2000,', 'Santa Fe, Argentina'],
  },
  socialLabel: 'Seguinos',
  social: [
    { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@briovaloresalycs.a.6858' },
    { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/BrioValores' },
    { id: 'x', label: 'X', href: 'https://x.com/BrioValores' },
    // TODO(Agus): confirmar link real de Instagram.
    { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/briovalores' },
    // TODO(Agus): confirmar link real de LinkedIn.
    { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/company/briovalores' },
  ],
  razonSocial: ['BRIO VALORES AGENTE', 'DE LIQUIDACIÓN Y COMPENSACIÓN S.A.'],
  registro: 'Agente de Liquidación y Compensación Registrado bajo el Nro. 512 de la CNV',
  credenciales: 'Agente BYMA 210 · Agente MAV 429 · Agente A3 378 · Agente MAE 072 · Agente ACDI 108',
  legalLinks: [
    { id: 'conducta', label: 'Código de conducta', href: '/codigo-de-conducta' },
    { id: 'terminos', label: 'Términos y condiciones', href: '/terminos-y-condiciones' },
  ],
  copyright: (year) => `© ${year} Brio Valores. Todos los derechos reservados.`,
};
