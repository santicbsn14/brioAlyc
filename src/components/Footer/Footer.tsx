import { Link } from 'react-router-dom';
import logoBlanco from '../../assets/logo-brio-blanco.svg';
import styles from './Footer.module.css';

export type SocialIconId = 'youtube' | 'facebook' | 'x' | 'instagram' | 'linkedin';

export interface FooterLink {
  texto: string;
  href: string;
}

export interface FooterRed {
  id: SocialIconId;
  /** aria-label del ícono. */
  label: string;
  href: string;
}

export interface FooterLegalLink extends FooterLink {
  id: string;
}

/** Todo el contenido llega armado (ver FooterSanity.tsx). Lo que viene vacío no se pinta:
 * una columna sin contenido, una red sin link, un renglón sin texto. */
export interface FooterProps {
  logoAlt: string;
  contacto: { titulo: string; telefono: FooterLink | null; email: FooterLink | null };
  direccion: { titulo: string; lineas: string[] };
  redes: { titulo: string; links: FooterRed[] };
  razonSocial: string[];
  registro: string;
  credenciales: string;
  legalLinks: FooterLegalLink[];
  /** Sin "© " ni el año: los pone el componente. */
  textoCopyright: string;
}

/** Íconos inline, mismo trazo simple que ya usa `components/Contacto/Contacto.tsx`. */
function SocialIcon({ id }: { id: string }) {
  const p = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (id as SocialIconId) {
    case 'youtube':
      return (
        <svg {...p}>
          <rect x="2.5" y="6" width="19" height="12" rx="4" />
          <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'facebook':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M13.6 21v-7h2.1l.3-2.6h-2.4V9.7c0-.72.2-1.22 1.24-1.22h1.33V6.1a17 17 0 0 0-1.94-.1c-1.92 0-3.24 1.18-3.24 3.34v1.86H8.9v2.6h2.09V21" />
        </svg>
      );
    case 'x':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M8.3 8.3l7.4 7.4M15.7 8.3l-7.4 7.4" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...p}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
          <path d="M8 10.5V17M8 7.5v.01M12 17v-3.8c0-1.3.9-2.2 2-2.2s2 .9 2 2.2V17" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

/** Footer institucional (brief "Footer (home) + legales"), montado en App.tsx fuera de
 * <Routes> para que aparezca en todas las páginas, no solo en la home. El contenido lo arma
 * FooterSanity.tsx con los documentos "footer" y "datosEmpresa" de Sanity.
 * 4 columnas en desktop (logo / Contacto / Dirección / Seguinos),
 * 2 en tablet y 1 en mobile chico (solo CSS, ver Footer.module.css). */
export default function Footer({
  logoAlt,
  contacto,
  direccion,
  redes,
  razonSocial,
  registro,
  credenciales,
  legalLinks,
  textoCopyright,
}: FooterProps) {
  const year = new Date().getFullYear();
  const contactos = [contacto.telefono, contacto.email].filter((c): c is FooterLink => Boolean(c));
  // Una red sin link no se muestra.
  const redesConLink = redes.links.filter((r) => r.href);

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.col}>
          <Link to="/" className={styles.brand} aria-label="Brio Valores — inicio">
            <img src={logoBlanco} alt={logoAlt} className={styles.logo} />
          </Link>
        </div>

        {contactos.length > 0 && (
          <div className={styles.col}>
            <h2 className={styles.colTitle}>{contacto.titulo}</h2>
            <ul className={styles.list}>
              {contactos.map((c) => (
                <li key={c.href}>
                  <a href={c.href}>{c.texto}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {direccion.lineas.length > 0 && (
          <div className={styles.col}>
            <h2 className={styles.colTitle}>{direccion.titulo}</h2>
            <address className={styles.address}>
              {direccion.lineas.map((linea) => (
                <span key={linea}>{linea}</span>
              ))}
            </address>
          </div>
        )}

        {redesConLink.length > 0 && (
          <div className={styles.col}>
            <h2 className={styles.colTitle}>{redes.titulo}</h2>
            <div className={styles.social}>
              {redesConLink.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={styles.socialLink}
                >
                  <SocialIcon id={s.id} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.legal}>
        <div className={styles.legalLeft}>
          {razonSocial.length > 0 && (
            <p className={styles.razonSocial}>
              {razonSocial.map((linea) => (
                <span key={linea}>{linea}</span>
              ))}
            </p>
          )}
          {registro && <p className={styles.registro}>{registro}</p>}
          {credenciales && <p className={styles.credenciales}>{credenciales}</p>}
        </div>

        <nav className={styles.legalLinks} aria-label="Legales">
          {legalLinks.map((l) => (
            <Link key={l.id} to={l.href}>
              {l.texto}
            </Link>
          ))}
        </nav>
      </div>

      <p className={styles.copyright}>{`© ${year} ${textoCopyright}`}</p>
    </footer>
  );
}
