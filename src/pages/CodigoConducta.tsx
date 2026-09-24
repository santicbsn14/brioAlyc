import { Link } from 'react-router-dom';
import { codigoConducta } from '../data/legal';
import styles from './LegalDoc.module.css';

/** Página /codigo-de-conducta: texto legal real de Brio Valores, completo y sin resumir
 * (brief "Página Código de conducta"). Contenido en `data/legal.ts`. Formato sobrio de
 * documento (capítulos como h2, artículos como párrafos normales, sin tarjetas ni
 * iconitos), mismo layout compartido que /terminos-y-condiciones (`LegalDoc.module.css`). */
export default function CodigoConducta() {
  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        <Link to="/" className={styles.back}>
          ← Volver al inicio
        </Link>

        <p className={styles.empresa}>{codigoConducta.empresa}</p>
        <h1 className={styles.title}>{codigoConducta.titulo}</h1>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{codigoConducta.prefacioTitulo}</h2>
          <p className={styles.p}>{codigoConducta.prefacio}</p>
        </div>

        {codigoConducta.capitulos.map((capitulo) => (
          <div key={capitulo.id} className={styles.chapter}>
            <h2 className={styles.chapterTitle}>{capitulo.titulo}</h2>
            {capitulo.bloques.map((bloque, i) =>
              bloque.tipo === 'parrafo' ? (
                <p key={i} className={styles.p}>
                  {bloque.texto}
                </p>
              ) : (
                <div key={i}>
                  <p className={styles.p}>{bloque.intro}</p>
                  <ul className={styles.list}>
                    {bloque.items.map((item, j) => (
                      <li key={j}>
                        {item.texto}
                        {item.sub && (
                          <ul className={styles.sublist}>
                            {item.sub.map((sub, k) => (
                              <li key={k}>{sub}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        ))}

        <p className={`${styles.p} ${styles.cierre}`}>{codigoConducta.cierre}</p>

        <div className={styles.signature}>
          <p className={styles.signName}>{codigoConducta.firmante}</p>
          <p className={styles.signRole}>{codigoConducta.firmanteCargo}</p>
          <p className={styles.signCompany}>{codigoConducta.firmanteEmpresa}</p>
        </div>

        <Link to="/" className={`${styles.back} ${styles.backBottom}`}>
          ← Volver al inicio
        </Link>
      </div>
    </section>
  );
}
