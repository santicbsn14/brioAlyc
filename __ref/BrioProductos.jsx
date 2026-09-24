import { useEffect, useRef, useState, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// Brio Valores — Productos (sección nueva, /servicios/productos)
// Mix: estructura por categorías (ref. TSA) + carrusel con banda de transición
// animada (ref. Inviu). SIN mercado internacional (Brio no opera).
// Sistema visual de Brio (navy, teal, naranja, Poppins/Sora).
//
// TODO (placeholder / a confirmar con Agus):
//   - Renta variable hoy solo "Acciones" (pendiente si Brio opera CEDEARs/opciones).
//   - Futuros y opciones: confirmar que va como categoría.
//   - Ilustraciones = abstractas hechas en código (después se pueden reemplazar).
//   - Copy de las líneas explicativas: provisorio.
// ─────────────────────────────────────────────────────────────

const CATEGORIAS = [
  {
    id: "renta-fija",
    nombre: "Renta fija",
    claim: "Previsibilidad y flujo de fondos conocido.",
    items: [
      { t: "Títulos públicos y soberanos", d: "Bonos del Estado nacional y provincias, en pesos o dólares." },
      { t: "Obligaciones Negociables", d: "Deuda de empresas que paga interés en forma periódica." },
      { t: "LECAPs / Letras", d: "Instrumentos de corto plazo del Tesoro." },
      { t: "Cauciones colocadoras", d: "Colocás fondos a plazo corto con garantía del mercado." },
    ],
  },
  {
    id: "renta-variable",
    nombre: "Renta variable",
    claim: "Sé parte de las principales empresas del país.",
    items: [
      { t: "Acciones (BYMA)", d: "Comprá participación en las empresas líderes argentinas." },
    ],
  },
  {
    id: "financiamiento",
    nombre: "Financiamiento",
    claim: "El mercado de capitales al servicio de tu empresa.",
    items: [
      { t: "Cheques de Pago Diferido", d: "Descontá cheques propios o de terceros con el aval de una SGR." },
      { t: "Fideicomisos Financieros", d: "Estructurá y colocá activos para fondear tu proyecto." },
      { t: "Pagarés Bursátiles", d: "Financiamiento de corto plazo para tu PyME." },
    ],
  },
  {
    id: "futuros",
    nombre: "Futuros y opciones",
    claim: "Cobertura frente a la volatilidad de precios.",
    items: [
      { t: "Futuros de dólar", d: "Cubrí tu posición ante la variación del tipo de cambio." },
      { t: "Financieros", d: "Futuros sobre índices, tasas y activos financieros." },
      { t: "Agropecuarios", d: "Cobertura para granos y producción del campo." },
      { t: "Commodities", d: "Contratos sobre materias primas." },
    ],
  },
];

// ── Ilustraciones abstractas (una por categoría), SVG en código ──
function Ilustracion({ id }) {
  const common = { viewBox: "0 0 240 240", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": true };
  if (id === "renta-fija")
    return (
      <svg {...common} className="pr-illus-svg">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#65f5e5" stopOpacity=".9" />
            <stop offset="1" stopColor="#65f5e5" stopOpacity=".2" />
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r="96" fill="none" stroke="#65f5e5" strokeOpacity=".18" strokeWidth="1.5" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={54 + i * 28} y={150 - i * 22} width="16" height={30 + i * 22} rx="4" fill="url(#g1)" />
        ))}
        <line x1="46" y1="176" x2="196" y2="176" stroke="#65f5e5" strokeOpacity=".35" strokeWidth="1.5" />
      </svg>
    );
  if (id === "renta-variable")
    return (
      <svg {...common} className="pr-illus-svg">
        <circle cx="120" cy="120" r="96" fill="none" stroke="#ef5915" strokeOpacity=".16" strokeWidth="1.5" />
        <polyline points="48,168 88,120 120,140 156,80 196,64" fill="none" stroke="#65f5e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="156,80 196,64 196,96" fill="none" stroke="#ef5915" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {[[88, 120], [120, 140], [156, 80]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4.5" fill="#05091f" stroke="#65f5e5" strokeWidth="2" />
        ))}
      </svg>
    );
  if (id === "financiamiento")
    return (
      <svg {...common} className="pr-illus-svg">
        <circle cx="120" cy="120" r="96" fill="none" stroke="#65f5e5" strokeOpacity=".16" strokeWidth="1.5" />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${64 + i * 18} ${150 - i * 26})`}>
            <rect width="86" height="52" rx="8" fill="none" stroke="#65f5e5" strokeOpacity={0.5 + i * 0.15} strokeWidth="2" />
            <line x1="14" y1="20" x2="56" y2="20" stroke="#65f5e5" strokeOpacity=".5" strokeWidth="2" />
            <circle cx="66" cy="32" r="8" fill="#ef5915" fillOpacity={0.4 + i * 0.25} />
          </g>
        ))}
      </svg>
    );
  return (
    <svg {...common} className="pr-illus-svg">
      <circle cx="120" cy="120" r="96" fill="none" stroke="#ef5915" strokeOpacity=".16" strokeWidth="1.5" />
      {[40, 70, 100].map((r, i) => (
        <circle key={i} cx="120" cy="120" r={r} fill="none" stroke="#65f5e5" strokeOpacity={0.5 - i * 0.12} strokeWidth="1.5" strokeDasharray="6 8" />
      ))}
      <path d="M120 120 L120 44" stroke="#ef5915" strokeWidth="3" strokeLinecap="round" />
      <path d="M120 120 L182 156" stroke="#65f5e5" strokeWidth="3" strokeLinecap="round" />
      <circle cx="120" cy="120" r="6" fill="#65f5e5" />
    </svg>
  );
}

export default function BrioProductos() {
  const [idx, setIdx] = useState(0);
  const [entered, setEntered] = useState(false);
  const total = CATEGORIAS.length;
  const timer = useRef(null);
  const wrapRef = useRef(null);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const go = useCallback((n) => setIdx((prev) => (n + total) % total), [total]);

  // Aparición de la sección al scrollear (una vez).
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (reduce) { setEntered(true); return; }
    const io = new IntersectionObserver(
      (e) => e.forEach((x) => { if (x.isIntersecting) { setEntered(true); io.disconnect(); } }),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  // Auto-avance suave (pausa en hover / reduce-motion).
  useEffect(() => {
    if (reduce) return;
    timer.current = setInterval(() => setIdx((p) => (p + 1) % total), 5200);
    return () => clearInterval(timer.current);
  }, [total, reduce]);

  const pause = () => timer.current && clearInterval(timer.current);
  const resume = () => {
    if (reduce) return;
    pause();
    timer.current = setInterval(() => setIdx((p) => (p + 1) % total), 5200);
  };

  const actual = CATEGORIAS[idx];

  return (
    <section className={`pr ${entered ? "is-in" : ""}`} ref={wrapRef}>
      <style>{css}</style>

      <div className="pr-inner">
        <header className="pr-head">
          <p className="pr-kicker"><span className="pr-kicker-line" aria-hidden="true" />Productos</p>
          <h2 className="pr-title">Elegí en qué invertir</h2>
          <p className="pr-lead">
            Una cartera de instrumentos para diseñar la estrategia que se adapte a tu perfil,
            tanto para invertir como para financiar tu empresa.
          </p>
        </header>

        {/* pestañas de categoría */}
        <nav className="pr-tabs" aria-label="Categorías de productos">
          {CATEGORIAS.map((c, i) => (
            <button
              key={c.id}
              className={`pr-tab ${i === idx ? "is-active" : ""}`}
              onClick={() => { go(i); resume(); }}
              aria-current={i === idx}
            >
              {c.nombre}
            </button>
          ))}
        </nav>

        {/* carrusel */}
        <div className="pr-stage" onMouseEnter={pause} onMouseLeave={resume}>
          {/* barra de progreso / banda de transición */}
          <div className="pr-band" aria-hidden="true">
            <span key={idx} className="pr-band-fill" style={{ animationDuration: reduce ? "0s" : "5.2s" }} />
          </div>

          <div className="pr-slide" key={actual.id}>
            <div className="pr-slide-illus">
              <Ilustracion id={actual.id} />
            </div>

            <div className="pr-slide-body">
              <p className="pr-slide-claim">{actual.claim}</p>
              <ul className="pr-list">
                {actual.items.map((it, i) => (
                  <li key={it.t} className="pr-item" style={{ "--i": i }}>
                    <span className="pr-item-dot" aria-hidden="true" />
                    <div>
                      <span className="pr-item-t">{it.t}</span>
                      <span className="pr-item-d">{it.d}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* controles */}
          <button className="pr-arrow pr-arrow--prev" onClick={() => { go(idx - 1); resume(); }} aria-label="Anterior">‹</button>
          <button className="pr-arrow pr-arrow--next" onClick={() => { go(idx + 1); resume(); }} aria-label="Siguiente">›</button>
        </div>

        {/* dots */}
        <div className="pr-dots" role="tablist">
          {CATEGORIAS.map((c, i) => (
            <button key={c.id} className={`pr-dot ${i === idx ? "is-active" : ""}`} onClick={() => { go(i); resume(); }} aria-label={c.nombre} />
          ))}
        </div>
      </div>
    </section>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap');

.pr{
  --navy:#05091f; --navy-2:#0a1030; --orange:#ef5915; --teal:#65f5e5;
  --white:#ffffff; --gray-text:#9aa3b2;
  background:
    radial-gradient(900px 500px at 85% 0%, rgba(101,245,229,.06), transparent 60%),
    var(--navy);
  color:var(--white);
  font-family:'Poppins',system-ui,sans-serif;
  padding:clamp(56px,9vw,110px) clamp(20px,6vw,88px);
}
.pr *{box-sizing:border-box;}
.pr-inner{max-width:1120px;margin:0 auto;}

/* head */
.pr-head{max-width:40rem;margin-bottom:clamp(28px,4vw,44px);}
.pr-kicker{display:inline-flex;align-items:center;gap:10px;margin:0 0 14px;font-size:.82rem;font-weight:500;color:var(--teal);letter-spacing:.3px;}
.pr-kicker-line{width:26px;height:2px;background:var(--teal);border-radius:2px;}
.pr-title{font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(1.8rem,3.4vw,2.6rem);line-height:1.1;letter-spacing:-.6px;margin:0 0 16px;}
.pr-lead{font-size:clamp(1rem,1.2vw,1.08rem);line-height:1.6;color:var(--gray-text);margin:0;}

/* tabs */
.pr-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:22px;}
.pr-tab{
  font-family:'Poppins',sans-serif;font-size:.92rem;font-weight:500;
  color:var(--gray-text);background:transparent;
  border:1px solid rgba(255,255,255,.1);border-radius:999px;
  padding:9px 18px;cursor:pointer;transition:all .2s ease;white-space:nowrap;
}
.pr-tab:hover{color:var(--white);border-color:rgba(101,245,229,.4);}
.pr-tab.is-active{color:var(--navy);background:var(--teal);border-color:var(--teal);font-weight:600;}

/* stage */
.pr-stage{
  position:relative;
  background:linear-gradient(160deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
  border:1px solid rgba(255,255,255,.1);
  border-radius:22px;
  overflow:hidden;
  min-height:340px;
}

/* banda de transición (progreso del auto-avance) */
.pr-band{position:absolute;top:0;left:0;right:0;height:3px;background:rgba(255,255,255,.06);z-index:3;}
.pr-band-fill{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--teal),var(--orange));animation:prFill linear forwards;}
@keyframes prFill{from{width:0}to{width:100%}}

/* slide */
.pr-slide{
  display:grid;grid-template-columns:.85fr 1.15fr;gap:clamp(20px,4vw,48px);
  align-items:center;padding:clamp(28px,4vw,48px);
  animation:prSlideIn .55s cubic-bezier(.22,.61,.36,1) both;
}
@keyframes prSlideIn{
  from{opacity:0;transform:translateX(26px);}
  to{opacity:1;transform:translateX(0);}
}

.pr-slide-illus{display:flex;align-items:center;justify-content:center;}
.pr-illus-svg{width:min(240px,78%);height:auto;animation:prFloat 6s ease-in-out infinite;}
@keyframes prFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}

.pr-slide-body{min-width:0;}
.pr-slide-claim{
  font-family:'Sora',sans-serif;font-weight:600;font-size:clamp(1.05rem,1.6vw,1.3rem);
  color:var(--white);margin:0 0 20px;line-height:1.3;
}
.pr-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px;}
.pr-item{
  display:flex;gap:14px;align-items:flex-start;padding:13px 0;
  border-bottom:1px solid rgba(255,255,255,.07);
  animation:prItemIn .5s ease both;animation-delay:calc(.15s + var(--i) * .08s);
}
.pr-item:last-child{border-bottom:none;}
@keyframes prItemIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
.pr-item-dot{flex:none;width:8px;height:8px;margin-top:7px;border-radius:50%;background:var(--teal);box-shadow:0 0 10px rgba(101,245,229,.5);}
.pr-item-t{display:block;font-family:'Sora',sans-serif;font-weight:600;font-size:1rem;color:var(--white);}
.pr-item-d{display:block;font-size:.88rem;line-height:1.5;color:var(--gray-text);margin-top:2px;}

/* flechas */
.pr-arrow{
  position:absolute;top:50%;transform:translateY(-50%);z-index:4;
  width:40px;height:40px;border-radius:50%;cursor:pointer;
  background:rgba(5,9,31,.6);border:1px solid rgba(255,255,255,.15);
  color:var(--white);font-size:1.4rem;line-height:1;
  display:flex;align-items:center;justify-content:center;
  transition:all .2s ease;backdrop-filter:blur(4px);
}
.pr-arrow:hover{background:var(--teal);color:var(--navy);border-color:var(--teal);}
.pr-arrow--prev{left:14px;}
.pr-arrow--next{right:14px;}

/* dots */
.pr-dots{display:flex;justify-content:center;gap:9px;margin-top:22px;}
.pr-dot{width:9px;height:9px;border-radius:50%;cursor:pointer;border:none;background:rgba(255,255,255,.2);transition:all .25s ease;padding:0;}
.pr-dot.is-active{background:var(--teal);width:26px;border-radius:5px;}

/* entrada de la sección */
.pr-head,.pr-tabs,.pr-stage,.pr-dots{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease;}
.pr.is-in .pr-head{opacity:1;transform:none;transition-delay:0ms;}
.pr.is-in .pr-tabs{opacity:1;transform:none;transition-delay:90ms;}
.pr.is-in .pr-stage{opacity:1;transform:none;transition-delay:170ms;}
.pr.is-in .pr-dots{opacity:1;transform:none;transition-delay:250ms;}

/* responsive */
@media (max-width:820px){
  .pr-slide{grid-template-columns:1fr;gap:20px;text-align:left;}
  .pr-slide-illus{order:-1;}
  .pr-illus-svg{width:150px;}
  .pr-arrow{display:none;}
}
@media (max-width:520px){
  .pr-tabs{gap:6px;}
  .pr-tab{font-size:.84rem;padding:8px 13px;}
}

@media (prefers-reduced-motion:reduce){
  .pr-slide,.pr-item,.pr-illus-svg,.pr-band-fill{animation:none;}
  .pr-head,.pr-tabs,.pr-stage,.pr-dots{opacity:1;transform:none;transition:none;}
  .pr-item{opacity:1;transform:none;}
}
`;
