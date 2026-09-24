import { useState, type ChangeEvent, type FormEvent, type SVGProps } from 'react';
import { useSearchParams } from 'react-router-dom';
import { contacto } from '../../data/contacto';
import { useReveal } from '../../hooks/useReveal';
import styles from './Contacto.module.css';

/** Regex simple de email — misma que valida `api/contacto.ts` del lado del servidor. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status = 'idle' | 'sending' | 'sent' | 'error';

interface Values {
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  mensaje: string;
  /** Honeypot anti-spam: campo oculto para personas, si un bot lo llena no se envía nada. */
  website: string;
}

const emptyValues: Values = { nombre: '', email: '', telefono: '', empresa: '', mensaje: '', website: '' };

type FieldErrors = Partial<Record<'nombre' | 'email' | 'mensaje', string>>;

const iconProps: SVGProps<SVGSVGElement> = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

type IconId = 'whatsapp' | 'email' | 'tel' | 'dir' | 'hs' | 'instagram' | 'linkedin';

/** Íconos SVG inline (trazo simple), uno por canal/red social. */
function Icon({ id }: { id: IconId }) {
  switch (id) {
    case 'whatsapp':
      return (
        <svg {...iconProps} aria-hidden="true">
          <path d="M20 11.5a8 8 0 0 1-11.9 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" />
          <path d="M9.2 8.6c.2 2.6 2.6 5 5.2 5.2l1.2-1.1-1.7-1-.9.6c-.9-.4-1.6-1.1-2-2l.6-.9-1-1.7-1.4 1Z" />
        </svg>
      );
    case 'email':
      return (
        <svg {...iconProps} aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case 'tel':
      return (
        <svg {...iconProps} aria-hidden="true">
          <path d="M5 4h3.5l1.5 4-2 1.3a11 11 0 0 0 5.7 5.7L15 13l4 1.5V18a2 2 0 0 1-2 2A13 13 0 0 1 3 6a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case 'dir':
      return (
        <svg {...iconProps} aria-hidden="true">
          <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...iconProps} aria-hidden="true">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...iconProps} aria-hidden="true">
          <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
          <path d="M8 10.5V17M8 7.5v.01M12 17v-3.8c0-1.3.9-2.2 2-2.2s2 .9 2 2.2V17" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps} aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      );
  }
}

/**
 * Sección Contacto de la home (#contacto). Portada tal cual del prototipo aprobado
 * `__ref/BrioContacto.jsx` (diseño y comportamiento ya validados, no se rediseñó nada).
 *
 * Dos columnas en desktop (izq: sello + título + bajada + canales + redes, der: form en
 * tarjeta glass), apiladas en mobile. Reusa `useReveal` para la aparición al scrollear
 * (el prototipo trae su propio hook local solo porque es standalone).
 *
 * El motivo preseleccionado se puede pasar por query param (`?motivo=pyme`), como llega
 * desde el CTA "Consultá por tu PyME" de Financiamiento PyME. Se lee una sola vez al
 * montar; si no viene o no matchea ningún motivo, arranca en el primero de la lista.
 */
export default function Contacto() {
  // Un solo ref en la sección: useReveal busca los descendientes con `styles.reveal`
  // (acá, `.side` y `.card`) y observa cada uno por separado — mismo patrón que
  // QuienesSomos/FinanciamientoPyme, no uno por bloque.
  const ref = useReveal<HTMLElement>(styles.reveal, styles.isIn);

  const [searchParams] = useSearchParams();
  const [motivo, setMotivo] = useState(() => {
    const fromQuery = searchParams.get('motivo');
    return contacto.motivos.some((m) => m.id === fromQuery) ? (fromQuery as string) : contacto.motivos[0].id;
  });

  const [values, setValues] = useState<Values>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');

  const current = contacto.motivos.find((m) => m.id === motivo) ?? contacto.motivos[0];
  const setField =
    (key: keyof Values) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  const validate = (): FieldErrors => {
    const er: FieldErrors = {};
    if (!values.nombre.trim()) er.nombre = contacto.errors.nombre;
    if (!EMAIL_RE.test(values.email.trim())) er.email = contacto.errors.email;
    if (values.mensaje.trim().length < 5) er.mensaje = contacto.errors.mensaje;
    return er;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (values.website) return; // honeypot: si un bot lo llena, no hacemos nada (ni error)

    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo, ...values }),
      });
      const data: { ok: boolean } = await res.json();
      setStatus(data.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const reset = () => {
    setValues(emptyValues);
    setErrors({});
    setStatus('idle');
  };

  return (
    <section id="contacto" className={styles.section} aria-labelledby="contacto-title" ref={ref}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.wrap}>
        {/* ── columna izquierda: qué + canales ── */}
        <div className={`${styles.side} ${styles.reveal}`}>
          <p className={styles.seal}>
            <span className={styles.sealBar} aria-hidden="true" />
            {contacto.seal}
          </p>
          <h2 id="contacto-title" className={styles.title}>
            {contacto.title}
          </h2>
          <p className={styles.lead}>{contacto.lead}</p>

          <ul className={styles.channels}>
            {contacto.channels.map((c) => {
              const inner = (
                <>
                  <span className={styles.ico}>
                    <Icon id={c.id as IconId} />
                  </span>
                  <span className={styles.chText}>
                    <span className={styles.chLabel}>{c.label}</span>
                    <span className={styles.chValue}>{c.value}</span>
                    {c.sub && <span className={styles.chSub}>{c.sub}</span>}
                  </span>
                </>
              );
              return (
                <li key={c.id}>
                  {c.href ? (
                    <a
                      className={`${styles.ch} ${styles.chLink}`}
                      href={c.href}
                      {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className={styles.ch}>{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className={styles.social}>
            <span className={styles.socialLabel}>{contacto.socialLabel}</span>
            <div className={styles.socialLinks}>
              {contacto.social.map((s) => (
                <a
                  key={s.id}
                  className={styles.socialLink}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                >
                  <Icon id={s.id as IconId} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── columna derecha: formulario ── */}
        <div className={`${styles.card} ${styles.reveal} ${styles.d1}`}>
          {status === 'sent' ? (
            <div className={styles.done} role="status" aria-live="polite">
              <span className={styles.doneIco} aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              </span>
              <h3 className={styles.doneTitle}>{contacto.success.title}</h3>
              <p className={styles.doneText}>{contacto.success.text}</p>
              <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={reset}>
                {contacto.success.again}
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <fieldset className={styles.motivos}>
                <legend className={styles.legend}>{contacto.motivosLabel}</legend>
                <div className={styles.chips}>
                  {contacto.motivos.map((m) => (
                    <label key={m.id} className={`${styles.chip} ${motivo === m.id ? styles.isOn : ''}`}>
                      <input
                        type="radio"
                        name="motivo"
                        value={m.id}
                        checked={motivo === m.id}
                        onChange={() => setMotivo(m.id)}
                      />
                      <span>{m.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className={styles.grid}>
                <div className={styles.field}>
                  <label htmlFor="contacto-nombre">{contacto.fields.nombre}</label>
                  <input
                    id="contacto-nombre"
                    type="text"
                    autoComplete="name"
                    value={values.nombre}
                    onChange={setField('nombre')}
                    aria-invalid={!!errors.nombre}
                    aria-describedby={errors.nombre ? 'contacto-nombre-err' : undefined}
                  />
                  {errors.nombre && (
                    <p id="contacto-nombre-err" className={styles.err} role="alert">
                      {errors.nombre}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="contacto-email">{contacto.fields.email}</label>
                  <input
                    id="contacto-email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={values.email}
                    onChange={setField('email')}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'contacto-email-err' : undefined}
                  />
                  {errors.email && (
                    <p id="contacto-email-err" className={styles.err} role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="contacto-tel">{contacto.fields.telefono}</label>
                  <input
                    id="contacto-tel"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={values.telefono}
                    onChange={setField('telefono')}
                  />
                </div>

                {current.extra && (
                  <div className={`${styles.field} ${styles.extra}`} key={current.id}>
                    <label htmlFor="contacto-extra">{current.extra.label}</label>
                    <input
                      id="contacto-extra"
                      type="text"
                      autoComplete="organization"
                      placeholder={current.extra.placeholder}
                      value={values[current.extra.name as keyof Values]}
                      onChange={setField(current.extra.name as keyof Values)}
                    />
                  </div>
                )}

                <div className={`${styles.field} ${styles.full}`}>
                  <label htmlFor="contacto-msg">{contacto.fields.mensaje}</label>
                  <textarea
                    id="contacto-msg"
                    rows={5}
                    placeholder={current.mensajePlaceholder}
                    value={values.mensaje}
                    onChange={setField('mensaje')}
                    aria-invalid={!!errors.mensaje}
                    aria-describedby={errors.mensaje ? 'contacto-msg-err' : undefined}
                  />
                  {errors.mensaje && (
                    <p id="contacto-msg-err" className={styles.err} role="alert">
                      {errors.mensaje}
                    </p>
                  )}
                </div>

                {/* honeypot anti-spam: oculto para personas */}
                <div className={styles.hp} aria-hidden="true">
                  <label htmlFor="contacto-web">Sitio web</label>
                  <input
                    id="contacto-web"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.website}
                    onChange={setField('website')}
                  />
                </div>
              </div>

              {status === 'error' && (
                <p className={`${styles.err} ${styles.errBox}`} role="alert">
                  {contacto.errors.envio}
                </p>
              )}

              <div className={styles.foot}>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={status === 'sending'}>
                  {status === 'sending' ? contacto.sendingLabel : contacto.submitLabel}
                </button>
                <p className={styles.legal}>{contacto.legal}</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
