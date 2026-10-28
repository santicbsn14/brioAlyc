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

/** Hero de la home. Entradas "Sanity 6.19 + sección Hero + menú agrupado",
 * "Hero: texto del link al panel completo" y "Acciones del panel + certificación en Equipo".
 * También la usa el Panel de Cotizaciones, por `accionesPanel` (así comparten la caché). */
export const HERO_QUERY = /* groq */ `
{
  "hero": *[_type == "seccionHero" && _id == "seccionHero"][0]{
    titulo, bajada, textoBotonPrincipal, textoBotonSecundario,
    tituloPanel, etiquetaPanel, accionesPanel, notaPanel, textoLinkPanel
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

/** Página /servicios/financiamiento-pyme. Entrada "Página Financiamiento PyME + tipo 'Texto con
 * resaltado'". */
export const FINANCIAMIENTO_QUERY = /* groq */ `
*[_type == "paginaFinanciamiento" && _id == "paginaFinanciamiento"][0]{
  kicker, titulo, bajada, textoBoton,
  beneficio1{titulo, texto}, beneficio2{titulo, texto}, beneficio3{titulo, texto},
  tituloPasos, bajadaPasos,
  paso1{titulo, texto}, paso2{titulo, texto}, paso3{titulo, texto}, paso4{titulo, texto},
  textoCierre
}`;

/** Página /abri-tu-cuenta. Entrada "Página Abrí tu cuenta (modelo + carga)". */
export const ABRIR_CUENTA_QUERY = /* groq */ `
*[_type == "paginaAbrirCuenta" && _id == "paginaAbrirCuenta"][0]{
  kicker, titulo, bajada, textoBotonEmpezar,
  tituloPreguntas, preguntas[]{_key, pregunta, respuesta},
  tituloCierre, textoCierre, textoBotonContacto
}`;

/** Página /informes: textos de la página + el listado (solo los informes con PDF, el más nuevo
 * arriba; misma fecha → el creado último primero). Entrada "Base del Studio + sección Informes". */
export const INFORMES_QUERY = /* groq */ `
{
  "pagina": *[_type == "paginaInformes" && _id == "paginaInformes"][0]{
    kicker, titulo, bajada, textoFiltroTodos, etiquetasCategorias, textoVacio, textoBotonDescarga
  },
  "informes": *[_type == "informe" && defined(archivo.asset)] | order(fecha desc, _createdAt desc){
    _id, titulo, fecha, categoria, resumen,
    "archivoUrl": archivo.asset->url,
    "archivoNombre": archivo.asset->originalFilename
  }
}`;

/** Página /comisiones: textos de la página + las pestañas en el orden del Studio (orderRank). Cada
 * tabla trae la grilla como filas de celdas: la primera fila son los títulos de las columnas.
 * Entrada "Página Comisiones". */
export const COMISIONES_QUERY = /* groq */ `
{
  "pagina": *[_type == "paginaComisiones" && _id == "paginaComisiones"][0]{
    titulo, textoVigencia, fechaVigencia, aclaracion
  },
  "pestanas": *[_type == "pestanaComisiones"] | order(orderRank) {
    _id, nombre,
    tablas[]{ _key, titulo, "filas": grilla.rows[].cells, notas }
  }
}`;

/** Página /codigo-de-conducta: la página + la razón social de Datos de la empresa (arriba del
 * título y debajo de la firma). Entrada "Legales (Código de conducta + Términos y condiciones)". */
export const CODIGO_CONDUCTA_QUERY = /* groq */ `
{
  "pagina": *[_type == "paginaCodigoConducta" && _id == "paginaCodigoConducta"][0]{
    titulo, cuerpo, cierre, firma{nombre, cargo}, textoVolver
  },
  "empresa": *[_type == "datosEmpresa" && _id == "datosEmpresa"][0]{ razonSocial }
}`;

/** Página /terminos-y-condiciones (no lee Datos de la empresa). Misma entrada que la anterior. */
export const TERMINOS_QUERY = /* groq */ `
*[_type == "paginaTerminos" && _id == "paginaTerminos"][0]{ titulo, cuerpo, cierre, textoVolver }`;
