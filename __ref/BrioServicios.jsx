import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// Brio Valores — Servicios (sección 6.4)
// Modelo TSA de dos niveles: Nivel 1 (pilares/servicios) + Nivel 2 (instrumentos por categoría) + Comisiones.
// Mismo sistema visual que el Hero (tokens, Poppins/Sora, acentos teal).
// TODO: contenido = placeholder base del sitio actual. Listado fino de instrumentos y
//       valores de comisiones los CONFIRMA Agus. (Ojo: NO replicar LEBAC — no existen desde 2018.)
// Aparición progresiva al scrollear (IntersectionObserver), respeta prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────

const PILLARS = [
  {
    icon: "growth",
    title: "Financiamiento PyME",
    text: "Salí a buscar fondeo en el mercado de capitales con cheques, obligaciones negociables y fideicomisos, a tasas competitivas.",
    featured: true,
  },
  {
    icon: "pie",
    title: "Asesoramiento e inversiones",
    text: "Armamos tu cartera según tu perfil y tus objetivos, con seguimiento profesional y acompañamiento real.",
    featured: false,
  },
  {
    icon: "layers",
    title: "Estructuración y colocación",
    text: "Diseñamos y colocamos fideicomisos financieros y obligaciones negociables para empresas que salen al mercado.",
    featured: false,
  },
];

const INSTRUMENTS = [
  {
    cat: "Financiamiento",
    items: ["Cheques de Pago Diferido", "Obligaciones Negociables", "Fideicomisos Financieros"],
  },
  {
    cat: "Renta fija",
    items: ["Títulos públicos y soberanos", "Obligaciones Negociables", "LECAPs / letras"],
  },
  {
    cat: "Renta variable",
    items: ["Acciones (BYMA líderes)", "Panel de cotizaciones en vivo →"],
  },
];

// TODO: valores de referencia — los define Brio (editable desde Sanity).
const FEES = [
  { concept: "Compra / venta de acciones", fee: "0,50%", note: "mín. según operación" },
  { concept: "Títulos públicos y ON", fee: "0,30%", note: "—" },
  { concept: "Cauciones colocadoras", fee: "0,15%", note: "—" },
  { concept: "Suscripción / rescate FCI", fee: "s/c", note: "según fondo" },
  { concept: "Custodia", fee: "0,10% anual", note: "sobre tenencia" },
];

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = ref.current?.querySelectorAll(".srv-reveal") ?? [];
    if (reduce) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return ref;
}

const Icon = ({ name }) => {
  const common = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  if (name === "growth")
    return (
      <svg {...common} aria-hidden="true">
        <polyline points="3 17 9 11 13 15 21 6" />
        <polyline points="15 6 21 6 21 12" />
      </svg>
    );
  if (name === "pie")
    return (
      <svg {...common} aria-hidden="true">
        <path d="M21 15.5A9 9 0 1 1 8.5 3" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
      </svg>
    );
  return (
    <svg {...common} aria-hidden="true">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
};

export default function BrioServicios() {
  const ref = useReveal();

  return (
    <section className="srv" ref={ref}>
      <style>{css}</style>

      <div className="srv-inner">
        {/* encabezado */}
        <header className="srv-head srv-reveal">
          <p className="srv-kicker">
            <span className="srv-kicker-line" aria-hidden="true" />
            Servicios
          </p>
          <h2 className="srv-title">Qué hacemos por vos y tu empresa</h2>
          <p className="srv-lead">
            Financiamiento, asesoramiento y estructuración en el mercado de capitales,
            con la solidez de un agente registrado en CNV.
          </p>
        </header>

        {/* ── Nivel 1 — pilares ── */}
        <div className="srv-pillars">
          {PILLARS.map((p, i) => (
            <article
              key={p.title}
              className={`srv-card srv-reveal ${p.featured ? "is-featured" : ""}`}
              style={{ "--i": i }}
            >
              {p.featured && <span className="srv-badge">Nuestro diferencial</span>}
              <span className="srv-ico">
                <Icon name={p.icon} />
              </span>
              <h3 className="srv-card-title">{p.title}</h3>
              <p className="srv-card-text">{p.text}</p>
            </article>
          ))}
        </div>

        {/* ── Nivel 2 — instrumentos ── */}
        <div className="srv-sub srv-reveal">
          <h3 className="srv-sub-title">Instrumentos que operamos</h3>
        </div>
        <div className="srv-instruments">
          {INSTRUMENTS.map((g, i) => (
            <div key={g.cat} className="srv-inst srv-reveal" style={{ "--i": i }}>
              <div className="srv-inst-cat">{g.cat}</div>
              <ul className="srv-inst-list">
                {g.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Comisiones ── */}
        <div className="srv-sub srv-reveal">
          <h3 className="srv-sub-title">Comisiones</h3>
        </div>
        <div className="srv-fees srv-reveal">
          <table className="srv-table">
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Comisión</th>
                <th>Mínimo / aclaración</th>
              </tr>
            </thead>
            <tbody>
              {FEES.map((f) => (
                <tr key={f.concept}>
                  <td data-label="Concepto">{f.concept}</td>
                  <td data-label="Comisión" className="srv-td-fee">{f.fee}</td>
                  <td data-label="Mínimo / aclaración" className="srv-td-note">{f.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="srv-fees-note">
            Valores de referencia · editables desde el panel. Los vigentes los define Brio.
          </p>
        </div>
      </div>
    </section>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap');

.srv{
  --navy:#05091f; --navy-2:#060a1f; --orange:#ef5915; --teal:#65f5e5;
  --white:#ffffff; --gray-text:#9aa3b2;
  background:var(--navy);
  color:var(--white);
  font-family:'Poppins',system-ui,sans-serif;
  padding:clamp(56px,9vw,110px) clamp(20px,6vw,88px);
}
.srv *{box-sizing:border-box;}
.srv-inner{max-width:1120px;margin:0 auto;}

/* encabezado */
.srv-head{max-width:40rem;margin-bottom:clamp(36px,5vw,56px);}
.srv-kicker{display:inline-flex;align-items:center;gap:10px;margin:0 0 14px;font-size:.82rem;font-weight:500;color:var(--teal);letter-spacing:.3px;}
.srv-kicker-line{width:26px;height:2px;background:var(--teal);border-radius:2px;}
.srv-title{font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(1.8rem,3.4vw,2.6rem);line-height:1.1;letter-spacing:-.6px;margin:0 0 16px;}
.srv-lead{font-size:clamp(1rem,1.2vw,1.08rem);line-height:1.6;color:var(--gray-text);margin:0;}

/* ── Nivel 1 — pilares ── */
.srv-pillars{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:clamp(48px,7vw,80px);}
.srv-card{
  position:relative;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.09);
  border-radius:16px;
  padding:28px 24px;
  transition:transform .2s ease, border-color .2s ease, background .2s ease;
}
.srv-card:hover{transform:translateY(-4px);border-color:rgba(101,245,229,.3);background:rgba(255,255,255,.055);}
.srv-card.is-featured{
  border-color:rgba(101,245,229,.4);
  background:linear-gradient(180deg, rgba(101,245,229,.07), rgba(255,255,255,.03));
  box-shadow:0 20px 50px -24px rgba(101,245,229,.35);
}
.srv-badge{
  position:absolute;top:-11px;left:24px;
  font-size:.68rem;font-weight:600;letter-spacing:.3px;
  color:var(--navy);background:var(--teal);
  padding:4px 11px;border-radius:999px;
}
.srv-ico{
  display:inline-flex;align-items:center;justify-content:center;
  width:52px;height:52px;border-radius:50%;
  background:rgba(101,245,229,.1);border:1px solid rgba(101,245,229,.28);
  color:var(--teal);margin-bottom:18px;
}
.srv-card-title{font-family:'Sora',sans-serif;font-weight:700;font-size:1.18rem;margin:0 0 10px;}
.srv-card-text{font-size:.95rem;line-height:1.6;color:var(--gray-text);margin:0;}

/* subtítulos de bloque */
.srv-sub{margin:0 0 22px;}
.srv-sub-title{
  font-family:'Sora',sans-serif;font-weight:600;font-size:1.35rem;margin:0;
  padding-bottom:12px;position:relative;display:inline-block;
}
.srv-sub-title::after{content:"";position:absolute;left:0;bottom:0;width:34px;height:2px;background:var(--teal);border-radius:2px;}

/* ── Nivel 2 — instrumentos ── */
.srv-instruments{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:clamp(48px,7vw,80px);}
.srv-inst{
  background:rgba(255,255,255,.03);
  border:1px solid rgba(255,255,255,.08);
  border-radius:14px;padding:22px 22px 8px;
}
.srv-inst-cat{
  font-family:'Sora',sans-serif;font-weight:700;font-size:.86rem;letter-spacing:.4px;
  text-transform:uppercase;color:var(--teal);margin-bottom:14px;
}
.srv-inst-list{list-style:none;margin:0;padding:0;}
.srv-inst-list li{
  position:relative;padding:11px 0 11px 20px;font-size:.95rem;color:rgba(255,255,255,.88);
  border-bottom:1px solid rgba(255,255,255,.06);
}
.srv-inst-list li:last-child{border-bottom:none;}
.srv-inst-list li::before{content:"";position:absolute;left:0;top:50%;transform:translateY(-50%);width:6px;height:6px;border-radius:50%;background:var(--teal);}

/* ── Comisiones ── */
.srv-fees{
  background:rgba(255,255,255,.03);
  border:1px solid rgba(255,255,255,.08);
  border-radius:14px;overflow:hidden;
}
.srv-table{width:100%;border-collapse:collapse;font-size:.95rem;}
.srv-table th{
  text-align:left;font-family:'Sora',sans-serif;font-weight:600;font-size:.8rem;
  letter-spacing:.3px;text-transform:uppercase;color:var(--gray-text);
  padding:16px 22px;border-bottom:1px solid rgba(255,255,255,.1);
}
.srv-table td{padding:15px 22px;border-bottom:1px solid rgba(255,255,255,.06);color:rgba(255,255,255,.9);}
.srv-table tbody tr:last-child td{border-bottom:none;}
.srv-table tbody tr:hover{background:rgba(255,255,255,.025);}
.srv-td-fee{font-family:'Sora',sans-serif;font-weight:600;color:var(--white);font-variant-numeric:tabular-nums;white-space:nowrap;}
.srv-td-note{color:var(--gray-text);}
.srv-fees-note{font-size:.78rem;color:var(--gray-text);margin:0;padding:14px 22px;background:rgba(255,255,255,.02);}

/* ── reveal on scroll ── */
.srv-reveal{opacity:0;transform:translateY(20px);transition:opacity .6s ease, transform .6s ease;}
.srv-reveal.is-in{opacity:1;transform:translateY(0);}
.srv-pillars .srv-reveal.is-in,.srv-instruments .srv-reveal.is-in{transition-delay:calc(var(--i,0) * 90ms);}

/* ── responsive ── */
@media (max-width:860px){
  .srv-pillars,.srv-instruments{grid-template-columns:1fr;}
  .srv-card.is-featured{order:-1;}
}
@media (max-width:560px){
  .srv-table thead{display:none;}
  .srv-table,.srv-table tbody,.srv-table tr,.srv-table td{display:block;width:100%;}
  .srv-table tr{border-bottom:1px solid rgba(255,255,255,.1);padding:8px 0;}
  .srv-table td{border:none;padding:7px 22px;display:flex;justify-content:space-between;gap:16px;}
  .srv-table td::before{content:attr(data-label);color:var(--gray-text);font-size:.8rem;}
  .srv-td-fee,.srv-td-note{text-align:right;}
}

@media (prefers-reduced-motion:reduce){
  .srv-reveal{opacity:1;transform:none;transition:none;}
  .srv-card:hover{transform:none;}
}
`;
