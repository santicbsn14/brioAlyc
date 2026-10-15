// Queries GROQ, una por componente. Salen de las queries de referencia de
// brio-studio/PROGRESO-STUDIO.md (cada entrada del Studio tiene la suya).
// Lo que devuelve cada una está tipado a mano en ./types.ts: si se cambia una query, cambiar su tipo.

/** Navbar (montado en App.tsx). Entrada "Ajustes chicos + Navbar". */
export const NAVBAR_QUERY = /* groq */ `
*[_type == "navbar" && _id == "navbar"][0]{
  linkQuienesSomos, linkEquipo, linkContacto,
  servicios{disparador, financiamientoPyme, productos},
  herramientas{disparador, comisiones, informes, consultaPortafolio, panelCotizaciones, rentaFija},
  textoPortafolio, textoBotonCuenta
}`;

/** Footer (montado en App.tsx). Entrada "Datos de la empresa + Contacto + Footer". */
export const FOOTER_QUERY = /* groq */ `
{
  "footer": *[_type == "footer" && _id == "footer"][0]{
    tituloContacto, tituloDireccion, tituloRedes, prefijoCredencial,
    textoLinkConducta, textoLinkTerminos, textoCopyright
  },
  "empresa": *[_type == "datosEmpresa" && _id == "datosEmpresa"][0]{
    telefono, email, direccion,
    youtube, facebook, x, instagram, linkedin,
    razonSocial, leyendaCnv, credenciales[]{_key, entidad, numero}
  }
}`;
