import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './LegalDoc.module.css';

/** Los textos de la página (vienen de Sanity, ver CodigoConductaSanity). Lo opcional vacío no se
 * pinta: sin `firmante` no hay bloque de firma. */
export interface CodigoConductaTextos {
  /** Razón social en un renglón (el CSS la pasa a mayúsculas arriba del título). */
  empresa?: string;
  titulo: string;
  /** El cuerpo ya armado (capítulos, secciones, artículos y listas). */
  cuerpo: ReactNode;
  cierre?: string;
  firmante?: string;
  firmanteCargo?: string;
  /** "Volver al inicio", sin la flecha (la "← " va acá). */
  textoVolver: string;
}

/** `cargando`: los textos todavía no llegaron de Sanity. Se ve el fondo de la página, de una pantalla
 * de alto, así el Footer no aparece arriba y salta. */
export type CodigoConductaProps = { cargando: true } | ({ cargando?: false } & CodigoConductaTextos);

/** Página /codigo-de-conducta: texto legal real de Brio Valores, completo y sin resumir
 * (brief "Página Código de conducta"). Formato sobrio de documento (capítulos como h2,
 * artículos como párrafos normales, sin tarjetas ni iconitos), mismo layout compartido que
 * /terminos-y-condiciones (`LegalDoc.module.css`). */
export default function CodigoConducta(props: CodigoConductaProps) {
  if (props.cargando) return <section className={styles.page} style={{ minHeight: '100vh' }} aria-busy />;
  const { empresa, titulo, cuerpo, cierre, firmante, firmanteCargo, textoVolver } = props;

  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        <Link to="/" className={styles.back}>
          {`← ${textoVolver}`}
        </Link>

        {empresa && <p className={styles.empresa}>{empresa}</p>}
        <h1 className={styles.title}>{titulo}</h1>

        {cuerpo}

        {cierre && <p className={`${styles.p} ${styles.cierre}`}>{cierre}</p>}

        {firmante && (
          <div className={styles.signature}>
            <p className={styles.signName}>{firmante}</p>
            {firmanteCargo && <p className={styles.signRole}>{firmanteCargo}</p>}
            {empresa && <p className={styles.signCompany}>{empresa}</p>}
          </div>
        )}

        <Link to="/" className={`${styles.back} ${styles.backBottom}`}>
          {`← ${textoVolver}`}
        </Link>
      </div>
    </section>
  );
}
