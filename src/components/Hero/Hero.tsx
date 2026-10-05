import { useEffect, useState } from 'react';
import type { CtaAction, Credential, StockRow } from '../../data/placeholders';
import type { AccionLider } from '../../data/accionesLideres';
import { useAccionesLideres } from '../../hooks/useAccionesLideres';
import styles from './Hero.module.css';

export interface HeroProps {
  kicker: string;
  title: string;
  lead: string;
  ctas: CtaAction[];
  credentials: Credential[];
  /** Acciones a mostrar en el panel (tickers + nombres); los precios vienen de data912. */
  leaders: AccionLider[];
  /** Precios de EJEMPLO para el primer render y si falla el fetch (mismas filas que `leaders`). */
  fallbackStocks: StockRow[];
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
  leaders,
  fallbackStocks,
  panelTitle,
  panelTag,
  panelFootnote,
}: HeroProps) {
  const [mounted, setMounted] = useState(false);
  // Precios reales de BYMA (data912 vía /api/mercado/arg-stocks), con fallback de ejemplo
  // mientras carga o si falla. El "latido" (resaltado de filas) lo maneja el hook.
  const { stocks, fuente, flash } = useAccionesLideres(leaders, fallbackStocks);

  // Entrada orquestada (fade + subida), una sola vez al montar.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

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

          <div
            className={styles.panel}
            role="img"
            aria-label="Panel de acciones BYMA (referencial)"
            data-fuente={fuente}
          >
            <div className={styles.panelHead}>
              <div className={styles.panelTitle}>
                <span className={styles.live} aria-hidden="true" />
                {panelTitle}
              </div>
              <span className={styles.tag}>{panelTag}</span>
            </div>

            <ul className={styles.rows}>
              {stocks.map((s) => {
                const up = (s.changePct ?? 0) >= 0;
                return (
                  <li key={s.symbol} className={`${styles.row} ${flash.has(s.symbol) ? styles.isFlash : ''}`}>
                    <div className={styles.sym}>
                      <span className={styles.symCode}>{s.symbol}</span>
                      <span className={styles.symName}>{s.name}</span>
                    </div>
                    <div className={styles.px}>{s.price !== null ? `$ ${formatPrice(s.price)}` : '—'}</div>
                    {s.changePct !== null ? (
                      <div className={`${styles.chg} ${up ? styles.up : styles.down}`}>
                        <span className={styles.arrow} aria-hidden="true">
                          {up ? '▲' : '▼'}
                        </span>
                        {formatChange(s.changePct)}
                      </div>
                    ) : (
                      <div className={`${styles.chg} ${styles.na}`}>—</div>
                    )}
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
