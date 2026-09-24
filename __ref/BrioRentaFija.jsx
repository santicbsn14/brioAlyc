import { useEffect, useRef, useState } from "react";

/* ============================================================
   BrioRentaFija.jsx — PROTOTIPO VISUAL (va a _ref/, descartable)
   Panel de Renta Fija: 4 pestañas (ONs, Soberana, Calendario, Cartera).
   Datos de ejemplo — el motor real de cálculo (TIR/duration/TC MEP)
   y el fetch a data912 vía proxy se portan tal cual en el brief de
   código, no se reescriben acá. Esto define diseño + interacción.
   ============================================================ */

const TABS = [
  { id: "ons", label: "Obligaciones Negociables" },
  { id: "sov", label: "Deuda Soberana" },
  { id: "cal", label: "Calendario" },
  { id: "car", label: "Cartera" },
];

// datos de ejemplo — la tabla real trae ~30-40 filas de BONDS reales
const ONS_MOCK = [
  { emisor: "YPF", ticker: "YMCXO", titulo: "ON Clase XL", ley: "Local", venc: "09/07/2029", precio: 98.4, tir: 8.9, dur: 2.4, vol: 1250000 },
  { emisor: "Pampa Energía", ticker: "MGC1O", titulo: "ON Clase 1", ley: "NY", venc: "22/07/2027", precio: 101.2, tir: 7.6, dur: 1.6, vol: 480000 },
  { emisor: "Telecom Arg.", ticker: "TLC1O", titulo: "ON Clase 21", ley: "Local", venc: "10/03/2028", precio: 95.7, tir: 9.8, dur: 2.1, vol: null },
  { emisor: "Vista Energy", ticker: "VSCTO", titulo: "ON Clase XI", ley: "NY", venc: "15/07/2035", precio: 103.9, tir: 7.1, dur: 5.8, vol: 920000 },
];

const SOV_MOCK = [
  { ticker: "GD30D", titulo: "Global 2030", venc: "09/07/2030", precio: 62.3, tir: 14.2, dur: 3.9, vol: 3100000 },
  { ticker: "AL35D", titulo: "Bonar 2035", venc: "09/01/2035", precio: 58.1, tir: 15.6, dur: 4.7, vol: 2050000 },
  { ticker: "T15E7", titulo: "BONCAP Ene-27", venc: "15/01/2027", precio: 87.5, tir: null, dur: null, vol: 640000 },
];

/* ---------- reveal local (en el real: useReveal.ts) ---------- */
function useRevealLocal() {
  const ref = useRef(null);
  const [isIn, setIsIn] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setIsIn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIsIn(true); io.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, isIn];
}

const fmt = (n, d = 2) => (n === null || n === undefined ? "—" : n.toLocaleString("es-AR", { minimumFractionDigits: d, maximumFractionDigits: d }));

function StatusDot({ status }) {
  const cls = status === "ok" ? "rf-dot rf-dot--ok" : status === "busy" ? "rf-dot rf-dot--busy" : "rf-dot";
  return <span className={cls} aria-hidden="true" />;
}

function OnsTable() {
  return (
    <div className="rf-table-wrap">
      <table className="rf-table">
        <thead>
          <tr>
            <th>Emisor</th><th>Ticker</th><th>Título</th><th>Ley</th><th>Vencimiento</th>
            <th className="num">Precio</th><th className="num">TIR %</th><th className="num">Duration</th><th className="num">Volumen</th>
          </tr>
        </thead>
        <tbody>
          {ONS_MOCK.map((b) => (
            <tr key={b.ticker}>
              <td>{b.emisor}</td>
              <td><span className="rf-ticker">{b.ticker} ↗</span></td>
              <td className="rf-muted">{b.titulo}</td>
              <td><span className={`rf-chip ${b.ley === "NY" ? "rf-chip--ny" : ""}`}>{b.ley}</span></td>
              <td className="rf-muted">{b.venc}</td>
              <td className="num">{b.vol === null ? <input className="rf-input" placeholder="manual" /> : fmt(b.precio)}</td>
              <td className="num rf-hi">{fmt(b.tir, 1)}</td>
              <td className="num">{fmt(b.dur, 1)}</td>
              <td className="num rf-muted">{b.vol ? b.vol.toLocaleString("es-AR") : "sin vol."}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SovTable() {
  return (
    <div className="rf-table-wrap">
      <table className="rf-table">
        <thead>
          <tr>
            <th>Ticker</th><th>Título</th><th>Vencimiento</th>
            <th className="num">Precio</th><th className="num">TIR %</th><th className="num">Duration</th><th className="num">Volumen</th>
          </tr>
        </thead>
        <tbody>
          {SOV_MOCK.map((b) => (
            <tr key={b.ticker}>
              <td><span className="rf-ticker">{b.ticker} ↗</span></td>
              <td className="rf-muted">{b.titulo}</td>
              <td className="rf-muted">{b.venc}</td>
              <td className="num">{fmt(b.precio)}</td>
              <td className="num rf-hi">{b.tir ? fmt(b.tir, 1) : "—"}</td>
              <td className="num">{b.dur ? fmt(b.dur, 1) : "—"}</td>
              <td className="num rf-muted">{b.vol.toLocaleString("es-AR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CalPlaceholder() {
  return (
    <div className="rf-empty">
      <p className="rf-empty-title">Calendario de pagos</p>
      <p className="rf-empty-text">Próximos vencimientos y pagos de renta/amortización de los instrumentos cargados. Se porta del motor original.</p>
    </div>
  );
}
function CarPlaceholder() {
  return (
    <div className="rf-empty">
      <p className="rf-empty-title">Tu cartera</p>
      <p className="rf-empty-text">Cargá tus posiciones para ver TIR y duration ponderados. Se guarda en este navegador (localStorage), no en una cuenta.</p>
      <button className="rf-btn rf-btn--primary">+ Agregar posición</button>
    </div>
  );
}

/* ---------- panel ---------- */
export default function BrioRentaFijaPrototype() {
  const [tab, setTab] = useState("ons");
  const [prevTab, setPrevTab] = useState("ons");
  const [dir, setDir] = useState(1);
  const [headRef, headIn] = useRevealLocal();

  const changeTab = (id) => {
    if (id === tab) return;
    const order = TABS.map((t) => t.id);
    setDir(order.indexOf(id) > order.indexOf(tab) ? 1 : -1);
    setPrevTab(tab);
    setTab(id);
  };

  return (
    <section className="rf-section" aria-labelledby="rf-title">
      <style>{css}</style>

      <div ref={headRef} className={`rf-head rf-reveal ${headIn ? "isIn" : ""}`}>
        <p className="rf-kicker">Herramientas</p>
        <h1 id="rf-title" className="rf-title">Panel de Renta Fija</h1>
        <p className="rf-lead">Precios, TIR y duration de ONs, deuda soberana, LECAPs y BONCAPs — datos referenciales, actualizados automáticamente.</p>
      </div>

      <div className="rf-toolbar">
        <nav className="rf-tabs" role="tablist" aria-label="Secciones del panel">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`rf-tab ${tab === t.id ? "isOn" : ""}`}
              onClick={() => changeTab(t.id)}
            >
              {t.label}
            </button>
          ))}
          <span
            className="rf-tab-indicator"
            style={{ "--i": TABS.findIndex((t) => t.id === tab) }}
          />
        </nav>

        <div className="rf-status">
          <StatusDot status="ok" />
          <span>Actualizado 14:32hs</span>
          <button className="rf-btn rf-btn--ghost rf-btn--sm">⟳ Actualizar</button>
        </div>
      </div>

      <div className="rf-panel-wrap">
        <div key={tab} className={`rf-panel rf-panel--enter-${dir > 0 ? "right" : "left"}`}>
          {tab === "ons" && <OnsTable />}
          {tab === "sov" && <SovTable />}
          {tab === "cal" && <CalPlaceholder />}
          {tab === "car" && <CarPlaceholder />}
        </div>
      </div>

      <p className="rf-disclaimer">
        * Datos referenciales, no en tiempo real (actualización cada 2 minutos aprox.). No constituye recomendación de inversión.
      </p>
    </section>
  );
}

/* ---------- estilos (en el real: RentaFija.module.css) ---------- */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Sora:wght@600;700&display=swap');

.rf-section{
  --navy:#05091f; --orange:#ef5915; --teal:#65f5e5; --white:#fff;
  --muted:#9aa3b2; --line:rgba(255,255,255,.12); --up:#37d39b; --down:#ff5a52;
  background:var(--navy); color:var(--white); min-height:100vh; font-family:'Poppins',system-ui,sans-serif;
  padding:clamp(90px,10vw,130px) clamp(20px,5vw,64px) clamp(60px,8vw,100px);
}
.rf-section *{box-sizing:border-box}

.rf-reveal{opacity:0; transform:translateY(16px); transition:opacity .6s ease, transform .6s ease}
.rf-reveal.isIn{opacity:1; transform:none}
@media (prefers-reduced-motion:reduce){.rf-reveal{opacity:1; transform:none; transition:none}}

.rf-head{max-width:900px; margin:0 auto clamp(28px,4vw,40px)}
.rf-kicker{margin:0 0 12px; font-size:.9rem; color:var(--teal)}
.rf-title{font-family:'Sora',sans-serif; font-weight:700; font-size:clamp(2rem,4vw,2.7rem); letter-spacing:-.02em; margin:0 0 14px}
.rf-lead{color:var(--muted); font-size:1rem; line-height:1.6; margin:0; max-width:60ch}

.rf-toolbar{
  max-width:1200px; margin:0 auto 4px; display:flex; align-items:center; justify-content:space-between;
  flex-wrap:wrap; gap:14px; border-bottom:1px solid var(--line); padding-bottom:0;
}
.rf-tabs{position:relative; display:flex; gap:4px; flex-wrap:wrap}
.rf-tab{
  font:inherit; font-size:.88rem; color:var(--muted); background:transparent; border:none;
  padding:12px 16px; cursor:pointer; position:relative; transition:color .2s ease;
}
.rf-tab:hover{color:#dfe4ee}
.rf-tab.isOn{color:var(--white); font-weight:500}
.rf-tab:focus-visible{outline:2px solid var(--teal); outline-offset:-2px; border-radius:6px}
.rf-tab-indicator{
  position:absolute; bottom:-1px; left:0; height:2px; width:160px; background:var(--teal);
  transform:translateX(calc(var(--i) * 100%));
  transition:transform .3s cubic-bezier(.4,0,.2,1);
  display:none;
}
/* el indicador se posiciona por JS-free trick: en el real, medir anchos reales con refs */

.rf-status{display:flex; align-items:center; gap:10px; font-size:.82rem; color:var(--muted); padding-bottom:12px}
.rf-dot{width:8px; height:8px; border-radius:50%; background:#5f6a7d; display:inline-block}
.rf-dot--ok{background:var(--up); box-shadow:0 0 0 3px rgba(55,211,155,.18)}
.rf-dot--busy{background:var(--teal); animation:rfPulse 1s ease-in-out infinite}
@keyframes rfPulse{0%,100%{opacity:1}50%{opacity:.4}}

.rf-btn{font:inherit; font-weight:500; border-radius:999px; cursor:pointer; transition:background .2s ease, transform .15s ease; border:1px solid transparent}
.rf-btn--ghost{background:transparent; color:var(--white); border-color:rgba(101,245,229,.5)}
.rf-btn--ghost:hover{background:rgba(101,245,229,.1)}
.rf-btn--sm{padding:6px 14px; font-size:.8rem}
.rf-btn--primary{background:var(--orange); color:#fff; padding:12px 22px; font-size:.9rem}
.rf-btn--primary:hover{background:#ff6a2b}

.rf-panel-wrap{max-width:1200px; margin:0 auto; overflow:hidden; position:relative}
.rf-panel{animation-duration:.32s; animation-timing-function:cubic-bezier(.4,0,.2,1); animation-fill-mode:both}
.rf-panel--enter-right{animation-name:rfSlideInRight}
.rf-panel--enter-left{animation-name:rfSlideInLeft}
@keyframes rfSlideInRight{from{opacity:0; transform:translateX(24px)} to{opacity:1; transform:none}}
@keyframes rfSlideInLeft{from{opacity:0; transform:translateX(-24px)} to{opacity:1; transform:none}}
@media (prefers-reduced-motion:reduce){.rf-panel{animation:none}}

.rf-table-wrap{overflow-x:auto; margin-top:20px; border:1px solid var(--line); border-radius:16px}
.rf-table{width:100%; border-collapse:collapse; font-size:.86rem; min-width:720px}
.rf-table thead th{
  text-align:left; font-weight:500; color:var(--muted); font-size:.78rem; text-transform:uppercase;
  letter-spacing:.05em; padding:14px 16px; border-bottom:1px solid var(--line); white-space:nowrap;
}
.rf-table tbody td{padding:13px 16px; border-bottom:1px solid rgba(255,255,255,.06)}
.rf-table tbody tr:last-child td{border-bottom:none}
.rf-table tbody tr:hover{background:rgba(255,255,255,.03)}
.num{text-align:right; font-variant-numeric:tabular-nums}
.rf-muted{color:var(--muted)}
.rf-hi{color:var(--teal); font-weight:600}
.rf-ticker{color:var(--teal); font-weight:500; cursor:pointer; white-space:nowrap}
.rf-ticker:hover{text-decoration:underline}
.rf-chip{font-size:.74rem; padding:2px 9px; border-radius:999px; border:1px solid var(--line); color:#dfe4ee}
.rf-chip--ny{border-color:rgba(239,89,21,.5); color:var(--orange)}
.rf-input{
  width:80px; background:rgba(255,255,255,.06); border:1px dashed rgba(101,245,229,.5); border-radius:8px;
  color:var(--white); padding:6px 8px; text-align:right; font:inherit; font-size:.84rem;
}
.rf-input::placeholder{color:#6f7a8e; font-style:italic}

.rf-empty{
  margin-top:20px; padding:56px 24px; text-align:center; border:1px dashed var(--line); border-radius:16px;
}
.rf-empty-title{font-family:'Sora',sans-serif; font-weight:600; font-size:1.15rem; margin:0 0 10px}
.rf-empty-text{color:var(--muted); max-width:44ch; margin:0 auto 20px; line-height:1.6}

.rf-disclaimer{max-width:1200px; margin:28px auto 0; font-size:.78rem; color:#5f6a7d; text-align:center}

@media (max-width:640px){
  .rf-tabs{width:100%; overflow-x:auto; flex-wrap:nowrap}
  .rf-tab{flex:none}
}
`;
