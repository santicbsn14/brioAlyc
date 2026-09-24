import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// Brio Valores — Financiamiento PyME (extendida, /servicios/financiamiento-pyme)
// Parte de Servicios (NO página suelta). Contenido REAL rescatado del sitio viejo.
// Bloques: intro (CPD + aval SGR) · beneficios · paso a paso de 4 etapas (tira
// horizontal animada) · cierre + CTA a Contacto.
// Sistema visual de Brio. Aparición al scrollear + reduced-motion.
//
// TODO: copy final lo repasa Agus. NO mencionar LEBAC (el sitio viejo lo tenía).
// ─────────────────────────────────────────────────────────────

const BENEFICIOS = [
  { t: "Cheques propios y de terceros", d: "Negociás tus cheques o los de tus clientes en el mercado." },
  { t: "Tasas de gran empresa", d: "Con el aval de una SGR accedés a tasas similares a las de grandes compañías." },
  { t: "Simple, transparente y seguro", d: "Operás bajo oferta pública en el Mercado Argentino de Valores (MAV) y BYMA." },
];

const PASOS = [
  { n: 1, t: "Presentás la documentación", d: "Tu PyME entrega la documentación y Brio la gestiona ante la SGR." },
  { n: 2, t: "La SGR emite el aval", d: "La Sociedad de Garantía Recíproca avala tus cheques." },
  { n: 3, t: "Brio opera en el mercado", d: "Como agente de negociación, Brio coloca los CPD en el mercado." },
  { n: 4, t: "Cobrás los fondos", d: "Recibís el dinero por cheque endosable o transferencia a tu cuenta." },
];

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = ref.current?.querySelectorAll(".fp-reveal") ?? [];
    if (reduce) { nodes.forEach((n) => n.classList.add("is-in")); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
      { threshold: 0.2 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return ref;
}

export default function BrioFinanciamientoPyme() {
  const ref = useReveal();

  return (
    <section className="fp" ref={ref}>
      <style>{css}</style>
      <div className="fp-inner">

        {/* ── Intro ── */}
        <header className="fp-hero fp-reveal">
          <p className="fp-kicker"><span className="fp-kicker-line" aria-hidden="true" />Servicios · Financiamiento PyME</p>
          <h1 className="fp-title">Financiá tu PyME en el mercado de capitales</h1>
          <p className="fp-lead">
            Negociá tus Cheques de Pago Diferido en el Mercado Argentino de Valores (MAV) y en BYMA.
            Con el <strong>segmento avalado por una SGR</strong>, tu empresa accede a financiamiento
            a tasas competitivas, de forma transparente y segura.
          </p>
          <a href="#contacto" className="fp-cta fp-cta--top">Consultá por tu PyME</a>
        </header>

        {/* ── Beneficios ── */}
        <div className="fp-benes">
          {BENEFICIOS.map((b, i) => (
            <article key={b.t} className="fp-bene fp-reveal" style={{ "--i": i }}>
              <span className="fp-bene-mark" aria-hidden="true" />
              <h3 className="fp-bene-t">{b.t}</h3>
              <p className="fp-bene-d">{b.d}</p>
            </article>
          ))}
        </div>

        {/* ── Paso a paso ── */}
        <div className="fp-steps-head fp-reveal">
          <h2 className="fp-h2">Cómo negociás tus cheques, paso a paso</h2>
          <p className="fp-h2-sub">Te acompañamos en todo el armado de la documentación para que puedas operar en el corto plazo.</p>
        </div>

        <ol className="fp-steps">
          <span className="fp-steps-line" aria-hidden="true" />
          {PASOS.map((p, i) => (
            <li key={p.n} className="fp-step fp-reveal" style={{ "--i": i }}>
              <span className="fp-step-num">{p.n}</span>
              <h3 className="fp-step-t">{p.t}</h3>
              <p className="fp-step-d">{p.d}</p>
            </li>
          ))}
        </ol>

        {/* ── Cierre ── */}
        <div className="fp-close fp-reveal">
          <p className="fp-close-txt">
            Desde Brio Valores acercamos tu PyME al mercado de capitales de manera simple y segura.
          </p>
          <a href="#contacto" className="fp-cta">Consultá por tu PyME</a>
        </div>

      </div>
    </section>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap');

.fp{
  --navy:#05091f; --orange:#ef5915; --teal:#65f5e5;
  --white:#ffffff; --gray-text:#9aa3b2;
  background:
    radial-gradient(900px 480px at 12% 0%, rgba(239,89,21,.07), transparent 60%),
    var(--navy);
  color:var(--white);
  font-family:'Poppins',system-ui,sans-serif;
  padding:clamp(56px,9vw,110px) clamp(20px,6vw,88px);
}
.fp *{box-sizing:border-box;}
.fp-inner{max-width:1080px;margin:0 auto;}

/* intro */
.fp-hero{max-width:44rem;margin-bottom:clamp(44px,6vw,72px);}
.fp-kicker{display:inline-flex;align-items:center;gap:10px;margin:0 0 16px;font-size:.82rem;font-weight:500;color:var(--teal);letter-spacing:.3px;}
.fp-kicker-line{width:26px;height:2px;background:var(--teal);border-radius:2px;}
.fp-title{font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(2rem,4vw,3rem);line-height:1.08;letter-spacing:-1px;margin:0 0 20px;}
.fp-lead{font-size:clamp(1.02rem,1.3vw,1.14rem);line-height:1.65;color:var(--gray-text);margin:0 0 28px;}
.fp-lead strong{color:var(--white);font-weight:600;}

/* CTA */
.fp-cta{
  display:inline-flex;align-items:center;justify-content:center;
  padding:14px 28px;border-radius:10px;font-weight:600;font-size:1rem;
  background:var(--orange);color:var(--white);text-decoration:none;
  box-shadow:0 10px 26px -10px rgba(239,89,21,.7);
  transition:transform .18s ease, box-shadow .18s ease;
}
.fp-cta:hover{transform:translateY(-2px);box-shadow:0 16px 32px -10px rgba(239,89,21,.85);}

/* beneficios */
.fp-benes{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:clamp(56px,8vw,90px);}
.fp-bene{
  background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.09);
  border-radius:16px;padding:26px 22px;position:relative;
}
.fp-bene-mark{display:block;width:34px;height:3px;border-radius:3px;background:var(--teal);margin-bottom:16px;}
.fp-bene-t{font-family:'Sora',sans-serif;font-weight:700;font-size:1.05rem;margin:0 0 8px;line-height:1.25;}
.fp-bene-d{font-size:.92rem;line-height:1.55;color:var(--gray-text);margin:0;}

/* paso a paso */
.fp-steps-head{text-align:center;max-width:38rem;margin:0 auto clamp(36px,5vw,52px);}
.fp-h2{font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(1.6rem,3vw,2.3rem);line-height:1.12;letter-spacing:-.6px;margin:0 0 12px;}
.fp-h2-sub{font-size:1rem;line-height:1.6;color:var(--gray-text);margin:0;}

.fp-steps{
  list-style:none;margin:0 0 clamp(56px,8vw,90px);padding:0;
  display:grid;grid-template-columns:repeat(4,1fr);gap:20px;position:relative;
}
/* línea conectora horizontal detrás de los números */
.fp-steps-line{
  position:absolute;top:26px;left:12%;right:12%;height:2px;z-index:0;
  background:linear-gradient(90deg, rgba(101,245,229,.15), rgba(101,245,229,.5), rgba(101,245,229,.15));
}
.fp-step{position:relative;z-index:1;text-align:center;padding:0 6px;}
.fp-step-num{
  display:flex;align-items:center;justify-content:center;
  width:52px;height:52px;margin:0 auto 16px;border-radius:50%;
  font-family:'Sora',sans-serif;font-weight:800;font-size:1.3rem;
  color:var(--navy);background:var(--teal);
  box-shadow:0 0 0 6px var(--navy), 0 8px 20px -6px rgba(101,245,229,.6);
}
.fp-step-t{font-family:'Sora',sans-serif;font-weight:600;font-size:1.02rem;margin:0 0 8px;line-height:1.25;}
.fp-step-d{font-size:.9rem;line-height:1.55;color:var(--gray-text);margin:0;}

/* cierre */
.fp-close{
  text-align:center;background:linear-gradient(160deg, rgba(101,245,229,.06), rgba(255,255,255,.02));
  border:1px solid rgba(255,255,255,.1);border-radius:20px;
  padding:clamp(32px,5vw,52px);
}
.fp-close-txt{font-family:'Sora',sans-serif;font-weight:600;font-size:clamp(1.1rem,1.8vw,1.4rem);line-height:1.35;margin:0 0 24px;max-width:34rem;margin-left:auto;margin-right:auto;}

/* reveal */
.fp-reveal{opacity:0;transform:translateY(20px);transition:opacity .6s ease, transform .6s ease;}
.fp-reveal.is-in{opacity:1;transform:translateY(0);}
.fp-benes .fp-reveal.is-in,.fp-steps .fp-reveal.is-in{transition-delay:calc(var(--i,0) * 120ms);}

/* responsive */
@media (max-width:820px){
  .fp-benes{grid-template-columns:1fr;}
  .fp-steps{grid-template-columns:1fr;gap:0;}
  .fp-steps-line{
    left:25px;right:auto;top:26px;bottom:26px;width:2px;height:auto;
    background:linear-gradient(180deg, rgba(101,245,229,.15), rgba(101,245,229,.5), rgba(101,245,229,.15));
  }
  .fp-step{text-align:left;display:grid;grid-template-columns:52px 1fr;column-gap:18px;padding:14px 0;}
  .fp-step-num{margin:0;grid-row:span 2;}
  .fp-step-t{align-self:center;margin:0;}
  .fp-step-d{grid-column:2;}
}

@media (prefers-reduced-motion:reduce){
  .fp-reveal{opacity:1;transform:none;transition:none;}
  .fp-cta:hover{transform:none;}
}
`;
