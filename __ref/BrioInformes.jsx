import { useMemo, useState } from "react";

/* ============================================================
   BrioInformes.jsx — PROTOTIPO (va a _ref/, descartable)
   Página /informes: listado de PDFs subidos desde Sanity,
   con filtro por categoría y descarga directa.
   Contenido en `informesPage` (arriba), pasa a data/informes.ts.
   ============================================================ */

const informesPage = {
  kicker: "Herramientas",
  title: "Informes",
  lead:
    "Análisis y reportes elaborados por nuestro equipo, para que sigas de cerca el contexto macro y de mercado.",
  filterAllLabel: "Todos",
  emptyLabel: "Todavía no hay informes en esta categoría.",
  downloadLabel: "Descargar PDF",
  fileSizeUnknown: null, // Sanity puede traer el tamaño del archivo; si no, se omite

  categorias: [
    { id: "semanal", label: "Informes semanales" },
    { id: "mensual", label: "Informes mensuales" }, // TODO(Agus): categoría de ejemplo, confirmar si aplica
    { id: "especial", label: "Informes especiales" }, // TODO(Agus): ídem
  ],

  informes: [
    {
      id: "1",
      titulo: "Informe semanal — Semana del 6 al 12 de julio",
      fecha: "2026-07-13",
      categoria: "semanal",
      resumen:
        "El Gobierno presentó el programa financiero en dólares para 2026-2027 y el riesgo país perforó mínimos de la gestión.",
      archivoUrl: "#", // en el sitio real: URL del PDF servido desde Sanity
    },
    // --- de acá para abajo, EJEMPLOS inventados solo para probar el filtro y el orden ---
    {
      id: "2",
      titulo: "Informe mensual — Junio 2026",
      fecha: "2026-07-02",
      categoria: "mensual",
      resumen:
        "Repaso del mes: inflación, actividad industrial y evolución de tasas en pesos. Contenido de ejemplo.",
      archivoUrl: "#",
    },
    {
      id: "3",
      titulo: "Informe semanal — Semana del 22 al 28 de junio",
      fecha: "2026-06-29",
      categoria: "semanal",
      resumen:
        "Cierre de semana con foco en licitación del Tesoro y comportamiento de la curva CER. Contenido de ejemplo.",
      archivoUrl: "#",
    },
    {
      id: "4",
      titulo: "Especial — Elecciones y mercado",
      fecha: "2026-06-10",
      categoria: "especial",
      resumen:
        "Qué mirar de cara al calendario electoral y cómo posicionarse en renta fija y variable. Contenido de ejemplo.",
      archivoUrl: "#",
    },
  ],
};

/* ---------- helpers ---------- */
const fmtFecha = (iso) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });
};

const IconDoc = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7 3.5Z" />
    <path d="M13.5 3.5V8h4" />
    <path d="M9 13h6M9 16.5h6" />
  </svg>
);

const IconDownload = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 4v11m0 0 4-4m-4 4-4-4" />
    <path d="M5 18.5h14" />
  </svg>
);

/* ---------- reveal local (en el código real: useReveal.ts) ---------- */
function useRevealLocal() {
  const [ref, setRef] = useState(null);
  const [isIn, setIsIn] = useState(false);
  useState(() => {
    if (!ref) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setIsIn(true); return; }
  });
  return [setRef, isIn || true]; // el prototipo simplifica: visible de entrada (el real usa IntersectionObserver)
}

/* ---------- página ---------- */
export default function BrioInformesPrototype() {
  const [activa, setActiva] = useState("todos");

  const filtrados = useMemo(() => {
    const base = activa === "todos" ? informesPage.informes : informesPage.informes.filter((i) => i.categoria === activa);
    return [...base].sort((a, b) => (a.fecha < b.fecha ? 1 : -1)); // más nuevo arriba
  }, [activa]);

  const categoriaLabel = (id) => informesPage.categorias.find((c) => c.id === id)?.label ?? id;

  return (
    <div className="inf-page">
      <style>{css}</style>

      <header className="inf-head">
        <p className="inf-kicker">{informesPage.kicker}</p>
        <h1 className="inf-title">{informesPage.title}</h1>
        <p className="inf-lead">{informesPage.lead}</p>
      </header>

      <div className="inf-filters" role="tablist" aria-label="Filtrar por categoría">
        <button
          role="tab"
          aria-selected={activa === "todos"}
          className={`inf-chip ${activa === "todos" ? "isOn" : ""}`}
          onClick={() => setActiva("todos")}
        >
          {informesPage.filterAllLabel}
        </button>
        {informesPage.categorias.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={activa === c.id}
            className={`inf-chip ${activa === c.id ? "isOn" : ""}`}
            onClick={() => setActiva(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <ul className="inf-list">
        {filtrados.length === 0 && <p className="inf-empty">{informesPage.emptyLabel}</p>}

        {filtrados.map((inf) => (
          <li key={inf.id} className="inf-item">
            <span className="inf-ico" aria-hidden="true"><IconDoc /></span>

            <div className="inf-body">
              <div className="inf-meta">
                <time dateTime={inf.fecha}>{fmtFecha(inf.fecha)}</time>
                <span className="inf-badge">{categoriaLabel(inf.categoria)}</span>
              </div>
              <h2 className="inf-item-title">{inf.titulo}</h2>
              {inf.resumen && <p className="inf-resumen">{inf.resumen}</p>}
            </div>

            <a className="inf-dl" href={inf.archivoUrl} download>
              <IconDownload />
              <span>{informesPage.downloadLabel}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- estilos (en el código real: pages/Informes.module.css) ---------- */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Sora:wght@600;700&display=swap');

.inf-page{
  --navy:#05091f; --orange:#ef5915; --teal:#65f5e5; --white:#fff;
  --muted:#9aa3b2; --line:rgba(255,255,255,.12);
  background:var(--navy); color:var(--white); min-height:100vh; font-family:'Poppins',system-ui,sans-serif;
  padding:clamp(90px,10vw,130px) clamp(20px,5vw,64px) clamp(60px,8vw,100px);
}
.inf-page *{box-sizing:border-box}

.inf-head{max-width:680px; margin:0 auto clamp(36px,5vw,56px)}
.inf-kicker{margin:0 0 14px; font-size:.9rem; color:var(--teal)}
.inf-title{font-family:'Sora',sans-serif; font-weight:700; font-size:clamp(2.1rem,4.4vw,3rem); letter-spacing:-.02em; margin:0 0 16px}
.inf-lead{color:var(--muted); font-size:1.05rem; line-height:1.65; margin:0; max-width:52ch}

.inf-filters{max-width:900px; margin:0 auto clamp(28px,4vw,40px); display:flex; flex-wrap:wrap; gap:10px}
.inf-chip{
  font:inherit; font-size:.9rem; cursor:pointer; padding:9px 16px; border-radius:999px;
  background:transparent; color:#dfe4ee; border:1px solid var(--line); transition:background .2s ease, border-color .2s ease, color .2s ease;
}
.inf-chip:hover{border-color:rgba(101,245,229,.6)}
.inf-chip.isOn{background:rgba(101,245,229,.14); border-color:var(--teal); color:#fff}
.inf-chip:focus-visible{outline:2px solid var(--teal); outline-offset:2px}

.inf-list{max-width:900px; margin:0 auto; list-style:none; padding:0; border-top:1px solid var(--line)}
.inf-empty{padding:32px 0; color:var(--muted)}

.inf-item{
  display:grid; grid-template-columns:auto 1fr auto; gap:18px; align-items:center;
  padding:24px 0; border-bottom:1px solid var(--line);
}
.inf-ico{
  width:44px; height:44px; border-radius:50%; display:grid; place-items:center; flex:none;
  color:var(--teal); border:1px solid rgba(101,245,229,.45); background:rgba(101,245,229,.08);
}
.inf-body{min-width:0}
.inf-meta{display:flex; align-items:center; gap:10px; flex-wrap:wrap; font-size:.84rem; color:var(--muted); margin-bottom:6px}
.inf-badge{padding:2px 10px; border-radius:999px; border:1px solid var(--line); font-size:.78rem}
.inf-item-title{font-family:'Sora',sans-serif; font-weight:600; font-size:1.1rem; margin:0 0 6px; line-height:1.35}
.inf-resumen{margin:0; color:var(--muted); font-size:.92rem; line-height:1.55; max-width:58ch}

.inf-dl{
  display:inline-flex; align-items:center; gap:8px; white-space:nowrap;
  padding:11px 18px; border-radius:999px; border:1px solid rgba(101,245,229,.6); color:var(--white);
  text-decoration:none; font-size:.9rem; font-weight:500; transition:background .2s ease, transform .15s ease;
}
.inf-dl:hover{background:rgba(101,245,229,.1)}
.inf-dl:active{transform:scale(.97)}
.inf-dl:focus-visible{outline:2px solid var(--teal); outline-offset:3px}

@media (max-width:640px){
  .inf-item{grid-template-columns:1fr; gap:12px}
  .inf-ico{display:none}
  .inf-dl{width:100%; justify-content:center}
}
`;
