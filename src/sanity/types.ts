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
