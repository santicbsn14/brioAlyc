import { useEffect, useState } from 'react';
import type { CtaAction, Credential, StockRow } from '../../data/placeholders';
import styles from './Hero.module.css';

export interface HeroProps {
  kicker: string;
  title: string;
  lead: string;
  ctas: CtaAction[];
  credentials: Credential[];
  stocks: StockRow[];
  panelTitle: string;
  panelTag: string;
  panelFootnote: string;
}

const formatPrice = (n: number) =>
  n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatChange = (n: number) =>
  `${n > 0 ? '+' : ''}${n.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

export default function Hero({
  kicker,
  title,
  lead,
  ctas,
  credentials,
  stocks: initialStocks,
  panelTitle,
  panelTag,
  panelFootnote,
}: HeroProps) {
  const [mounted, setMounted] = useState(false);
  const [stocks, setStocks] = useState(initialStocks);
  const [flash, setFlash] = useState<string | null>(null); // symbol que acaba de actualizarse

  // Entrada orquestada (fade + subida), una sola vez al montar.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Tick simulado para que el panel se sienta "en vivo". Respeta reduce-motion.
  // TODO: reemplazar por data912 (arg_stocks) vía backend proxy con caché (Fase 4).
  // El % acá deriva del precio de forma independiente; se va con la data real.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = setInterval(() => {
      setStocks((prev) => {
        const i = Math.floor(Math.random() * prev.length);
        const next = prev.map((s, idx) => {
          if (idx !== i) return s;
          const drift = (Math.random() - 0.48) * 0.6; // -0.29..+0.31
          const price = Math.max(1, s.price * (1 + drift / 100));
          const changePct = +(s.changePct + drift).toFixed(1);
          return { ...s, price, changePct };
        });
        setFlash(prev[i].symbol);
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
    <section className={`${styles.hero} ${mounted ? styles.isIn : ''}`}>
      <div className={styles.grid}>
        {/* ── Columna izquierda ── */}
        <div className={styles.copy}>
          <p className={styles.kicker}>
            <span className={styles.kickerDot} aria-hidden="true" />
            {kicker}
          </p>

          <h1 className={styles.title}>{title}</h1>

          <p className={styles.lead}>{lead}</p>

          <div className={styles.ctas}>
            {ctas.map((cta) => (
              <a
                key={cta.label}
                href={cta.href}
                className={`${styles.btn} ${cta.variant === 'primary' ? styles.btnPrimary : styles.btnGhost}`}
              >
                {cta.label}
              </a>
            ))}
          </div>

          <ul className={styles.creds}>
            {credentials.map((c) => (
              <li key={c.label} className={styles.cred}>
                <span className={styles.credLabel}>{c.label}</span>
                <span className={styles.credNum}>{c.number}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Columna derecha ── */}
        <div className={styles.visual}>
          <div className={styles.glow} aria-hidden="true" />
          <div className={styles.gridLines} aria-hidden="true" />

          <div className={styles.panel} role="img" aria-label="Panel de acciones BYMA (referencial)">
            <div className={styles.panelHead}>
              <div className={styles.panelTitle}>
                <span className={styles.live} aria-hidden="true" />
                {panelTitle}
              </div>
              <span className={styles.tag}>{panelTag}</span>
            </div>

            <ul className={styles.rows}>
              {stocks.map((s) => {
                const up = s.changePct >= 0;
                return (
                  <li key={s.symbol} className={`${styles.row} ${flash === s.symbol ? styles.isFlash : ''}`}>
                    <div className={styles.sym}>
                      <span className={styles.symCode}>{s.symbol}</span>
                      <span className={styles.symName}>{s.name}</span>
                    </div>
                    <div className={styles.px}>$ {formatPrice(s.price)}</div>
                    <div className={`${styles.chg} ${up ? styles.up : styles.down}`}>
                      <span className={styles.arrow} aria-hidden="true">
                        {up ? '▲' : '▼'}
                      </span>
                      {formatChange(s.changePct)}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className={styles.panelFoot}>{panelFootnote}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
