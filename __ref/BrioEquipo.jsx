import { useEffect, useRef, useState } from "react";

/* ============================================================
   BrioEquipo.jsx — PROTOTIPO (va a _ref/, descartable)
   Sección Equipo (estrella, animación estilo Inviu).
   12 personas = 3 socios + 9 empleados, DOS tratamientos.
   Fotos con PLACEHOLDER (avatar con iniciales) hasta tener
   las reales — orientación propuesta: vertical 4:5.
   Contenido pasa después a data/equipo.ts.
   ============================================================ */

const equipo = {
  kicker: "Nuestra gente",
  title: "El equipo detrás de Brio",
  lead: "Un grupo de especialistas que combina experiencia de mercado con cercanía real con cada cliente.",

  socios: [
    {
      id: "s1",
      nombre: "Nombre Apellido",
      cargo: "Socio Director",
      bio: "Más de X años en el mercado de capitales. Texto de ejemplo a reemplazar por la descripción real.",
      color: "teal",
    },
    {
      id: "s2",
      nombre: "Nombre Apellido",
      cargo: "Socia",
      bio: "Más de X años en el mercado de capitales. Texto de ejemplo a reemplazar por la descripción real.",
      color: "orange",
    },
    {
      id: "s3",
      nombre: "Nombre Apellido",
      cargo: "Socio",
      bio: "Más de X años en el mercado de capitales. Texto de ejemplo a reemplazar por la descripción real.",
      color: "teal",
    },
  ],

  equipoLabel: "Equipo",
  // 9 empleados de ejemplo — nombres/cargos genéricos hasta tener la nómina real
  empleados: Array.from({ length: 9 }, (_, i) => ({
    id: `e${i + 1}`,
    nombre: "Nombre Apellido",
    cargo: "Cargo",
  })),
};

/* ---------- avatar placeholder (iniciales, sin foto real) ---------- */
function Avatar({ nombre, tone = "teal", size = "md" }) {
  const initials = nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  return (
    <div className={`eq-avatar eq-avatar--${size} eq-avatar--${tone}`} aria-hidden="true">
      <span>{initials || "?"}</span>
    </div>
  );
}

/* ---------- reveal (en el código real: useReveal.ts) ---------- */
function useRevealLocal(threshold = 0.15) {
  const ref = useRef(null);
  const [isIn, setIsIn] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) { setIsIn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIsIn(true); io.disconnect(); } }, { threshold });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, isIn];
}

/* ---------- sección ---------- */
export default function BrioEquipoPrototype() {
  const [headRef, headIn] = useRevealLocal();
  const [socRef, socIn] = useRevealLocal();
  const [empRef, empIn] = useRevealLocal(0.05);

  return (
    <section className="eq-section" aria-labelledby="eq-title">
      <style>{css}</style>

      <div ref={headRef} className={`eq-head eq-reveal ${headIn ? "isIn" : ""}`}>
        <p className="eq-kicker">{equipo.kicker}</p>
        <h2 id="eq-title" className="eq-title">{equipo.title}</h2>
        <p className="eq-lead">{equipo.lead}</p>
      </div>

      {/* -------- socios: tratamiento destacado, con bio -------- */}
      <div ref={socRef} className="eq-socios">
        {equipo.socios.map((s, i) => (
          <article
            key={s.id}
            className={`eq-socio eq-reveal ${socIn ? "isIn" : ""}`}
            style={{ transitionDelay: socIn ? `${i * 0.1}s` : "0s" }}
          >
            <Avatar nombre={s.nombre} tone={s.color} size="lg" />
            <h3 className="eq-socio-nombre">{s.nombre}</h3>
            <p className="eq-socio-cargo">{s.cargo}</p>
            <p className="eq-socio-bio">{s.bio}</p>
          </article>
        ))}
      </div>

      {/* -------- empleados: grilla simple, solo foto+nombre+cargo -------- */}
      <div ref={empRef} className="eq-emp-wrap">
        <p className="eq-emp-label">{equipo.equipoLabel}</p>
        <div className="eq-emp-grid">
          {equipo.empleados.map((e, i) => (
            <div
              key={e.id}
              className={`eq-emp eq-reveal ${empIn ? "isIn" : ""}`}
              style={{ transitionDelay: empIn ? `${(i % 5) * 0.06}s` : "0s" }}
            >
              <Avatar nombre={e.nombre} tone={i % 2 ? "orange" : "teal"} size="sm" />
              <p className="eq-emp-nombre">{e.nombre}</p>
              <p className="eq-emp-cargo">{e.cargo}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="eq-note">
        * Fotos placeholder — se reemplazan por las 12 fotos reales (orientación vertical 4:5)
        cuando estén disponibles.
      </p>
    </section>
  );
}

/* ---------- estilos (en el código real: Equipo.module.css) ---------- */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Sora:wght@600;700&display=swap');

.eq-section{
  --navy:#05091f; --orange:#ef5915; --teal:#65f5e5; --white:#fff;
  --muted:#9aa3b2; --line:rgba(255,255,255,.12);
  background:var(--navy); color:var(--white); font-family:'Poppins',system-ui,sans-serif;
  padding:clamp(64px,9vw,120px) clamp(20px,5vw,64px);
}
.eq-section *{box-sizing:border-box}

.eq-reveal{opacity:0; transform:translateY(20px); transition:opacity .6s ease, transform .6s ease}
.eq-reveal.isIn{opacity:1; transform:none}
@media (prefers-reduced-motion:reduce){.eq-reveal{opacity:1; transform:none; transition:none}}

.eq-head{max-width:680px; margin:0 auto clamp(48px,7vw,72px); text-align:center}
.eq-kicker{margin:0 0 14px; font-size:.9rem; color:var(--teal)}
.eq-title{font-family:'Sora',sans-serif; font-weight:700; font-size:clamp(2rem,4.2vw,2.9rem); letter-spacing:-.02em; margin:0 0 16px}
.eq-lead{color:var(--muted); font-size:1.02rem; line-height:1.65; margin:0 auto; max-width:52ch}

/* avatar placeholder */
.eq-avatar{border-radius:50%; display:grid; place-items:center; font-family:'Sora',sans-serif; font-weight:700; flex:none}
.eq-avatar--teal{background:rgba(101,245,229,.14); color:var(--teal); border:1px solid rgba(101,245,229,.5)}
.eq-avatar--orange{background:rgba(239,89,21,.14); color:var(--orange); border:1px solid rgba(239,89,21,.5)}
.eq-avatar--lg{width:120px; height:120px; font-size:2rem; aspect-ratio:4/5; border-radius:24px}
.eq-avatar--sm{width:84px; height:84px; font-size:1.3rem; aspect-ratio:4/5; border-radius:18px}

/* socios */
.eq-socios{
  max-width:1100px; margin:0 auto clamp(56px,7vw,84px);
  display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(20px,3vw,32px);
}
.eq-socio{
  text-align:center; padding:clamp(28px,3vw,36px) 20px; border-radius:20px;
  background:rgba(255,255,255,.03); border:1px solid var(--line);
}
.eq-socio .eq-avatar{margin:0 auto 20px}
.eq-socio-nombre{font-family:'Sora',sans-serif; font-weight:600; font-size:1.15rem; margin:0 0 4px}
.eq-socio-cargo{color:var(--teal); font-size:.88rem; margin:0 0 14px}
.eq-socio-bio{color:var(--muted); font-size:.92rem; line-height:1.6; margin:0}

/* empleados */
.eq-emp-wrap{max-width:1100px; margin:0 auto}
.eq-emp-label{
  text-align:center; text-transform:uppercase; letter-spacing:.12em; font-size:.78rem;
  color:var(--muted); margin:0 0 28px;
}
.eq-emp-grid{
  display:grid; grid-template-columns:repeat(5,1fr); gap:clamp(18px,2.4vw,28px);
  justify-items:center;
}
.eq-emp{text-align:center}
.eq-emp .eq-avatar{margin:0 auto 12px}
.eq-emp-nombre{font-weight:500; font-size:.92rem; margin:0}
.eq-emp-cargo{color:var(--muted); font-size:.82rem; margin:2px 0 0}

.eq-note{max-width:1100px; margin:clamp(36px,5vw,52px) auto 0; text-align:center; font-size:.8rem; color:#5f6a7d; font-style:italic}

/* responsive */
@media (max-width:900px){
  .eq-socios{grid-template-columns:1fr}
  .eq-socio{max-width:360px; margin:0 auto}
  .eq-emp-grid{grid-template-columns:repeat(3,1fr)}
}
@media (max-width:480px){
  .eq-emp-grid{grid-template-columns:repeat(2,1fr)}
}
`;
