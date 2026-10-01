import { useEffect, useMemo, useRef, useState } from 'react';
import { calcCFView, type CFCurrency, type CFInfo } from '../../lib/rentaFija/flujoFondos';
import { fmtFechaISO, fmtNum, fmtPct } from '../../lib/rentaFija/format';
import styles from './FlujoFondosDrawer.module.css';

interface Props {
  /** null = drawer cerrado y sin contenido todavía. Se conserva al cerrar para que
   * el contenido no desaparezca mientras corre la animación de salida. */
  info: CFInfo | null;
  open: boolean;
  /** Cambia en cada apertura: remonta el cuerpo para resetear monto y moneda. */
  sessionKey: number;
  onClose: () => void;
}

/** Drawer lateral con el detalle de flujo de fondos de un ticker (openCFDrawer del
 * original). La lógica de cálculo vive en lib/rentaFija/flujoFondos.ts. */
export default function FlujoFondosDrawer({ info, open, sessionKey, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Escape + bloqueo de scroll + foco: solo mientras está abierto. Al cerrar, el
  // foco vuelve al ticker que lo abrió.
  useEffect(() => {
    if (!open) return undefined;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div
      className={`${styles.overlay} ${open ? styles.isOpen : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-hidden={!open}
    >
      <aside className={styles.drawer} role="dialog" aria-modal="true" aria-labelledby="cf-title">
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <p className={styles.kicker}>Flujo de fondos</p>
              <h2 id="cf-title" className={styles.title}>
                {info?.ticker ?? '—'}
              </h2>
            </div>
            <button ref={closeBtnRef} type="button" className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
              ×
            </button>
          </div>
          {info && <Subtitulo info={info} />}
        </header>
        {info && <Cuerpo key={sessionKey} info={info} />}
      </aside>
    </div>
  );
}

function Subtitulo({ info }: { info: CFInfo }) {
  const items: { label: string; value: string }[] = [];
  if (info.tipoCap) {
    if (info.tna != null) items.push({ label: 'TNA', value: fmtPct(info.tna, 2) });
    if (info.tem != null) items.push({ label: 'TEM', value: fmtPct(info.tem, 2) });
    if (info.tea != null) items.push({ label: 'TEA', value: fmtPct(info.tea, 2) });
  } else {
    if (info.tir !== null) items.push({ label: 'TIR', value: fmtPct(info.tir, 2) });
    if (info.duration !== null) items.push({ label: 'Duration', value: `${fmtNum(info.duration, 2)} años` });
  }
  if (info.precio != null) items.push({ label: 'Px', value: fmtNum(info.precio, 3) });
  items.push({ label: 'Vto', value: info.vencimiento });

  return (
    <div className={styles.subtitle}>
      {info.tipoCap && (
        <span className={`${styles.tipo} ${info.tipoCap === 'BONCAP' ? styles.tipoBoncap : styles.tipoLecap}`}>{info.tipoCap}</span>
      )}
      {items.map((it) => (
        <span key={it.label} className={styles.stat}>
          {it.label} <b>{it.value}</b>
        </span>
      ))}
    </div>
  );
}

function Cuerpo({ info }: { info: CFInfo }) {
  const esCap = info.tipoCap !== null;
  // LECAP/BONCAP arrancan en Nominales (son en pesos); ONs/soberanos en USD.
  const [currency, setCurrency] = useState<CFCurrency>(esCap ? 'NOM' : 'USD');
  const [amount, setAmount] = useState('');

  const view = useMemo(() => calcCFView(info, currency, amount), [info, currency, amount]);

  const monLabel = esCap ? 'ARS' : 'USD';
  const inputLabel = currency === 'USD' ? `Inversión ${monLabel}` : 'Valor nominal';
  const montoTipeado = amount.trim() !== '';

  let escalaTxt = 'Valores por cada 100 nominales';
  if (view.scale !== null) {
    escalaTxt = `Equivale a ${fmtNum(view.scale, 2)} nominales`;
  } else if (montoTipeado && currency === 'USD' && info.precio == null) {
    escalaTxt = 'Sin precio de mercado para convertir el monto: valores por cada 100 nominales';
  }

  return (
    <div className={styles.body}>
      <div className={styles.controls}>
        <label className={styles.amountWrap}>
          <span className={styles.amountLbl}>{inputLabel}</span>
          <input
            className={styles.amountInput}
            type="text"
            inputMode="decimal"
            placeholder="ej: 10000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <div className={styles.curBtns} role="group" aria-label="Moneda del monto">
          <button
            type="button"
            className={`${styles.curBtn} ${currency === 'USD' ? styles.isOn : ''}`}
            aria-pressed={currency === 'USD'}
            onClick={() => setCurrency('USD')}
          >
            {monLabel}
          </button>
          <button
            type="button"
            className={`${styles.curBtn} ${currency === 'NOM' ? styles.isOn : ''}`}
            aria-pressed={currency === 'NOM'}
            onClick={() => setCurrency('NOM')}
          >
            Nominales
          </button>
        </div>
      </div>
      <p className={styles.escala} aria-live="polite">
        {escalaTxt}
      </p>

      <div className={styles.summary}>
        <div className={styles.card}>
          <div className={styles.cardLbl}>Total cobrado</div>
          <div className={styles.cardVal}>{fmtNum(view.totalCF, 2)}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLbl}>Cupones</div>
          <div className={styles.cardVal}>{fmtNum(view.totalCupon, 2)}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLbl}>Amortización</div>
          <div className={styles.cardVal}>{fmtNum(view.totalAmort, 2)}</div>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cupón</th>
              <th>Amort.</th>
              <th>Total</th>
              <th>% total</th>
            </tr>
          </thead>
          <tbody>
            {view.rows.map((r, i) => (
              <tr key={`${r.fecha}-${i}`} className={r.amort > 0 ? styles.rowAmort : undefined}>
                <td>{fmtFechaISO(r.fecha)}</td>
                <td>{r.cupon > 0 ? fmtNum(r.cupon, 2) : '—'}</td>
                <td>{r.amort > 0 ? fmtNum(r.amort, 2) : '—'}</td>
                <td>{fmtNum(r.cf, 2)}</td>
                <td className={styles.pct}>{r.pct !== null ? `${fmtNum(r.pct, 1)}%` : '—'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>{fmtNum(view.totalCupon, 2)}</td>
              <td>{fmtNum(view.totalAmort, 2)}</td>
              <td>{fmtNum(view.totalCF, 2)}</td>
              <td>100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
      {view.rows.some((r) => r.amort > 0) && (
        <p className={styles.legend}>
          <span className={styles.legendSwatch} aria-hidden="true" /> Pago con devolución de capital (amortización)
        </p>
      )}
    </div>
  );
}
