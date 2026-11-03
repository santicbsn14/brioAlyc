import { Link } from 'react-router-dom';
import { useNoIndex } from '../seo/useSeo';
import styles from './NoEncontrada.module.css';

/** Página para cualquier ruta que no existe (Route path="*"). Textos en código. Mientras está
 * montada, el <head> lleva meta robots "noindex"; el título lo pone useSeo (seo/paginas.ts). */
export default function NoEncontrada() {
  useNoIndex();

  return (
    <section className={styles.nf} aria-labelledby="nf-title">
      <div className={styles.inner}>
        <p className={styles.kicker}>
          <span className={styles.kickerLine} aria-hidden="true" />
          Error 404
        </p>
        <h1 id="nf-title" className={styles.title}>
          No encontramos esta página
        </h1>
        <p className={styles.lead}>
          Puede que el link esté mal escrito o que la página ya no exista. Desde el inicio llegás a todo el sitio.
        </p>
        <Link to="/" className={styles.cta}>
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
