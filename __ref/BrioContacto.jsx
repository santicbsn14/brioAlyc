import { useEffect, useRef, useState } from "react";

/* ============================================================
   BrioContacto.jsx — PROTOTIPO (va a _ref/, descartable)
   Sección Contacto de la home (#contacto).
   Todo el contenido está en `contacto` (arriba) para pasarlo
   después a data/contacto.ts y de ahí a Sanity.
   ============================================================ */

const contacto = {
  title: "Hablemos de lo que necesitás",
  lead:
    "Contanos qué querés hacer y te respondemos a la brevedad. Si preferís, escribinos directo por el canal que te quede más cómodo.",
  motivosLabel: "¿En qué te ayudamos?",
  motivos: [
    {
      id: "cuenta",
      label: "Abrir mi cuenta",
      mensajePlaceholder: "Contanos si ya invertís o si es tu primera vez, y qué te interesa operar.",
      extra: null,
    },
    {
      id: "pyme",
      label: "Financiamiento para mi PyME",
      mensajePlaceholder: "Contanos qué necesita tu empresa: descuento de cheques, obligaciones negociables, otra cosa.",
      extra: { name: "empresa", label: "Nombre de la empresa", placeholder: "Razón social" },
    },
    {
      id: "consulta",
      label: "Otra consulta",
      mensajePlaceholder: "Escribinos tu consulta.",
      extra: null,
    },
  ],
  fields: {
    nombre: "Nombre y apellido",
    email: "Email",
    telefono: "Teléfono (opcional)",
    mensaje: "Mensaje",
  },
  submitLabel: "Enviar consulta",
  sendingLabel: "Enviando…",
  legal: "Usamos tus datos solo para responderte esta consulta.",
  success: {
    title: "Recibimos tu consulta",
    text: "Te respondemos por email o teléfono en el horario de atención.",
    again: "Enviar otra consulta",
  },
  errors: {
    nombre: "Escribí tu nombre.",
    email: "Revisá el email: parece que falta algo.",
    mensaje: "Contanos brevemente qué necesitás.",
    envio: "No pudimos enviar el mensaje. Probá de nuevo o escribinos por WhatsApp.",
  },
  // TODO(Agus): todos estos datos son de ejemplo
  channels: [
    { id: "whatsapp", label: "WhatsApp", value: "+54 9 341 000 0000", href: "https://wa.me/5493410000000", external: true },
    { id: "email", label: "Email", value: "contacto@briovalores.com", href: "mailto:contacto@briovalores.com" },
    { id: "tel", label: "Teléfono", value: "(0341) 000-0000", href: "tel:+543410000000" },
    { id: "dir", label: "Oficina", value: "Rosario, Santa Fe", sub: "Calle 000, piso 0", href: null },
    { id: "hs", label: "Horario", value: "Lunes a viernes, 10 a 17 hs", href: null },
  ],
  socialLabel: "Seguinos",
  // TODO(Agus): confirmar usuarios reales de cada red (hoy son de ejemplo)
  social: [
    { id: "instagram", label: "Instagram", href: "https://instagram.com/briovalores" },
    { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com/company/briovalores" },
  ],
  seal: "Agente registrado en CNV · Mat. 512",
};

/* ---------- íconos (SVG inline, trazo simple) ---------- */
const Icon = ({ id }) => {
  const p = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  switch (id) {
    case "whatsapp":
      return (<svg {...p}><path d="M20 11.5a8 8 0 0 1-11.9 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" /><path d="M9.2 8.6c.2 2.6 2.6 5 5.2 5.2l1.2-1.1-1.7-1-.9.6c-.9-.4-1.6-1.1-2-2l.6-.9-1-1.7-1.4 1Z" /></svg>);
    case "email":
      return (<svg {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></svg>);
    case "tel":
      return (<svg {...p}><path d="M5 4h3.5l1.5 4-2 1.3a11 11 0 0 0 5.7 5.7L15 13l4 1.5V18a2 2 0 0 1-2 2A13 13 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>);
    case "dir":
      return (<svg {...p}><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>);
    case "instagram":
      return (<svg {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" /></svg>);
    case "linkedin":
      return (<svg {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M8 10.5V17M8 7.5v.01M12 17v-3.8c0-1.3.9-2.2 2-2.2s2 .9 2 2.2V17" /></svg>);
    default:
      return (<svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>);
  }
};

/* ---------- reveal (en el código real se usa useReveal.ts) ---------- */
function useRevealLocal() {
  const ref = useRef(null);
  const [isIn, setIsIn] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) { setIsIn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIsIn(true); io.disconnect(); } }, { threshold: 0.15 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, isIn];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ---------- sección ---------- */
function Contacto({ defaultMotivo = "cuenta" }) {
  const [headRef, headIn] = useRevealLocal();
  const [formRef, formIn] = useRevealLocal();

  const [motivo, setMotivo] = useState(defaultMotivo);
  const [values, setValues] = useState({ nombre: "", email: "", telefono: "", empresa: "", mensaje: "", website: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  // si llega desde un CTA con otro motivo (?motivo=pyme), lo actualiza
  useEffect(() => { setMotivo(defaultMotivo); }, [defaultMotivo]);

  const current = contacto.motivos.find((m) => m.id === motivo) ?? contacto.motivos[0];
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const validate = () => {
    const er = {};
    if (!values.nombre.trim()) er.nombre = contacto.errors.nombre;
    if (!EMAIL_RE.test(values.email.trim())) er.email = contacto.errors.email;
    if (values.mensaje.trim().length < 5) er.mensaje = contacto.errors.mensaje;
    return er;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (values.website) return; // honeypot: si un bot lo llena, no hacemos nada
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;
    setStatus("sending");
    try {
      // En el sitio real: fetch("/api/contacto", { method: "POST", body: JSON.stringify({ motivo, ...values }) })
      await new Promise((r) => setTimeout(r, 900));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setValues({ nombre: "", email: "", telefono: "", empresa: "", mensaje: "", website: "" });
    setErrors({});
    setStatus("idle");
  };

  return (
    <section id="contacto" className="ct-section" aria-labelledby="ct-title">
      <style>{css}</style>
      <div className="ct-glow" aria-hidden="true" />

      <div className="ct-wrap">
        {/* -------- columna izquierda: qué + canales -------- */}
        <div ref={headRef} className={`ct-side ct-reveal ${headIn ? "isIn" : ""}`}>
          <p className="ct-seal"><span className="ct-seal-bar" aria-hidden="true" />{contacto.seal}</p>
          <h2 id="ct-title" className="ct-title">{contacto.title}</h2>
          <p className="ct-lead">{contacto.lead}</p>

          <ul className="ct-channels">
            {contacto.channels.map((c) => {
              const inner = (
                <>
                  <span className="ct-ico"><Icon id={c.id} /></span>
                  <span className="ct-ch-text">
                    <span className="ct-ch-label">{c.label}</span>
                    <span className="ct-ch-value">{c.value}</span>
                    {c.sub && <span className="ct-ch-sub">{c.sub}</span>}
                  </span>
                </>
              );
              return (
                <li key={c.id}>
                  {c.href ? (
                    <a className="ct-ch ct-ch-link" href={c.href} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{inner}</a>
                  ) : (
                    <div className="ct-ch">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="ct-social">
            <span className="ct-social-label">{contacto.socialLabel}</span>
            <div className="ct-social-links">
              {contacto.social.map((s) => (
                <a key={s.id} className="ct-social-link" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <Icon id={s.id} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* -------- columna derecha: formulario -------- */}
        <div ref={formRef} className={`ct-card ct-reveal ct-d1 ${formIn ? "isIn" : ""}`}>
          {status === "sent" ? (
            <div className="ct-done" role="status" aria-live="polite">
              <span className="ct-done-ico" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
              </span>
              <h3 className="ct-done-title">{contacto.success.title}</h3>
              <p className="ct-done-text">{contacto.success.text}</p>
              <button type="button" className="ct-btn ct-btn-ghost" onClick={reset}>{contacto.success.again}</button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <fieldset className="ct-motivos">
                <legend className="ct-legend">{contacto.motivosLabel}</legend>
                <div className="ct-chips">
                  {contacto.motivos.map((m) => (
                    <label key={m.id} className={`ct-chip ${motivo === m.id ? "isOn" : ""}`}>
                      <input type="radio" name="motivo" value={m.id} checked={motivo === m.id} onChange={() => setMotivo(m.id)} />
                      <span>{m.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="ct-grid">
                <div className="ct-field">
                  <label htmlFor="ct-nombre">{contacto.fields.nombre}</label>
                  <input id="ct-nombre" type="text" autoComplete="name" value={values.nombre} onChange={set("nombre")} aria-invalid={!!errors.nombre} aria-describedby={errors.nombre ? "ct-nombre-err" : undefined} />
                  {errors.nombre && <p id="ct-nombre-err" className="ct-err" role="alert">{errors.nombre}</p>}
                </div>

                <div className="ct-field">
                  <label htmlFor="ct-email">{contacto.fields.email}</label>
                  <input id="ct-email" type="email" autoComplete="email" inputMode="email" value={values.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "ct-email-err" : undefined} />
                  {errors.email && <p id="ct-email-err" className="ct-err" role="alert">{errors.email}</p>}
                </div>

                <div className="ct-field">
                  <label htmlFor="ct-tel">{contacto.fields.telefono}</label>
                  <input id="ct-tel" type="tel" autoComplete="tel" inputMode="tel" value={values.telefono} onChange={set("telefono")} />
                </div>

                {current.extra && (
                  <div className="ct-field ct-extra" key={current.id}>
                    <label htmlFor="ct-extra">{current.extra.label}</label>
                    <input id="ct-extra" type="text" autoComplete="organization" placeholder={current.extra.placeholder} value={values[current.extra.name]} onChange={set(current.extra.name)} />
                  </div>
                )}

                <div className="ct-field ct-full">
                  <label htmlFor="ct-msg">{contacto.fields.mensaje}</label>
                  <textarea id="ct-msg" rows={5} placeholder={current.mensajePlaceholder} value={values.mensaje} onChange={set("mensaje")} aria-invalid={!!errors.mensaje} aria-describedby={errors.mensaje ? "ct-msg-err" : undefined} />
                  {errors.mensaje && <p id="ct-msg-err" className="ct-err" role="alert">{errors.mensaje}</p>}
                </div>

                {/* honeypot anti-spam: oculto para personas */}
                <div className="ct-hp" aria-hidden="true">
                  <label htmlFor="ct-web">Sitio web</label>
                  <input id="ct-web" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
                </div>
              </div>

              {status === "error" && <p className="ct-err ct-err-box" role="alert">{contacto.errors.envio}</p>}

              <div className="ct-foot">
                <button type="submit" className="ct-btn ct-btn-primary" disabled={status === "sending"}>
                  {status === "sending" ? contacto.sendingLabel : contacto.submitLabel}
                </button>
                <p className="ct-legal">{contacto.legal}</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- wrapper del prototipo: simula llegar desde un CTA ---------- */
export default function BrioContactoPrototype() {
  const [entrada, setEntrada] = useState("cuenta");
  return (
    <div style={{ background: "#05091f", minHeight: "100vh" }}>
      <div style={{ padding: "12px 20px", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", borderBottom: "1px dashed rgba(255,255,255,.2)", font: "13px Poppins, sans-serif", color: "#9aa3b2" }}>
        <span>Solo prototipo · simular entrada desde:</span>
        <button style={devBtn(entrada === "cuenta")} onClick={() => setEntrada("cuenta")}>Menú / ancla (#contacto)</button>
        <button style={devBtn(entrada === "pyme")} onClick={() => setEntrada("pyme")}>CTA “Consultá por tu PyME”</button>
      </div>
      <Contacto defaultMotivo={entrada} />
    </div>
  );
}
const devBtn = (on) => ({ background: on ? "#65f5e5" : "transparent", color: on ? "#05091f" : "#fff", border: "1px solid rgba(255,255,255,.3)", borderRadius: 999, padding: "5px 12px", cursor: "pointer", font: "inherit" });

/* ---------- estilos (en el código real: Contacto.module.css) ---------- */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Sora:wght@500;600;700&display=swap');

.ct-section{
  --navy:#05091f; --orange:#ef5915; --teal:#65f5e5; --white:#fff;
  --muted:#9aa3b2; --line:rgba(255,255,255,.12); --err:#ff5a52;
  position:relative; overflow:hidden; background:var(--navy); color:var(--white);
  font-family:'Poppins',system-ui,sans-serif;
  padding:clamp(64px,9vw,120px) clamp(20px,5vw,64px);
}
.ct-section *{box-sizing:border-box}
.ct-glow{
  position:absolute; inset:auto -10% -30% auto; width:60%; aspect-ratio:1;
  background:radial-gradient(closest-side, rgba(101,245,229,.10), transparent 70%);
  pointer-events:none;
}
.ct-wrap{
  position:relative; max-width:1180px; margin:0 auto;
  display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);
  gap:clamp(32px,6vw,88px); align-items:start;
}

/* aparición: una sola entrada, sin escalonar todo */
.ct-reveal{opacity:0; transform:translateY(18px); transition:opacity .7s ease, transform .7s ease}
.ct-reveal.isIn{opacity:1; transform:none}
.ct-d1{transition-delay:.12s}
@media (prefers-reduced-motion:reduce){.ct-reveal{opacity:1; transform:none; transition:none}}

/* lado izquierdo */
.ct-seal{display:flex; align-items:center; gap:12px; margin:0 0 20px; font-size:.9rem; color:var(--muted)}
.ct-seal-bar{width:28px; height:2px; background:var(--teal); border-radius:2px}
.ct-title{
  font-family:'Sora',sans-serif; font-weight:700; letter-spacing:-.02em; line-height:1.1;
  font-size:clamp(2rem,4.2vw,3.1rem); margin:0 0 18px; max-width:14ch;
}
.ct-lead{color:var(--muted); font-size:1.02rem; line-height:1.65; margin:0 0 36px; max-width:46ch}

.ct-channels{list-style:none; margin:0; padding:0; display:grid; gap:4px}
.ct-ch{display:flex; align-items:center; gap:16px; padding:12px 14px; margin:0 -14px; border-radius:14px; color:inherit; text-decoration:none}
.ct-ch-link{transition:background .2s ease}
.ct-ch-link:hover{background:rgba(255,255,255,.05)}
.ct-ch-link:focus-visible{outline:2px solid var(--teal); outline-offset:2px}
.ct-ico{
  flex:none; width:44px; height:44px; border-radius:50%; display:grid; place-items:center;
  color:var(--teal); border:1px solid rgba(101,245,229,.45); background:rgba(101,245,229,.08);
}
.ct-ch-text{display:flex; flex-direction:column; min-width:0}
.ct-ch-label{font-size:.82rem; color:var(--muted)}
.ct-ch-value{font-weight:500; font-size:1.02rem; overflow-wrap:anywhere}
.ct-ch-sub{font-size:.88rem; color:var(--muted)}

.ct-social{display:flex; align-items:center; gap:14px; margin-top:28px; padding-top:24px; border-top:1px solid var(--line)}
.ct-social-label{font-size:.86rem; color:var(--muted)}
.ct-social-links{display:flex; gap:10px}
.ct-social-link{
  width:40px; height:40px; border-radius:50%; display:grid; place-items:center; color:#dfe4ee;
  border:1px solid var(--line); transition:border-color .2s ease, color .2s ease, background .2s ease;
}
.ct-social-link:hover{border-color:var(--teal); color:var(--teal); background:rgba(101,245,229,.08)}
.ct-social-link:focus-visible{outline:2px solid var(--teal); outline-offset:2px}

/* formulario */
.ct-card{
  background:rgba(255,255,255,.04); border:1px solid var(--line); border-radius:22px;
  padding:clamp(22px,3.4vw,40px); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
}
.ct-motivos{border:0; margin:0 0 26px; padding:0; min-width:0}
.ct-legend{font-family:'Sora',sans-serif; font-weight:600; font-size:1.05rem; padding:0; margin-bottom:14px}
.ct-chips{display:flex; flex-wrap:wrap; gap:10px}
.ct-chip{position:relative; cursor:pointer}
.ct-chip input{position:absolute; opacity:0; inset:0; margin:0; cursor:pointer}
.ct-chip span{
  display:inline-block; padding:10px 16px; border-radius:999px; font-size:.92rem;
  border:1px solid var(--line); color:#dfe4ee; background:transparent;
  transition:background .2s ease, border-color .2s ease, color .2s ease;
}
.ct-chip:hover span{border-color:rgba(101,245,229,.6)}
.ct-chip.isOn span{background:rgba(101,245,229,.14); border-color:var(--teal); color:#fff}
.ct-chip:focus-within span{outline:2px solid var(--teal); outline-offset:2px}

.ct-grid{display:grid; grid-template-columns:1fr 1fr; gap:18px}
.ct-full{grid-column:1 / -1}
.ct-field{display:flex; flex-direction:column; gap:7px; min-width:0}
.ct-field label{font-size:.86rem; color:var(--muted)}
.ct-field input, .ct-field textarea{
  width:100%; font:inherit; font-size:1rem; color:#fff; background:rgba(255,255,255,.05);
  border:1px solid var(--line); border-radius:12px; padding:13px 14px;
  transition:border-color .2s ease, background .2s ease;
}
.ct-field textarea{resize:vertical; min-height:120px; line-height:1.5}
.ct-field input::placeholder, .ct-field textarea::placeholder{color:#6f7a8e}
.ct-field input:focus, .ct-field textarea:focus{outline:none; border-color:var(--teal); background:rgba(255,255,255,.07); box-shadow:0 0 0 3px rgba(101,245,229,.18)}
.ct-field [aria-invalid="true"]{border-color:var(--err)}
.ct-err{margin:0; font-size:.84rem; color:var(--err)}
.ct-err-box{margin-top:16px; padding:12px 14px; border:1px solid rgba(255,90,82,.45); border-radius:12px; background:rgba(255,90,82,.08)}

/* el campo extra (PyME) es la única cosa que se mueve al cambiar de motivo */
.ct-extra{animation:ctIn .35s ease}
@keyframes ctIn{from{opacity:0; transform:translateY(-6px)} to{opacity:1; transform:none}}
@media (prefers-reduced-motion:reduce){.ct-extra{animation:none}}

.ct-hp{position:absolute; left:-9999px; width:1px; height:1px; overflow:hidden}

.ct-foot{display:flex; align-items:center; gap:18px; flex-wrap:wrap; margin-top:24px}
.ct-legal{margin:0; font-size:.82rem; color:var(--muted); flex:1 1 200px}
.ct-btn{font:inherit; font-weight:600; font-size:1rem; border-radius:999px; padding:14px 28px; cursor:pointer; border:1px solid transparent; transition:transform .15s ease, background .2s ease, opacity .2s ease}
.ct-btn:focus-visible{outline:2px solid var(--teal); outline-offset:3px}
.ct-btn-primary{background:var(--orange); color:#fff}
.ct-btn-primary:hover{background:#ff6a2b}
.ct-btn-primary:active{transform:scale(.98)}
.ct-btn-primary:disabled{opacity:.65; cursor:progress}
.ct-btn-ghost{background:transparent; color:#fff; border-color:rgba(101,245,229,.6)}
.ct-btn-ghost:hover{background:rgba(101,245,229,.1)}

/* éxito */
.ct-done{text-align:center; padding:clamp(20px,5vw,56px) 8px}
.ct-done-ico{width:64px; height:64px; margin:0 auto 20px; border-radius:50%; display:grid; place-items:center; color:var(--teal); border:1px solid var(--teal); background:rgba(101,245,229,.1)}
.ct-done-title{font-family:'Sora',sans-serif; font-size:1.5rem; margin:0 0 10px}
.ct-done-text{color:var(--muted); margin:0 auto 28px; max-width:34ch; line-height:1.6}

/* responsive */
@media (max-width:900px){
  .ct-wrap{grid-template-columns:1fr}
  .ct-title{max-width:none}
}
@media (max-width:560px){
  .ct-grid{grid-template-columns:1fr}
  .ct-btn-primary{width:100%}
  .ct-foot{flex-direction:column; align-items:stretch}
  .ct-legal{text-align:center; flex:none}
}
`;
