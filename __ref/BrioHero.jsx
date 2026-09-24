import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// Brio Valores — Hero (dirección "híbrida", sección 6.1)
// Prototipo para revisar. Copy = placeholder (viene de Agus).
// Data de acciones = mock referencial (después la trae data912 → arg_stocks).
// CSS propio, sin librerías de UI, con los tokens de paleta del brief.
// ─────────────────────────────────────────────────────────────

const STOCKS_INIT = [
  { sym: "GGAL", name: "Grupo Galicia", px: 5842.5, chg: 1.8 },
  { sym: "YPFD", name: "YPF", px: 41200, chg: 0.9 },
  { sym: "BMA", name: "Banco Macro", px: 9740, chg: 2.3 },
  { sym: "PAMP", name: "Pampa Energía", px: 3128, chg: -0.6 },
  { sym: "ALUA", name: "Aluar", px: 1086.5, chg: -0.4 },
];

const fmtPx = (n) =>
  n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtChg = (n) => `${n > 0 ? "+" : ""}${n.toLocaleString("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

export default function BrioHero() {
  const [mounted, setMounted] = useState(false);
  const [stocks, setStocks] = useState(STOCKS_INIT);
  const [flash, setFlash] = useState(null); // sym que acaba de actualizarse
  const [navOpen, setNavOpen] = useState(false);

  // Entrada orquestada (fade + subida) una sola vez al montar.
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Tick sutil para que el panel se sienta "en vivo". Respeta reduce-motion.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => {
      setStocks((prev) => {
        const i = Math.floor(Math.random() * prev.length);
        const next = prev.map((s, idx) => {
          if (idx !== i) return s;
          const drift = (Math.random() - 0.48) * 0.6; // -0.29..+0.31
          const px = Math.max(1, s.px * (1 + drift / 100));
          const chg = +(s.chg + drift).toFixed(1);
          return { ...s, px, chg };
        });
        setFlash(prev[i].sym);
        return next;
      });
    }, 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 550);
    return () => clearTimeout(t);
  }, [flash]);

  return (
    <section className={`brio-hero ${mounted ? "is-in" : ""}`}>
      <style>{css}</style>

      {/* ── Navbar (logo placeholder — el vector lo pasa Agus) ── */}
      <header className="bh-nav" style={{ "--d": "0ms" }}>
        <a href="#top" className="bh-brand" aria-label="Brio Valores — inicio">
          <span className="bh-brand-mark">brio</span>
          <span className="bh-brand-sub">valores</span>
        </a>

        <nav className={`bh-navlinks ${navOpen ? "is-open" : ""}`} aria-label="Principal">
          <a href="#quienes">Quiénes somos</a>
          <a href="#servicios" className="has-sub">Servicios<span className="bh-caret" aria-hidden="true">▾</span></a>
          <a href="#herramientas" className="has-sub">Herramientas<span className="bh-caret" aria-hidden="true">▾</span></a>
          <a href="#informes">Informes</a>
          <a href="#contacto">Contacto</a>

          {/* acciones dentro del panel, solo en mobile */}
          <div className="bh-nav-mobileactions">
            <a href="#portafolio" className="bh-nav-portfolio">Mi Portafolio</a>
            <a href="#abri-cuenta" className="bh-btn bh-btn--primary bh-btn--sm">Abrí tu cuenta</a>
          </div>
        </nav>

        <div className="bh-nav-actions">
          <a href="#portafolio" className="bh-nav-portfolio">Mi Portafolio</a>
          <a href="#abri-cuenta" className="bh-btn bh-btn--primary bh-btn--sm">Abrí tu cuenta</a>
        </div>

        <button
          className={`bh-burger ${navOpen ? "is-open" : ""}`}
          aria-label="Abrir menú"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
      </header>

      <div className="bh-grid">
        {/* ── Columna izquierda ── */}
        <div className="bh-copy">
          <p className="bh-kicker" style={{ "--d": "80ms" }}>
            <span className="bh-kicker-dot" aria-hidden="true" />
            Agente registrado en CNV · Mat. 512
          </p>

          <h1 className="bh-title" style={{ "--d": "160ms" }}>
            Tu acceso profesional al mercado de capitales
          </h1>

          <p className="bh-lead" style={{ "--d": "240ms" }}>
            Financiamiento PyME, asesoramiento e inversiones con la solidez de un
            agente registrado. Operá en BYMA con acompañamiento real.
          </p>

          <div className="bh-ctas" style={{ "--d": "320ms" }}>
            <a href="#abri-cuenta" className="bh-btn bh-btn--primary">
              Abrí tu cuenta
            </a>
            <a href="#opera-online" className="bh-btn bh-btn--ghost">
              Operá online
            </a>
          </div>

          <ul className="bh-creds" style={{ "--d": "400ms" }}>
            {[
              ["BYMA", "210"],
              ["MAV", "429"],
              ["A3", "378"],
              ["MAE", "072"],
              ["ACDI", "108"],
            ].map(([label, num]) => (
              <li key={label} className="bh-cred">
                <span className="bh-cred-label">{label}</span>
                <span className="bh-cred-num">{num}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Columna derecha ── */}
        <div className="bh-visual" style={{ "--d": "300ms" }}>
          <div className="bh-glow" aria-hidden="true" />
          <div className="bh-grid-lines" aria-hidden="true" />

          <div className="bh-panel" role="img" aria-label="Panel de acciones BYMA (referencial)">
            <div className="bh-panel-head">
              <div className="bh-panel-title">
                <span className="bh-live" aria-hidden="true" />
                Acciones · BYMA líderes
              </div>
              <span className="bh-tag">Referencial</span>
            </div>

            <ul className="bh-rows">
              {stocks.map((s) => {
                const up = s.chg >= 0;
                return (
                  <li key={s.sym} className={`bh-row ${flash === s.sym ? "is-flash" : ""}`}>
                    <div className="bh-sym">
                      <span className="bh-sym-code">{s.sym}</span>
                      <span className="bh-sym-name">{s.name}</span>
                    </div>
                    <div className="bh-px">$ {fmtPx(s.px)}</div>
                    <div className={`bh-chg ${up ? "up" : "down"}`}>
                      <span className="bh-arrow" aria-hidden="true">{up ? "▲" : "▼"}</span>
                      {fmtChg(s.chg)}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="bh-panel-foot">
              Datos referenciales · no en tiempo real
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap');

.brio-hero{
  --navy:#05091f;
  --navy-2:#060a1f;
  --orange:#ef5915;
  --teal:#65f5e5;
  --white:#ffffff;
  --gray-text:#9aa3b2;
  --up:#37d39b;
  --down:#ff5a52;

  position:relative;
  min-height:100vh;
  box-sizing:border-box;
  padding:clamp(20px,4vw,40px) clamp(20px,6vw,88px);
  background:
    radial-gradient(1200px 600px at 82% 18%, rgba(101,245,229,.10), transparent 60%),
    radial-gradient(900px 500px at 95% 60%, rgba(239,89,21,.08), transparent 55%),
    var(--navy);
  color:var(--white);
  font-family:'Poppins',system-ui,sans-serif;
  overflow:hidden;
  display:flex;
  flex-direction:column;
}
.brio-hero *{box-sizing:border-box;}

/* ── navbar ── */
.bh-nav{
  position:relative;z-index:20;
  display:flex;align-items:center;justify-content:space-between;gap:24px;
  margin-bottom:clamp(28px,6vh,64px);
}
.bh-brand{display:inline-flex;align-items:baseline;gap:6px;text-decoration:none;flex-shrink:0;}
.bh-brand-mark{font-family:'Sora',sans-serif;font-weight:800;font-size:1.35rem;letter-spacing:-.5px;color:var(--white);}
.bh-brand-sub{font-family:'Sora',sans-serif;font-weight:600;font-size:1.35rem;color:var(--teal);letter-spacing:-.5px;}

.bh-navlinks{display:flex;align-items:center;gap:28px;}
.bh-navlinks > a{
  display:inline-flex;align-items:center;gap:5px;
  color:rgba(255,255,255,.82);text-decoration:none;font-size:.92rem;font-weight:500;
  transition:color .18s ease;white-space:nowrap;
}
.bh-navlinks > a:hover{color:var(--white);}
.bh-caret{font-size:.6rem;color:var(--teal);opacity:.9;transform:translateY(1px);}

.bh-nav-actions{display:flex;align-items:center;gap:16px;flex-shrink:0;}
.bh-nav-portfolio{
  color:var(--teal);text-decoration:none;font-size:.92rem;font-weight:500;
  transition:opacity .18s ease;white-space:nowrap;
}
.bh-nav-portfolio:hover{opacity:.75;}
.bh-btn--sm{padding:10px 18px;font-size:.9rem;}

.bh-nav-mobileactions{display:none;}

/* burger */
.bh-burger{
  display:none;flex-direction:column;gap:5px;
  background:none;border:0;cursor:pointer;padding:8px;margin:-8px;
}
.bh-burger span{width:24px;height:2px;background:var(--white);border-radius:2px;transition:transform .25s ease,opacity .2s ease;}
.bh-burger.is-open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
.bh-burger.is-open span:nth-child(2){opacity:0;}
.bh-burger.is-open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}

/* ── grid ── */
.bh-grid{
  flex:1;
  display:grid;
  grid-template-columns:1.05fr .95fr;
  align-items:center;
  gap:clamp(32px,5vw,72px);
}

/* ── copy ── */
.bh-copy{max-width:34rem;}
.bh-kicker{
  display:inline-flex;align-items:center;gap:9px;
  margin:0 0 20px;font-size:.82rem;font-weight:500;color:var(--teal);
  letter-spacing:.2px;
}
.bh-kicker-dot{width:7px;height:7px;border-radius:50%;background:var(--teal);box-shadow:0 0 12px 1px rgba(101,245,229,.7);}
.bh-title{
  font-family:'Sora',sans-serif;font-weight:700;
  font-size:clamp(2.15rem,4.6vw,3.4rem);line-height:1.06;
  letter-spacing:-1px;margin:0 0 20px;color:var(--white);
}
.bh-lead{
  font-size:clamp(1rem,1.3vw,1.12rem);line-height:1.6;
  color:var(--gray-text);margin:0 0 34px;max-width:30rem;
}

/* ── CTAs ── */
.bh-ctas{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:38px;}
.bh-btn{
  display:inline-flex;align-items:center;justify-content:center;
  padding:14px 26px;border-radius:10px;font-weight:600;font-size:.98rem;
  text-decoration:none;cursor:pointer;transition:transform .18s ease,background .18s ease,box-shadow .18s ease,border-color .18s ease,color .18s ease;
}
.bh-btn--primary{background:var(--orange);color:var(--white);box-shadow:0 8px 24px -8px rgba(239,89,21,.7);}
.bh-btn--primary:hover{transform:translateY(-2px);box-shadow:0 14px 30px -8px rgba(239,89,21,.85);}
.bh-btn--ghost{background:transparent;color:var(--teal);border:1.5px solid rgba(101,245,229,.45);}
.bh-btn--ghost:hover{transform:translateY(-2px);border-color:var(--teal);background:rgba(101,245,229,.08);}

/* ── credenciales (sellos) ── */
.bh-creds{list-style:none;display:flex;flex-wrap:wrap;gap:10px;padding:0;margin:0;}
.bh-cred{
  display:inline-flex;align-items:center;gap:7px;
  padding:7px 12px;border-radius:8px;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);
}
.bh-cred-label{font-family:'Sora',sans-serif;font-weight:700;font-size:.74rem;color:var(--white);letter-spacing:.3px;}
.bh-cred-num{font-size:.74rem;color:var(--teal);font-weight:600;}

/* ── visual derecha ── */
.bh-visual{position:relative;display:flex;align-items:center;justify-content:center;min-height:360px;}
.bh-glow{
  position:absolute;inset:-10% -6% -10% -6%;
  background:radial-gradient(closest-side, rgba(101,245,229,.16), transparent 70%);
  filter:blur(6px);animation:bhFloat 9s ease-in-out infinite;
}
.bh-grid-lines{
  position:absolute;inset:0;opacity:.5;
  background-image:
    linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px);
  background-size:38px 38px;
  -webkit-mask-image:radial-gradient(closest-side, #000 55%, transparent 92%);
          mask-image:radial-gradient(closest-side, #000 55%, transparent 92%);
}

/* ── panel glass ── */
.bh-panel{
  position:relative;width:min(400px,100%);
  background:rgba(255,255,255,.055);
  border:1px solid rgba(255,255,255,.12);
  border-radius:18px;
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  box-shadow:0 30px 60px -24px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.08);
  padding:18px 18px 14px;
  animation:bhBob 7s ease-in-out infinite;
}
.bh-panel-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.bh-panel-title{display:flex;align-items:center;gap:8px;font-family:'Sora',sans-serif;font-weight:600;font-size:.9rem;color:var(--white);}
.bh-live{width:8px;height:8px;border-radius:50%;background:var(--teal);box-shadow:0 0 0 0 rgba(101,245,229,.6);animation:bhPulse 2s infinite;}
.bh-tag{font-size:.66rem;font-weight:600;color:var(--teal);background:rgba(101,245,229,.10);border:1px solid rgba(101,245,229,.28);padding:3px 8px;border-radius:999px;letter-spacing:.3px;}

.bh-rows{list-style:none;margin:0;padding:0;}
.bh-row{
  display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:10px;
  padding:11px 8px;border-radius:10px;
  border-bottom:1px solid rgba(255,255,255,.06);
  transition:background .4s ease;
}
.bh-row:last-child{border-bottom:none;}
.bh-row.is-flash{background:rgba(101,245,229,.09);}
.bh-sym{display:flex;flex-direction:column;gap:1px;min-width:0;}
.bh-sym-code{font-family:'Sora',sans-serif;font-weight:700;font-size:.86rem;color:var(--white);}
.bh-sym-name{font-size:.68rem;color:var(--gray-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.bh-px{font-size:.86rem;color:var(--white);font-variant-numeric:tabular-nums;white-space:nowrap;}
.bh-chg{
  display:inline-flex;align-items:center;gap:4px;justify-content:flex-end;
  font-size:.8rem;font-weight:600;font-variant-numeric:tabular-nums;min-width:64px;
}
.bh-chg.up{color:var(--up);}
.bh-chg.down{color:var(--down);}
.bh-arrow{font-size:.6rem;}
.bh-panel-foot{margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.06);font-size:.66rem;color:var(--gray-text);text-align:center;}

/* ── entrada orquestada (una sola vez) ── */
.bh-nav,.bh-kicker,.bh-title,.bh-lead,.bh-ctas,.bh-creds,.bh-visual{
  opacity:0;transform:translateY(16px);
  transition:opacity .6s ease, transform .6s ease;
  transition-delay:var(--d,0ms);
}
.brio-hero.is-in .bh-nav,
.brio-hero.is-in .bh-kicker,
.brio-hero.is-in .bh-title,
.brio-hero.is-in .bh-lead,
.brio-hero.is-in .bh-ctas,
.brio-hero.is-in .bh-creds,
.brio-hero.is-in .bh-visual{opacity:1;transform:translateY(0);}

@keyframes bhPulse{0%{box-shadow:0 0 0 0 rgba(101,245,229,.5);}70%{box-shadow:0 0 0 7px rgba(101,245,229,0);}100%{box-shadow:0 0 0 0 rgba(101,245,229,0);}}
@keyframes bhBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
@keyframes bhFloat{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(-2%,3%) scale(1.05);}}

/* ── responsive ── */
/* navbar → burger + panel desplegable */
@media (max-width:920px){
  .bh-nav-actions{display:none;}
  .bh-burger{display:flex;}
  .bh-navlinks{
    position:absolute;top:calc(100% + 8px);right:0;left:0;
    flex-direction:column;align-items:stretch;gap:0;
    background:var(--navy-2);
    border:1px solid rgba(255,255,255,.10);border-radius:14px;
    padding:8px;
    box-shadow:0 24px 50px -18px rgba(0,0,0,.75);
    opacity:0;visibility:hidden;transform:translateY(-8px);
    transition:opacity .2s ease, transform .2s ease, visibility .2s;
  }
  .bh-navlinks.is-open{opacity:1;visibility:visible;transform:translateY(0);}
  .bh-navlinks > a{padding:13px 14px;border-radius:9px;font-size:1rem;}
  .bh-navlinks > a:hover{background:rgba(255,255,255,.05);}
  .has-sub{justify-content:space-between;}
  .bh-nav-mobileactions{
    display:flex;flex-direction:column;gap:10px;
    margin-top:6px;padding:12px 6px 6px;
    border-top:1px solid rgba(255,255,255,.08);
  }
  .bh-nav-mobileactions .bh-nav-portfolio{padding:6px 8px;}
  .bh-nav-mobileactions .bh-btn{width:100%;}
}
@media (max-width:860px){
  .bh-grid{grid-template-columns:1fr;text-align:center;gap:40px;}
  .bh-copy{max-width:100%;margin:0 auto;}
  .bh-kicker{justify-content:center;}
  .bh-lead{margin-left:auto;margin-right:auto;}
  .bh-ctas,.bh-creds{justify-content:center;}
  .bh-visual{order:2;min-height:auto;}
}
@media (max-width:420px){
  .bh-ctas .bh-btn{flex:1;}
  .bh-cred{padding:6px 10px;}
}

@media (prefers-reduced-motion:reduce){
  .bh-panel,.bh-glow,.bh-live{animation:none;}
  .bh-nav,.bh-kicker,.bh-title,.bh-lead,.bh-ctas,.bh-creds,.bh-visual{transition:none;opacity:1;transform:none;}
}
`;
