import { useMemo, useState } from 'react';
import { categorias, informes, informesPage } from '../data/informes';
import { useReveal } from '../hooks/useReveal';
import styles from './Informes.module.css';

/** Formatea una fecha ISO (yyyy-mm-dd) en español, ej. "13 de julio de 2026". */
function formatFecha(iso: string) {
  const fecha = new Date(`${iso}T00:00:00`);
  return fecha.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function IconDoc() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7 3.5Z" />
      <path d="M13.5 3.5V8h4" />
      <path d="M9 13h6M9 16.5h6" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4v11m0 0 4-4m-4 4-4-4" />
      <path d="M5 18.5h14" />
    </svg>
  );
}

/** Página /informes (menú Herramientas, brief 3.4): listado de PDFs con filtro por
 * categoría y descarga directa. Portada tal cual del prototipo aprobado
 * `__ref/BrioInformes.jsx` (diseño ya validado, no se rediseñó nada). Toda la copy y
 * el contenido viven en `data/informes.ts`. */
export default function Informes() {
  const [activa, setActiva] = useState('todos');
  const ref = useReveal<HTMLElement>(styles.reveal, styles.isIn);

  const filtrados = useMemo(() => {
    const base = activa === 'todos' ? informes : informes.filter((i) => i.categoria === activa);
    return [...base].sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  }, [activa]);

  const categoriaLabel = (id: string) => categorias.find((c) => c.id === id)?.label ?? id;

  return (
    <section className={styles.informes} ref={ref}>
      <div className={styles.inner}>
        <header className={`${styles.head} ${styles.reveal}`}>
          <p className={styles.kicker}>
            <span className={styles.kickerLine} aria-hidden="true" />
            {informesPage.kicker}
          </p>
          <h1 className={styles.title}>{informesPage.title}</h1>
          <p className={styles.lead}>{informesPage.lead}</p>
        </header>

        <div className={`${styles.filters} ${styles.reveal}`} role="tablist" aria-label="Filtrar por categoría">
          <button
            type="button"
            role="tab"
            aria-selected={activa === 'todos'}
            className={`${styles.chip} ${activa === 'todos' ? styles.isOn : ''}`}
            onClick={() => setActiva('todos')}
          >
            {informesPage.filterAllLabel}
          </button>
          {categorias.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={activa === c.id}
              className={`${styles.chip} ${activa === c.id ? styles.isOn : ''}`}
              onClick={() => setActiva(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <ul className={`${styles.list} ${styles.reveal}`}>
          {filtrados.length === 0 && <p className={styles.empty}>{informesPage.emptyLabel}</p>}

          {filtrados.map((inf) => (
            <li key={inf.id} className={styles.item}>
              <span className={styles.ico} aria-hidden="true">
                <IconDoc />
              </span>

              <div className={styles.body}>
                <div className={styles.meta}>
                  <time dateTime={inf.fecha}>{formatFecha(inf.fecha)}</time>
                  <span className={styles.badge}>{categoriaLabel(inf.categoria)}</span>
                </div>
                <h2 className={styles.itemTitle}>{inf.titulo}</h2>
                {inf.resumen && <p className={styles.resumen}>{inf.resumen}</p>}
              </div>

              <a className={styles.dl} href={inf.archivoUrl} download>
                <IconDownload />
                <span>{informesPage.downloadLabel}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
