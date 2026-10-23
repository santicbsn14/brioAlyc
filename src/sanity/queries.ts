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

/** Hero de la home. Entradas "Sanity 6.19 + sección Hero + menú agrupado" y
 * "Hero: texto del link al panel completo". */
export const HERO_QUERY = /* groq */ `
{
  "hero": *[_type == "seccionHero" && _id == "seccionHero"][0]{
    titulo, bajada, textoBotonPrincipal, textoBotonSecundario,
    tituloPanel, etiquetaPanel, notaPanel, textoLinkPanel
  },
  "empresa": *[_type == "datosEmpresa" && _id == "datosEmpresa"][0]{
    selloCnv, credenciales[]{_key, entidad, numero}
  }
}`;

/** Servicios de la home: sus textos + los nombres de las tres categorías de Productos que muestra la
 * home (los instrumentos no se cargan en Servicios). Entrada "Sección Servicios". */
export const SERVICIOS_QUERY = /* groq */ `
{
  "servicios": *[_type == "seccionServicios" && _id == "seccionServicios"][0]{
    kicker, titulo, bajada, textoDestacado,
    pilar1{titulo, texto}, pilar2{titulo, texto}, pilar3{titulo, texto},
    tituloInstrumentos, textoLinkPanel,
    tituloComisiones, bajadaComisiones, textoBotonComisiones
  },
  "productos": *[_type == "paginaProductos" && _id == "paginaProductos"][0]{
    categoriaFinanciamiento{nombre, instrumentos[]{_key, nombre}},
    categoriaRentaFija{nombre, instrumentos[]{_key, nombre}},
    categoriaRentaVariable{nombre, instrumentos[]{_key, nombre}}
  }
}`;

/** Página /servicios/productos. Entrada "Página Productos". */
export const PRODUCTOS_QUERY = /* groq */ `
*[_type == "paginaProductos" && _id == "paginaProductos"][0]{
  kicker, titulo, bajada,
  "categorias": {
    "rentaFija": categoriaRentaFija{nombre, frase, instrumentos[]{_key, nombre, linea}},
    "rentaVariable": categoriaRentaVariable{nombre, frase, instrumentos[]{_key, nombre, linea}},
    "financiamiento": categoriaFinanciamiento{nombre, frase, instrumentos[]{_key, nombre, linea}},
    "futuros": categoriaFuturos{nombre, frase, instrumentos[]{_key, nombre, linea}}
  }
}`;

/** Contacto de la home. Entrada "Datos de la empresa + Contacto + Footer". */
export const CONTACTO_QUERY = /* groq */ `
{
  "seccion": *[_type == "seccionContacto" && _id == "seccionContacto"][0]{
    titulo, bajada, etiquetasCanales, rotuloRedes,
    rotuloMotivos, etiquetasCampos, placeholdersMensaje,
    textoBotonEnviar, textoBotonEnviando, avisoDatos, exito, mensajeErrorEnvio
  },
  "empresa": *[_type == "datosEmpresa" && _id == "datosEmpresa"][0]{
    telefono, email, direccion, whatsapp, whatsappTexto, horario,
    instagram, linkedin, selloCnv
  }
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

/** Quiénes somos de la home. Entrada "Flechas fuera del texto + sección Quiénes somos". */
export const QUIENES_SOMOS_QUERY = /* groq */ `
*[_type == "seccionQuienesSomos" && _id == "seccionQuienesSomos"][0]{
  kicker, titulo, relato,
  foto{alt, crop, hotspot, asset->{_id, url, metadata{dimensions, lqip}}},
  valor1{titulo, texto}, valor2{titulo, texto}, valor3{titulo, texto}, valor4{titulo, texto}
}`;

/** Equipo de la home: textos de la sección + socios y empleados en el orden de cada lista del
 * Studio (orderRank). Entrada "Sección Equipo". */
export const EQUIPO_QUERY = /* groq */ `
{
  "seccion": *[_type == "seccionEquipo" && _id == "seccionEquipo"][0]{
    kicker, titulo, bajada, rotuloEmpleados, textoVerMas, textoVerMenos
  },
  "socios": *[_type == "persona" && tipo == "socio"] | order(orderRank){
    _id, nombre, cargo, bio, bioExtendida,
    foto{asset->{_id, url, metadata{dimensions, lqip}}, crop, hotspot}
  },
  "empleados": *[_type == "persona" && tipo == "empleado"] | order(orderRank){
    _id, nombre, cargo,
    foto{asset->{_id, url, metadata{dimensions, lqip}}, crop, hotspot}
  }
}`;
