import { useMemo } from 'react';
import type { CalEventsByDate } from '../../lib/rentaFija/calendar';
import { fmtFechaISO, fmtMesISO, fmtNum } from '../../lib/rentaFija/format';
import styles from './RentaFija.module.css';

interface Props {
  events: CalEventsByDate;
}

const TIPO_LABEL: Record<string, string> = { ambos: 'Renta + Amort.', amort: 'Amortización', renta: 'Renta' };

/** Lista de próximos pagos (renta/amortización) de todos los instrumentos cargados,
 * ordenada por fecha — adaptación visual del calendario en grilla del original
 * (renderCal) a la línea de diseño de Brio; misma lógica de qué eventos mostrar. */
export default function Calendario({ events }: Props) {
  const proximos = useMemo(() => {
    const todayIso = new Date().toISOString().slice(0, 10);
    return Object.keys(events)
      .filter((f) => f >= todayIso)
      .sort()
      .map((fecha) => ({ fecha, items: events[fecha] }));
  }, [events]);

  if (proximos.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Sin próximos pagos</p>
        <p className={styles.emptyText}>No hay vencimientos de renta o amortización por delante en los instrumentos cargados.</p>
      </div>
    );
  }

  return (
    <div className={styles.calList}>
      {proximos.map(({ fecha, items }, idx) => {
        const mes = fmtMesISO(fecha);
        const mesAnterior = idx > 0 ? fmtMesISO(proximos[idx - 1].fecha) : null;
        const showMonth = mes !== mesAnterior;
        const sorted = [...items].sort((a, b) => b.cf - a.cf);
        return (
          <div key={fecha}>
            {showMonth && <p className={styles.calMonth}>{mes}</p>}
            <div className={styles.calRow}>
              <span className={styles.calDate}>{fmtFechaISO(fecha)}</span>
              <div className={styles.calEvents}>
                {sorted.map((ev, i) => (
                  <span key={`${ev.ticker}-${i}`} className={`${styles.calChip} ${styles[`calChip${ev.tipo === 'ambos' ? 'Ambos' : ev.tipo === 'amort' ? 'Amort' : 'Renta'}`]}`} title={TIPO_LABEL[ev.tipo]}>
                    {ev.ticker} <span className={styles.calChipVal}>{fmtNum(ev.cf, 2)}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
