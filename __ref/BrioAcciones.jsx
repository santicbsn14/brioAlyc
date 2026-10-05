import { useMemo, useState } from "react";

/* ============================================================
   BrioAcciones.jsx — PROTOTIPO VISUAL (va a _ref/, descartable)
   Página /herramientas/acciones: panel de cotizaciones BYMA líderes.
   Reusa la misma lista (ACCIONES_LIDERES) y el proxy (arg-stocks)
   ya construidos para el Hero — esto es la versión "tabla completa".
   Datos de ejemplo acá; en el código real se conecta al hook real.
   ============================================================ */

const MOCK = [
  { ticker: "GGAL", nombre: "Grupo Financiero Galicia", bid: 7180, ask: 7195, c: 7190, pct: 1.8, vol: 2_450_000 },
  { ticker: "YPFD", nombre: "YPF", bid: 38200, ask: 38350, c: 38300, pct: -0.6, vol: 1_120_000 },
  { ticker: "PAMP", nombre: "Pampa Energía", bid: 4310, ask: 4325, c: 4320, pct: 2.4, vol: 980_000 },
  { ticker: "ALUA", nombre: "Aluar", bid: 1052, ask: 1058, c: 1055, pct: 0.3, vol: 1_540_000 },
  { ticker: "BMA", nombre: "Banco Macro", bid: 9850, ask: 9870, c: 9860, pct: -1.2, vol: 760_000 },
  { ticker: "CEPU", nombre: "Central Puerto", bid: 2290, ask: 2305, c: 2298, pct: 0.9, vol: 640_000 },
  { ticker: "TGSU2", nombre: "Transportadora de Gas del Sur", bid: 6120, ask: 6145, c: 6130, pct: 0, vol: 410_000 },
  { ticker: "BBAR", nombre: "BBVA Argentina", bid: 5340, ask: 5360, c: 5350, pct: -0.4, vol: 520_000 },
];

const fmtPx = (n) => n.toLocaleString("es-AR");
const fmtVol = (v) => {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace(".", ",") + "M";
  if (v >= 1_000) return Math.round(v / 1_000) + "K";
  return v.toLocaleString("es-AR");
};

function StatusDot({ status }) {
  const cls = status === "ok" ? "ac-dot ac-dot--ok" : "ac-dot ac-dot--busy";
  return <span className={cls} aria-hidden="true" />;
}

export default function BrioAccionesPrototype() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("ticker");
  const [sortDir, setSortDir] = useState(1);

  const rows = useMemo(() => {
    let r = MOCK.filter(
      (s) => s.ticker.toLowerCase().includes(query.toLowerCase()) || s.nombre.toLowerCase().includes(query.toLowerCase())
    );
    r.sort((a, b) => {
      const va = a[sortBy];
      const vb = b[sortBy];
      if (typeof va === "string") return va.localeCompare(vb) * sortDir;
      return (va - vb) * sortDir;
    });
    return r;
  }, [query, sortBy, sortDir]);

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir((d) => -d);
    else {
      setSortBy(col);
      setSortDir(1);
    }
  };

  const Th = ({ col, children, num }) => (
    <th className={num ? "num" : ""} onClick={() => toggleSort(col)} aria-sort={sortBy === col ? (sortDir === 1 ? "ascending" : "descending") : "none"}>
      <button className="ac-th-btn">
        {children}
        {sortBy === col && <span className="ac-sort-arrow">{sortDir === 1 ? "↑" : "↓"}</span>}
      </button>
    </th>
  );

  return (
    <section className="ac-section">
      <style>{css}</style>

      <div className="ac-head">
        <p className="ac-kicker">Herramientas</p>
        <h1 className="ac-title">Panel de Cotizaciones</h1>
        <p className="ac-lead">Precios en vivo de las principales acciones líderes de BYMA — actualización automática cada 2 minutos aproximadamente.</p>
      </div>

      <div className="ac-toolbar">
        <input
          className="ac-search"
          type="search"
          placeholder="Buscar por ticker o nombre…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar acción"
        />

        <div className="ac-status">
          <StatusDot status="ok" />
          <span>Actualizado 14:32hs</span>
          <button className="ac-btn ac-btn--ghost ac-btn--sm">⟳ Actualizar</button>
          <button className="ac-btn ac-btn--ghost ac-btn--sm">⇩ Exportar CSV</button>
        </div>
      </div>

      <div className="ac-table-wrap">
        <table className="ac-table">
          <thead>
            <tr>
              <Th col="ticker">Ticker</Th>
              <Th col="nombre">Nombre</Th>
              <Th col="bid" num>Compra</Th>
              <Th col="ask" num>Venta</Th>
              <Th col="c" num>Último</Th>
              <Th col="pct" num>Var. %</Th>
              <Th col="vol" num>Volumen</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.ticker}>
                <td><span className="ac-ticker">{s.ticker}</span></td>
                <td className="ac-muted">{s.nombre}</td>
                <td className="num">{fmtPx(s.bid)}</td>
                <td className="num">{fmtPx(s.ask)}</td>
                <td className="num ac-last">{fmtPx(s.c)}</td>
                <td className={`num ac-pct ${s.pct > 0 ? "ac-up" : s.pct < 0 ? "ac-down" : "ac-flat"}`}>
                  {s.pct > 0 ? "▲" : s.pct < 0 ? "▼" : "–"} {Math.abs(s.pct).toLocaleString("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                </td>
                <td className="num ac-muted">{fmtVol(s.vol)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="ac-empty">No encontramos ninguna acción que coincida con tu búsqueda.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="ac-disclaimer">
        * Datos referenciales, no en tiempo real. No constituye recomendación de inversión. Fuente: data912.
      </p>
    </section>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Sora:wght@600;700&display=swap');

.ac-section{
  --navy:#05091f; --orange:#ef5915; --teal:#65f5e5; --white:#fff;
  --muted:#9aa3b2; --line:rgba(255,255,255,.12); --up:#37d39b; --down:#ff5a52;
  background:var(--navy); color:var(--white); min-height:100vh; font-family:'Poppins',system-ui,sans-serif;
  padding:clamp(90px,10vw,130px) clamp(20px,5vw,64px) clamp(60px,8vw,100px);
}
.ac-section *{box-sizing:border-box}

.ac-head{max-width:900px; margin:0 auto clamp(28px,4vw,40px)}
.ac-kicker{margin:0 0 12px; font-size:.9rem; color:var(--teal)}
.ac-title{font-family:'Sora',sans-serif; font-weight:700; font-size:clamp(2rem,4vw,2.7rem); letter-spacing:-.02em; margin:0 0 14px}
.ac-lead{color:var(--muted); font-size:1rem; line-height:1.6; margin:0; max-width:60ch}

.ac-toolbar{
  max-width:1100px; margin:0 auto 20px; display:flex; align-items:center; justify-content:space-between;
  flex-wrap:wrap; gap:14px;
}
.ac-search{
  flex:1 1 260px; max-width:320px; background:rgba(255,255,255,.05); border:1px solid var(--line); border-radius:999px;
  padding:10px 18px; color:var(--white); font:inherit; font-size:.9rem;
}
.ac-search::placeholder{color:#6f7a8e}
.ac-search:focus{outline:none; border-color:var(--teal); box-shadow:0 0 0 3px rgba(101,245,229,.18)}

.ac-status{display:flex; align-items:center; gap:10px; font-size:.82rem; color:var(--muted); flex-wrap:wrap}
.ac-dot{width:8px; height:8px; border-radius:50%; background:var(--up); display:inline-block; box-shadow:0 0 0 3px rgba(55,211,155,.18)}
.ac-dot--busy{background:var(--teal); animation:acPulse 1s ease-in-out infinite}
@keyframes acPulse{0%,100%{opacity:1}50%{opacity:.4}}

.ac-btn{font:inherit; font-weight:500; border-radius:999px; cursor:pointer; border:1px solid rgba(101,245,229,.5); background:transparent; color:var(--white); transition:background .2s ease}
.ac-btn:hover{background:rgba(101,245,229,.1)}
.ac-btn--sm{padding:6px 14px; font-size:.8rem}

.ac-table-wrap{max-width:1100px; margin:0 auto; overflow-x:auto; border:1px solid var(--line); border-radius:16px}
.ac-table{width:100%; border-collapse:collapse; font-size:.88rem; min-width:680px}
.ac-table thead th{
  text-align:left; font-weight:500; color:var(--muted); font-size:.78rem; text-transform:uppercase;
  letter-spacing:.05em; padding:0; border-bottom:1px solid var(--line); white-space:nowrap;
}
.ac-th-btn{
  all:unset; display:flex; align-items:center; gap:4px; cursor:pointer; padding:14px 16px; width:100%; box-sizing:border-box;
}
.ac-table thead th.num .ac-th-btn{justify-content:flex-end}
.ac-sort-arrow{color:var(--teal); font-size:.75rem}
.ac-table tbody td{padding:13px 16px; border-bottom:1px solid rgba(255,255,255,.06)}
.ac-table tbody tr:last-child td{border-bottom:none}
.ac-table tbody tr:hover{background:rgba(255,255,255,.03)}
.num{text-align:right; font-variant-numeric:tabular-nums}
.ac-muted{color:var(--muted)}
.ac-ticker{font-weight:600; letter-spacing:.02em}
.ac-last{font-weight:600}
.ac-pct{font-weight:600; white-space:nowrap}
.ac-up{color:var(--up)}
.ac-down{color:var(--down)}
.ac-flat{color:var(--muted)}
.ac-empty{text-align:center; padding:40px 16px; color:var(--muted)}

.ac-disclaimer{max-width:1100px; margin:24px auto 0; font-size:.78rem; color:#5f6a7d; text-align:center}

@media (max-width:640px){
  .ac-toolbar{flex-direction:column; align-items:stretch}
  .ac-search{max-width:none}
}
`;
