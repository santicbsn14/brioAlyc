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

// ── Imágenes (tipo `image` de Sanity, con crop/hotspot) ──────────────────

/** Una imagen como la piden las queries: el asset expandido + el recorte y el punto de interés. */
export interface ImagenDoc {
  /** Solo en las que tienen descripción (ej. la foto de Quiénes somos). */
  alt?: Texto;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
  hotspot?: { x: number; y: number; height: number; width: number } | null;
  /** `null` si se cargó la descripción pero no se subió la foto. */
  asset?: {
    _id: string;
    url?: Texto;
    metadata?: { dimensions?: { width: number; height: number } | null; lqip?: Texto } | null;
  } | null;
}

// ── Quiénes somos (schemaTypes/singletons/seccionQuienesSomos.ts) ───────

export interface ValorDoc {
  titulo?: Texto;
  texto?: Texto;
}

export interface SeccionQuienesSomosDoc {
  /** Opcional. */
  kicker?: Texto;
  titulo?: Texto;
  /** Un solo texto: los párrafos van separados por un renglón en blanco. */
  relato?: Texto;
  foto?: ImagenDoc | null;
  valor1?: ValorDoc | null;
  valor2?: ValorDoc | null;
  valor3?: ValorDoc | null;
  valor4?: ValorDoc | null;
}

/** QUIENES_SOMOS_QUERY: `null` si el documento no está publicado. */
export type QuienesSomosQueryResult = SeccionQuienesSomosDoc | null;

// ── Equipo (schemaTypes/singletons/seccionEquipo.ts + documents/persona.ts) ─

export interface SeccionEquipoDoc {
  /** Opcional. */
  kicker?: Texto;
  titulo?: Texto;
  /** Opcional. */
  bajada?: Texto;
  rotuloEmpleados?: Texto;
  textoVerMas?: Texto;
  textoVerMenos?: Texto;
}

export interface PersonaDoc {
  _id: string;
  nombre?: Texto;
  cargo?: Texto;
  /** Solo socios. */
  bio?: Texto;
  /** Solo socios, opcional: si está, aparece "Ver más". */
  bioExtendida?: Texto;
  foto?: ImagenDoc | null;
}

/** EQUIPO_QUERY: `seccion` viene `null` si no está publicada; las listas, vacías si no hay nadie. */
export interface EquipoQueryResult {
  seccion: SeccionEquipoDoc | null;
  socios: PersonaDoc[] | null;
  empleados: PersonaDoc[] | null;
}

// ── Texto con resaltado (schemaTypes/objects/textoResaltado.tsx) ─────────

/** Un pedazo de texto del párrafo. Los resaltados traen "resaltado" en `marks`. */
export interface SpanDoc {
  _key: string;
  _type?: string;
  text?: Texto;
  marks?: string[] | null;
}

/** Un párrafo con partes resaltadas: un array con un solo bloque (el Studio no deja publicar dos). */
export type TextoResaltadoDoc = { _key?: string; _type?: string; children?: SpanDoc[] | null }[];

// ── Financiamiento PyME (schemaTypes/singletons/paginaFinanciamiento.ts) ─

export interface BloqueFijoDoc {
  titulo?: Texto;
  texto?: Texto;
}

export interface PaginaFinanciamientoDoc {
  /** Opcional. */
  kicker?: Texto;
  titulo?: Texto;
  /** Opcional. */
  bajada?: TextoResaltadoDoc | null;
  /** El mismo texto para los dos botones (intro y cierre). */
  textoBoton?: Texto;
  beneficio1?: BloqueFijoDoc | null;
  beneficio2?: BloqueFijoDoc | null;
  beneficio3?: BloqueFijoDoc | null;
  tituloPasos?: Texto;
  /** Opcional. */
  bajadaPasos?: Texto;
  paso1?: BloqueFijoDoc | null;
  paso2?: BloqueFijoDoc | null;
  paso3?: BloqueFijoDoc | null;
  paso4?: BloqueFijoDoc | null;
  textoCierre?: Texto;
}

/** FINANCIAMIENTO_QUERY: `null` si el documento no está publicado. */
export type FinanciamientoQueryResult = PaginaFinanciamientoDoc | null;

// ── Abrí tu cuenta (schemaTypes/singletons/paginaAbrirCuenta.ts) ─

export interface PreguntaFrecuenteDoc {
  _key: string;
  pregunta?: Texto;
  /** Texto plano: un renglón en blanco separa párrafos. */
  respuesta?: Texto;
}

export interface PaginaAbrirCuentaDoc {
  /** Opcional. */
  kicker?: Texto;
  titulo?: Texto;
  /** Opcional. */
  bajada?: Texto;
  textoBotonEmpezar?: Texto;
  tituloPreguntas?: Texto;
  preguntas?: PreguntaFrecuenteDoc[] | null;
  tituloCierre?: Texto;
  /** Opcional. */
  textoCierre?: Texto;
  textoBotonContacto?: Texto;
}

/** ABRIR_CUENTA_QUERY: `null` si el documento no está publicado. */
export type AbrirCuentaQueryResult = PaginaAbrirCuentaDoc | null;

// ── Informes (schemaTypes/singletons/paginaInformes.ts + documents/informe.ts) ─

/** Ids de las categorías: los mismos que CATEGORIAS_INFORME del Studio. */
export type CategoriaInformeId = 'semanal' | 'mensual' | 'especial';

export interface PaginaInformesDoc {
  /** Opcional. */
  kicker?: Texto;
  titulo?: Texto;
  /** Opcional. */
  bajada?: Texto;
  /** "Todos". */
  textoFiltroTodos?: Texto;
  /** Nombre visible de cada categoría ("Informes semanales"…). */
  etiquetasCategorias?: Partial<Record<CategoriaInformeId, Texto>> | null;
  /** Opcional: cuando no hay informes en la categoría elegida. */
  textoVacio?: Texto;
  /** "Descargar PDF". */
  textoBotonDescarga?: Texto;
}

export interface InformeDoc {
  _id: string;
  titulo?: Texto;
  /** "AAAA-MM-DD". */
  fecha?: Texto;
  categoria?: Texto;
  /** Opcional. */
  resumen?: Texto;
  archivoUrl?: Texto;
  /** Nombre con el que se subió el PDF. */
  archivoNombre?: Texto;
}

/** INFORMES_QUERY: `pagina` viene `null` si no está publicada; `informes`, vacío si no hay. */
export interface InformesQueryResult {
  pagina: PaginaInformesDoc | null;
  informes: InformeDoc[] | null;
}

// ── Comisiones (schemaTypes/singletons/paginaComisiones.ts + documents/pestanaComisiones.ts) ─

export interface PaginaComisionesDoc {
  titulo?: Texto;
  /** "Vigencia:" (el espacio antes de la fecha lo pone el front). */
  textoVigencia?: Texto;
  /** "AAAA-MM-DD"; en la web se muestra solo mes y año. */
  fechaVigencia?: Texto;
  /** Opcional. */
  aclaracion?: Texto;
}

export interface TablaComisionesDoc {
  _key: string;
  titulo?: Texto;
  /** La grilla, fila por fila: la primera son los títulos de las columnas, el resto los datos. */
  filas?: (Texto[] | null)[] | null;
  /** Opcional. */
  notas?: Texto[] | null;
}

export interface PestanaComisionesDoc {
  _id: string;
  nombre?: Texto;
  tablas?: TablaComisionesDoc[] | null;
}

/** COMISIONES_QUERY: `pagina` viene `null` si no está publicada; `pestanas`, vacío si no hay. */
export interface ComisionesQueryResult {
  pagina: PaginaComisionesDoc | null;
  pestanas: PestanaComisionesDoc[] | null;
}

// ── Legales (schemaTypes/objects/textoLegal.ts + singletons/paginaCodigoConducta.ts y paginaTerminos.ts) ─

/** Un bloque de Portable Text del cuerpo: estilo `normal` (párrafo), `h2` (título de capítulo) o
 * `h3` (título de sección); los ítems de lista traen `listItem: 'bullet'` y `level` 1 o 2. */
export interface BloqueLegalDoc {
  _key: string;
  _type: string;
  style?: string;
  listItem?: string;
  level?: number;
  children?: SpanDoc[] | null;
  markDefs?: unknown[] | null;
}

export interface PaginaCodigoConductaDoc {
  titulo?: Texto;
  cuerpo?: BloqueLegalDoc[] | null;
  /** Opcional. */
  cierre?: Texto;
  /** Opcional: sin nombre, la firma no se muestra. */
  firma?: { nombre?: Texto; cargo?: Texto } | null;
  /** "Volver al inicio", sin la flecha. */
  textoVolver?: Texto;
}

/** CODIGO_CONDUCTA_QUERY: cada documento viene `null` si no está publicado. */
export interface CodigoConductaQueryResult {
  pagina: PaginaCodigoConductaDoc | null;
  /** Un renglón por línea (`\n`). */
  empresa: { razonSocial?: Texto } | null;
}

export interface PaginaTerminosDoc {
  titulo?: Texto;
  cuerpo?: BloqueLegalDoc[] | null;
  /** Opcional. */
  cierre?: Texto;
  textoVolver?: Texto;
}

/** TERMINOS_QUERY: `null` si el documento no está publicado. */
export type TerminosQueryResult = PaginaTerminosDoc | null;
