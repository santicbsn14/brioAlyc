import { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────
// Brio Valores — Quiénes somos (sección 6.2)
// Bloque 1: relato (texto + foto de oficina) · Bloque 2: números/contadores animados
// Bloque 3: 4 tarjetas de valores (ESPECIALISTAS, EXPERIENCIA, ASESORAMIENTO, HONESTIDAD).
// Mismo sistema visual que Hero/Servicios. Aparición al scrollear + reduced-motion.
//
// TODO (placeholder): relato = base del sitio actual. Foto de oficina la manda Agus.
//   Los NÚMEROS son inventados y la idea del bloque de contadores hay que VALIDARLA con Agus
//   (si no le gusta, se replantea — así está en el md). Contenido de valores desde CMS.
// ─────────────────────────────────────────────────────────────

// TODO: valores reales los define Brio (desde Sanity).
const STATS = [
  { target: 15, prefix: "+", suffix: "", label: "Años en el mercado" },
  { target: 2000, prefix: "+", suffix: "", label: "Clientes activos" },
  { target: 850, prefix: "$", suffix: " MM", label: "Volumen operado / mes" },
  { badge: "Mat. 512", label: "Registrado en CNV" }, // no es contador
];

const VALUES = [
  { icon: "target", title: "ESPECIALISTAS", text: "Foco en el mercado de capitales argentino y sus instrumentos." },
  { icon: "clock", title: "EXPERIENCIA", text: "Años operando y acompañando a empresas e inversores." },
  { icon: "compass", title: "ASESORAMIENTO", text: "Estrategias a medida según el perfil de cada cliente." },
  { icon: "shield", title: "HONESTIDAD", text: "Transparencia en cada operación y recomendación." },
];

const fmt = (n) => Math.round(n).toLocaleString("es-AR");

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = ref.current?.querySelectorAll(".qs-reveal") ?? [];
    if (reduce) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      }),
      { threshold: 0.15 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return ref;
}

// Contador que cuenta hasta target cuando `run` pasa a true.
function Counter({ target, prefix = "", suffix = "", run }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setVal(target); return; }
    let raf;
    const dur = 1200;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target]);
  return <span>{prefix}{fmt(val)}{suffix}</span>;
}

const Ico = ({ name }) => {
  const c = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  if (name === "target") return <svg {...c}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" /></svg>;
  if (name === "clock") return <svg {...c}><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 16 14" /></svg>;
  if (name === "compass") return <svg {...c}><circle cx="12" cy="12" r="9" /><polygon points="16 8 13 13 8 16 11 11 16 8" /></svg>;
  return <svg {...c}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><polyline points="9 12 11 14 15 10" /></svg>;
};

export default function BrioQuienesSomos() {
  const ref = useReveal();
  const [statsRun, setStatsRun] = useState(false);
  const statsRef = useRef(null);

  // Dispara los contadores cuando el bloque de números entra en pantalla.
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setStatsRun(true); io.disconnect(); } }),
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="qs" id="quienes" ref={ref}>
      <style>{css}</style>
      <div className="qs-inner">

        {/* ── Bloque 1 — Relato ── */}
        <div className="qs-relato">
          <div className="qs-relato-txt qs-reveal">
            <p className="qs-kicker"><span className="qs-kicker-line" aria-hidden="true" />Quiénes somos</p>
            <h2 className="qs-title">Un agente de bolsa con mirada de largo plazo</h2>
            <p className="qs-p">
              Brio Valores es un Agente de Liquidación y Compensación registrado en la CNV,
              con base en Rosario y presencia en todo el país. Acompañamos a empresas e
              inversores en el mercado de capitales argentino.
            </p>
            <p className="qs-p">
              Combinamos experiencia, especialización y un trato cercano para que cada cliente
              —desde una PyME que busca financiarse hasta un inversor que arma su cartera— tenga
              asesoramiento profesional y honesto.
            </p>
          </div>

          {/* foto de oficina — la manda Agus (placeholder) */}
          <div className="qs-relato-foto qs-reveal" aria-hidden="true">
            <div className="qs-foto-ph">
              <span className="qs-foto-ico">🏢</span>
              <span className="qs-foto-txt">Foto de oficina<br />(la pasa Agus)</span>
            </div>
          </div>
        </div>

        {/* ── Bloque 2 — Números ── */}
        <div className="qs-stats qs-reveal" ref={statsRef}>
          {STATS.map((s) => (
            <div key={s.label} className="qs-stat">
              <div className="qs-stat-num">
                {s.badge ? s.badge : <Counter target={s.target} prefix={s.prefix} suffix={s.suffix} run={statsRun} />}
              </div>
              <div className="qs-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Bloque 3 — Valores ── */}
        <div className="qs-values">
          {VALUES.map((v, i) => (
            <article key={v.title} className="qs-value qs-reveal" style={{ "--i": i }}>
              <span className="qs-value-ico"><Ico name={v.icon} /></span>
              <h3 className="qs-value-title">{v.title}</h3>
              <span className="qs-value-line" aria-hidden="true" />
              <p className="qs-value-text">{v.text}</p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap');

.qs{
  --navy:#05091f; --orange:#ef5915; --teal:#65f5e5;
  --white:#ffffff; --gray-text:#9aa3b2;
  background:var(--navy);color:var(--white);
  font-family:'Poppins',system-ui,sans-serif;
  padding:clamp(56px,9vw,110px) clamp(20px,6vw,88px);
}
.qs *{box-sizing:border-box;}
.qs-inner{max-width:1120px;margin:0 auto;}

/* ── Bloque 1 — Relato ── */
.qs-relato{display:grid;grid-template-columns:1fr 1fr;gap:clamp(32px,5vw,64px);align-items:center;margin-bottom:clamp(48px,7vw,84px);}
.qs-kicker{display:inline-flex;align-items:center;gap:10px;margin:0 0 14px;font-size:.82rem;font-weight:500;color:var(--teal);letter-spacing:.3px;}
.qs-kicker-line{width:26px;height:2px;background:var(--teal);border-radius:2px;}
.qs-title{font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(1.7rem,3.2vw,2.5rem);line-height:1.12;letter-spacing:-.6px;margin:0 0 20px;}
.qs-p{font-size:clamp(.98rem,1.2vw,1.06rem);line-height:1.65;color:var(--gray-text);margin:0 0 16px;}
.qs-p:last-child{margin-bottom:0;}

.qs-relato-foto{width:100%;}
.qs-foto-ph{
  aspect-ratio:4/3;width:100%;border-radius:16px;
  background:
    radial-gradient(120% 120% at 70% 20%, rgba(101,245,229,.12), transparent 55%),
    linear-gradient(160deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
  border:1px dashed rgba(101,245,229,.3);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
  color:var(--gray-text);text-align:center;
}
.qs-foto-ico{font-size:2rem;opacity:.7;}
.qs-foto-txt{font-size:.85rem;line-height:1.4;}

/* ── Bloque 2 — Números ── */
.qs-stats{
  display:grid;grid-template-columns:repeat(4,1fr);gap:20px;
  padding:clamp(28px,4vw,40px) clamp(20px,3vw,32px);
  background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:18px;
  margin-bottom:clamp(48px,7vw,84px);
}
.qs-stat{text-align:center;position:relative;}
.qs-stat:not(:last-child)::after{content:"";position:absolute;right:-10px;top:15%;height:70%;width:1px;background:rgba(255,255,255,.08);}
.qs-stat-num{font-family:'Sora',sans-serif;font-weight:800;font-size:clamp(1.9rem,3.4vw,2.7rem);color:var(--white);line-height:1;letter-spacing:-1px;font-variant-numeric:tabular-nums;}
.qs-stat:last-child .qs-stat-num{color:var(--teal);}
.qs-stat-label{margin-top:10px;font-size:.86rem;color:var(--gray-text);}

/* ── Bloque 3 — Valores ── */
.qs-values{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
.qs-value{
  background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;
  padding:26px 22px;transition:transform .2s ease,border-color .2s ease;
}
.qs-value:hover{transform:translateY(-4px);border-color:rgba(101,245,229,.28);}
.qs-value-ico{
  display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;
  background:rgba(101,245,229,.1);border:1px solid rgba(101,245,229,.28);color:var(--teal);margin-bottom:16px;
}
.qs-value-title{font-family:'Sora',sans-serif;font-weight:700;font-size:.95rem;letter-spacing:.5px;margin:0 0 10px;}
.qs-value-line{display:block;width:28px;height:2px;background:var(--teal);border-radius:2px;margin-bottom:12px;}
.qs-value-text{font-size:.9rem;line-height:1.55;color:var(--gray-text);margin:0;}

/* ── reveal ── */
.qs-reveal{opacity:0;transform:translateY(20px);transition:opacity .6s ease, transform .6s ease;}
.qs-reveal.is-in{opacity:1;transform:translateY(0);}
.qs-values .qs-reveal.is-in{transition-delay:calc(var(--i,0) * 90ms);}

/* ── responsive ── */
@media (max-width:860px){
  .qs-relato{grid-template-columns:1fr;}
  .qs-stats{grid-template-columns:repeat(2,1fr);gap:28px 20px;}
  .qs-stat:nth-child(2)::after{display:none;}
  .qs-values{grid-template-columns:repeat(2,1fr);}
}
@media (max-width:480px){
  .qs-stats{grid-template-columns:1fr;}
  .qs-stat::after{display:none!important;}
  .qs-values{grid-template-columns:1fr;}
}

@media (prefers-reduced-motion:reduce){
  .qs-reveal{opacity:1;transform:none;transition:none;}
  .qs-value:hover{transform:none;}
}
`;
