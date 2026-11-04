import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './LegalDoc.module.css';

/** Los textos de la página (vienen de Sanity, ver TerminosSanity). El cierre vacío no se pinta. */
export interface TerminosTextos {
  titulo: string;
  /** El cuerpo ya armado (las secciones numeradas con su texto). */
  cuerpo: ReactNode;
  cierre?: string;
  /** "Volver al inicio", sin la flecha (la "← " va acá). */
  textoVolver: string;
}

/** `cargando`: los textos todavía no llegaron de Sanity. Se ve el fondo de la página, de una pantalla
 * de alto, así el Footer no aparece arriba y salta. */
export type TerminosProps = { cargando: true } | ({ cargando?: false } & TerminosTextos);

/** Página /terminos-y-condiciones: hoy un borrador genérico (TODO asesoría legal: Agus lo reemplaza
 * en el Studio), mismo layout de documento que /codigo-de-conducta (`LegalDoc.module.css`
 * compartido). */
export default function TerminosCondiciones(props: TerminosProps) {
  if (props.cargando) return <section className={styles.page} style={{ minHeight: '100vh' }} aria-busy />;
  const { titulo, cuerpo, cierre, textoVolver } = props;

  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        <Link to="/" className={styles.back}>
          {`← ${textoVolver}`}
        </Link>

        <h1 className={styles.title}>{titulo}</h1>

        {cuerpo}

        {cierre && <p className={`${styles.p} ${styles.cierre}`}>{cierre}</p>}

        <Link to="/" className={`${styles.back} ${styles.backBottom}`}>
          {`← ${textoVolver}`}
        </Link>
      </div>
    </section>
  );
}
