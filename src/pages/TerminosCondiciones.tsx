import { Link } from 'react-router-dom';
import { terminosCondiciones } from '../data/legal';
import styles from './LegalDoc.module.css';

/** Página /terminos-y-condiciones: borrador genérico (ver TODO en `data/legal.ts`), mismo
 * layout de documento que /codigo-de-conducta (`LegalDoc.module.css` compartido). */
export default function TerminosCondiciones() {
  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        <Link to="/" className={styles.back}>
          ← Volver al inicio
        </Link>

        <h1 className={styles.title}>{terminosCondiciones.titulo}</h1>

        {terminosCondiciones.secciones.map((seccion) => (
          <div key={seccion.numero} className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {seccion.numero}. {seccion.titulo}
            </h2>
            <p className={styles.p}>{seccion.texto}</p>
          </div>
        ))}

        <p className={`${styles.p} ${styles.cierre}`}>{terminosCondiciones.cierre}</p>

        <Link to="/" className={`${styles.back} ${styles.backBottom}`}>
          ← Volver al inicio
        </Link>
      </div>
    </section>
  );
}
