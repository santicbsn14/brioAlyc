// Tipos de lo que devuelve cada query de ./queries.ts, escritos a mano a partir de los schemas
// de brio-studio (schemaTypes/). Sin TypeGen por ahora.
//
// Criterio: todo campo es opcional (`?`) o puede venir `null`, aunque en el Studio sea obligatorio.
// Un documento publicado antes de que un campo pasara a obligatorio, o un campo que se agrega
// después, puede faltar: el front lo tiene que bancar sin romperse.

type Texto = string | null;

// ── Navbar (schemaTypes/singletons/navbar.ts) ───────────────────────────

export interface NavbarDoc {
  linkQuienesSomos?: Texto;
  linkEquipo?: Texto;
  linkContacto?: Texto;
  servicios?: {
    disparador?: Texto;
    financiamientoPyme?: Texto;
    productos?: Texto;
  } | null;
  herramientas?: {
    disparador?: Texto;
    comisiones?: Texto;
    informes?: Texto;
    consultaPortafolio?: Texto;
    panelCotizaciones?: Texto;
    rentaFija?: Texto;
  } | null;
  textoPortafolio?: Texto;
  textoBotonCuenta?: Texto;
}

/** NAVBAR_QUERY: `null` si el documento no está publicado. */
export type NavbarQueryResult = NavbarDoc | null;

// ── Footer (schemaTypes/singletons/footer.ts) ───────────────────────────

export interface FooterDoc {
  tituloContacto?: Texto;
  tituloDireccion?: Texto;
  tituloRedes?: Texto;
  /** Opcional: "Agente" antes de cada credencial. */
  prefijoCredencial?: Texto;
  textoLinkConducta?: Texto;
  textoLinkTerminos?: Texto;
  /** Sin "© " ni el año: los pone el front. */
  textoCopyright?: Texto;
}

// ── Datos de la empresa (schemaTypes/singletons/datosEmpresa.ts) ─────────

export interface Direccion {
  calle?: Texto;
  ciudad?: Texto;
  codigoPostal?: Texto;
  provincia?: Texto;
  pais?: Texto;
}

export interface Credencial {
  _key: string;
  entidad?: Texto;
  /** Texto, para no perder el cero de "072". */
  numero?: Texto;
}

/** Redes: un campo por red, todas opcionales (solo links https://). */
export type RedId = 'youtube' | 'facebook' | 'x' | 'instagram' | 'linkedin';

/** Los campos de datosEmpresa que pide el Footer. */
export type DatosEmpresaFooter = Partial<Record<RedId, Texto>> & {
  /** Tal como se muestra, ej. "+54 (341) 5275351/52". */
  telefono?: Texto;
  email?: Texto;
  direccion?: Direccion | null;
  /** Un renglón por línea (`\n`). */
  razonSocial?: Texto;
  leyendaCnv?: Texto;
  credenciales?: Credencial[] | null;
};

/** FOOTER_QUERY: cada documento viene `null` si no está publicado. */
export interface FooterQueryResult {
  footer: FooterDoc | null;
  empresa: DatosEmpresaFooter | null;
}

// ── Hero (schemaTypes/singletons/seccionHero.ts) ────────────────────────

export interface SeccionHeroDoc {
  titulo?: Texto;
  /** Opcional. */
  bajada?: Texto;
  textoBotonPrincipal?: Texto;
  textoBotonSecundario?: Texto;
  tituloPanel?: Texto;
  etiquetaPanel?: Texto;
  notaPanel?: Texto;
  /** "Ver panel completo", sin la flecha (la pone el front). Agregado el 2026-10-21: un Hero
   * publicado antes no lo tiene. */
  textoLinkPanel?: Texto;
}

/** Los campos de datosEmpresa que pide el Hero. */
export interface DatosEmpresaHero {
  /** "Agente registrado en CNV · Mat. 512": el antetítulo del Hero. */
  selloCnv?: Texto;
  credenciales?: Credencial[] | null;
}

/** HERO_QUERY: cada documento viene `null` si no está publicado. */
export interface HeroQueryResult {
  hero: SeccionHeroDoc | null;
  empresa: DatosEmpresaHero | null;
}

// ── Contacto (schemaTypes/singletons/seccionContacto.ts) ────────────────

/** Ids de los motivos del formulario: los mismos que MOTIVOS_CONTACTO del Studio y data/contacto.ts. */
export type MotivoContactoId = 'cuenta' | 'pyme' | 'consulta';

export interface SeccionContactoDoc {
  titulo?: Texto;
  /** Opcional. */
  bajada?: Texto;
  etiquetasCanales?: {
    whatsapp?: Texto;
    email?: Texto;
    telefono?: Texto;
    oficina?: Texto;
    horario?: Texto;
  } | null;
  /** "Seguinos". */
  rotuloRedes?: Texto;
  /** "¿En qué te ayudamos?". */
  rotuloMotivos?: Texto;
  etiquetasCampos?: {
    nombre?: Texto;
    email?: Texto;
    telefono?: Texto;
    mensaje?: Texto;
  } | null;
  /** Texto de ayuda del mensaje, uno por motivo, todos opcionales. */
  placeholdersMensaje?: Partial<Record<MotivoContactoId, Texto>> | null;
  textoBotonEnviar?: Texto;
  textoBotonEnviando?: Texto;
  /** Opcional: "Usamos tus datos solo para…". */
  avisoDatos?: Texto;
  exito?: {
    titulo?: Texto;
    /** Opcional. */
    texto?: Texto;
    textoBoton?: Texto;
  } | null;
  mensajeErrorEnvio?: Texto;
}

/** Los campos de datosEmpresa que pide Contacto. */
export interface DatosEmpresaContacto {
  telefono?: Texto;
  email?: Texto;
  direccion?: Direccion | null;
  /** Opcional (con aviso en el Studio). Solo dígitos, formato internacional. */
  whatsapp?: Texto;
  /** Opcional: cómo se muestra; vacío → "+" + `whatsapp`. */
  whatsappTexto?: Texto;
  /** Opcional (con aviso en el Studio). */
  horario?: Texto;
  instagram?: Texto;
  linkedin?: Texto;
  selloCnv?: Texto;
}

/** CONTACTO_QUERY: cada documento viene `null` si no está publicado. */
export interface ContactoQueryResult {
  seccion: SeccionContactoDoc | null;
  empresa: DatosEmpresaContacto | null;
}

// ── Servicios (schemaTypes/singletons/seccionServicios.ts) ──────────────

export interface PilarDoc {
  titulo?: Texto;
  texto?: Texto;
}

export interface SeccionServiciosDoc {
  /** Opcional. */
  kicker?: Texto;
  titulo?: Texto;
  /** Opcional. */
  bajada?: Texto;
  /** "Nuestro diferencial": la etiqueta del pilar destacado (el primero). */
  textoDestacado?: Texto;
  pilar1?: PilarDoc | null;
  pilar2?: PilarDoc | null;
  pilar3?: PilarDoc | null;
  tituloInstrumentos?: Texto;
  /** "Panel de cotizaciones en vivo", sin la flecha (la pone el front). */
  textoLinkPanel?: Texto;
  tituloComisiones?: Texto;
  /** Opcional. */
  bajadaComisiones?: Texto;
  /** "Ver comisiones completas", sin la flecha (la pone el front). */
  textoBotonComisiones?: Texto;
}

// ── Productos (schemaTypes/singletons/paginaProductos.ts) ───────────────

export interface InstrumentoDoc {
  _key: string;
  nombre?: Texto;
  /** Línea explicativa: solo la pide la página Productos. */
  linea?: Texto;
}

export interface CategoriaProductosDoc {
  nombre?: Texto;
  /** Solo la pide la página Productos. */
  frase?: Texto;
  instrumentos?: InstrumentoDoc[] | null;
}

/** Las tres categorías de Productos que muestra la home. */
export interface ProductosParaServicios {
  categoriaFinanciamiento?: CategoriaProductosDoc | null;
  categoriaRentaFija?: CategoriaProductosDoc | null;
  categoriaRentaVariable?: CategoriaProductosDoc | null;
}

/** SERVICIOS_QUERY: cada documento viene `null` si no está publicado. */
export interface ServiciosQueryResult {
  servicios: SeccionServiciosDoc | null;
  productos: ProductosParaServicios | null;
}

export interface PaginaProductosDoc {
  /** Opcional. */
  kicker?: Texto;
  titulo?: Texto;
  /** Opcional. */
  bajada?: Texto;
  categorias?: {
    rentaFija?: CategoriaProductosDoc | null;
    rentaVariable?: CategoriaProductosDoc | null;
    financiamiento?: CategoriaProductosDoc | null;
    futuros?: CategoriaProductosDoc | null;
  } | null;
}

/** PRODUCTOS_QUERY: `null` si el documento no está publicado. */
export type ProductosQueryResult = PaginaProductosDoc | null;
