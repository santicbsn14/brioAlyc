import Contacto, { type ContactoCanal, type ContactoProps, type ContactoRed } from './Contacto';
import FaltaCargar from '../FaltaCargar/FaltaCargar';
import { useSanityQuery } from '../../sanity/useSanityQuery';
import { CONTACTO_QUERY } from '../../sanity/queries';
import { hrefEmail, hrefTelefono, hrefWhatsapp } from '../../sanity/links';
import type { ContactoQueryResult, DatosEmpresaContacto, SeccionContactoDoc } from '../../sanity/types';
import styles from './Contacto.module.css';

/** Id del ancla de la sección: lo usan "/#contacto" (Navbar), ABRI_CUENTA_HREF y el botón de
 * Financiamiento PyME ("/?motivo=…#contacto"). */
const ANCLA = 'contacto';

/** Orden e ícono de las redes en código (Contacto solo tiene íconos de estas dos); el link sale
 * de Datos de la empresa. El label es el aria-label del ícono. */
const REDES: Omit<ContactoRed, 'href'>[] = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'linkedin', label: 'LinkedIn' },
];

const texto = (t?: string | null) => t?.trim() || undefined;

/** Los 5 canales, con los valores de Datos de la empresa y los nombres de la sección. Un canal sin
 * valor no se muestra (WhatsApp y horario son opcionales en el Studio). */
function armarCanales(seccion: SeccionContactoDoc, empresa: DatosEmpresaContacto): ContactoCanal[] {
  const nombres = seccion.etiquetasCanales;
  const d = empresa.direccion;
  const whatsapp = texto(empresa.whatsapp);
  const email = texto(empresa.email);
  const telefono = texto(empresa.telefono);
  const horario = texto(empresa.horario);
  const canales: (ContactoCanal | null)[] = [
    whatsapp
      ? {
          id: 'whatsapp',
          label: nombres?.whatsapp ?? '',
          value: texto(empresa.whatsappTexto) ?? `+${whatsapp}`,
          href: hrefWhatsapp(whatsapp),
          external: true,
        }
      : null,
    email ? { id: 'email', label: nombres?.email ?? '', value: email, href: hrefEmail(email) } : null,
    telefono ? { id: 'tel', label: nombres?.telefono ?? '', value: telefono, href: hrefTelefono(telefono) } : null,
    // "Rosario, Santa Fe" + "Córdoba 1464 Piso 4, CP 2000": las comas y el "CP" los pone el front.
    d && (d.ciudad || d.provincia)
      ? {
          id: 'dir',
          label: nombres?.oficina ?? '',
          value: [d.ciudad, d.provincia].filter(Boolean).join(', '),
          sub: texto([d.calle, d.codigoPostal && `CP ${d.codigoPostal}`].filter(Boolean).join(', ')),
          href: null,
        }
      : null,
    horario ? { id: 'hs', label: nombres?.horario ?? '', value: horario, href: null } : null,
  ];
  return canales.filter((c): c is ContactoCanal => c !== null);
}

/** Arma las props de Contacto como dice la entrada "Datos de la empresa + Contacto + Footer" de
 * PROGRESO-STUDIO.md. Motivos, mensajes de validación, el campo "Nombre de la empresa" y el
 * honeypot quedan en código (data/contacto.ts y Contacto.tsx). */
function armarContacto(seccion: SeccionContactoDoc, empresa: DatosEmpresaContacto): ContactoProps {
  const campos = seccion.etiquetasCampos;
  const ayuda = seccion.placeholdersMensaje;
  return {
    seal: texto(empresa.selloCnv),
    title: seccion.titulo ?? '',
    lead: texto(seccion.bajada),
    channels: armarCanales(seccion, empresa),
    socialLabel: seccion.rotuloRedes ?? '',
    // Una red sin link no se muestra.
    social: REDES.flatMap((r) => {
      const href = texto(empresa[r.id]);
      return href ? [{ ...r, href }] : [];
    }),
    motivosLabel: seccion.rotuloMotivos ?? '',
    fields: {
      nombre: campos?.nombre ?? '',
      email: campos?.email ?? '',
      telefono: campos?.telefono ?? '',
      mensaje: campos?.mensaje ?? '',
    },
    mensajePlaceholders: {
      cuenta: texto(ayuda?.cuenta),
      pyme: texto(ayuda?.pyme),
      consulta: texto(ayuda?.consulta),
    },
    submitLabel: seccion.textoBotonEnviar ?? '',
    sendingLabel: seccion.textoBotonEnviando ?? '',
    legal: texto(seccion.avisoDatos),
    success: {
      title: seccion.exito?.titulo ?? '',
      text: texto(seccion.exito?.texto),
      again: seccion.exito?.textoBoton ?? '',
    },
    errorEnvio: seccion.mensajeErrorEnvio ?? '',
  };
}

/** Contacto con "seccionContacto" + lo que usa de "datosEmpresa", en una sola query.
 * El ancla #contacto existe siempre, en todos los estados: los links "/?motivo=…#contacto"
 * esperan un tiempo limitado a que aparezca (hooks/useScrollToTop.ts), y los datos de Sanity
 * pueden llegar después.
 *  - cargando → la sección vacía, con su fondo y el alto de una pantalla: así el scroll puede
 *    dejarla arriba de todo aunque abajo todavía no haya nada (el Footer también carga). El
 *    formulario se monta cuando llegan los datos y lee `?motivo=` en ese momento, así que el
 *    chip queda marcado igual;
 *  - error de red → solo el ancla, sin alto (está abajo: que no aparezca no mueve nada);
 *  - algún documento sin publicar → el ancla con un recuadro FaltaCargar por cada uno (en
 *    producción, solo el ancla).
 * El formulario sigue mandando a /api/contacto como siempre. */
export default function ContactoSanity() {
  const { data, status } = useSanityQuery<ContactoQueryResult>(CONTACTO_QUERY);

  if (status === 'cargando') {
    return <section id={ANCLA} className={`${styles.section} ${styles.reserva}`} aria-busy="true" />;
  }
  if (status === 'error') return <div id={ANCLA} />;

  const seccion = data?.seccion;
  const empresa = data?.empresa;
  if (!seccion || !empresa) {
    return (
      <div id={ANCLA}>
        {!seccion && <FaltaCargar nombre="Sección Contacto" ubicacion="Inicio → Contacto" />}
        {!empresa && <FaltaCargar nombre="Datos de la empresa" ubicacion="General → Datos de la empresa" />}
      </div>
    );
  }

  return <Contacto {...armarContacto(seccion, empresa)} />;
}
